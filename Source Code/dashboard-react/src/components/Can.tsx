import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionKey } from '../lib/permissions';

interface CanProps {
  /** The permission to check */
  permission: PermissionKey;
  /** Content to render when permission is granted */
  children: React.ReactNode;
  /** Optional fallback content when permission is denied */
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children based on whether the current user
 * has the specified permission.
 *
 * Usage:
 *   <Can permission="products.create">
 *     <button>Add Product</button>
 *   </Can>
 */
export const Can: React.FC<CanProps> = ({ permission, children, fallback = null }) => {
  const { can } = usePermissions();
  return can(permission) ? <>{children}</> : <>{fallback}</>;
};

export default Can;
