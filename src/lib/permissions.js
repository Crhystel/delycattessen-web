// Permission classes (à la DRF permission_classes): each encapsulates one
// access rule behind a common hasPermission(auth) contract, so guards like
// ProtectedRoute stay closed for modification and open for new rules.
export class BasePermission {
  hasPermission() {
    throw new Error("hasPermission() must be implemented by subclasses");
  }
}

export class IsAuthenticated extends BasePermission {
  hasPermission(auth) {
    return auth.isAuthenticated;
  }
}

export class IsAdmin extends BasePermission {
  hasPermission(auth) {
    return auth.isAuthenticated && auth.role === "ADMIN";
  }
}
