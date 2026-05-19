export const ROLE_LEVELS = {
  MITARBEITER: 1,
  TEAMLEITER: 4,
  MANAGER: 6,
  ADMIN: 10,
};

export function getRoleLevel(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value || 0);
  }

  return Number(value?.role_level || 0);
}

export function isAdmin(value) {
  return getRoleLevel(value) >= ROLE_LEVELS.ADMIN;
}

export function canViewDashboard(value) {
  return getRoleLevel(value) >= ROLE_LEVELS.MITARBEITER;
}

export function canCreateTasks(value) {
  return getRoleLevel(value) >= ROLE_LEVELS.MITARBEITER;
}

export function canEditTasks(value) {
  return getRoleLevel(value) >= ROLE_LEVELS.TEAMLEITER;
}

export function canDeleteTasks(value) {
  return getRoleLevel(value) >= ROLE_LEVELS.MANAGER;
}

export function canManageUsers(value) {
  return getRoleLevel(value) >= 8;
}

export function canManageProduction(value) {
  return getRoleLevel(value) >= ROLE_LEVELS.MANAGER;
}

export function canViewReports(value) {
  return getRoleLevel(value) >= ROLE_LEVELS.MANAGER;
}

export function canManageCompany(value) {
  return getRoleLevel(value) >= ROLE_LEVELS.ADMIN;
}