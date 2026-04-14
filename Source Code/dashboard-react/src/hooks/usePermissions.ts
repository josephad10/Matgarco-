import { useAuthStore } from '../store/authStore';
import { PermissionKey } from '../lib/permissions';

/**
 * Returns a `can(permission)` function that checks whether the current user
 * has access to the given permission.
 *
 * - Owners (`merchant_owner`) and super-admins always have all permissions.
 * - Staff members are checked against their `permissions` map.
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  const isOwner =
    user?.role === 'merchant_owner' || user?.role === 'super_admin';

  const can = (permission: PermissionKey): boolean => {
    if (!user) return false;
    if (isOwner) return true;
    return user.permissions?.[permission] === true;
  };

  const canAny = (...permissions: PermissionKey[]): boolean =>
    permissions.some((p) => can(p));

  const canAll = (...permissions: PermissionKey[]): boolean =>
    permissions.every((p) => can(p));

  return { can, canAny, canAll, isOwner };
};
