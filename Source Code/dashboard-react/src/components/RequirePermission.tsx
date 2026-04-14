import React from 'react';
import { ShieldX } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import type { PermissionKey } from '../lib/permissions';

interface RequirePermissionProps {
  permission: PermissionKey;
  children: React.ReactNode;
}

/**
 * Wraps a page/section and renders a 403-style card when the user
 * does not have the required permission.
 *
 * Usage in App.tsx:
 *   <Route path="products" element={
 *     <RequirePermission permission="products.view">
 *       <ProductsList />
 *     </RequirePermission>
 *   } />
 */
export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  children,
}) => {
  const { can } = usePermissions();

  if (!can(permission)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 py-16">
        <div className="p-6 bg-red-50 rounded-full">
          <ShieldX className="w-16 h-16 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح لك</h2>
          <p className="text-gray-500 max-w-sm">
            ليس لديك صلاحية للوصول إلى هذه الصفحة. تواصل مع مدير المتجر لمنحك الإذن.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequirePermission;
