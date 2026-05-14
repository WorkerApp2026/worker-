export function countOpenTasks(tasks = []) {
  return tasks.filter((task) => task.status !== "Erledigt").length;
}

export function countDoneTasks(tasks = []) {
  return tasks.filter((task) => task.status === "Erledigt").length;
}

export function sortRecentTasks(tasks = []) {
  return [...tasks].sort((a, b) => {
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });
}