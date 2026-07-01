export function getProjectTaskPath(projectId: string, taskId: string): string {
  return `/projects/${projectId}?tab=tasks&task=${taskId}`;
}

export function getProjectTabPath(projectId: string, tab: string): string {
  return `/projects/${projectId}?tab=${tab}`;
}