// Account-management rules for staff, mirroring the backend permission
// CanManageStaffAccount. Keep both in sync.

export function isPendingActivation(user) {
  return user.must_change_password === true;
}

// Operatives: admin has full CRUD.
// Teachers: admin can edit/delete only while pending activation.
export function canEditStaff(user) {
  return user.role === "OPERATIONS_STAFF" || isPendingActivation(user);
}

export function canDeleteStaff(user) {
  return canEditStaff(user);
}

// Activated teachers own their profile; admin can only (de)activate.
export function isManagedByOwner(user) {
  return user.role === "TEACHER" && !isPendingActivation(user);
}

// Email of an already-activated account cannot be changed by the admin
// until the verified email-change flow exists.
export function canEditEmail(user) {
  return isPendingActivation(user);
}
