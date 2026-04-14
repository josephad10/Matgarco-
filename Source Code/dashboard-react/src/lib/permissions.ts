// ─── Permission Keys ──────────────────────────────────────────────────────────
export type PermissionKey =
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'orders.view'
  | 'orders.updateStatus'
  | 'orders.cancel'
  | 'customers.view'
  | 'customers.edit'
  | 'reports.view'
  | 'settings.view'
  | 'settings.edit'
  | 'settings.editSubscription'
  | 'staff.view'
  | 'staff.create'
  | 'staff.edit'
  | 'staff.delete';

export type StaffPermissions = Record<PermissionKey, boolean>;

// ─── All Permission Keys (ordered) ───────────────────────────────────────────
export const ALL_PERMISSIONS: PermissionKey[] = [
  'products.view',
  'products.create',
  'products.edit',
  'products.delete',
  'orders.view',
  'orders.updateStatus',
  'orders.cancel',
  'customers.view',
  'customers.edit',
  'reports.view',
  'settings.view',
  'settings.edit',
  'settings.editSubscription',
  'staff.view',
  'staff.create',
  'staff.edit',
  'staff.delete',
];

// ─── Arabic Labels ────────────────────────────────────────────────────────────
export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  'products.view': 'عرض المنتجات',
  'products.create': 'إضافة منتج',
  'products.edit': 'تعديل منتج',
  'products.delete': 'حذف منتج',
  'orders.view': 'عرض الطلبات',
  'orders.updateStatus': 'تحديث حالة الطلب',
  'orders.cancel': 'إلغاء طلب',
  'customers.view': 'عرض العملاء',
  'customers.edit': 'تعديل بيانات عميل',
  'reports.view': 'عرض التقارير',
  'settings.view': 'عرض الإعدادات',
  'settings.edit': 'تعديل الإعدادات',
  'settings.editSubscription': 'إدارة الاشتراك',
  'staff.view': 'عرض الموظفين',
  'staff.create': 'إضافة موظف',
  'staff.edit': 'تعديل موظف',
  'staff.delete': 'حذف موظف',
};

// ─── Permission Groups (for UI rendering) ────────────────────────────────────
export const PERMISSION_GROUPS: { label: string; keys: PermissionKey[] }[] = [
  {
    label: 'المنتجات',
    keys: ['products.view', 'products.create', 'products.edit', 'products.delete'],
  },
  {
    label: 'الطلبات',
    keys: ['orders.view', 'orders.updateStatus', 'orders.cancel'],
  },
  {
    label: 'العملاء',
    keys: ['customers.view', 'customers.edit'],
  },
  {
    label: 'التقارير',
    keys: ['reports.view'],
  },
  {
    label: 'الإعدادات',
    keys: ['settings.view', 'settings.edit', 'settings.editSubscription'],
  },
  {
    label: 'إدارة الموظفين',
    keys: ['staff.view', 'staff.create', 'staff.edit', 'staff.delete'],
  },
];

// ─── Role Template Permissions ────────────────────────────────────────────────
const makePermissions = (keys: PermissionKey[]): StaffPermissions => {
  const result = {} as StaffPermissions;
  ALL_PERMISSIONS.forEach((k) => { result[k] = false; });
  keys.forEach((k) => { result[k] = true; });
  return result;
};

export const OWNER_PERMISSIONS: StaffPermissions = makePermissions(ALL_PERMISSIONS);

export const MANAGER_PERMISSIONS: StaffPermissions = makePermissions([
  'products.view',
  'products.create',
  'products.edit',
  'products.delete',
  'orders.view',
  'orders.updateStatus',
  'orders.cancel',
  'customers.view',
  'customers.edit',
  'reports.view',
  'settings.view',
  'settings.edit',
  'staff.view',
]);

export const STAFF_PERMISSIONS: StaffPermissions = makePermissions([
  'products.view',
  'orders.view',
  'orders.updateStatus',
  'customers.view',
]);

export const ACCOUNTANT_PERMISSIONS: StaffPermissions = makePermissions([
  'products.view',
  'orders.view',
  'customers.view',
  'reports.view',
]);

// ─── Role Templates ───────────────────────────────────────────────────────────
export interface RoleTemplate {
  id: string;
  label: string;
  description: string;
  permissions: StaffPermissions;
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'manager',
    label: 'مدير',
    description: 'صلاحيات كاملة ما عدا الاشتراك وإدارة الموظفين',
    permissions: MANAGER_PERMISSIONS,
  },
  {
    id: 'staff',
    label: 'موظف',
    description: 'عرض المنتجات والطلبات وتحديث حالة الطلبات',
    permissions: STAFF_PERMISSIONS,
  },
  {
    id: 'accountant',
    label: 'محاسب',
    description: 'عرض التقارير والطلبات والعملاء فقط',
    permissions: ACCOUNTANT_PERMISSIONS,
  },
  {
    id: 'custom',
    label: 'مخصص',
    description: 'اختر الصلاحيات يدوياً',
    permissions: makePermissions([]),
  },
];
