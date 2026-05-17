export const ROLE_LEVELS = {
  MITARBEITER: 1,
  TEAMLEITER: 4,
  MANAGER: 6,
  ADMIN: 10,
};

export function getRoleLevel(profile) {
  return Number(profile?.role_level || 0);
}

export function isAdmin(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.ADMIN;
}

export function canViewDashboard(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.MITARBEITER;
}

export function canCreateTasks(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.MITARBEITER;
}

export function canEditTasks(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.TEAMLEITER;
}

export function canDeleteTasks(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.MANAGER;
}

export function canManageUsers(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.MANAGER;
}

export function canManageProduction(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.MANAGER;
}

export function canViewReports(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.MANAGER;
}

export function canManageCompany(profile) {
  return getRoleLevel(profile) >= ROLE_LEVELS.ADMIN;
}