import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  activities as initialActivities,
  clients as initialClients,
  communicationLogs as initialCommunicationLogs,
  documents as initialDocuments,
  employees as initialEmployees,
  invoices as initialInvoices,
  meetings as initialMeetings,
  projects as initialProjects,
  tasks as initialTasks,
} from '../data/sampleData';
import type {
  Activity,
  Client,
  CommunicationLog,
  Document,
  Employee,
  Invoice,
  Material,
  Meeting,
  Project,
  Task,
} from '../types';
import { generateId } from '../utils/id';
import { getMaterialCost } from '../utils/format';

function normalizeTask(task: Task): Task {
  const materialCost = getMaterialCost(task.materials);
  const estimatedLabourCost =
    task.labourRequirement.estimatedLabourCost ??
    Math.max(0, task.estimatedCost - materialCost);
  const actualLabourCost =
    task.labourRequirement.actualLabourCost ??
    Math.max(0, task.actualCost - materialCost);

  return {
    ...task,
    labourRequirement: {
      ...task.labourRequirement,
      estimatedLabourCost,
      actualLabourCost,
    },
  };
}

export interface AppData {
  projects: Project[];
  clients: Client[];
  tasks: Task[];
  meetings: Meeting[];
  communicationLogs: CommunicationLog[];
  documents: Document[];
  invoices: Invoice[];
  employees: Employee[];
  activities: Activity[];
}

export interface AppSelectors {
  getProject: (id: string) => Project | undefined;
  getClient: (id: string) => Client | undefined;
  getEmployee: (id: string) => Employee | undefined;
  getTask: (id: string) => Task | undefined;
  getProjectTasks: (projectId: string) => Task[];
  getProjectMeetings: (projectId: string) => Meeting[];
  getProjectDocuments: (projectId: string) => Document[];
  getProjectInvoices: (projectId: string) => Invoice[];
  getProjectCommunications: (projectId: string) => CommunicationLog[];
}

export type NewProjectInput = Omit<Project, 'id' | 'actualSpend' | 'progress'>;
export type NewTaskInput = Omit<
  Task,
  'id' | 'actualCost' | 'materials' | 'labourRequirement' | 'financeRequirement' | 'dependencies' | 'errors'
>;

export type ProjectUpdates = Partial<Omit<Project, 'id'>>;
export type TaskUpdates = Partial<Omit<Task, 'id' | 'projectId'>>;
export type NewMaterialInput = Omit<Material, 'id'>;
export type MaterialUpdates = Partial<Omit<Material, 'id'>>;

export interface AppActions {
  addProject: (project: NewProjectInput) => Project;
  updateProject: (id: string, updates: ProjectUpdates) => void;
  addTask: (task: NewTaskInput) => Task;
  updateTask: (id: string, updates: TaskUpdates) => void;
  addMaterial: (taskId: string, material: NewMaterialInput) => void;
  updateMaterial: (taskId: string, materialId: string, updates: MaterialUpdates) => void;
  removeMaterial: (taskId: string, materialId: string) => void;
}

export type AppContextValue = AppData & AppSelectors & AppActions;

const DataContext = createContext<AppData | null>(null);
const SelectorsContext = createContext<AppSelectors | null>(null);
const ActionsContext = createContext<AppActions | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => ({
    projects: initialProjects,
    clients: initialClients,
    tasks: initialTasks.map(normalizeTask),
    meetings: initialMeetings,
    communicationLogs: initialCommunicationLogs,
    documents: initialDocuments,
    invoices: initialInvoices,
    employees: initialEmployees,
    activities: initialActivities,
  }));

  const addProject = useCallback((project: NewProjectInput) => {
    const newProject: Project = {
      ...project,
      id: generateId('p'),
      actualSpend: 0,
      progress: 0,
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
    return newProject;
  }, []);

  const addTask = useCallback((task: NewTaskInput) => {
    const newTask: Task = {
      ...task,
      id: generateId('t'),
      actualCost: 0,
      materials: [],
      labourRequirement: {
        crewSize: 1,
        estimatedHours: 40,
        estimatedLabourCost: task.estimatedCost,
        actualLabourCost: 0,
      },
      financeRequirement: {
        allocatedBudget: task.estimatedCost,
        contingency: Math.round(task.estimatedCost * 0.1),
      },
      dependencies: [],
      errors: [],
    };
    setData((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    return newTask;
  }, []);

  const updateProject = useCallback((id: string, updates: ProjectUpdates) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      ),
    }));
  }, []);

  const updateTask = useCallback((id: string, updates: TaskUpdates) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => {
        if (task.id !== id) return task;

        const updated: Task = { ...task, ...updates };
        if (updates.estimatedCost !== undefined && updates.financeRequirement === undefined) {
          updated.financeRequirement = {
            ...task.financeRequirement,
            allocatedBudget: updates.estimatedCost,
          };
        }
        return updated;
      }),
    }));
  }, []);

  const updateTaskMaterials = useCallback(
    (taskId: string, updater: (materials: Material[]) => Material[]) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === taskId ? { ...task, materials: updater(task.materials) } : task
        ),
      }));
    },
    []
  );

  const addMaterial = useCallback(
    (taskId: string, material: NewMaterialInput) => {
      updateTaskMaterials(taskId, (materials) => [
        ...materials,
        { ...material, id: generateId('m') },
      ]);
    },
    [updateTaskMaterials]
  );

  const updateMaterial = useCallback(
    (taskId: string, materialId: string, updates: MaterialUpdates) => {
      updateTaskMaterials(taskId, (materials) =>
        materials.map((material) =>
          material.id === materialId ? { ...material, ...updates } : material
        )
      );
    },
    [updateTaskMaterials]
  );

  const removeMaterial = useCallback(
    (taskId: string, materialId: string) => {
      updateTaskMaterials(taskId, (materials) =>
        materials.filter((material) => material.id !== materialId)
      );
    },
    [updateTaskMaterials]
  );

  const selectors = useMemo<AppSelectors>(
    () => ({
      getProject: (id) => data.projects.find((p) => p.id === id),
      getClient: (id) => data.clients.find((c) => c.id === id),
      getEmployee: (id) => data.employees.find((e) => e.id === id),
      getTask: (id) => data.tasks.find((t) => t.id === id),
      getProjectTasks: (projectId) => data.tasks.filter((t) => t.projectId === projectId),
      getProjectMeetings: (projectId) => data.meetings.filter((m) => m.projectId === projectId),
      getProjectDocuments: (projectId) => data.documents.filter((d) => d.projectId === projectId),
      getProjectInvoices: (projectId) => data.invoices.filter((i) => i.projectId === projectId),
      getProjectCommunications: (projectId) =>
        data.communicationLogs.filter((c) => c.projectId === projectId),
    }),
    [data]
  );

  const actions = useMemo<AppActions>(
    () => ({ addProject, updateProject, addTask, updateTask, addMaterial, updateMaterial, removeMaterial }),
    [addProject, updateProject, addTask, updateTask, addMaterial, updateMaterial, removeMaterial]
  );

  return (
    <DataContext.Provider value={data}>
      <SelectorsContext.Provider value={selectors}>
        <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>
      </SelectorsContext.Provider>
    </DataContext.Provider>
  );
}

export function useAppData(): AppData {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppProvider');
  }
  return context;
}

export function useAppSelectors(): AppSelectors {
  const context = useContext(SelectorsContext);
  if (!context) {
    throw new Error('useAppSelectors must be used within AppProvider');
  }
  return context;
}

export function useAppActions(): AppActions {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useAppActions must be used within AppProvider');
  }
  return context;
}

/** Combined hook for convenience. Prefer granular hooks for targeted access. */
export function useApp(): AppContextValue {
  return { ...useAppData(), ...useAppSelectors(), ...useAppActions() };
}

/** Selector hook for reading specific slices without coupling to the full context shape. */
export function useAppSelector<T>(selector: (ctx: AppContextValue) => T): T {
  const data = useAppData();
  const selectors = useAppSelectors();
  const actions = useAppActions();
  const ctx = useMemo(() => ({ ...data, ...selectors, ...actions }), [data, selectors, actions]);
  return selector(ctx);
}