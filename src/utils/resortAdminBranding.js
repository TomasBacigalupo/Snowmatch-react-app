export const CERRO_BAYO_LOGO = '/logo/cerro-bayo-white.png';
export const RESORT_ADMIN_MANAGED_RESORT_KEY = 'resortAdminManagedResort';

export function syncResortAdminManagedResortCache(user) {
  if (typeof window === 'undefined') return;
  if (user?.role === 'RESORT_ADMIN' && user?.managedResort) {
    localStorage.setItem(RESORT_ADMIN_MANAGED_RESORT_KEY, user.managedResort);
  } else if (!user || user.role !== 'RESORT_ADMIN') {
    localStorage.removeItem(RESORT_ADMIN_MANAGED_RESORT_KEY);
  }
}

export function getCachedResortAdminManagedResort() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(RESORT_ADMIN_MANAGED_RESORT_KEY);
}

export function isCerroBayoManagedResort(resort) {
  return resort === 'CERRO_BAYO';
}

export function getEffectiveManagedResort(user) {
  return user?.managedResort || getCachedResortAdminManagedResort();
}

export function isCerroBayoResortAdmin(user) {
  const cachedResort = getCachedResortAdminManagedResort();

  if (user?.role === 'RESORT_ADMIN') {
    return isCerroBayoManagedResort(getEffectiveManagedResort(user));
  }

  if (!user && isCerroBayoManagedResort(cachedResort)) {
    return true;
  }

  return false;
}

export function isResortAdminNavLoading({ isInitialized, user }) {
  if (!isInitialized || !user) return true;
  if (user.role === 'RESORT_ADMIN' && !user.managedResort) return true;
  return false;
}
