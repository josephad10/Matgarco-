import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Plus,
  PencilLine,
  Trash2,
  KeyRound,
  Shield,
  ShieldOff,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { staffAPI } from '../../lib/api';
import {
  PERMISSION_GROUPS,
  PERMISSION_LABELS,
  ROLE_TEMPLATES,
  PermissionKey,
  StaffPermissions,
  ALL_PERMISSIONS,
  RoleTemplate,
} from '../../lib/permissions';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  staffRole?: string;
  staffRoleLabel?: string;
  permissions?: Record<string, boolean>;
  isActive?: boolean;
  createdAt?: string;
}

const emptyPermissions = (): StaffPermissions => {
  const p = {} as StaffPermissions;
  ALL_PERMISSIONS.forEach((k) => { p[k] = false; });
  return p;
};

// ─── Permission Toggle UI ─────────────────────────────────────────────────────
interface PermissionEditorProps {
  permissions: StaffPermissions;
  onChange: (permissions: StaffPermissions) => void;
}

const PermissionEditor: React.FC<PermissionEditorProps> = ({ permissions, onChange }) => {
  const [expanded, setExpanded] = useState<string[]>(PERMISSION_GROUPS.map((g) => g.label));

  const toggle = (key: PermissionKey) => {
    onChange({ ...permissions, [key]: !permissions[key] });
  };

  const toggleGroup = (label: string) =>
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );

  return (
    <div className="space-y-2">
      {PERMISSION_GROUPS.map((group) => {
        const isExpanded = expanded.includes(group.label);
        const allOn = group.keys.every((k) => permissions[k]);
        const someOn = group.keys.some((k) => permissions[k]);

        return (
          <div key={group.label} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Group header */}
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-700">{group.label}</span>
                {someOn && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {group.keys.filter((k) => permissions[k]).length}/{group.keys.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Select all toggle */}
                <label
                  className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={allOn}
                    onChange={() => {
                      const updated = { ...permissions };
                      group.keys.forEach((k) => { updated[k] = !allOn; });
                      onChange(updated);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  الكل
                </label>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Permission items */}
            {isExpanded && (
              <div className="px-4 py-2 grid grid-cols-2 gap-2">
                {group.keys.map((key) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={permissions[key] ?? false}
                      onChange={() => toggle(key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm text-gray-600">{PERMISSION_LABELS[key]}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Create / Edit Modal ───────────────────────────────────────────────────────
interface StaffModalProps {
  member?: StaffMember | null;
  onClose: () => void;
}

const StaffModal: React.FC<StaffModalProps> = ({ member, onClose }) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(member);

  const [form, setForm] = useState({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    email: member?.email || '',
    password: '',
    phone: member?.phone || '',
    staffRoleLabel: member?.staffRoleLabel || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    member?.staffRole || 'custom'
  );
  const [permissions, setPermissions] = useState<StaffPermissions>(() => {
    const base = emptyPermissions();
    if (member?.permissions) {
      Object.entries(member.permissions).forEach(([k, v]) => {
        if (k in base) (base as Record<string, boolean>)[k] = v;
      });
    }
    return base;
  });

  const applyTemplate = (tpl: RoleTemplate) => {
    setSelectedTemplate(tpl.id);
    setPermissions({ ...tpl.permissions });
    if (tpl.id !== 'custom') {
      setForm((prev) => ({ ...prev, staffRoleLabel: tpl.label }));
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => staffAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('تم إضافة الموظف بنجاح');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'حدث خطأ أثناء الإضافة');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => staffAPI.update(member!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('تم تحديث بيانات الموظف');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'حدث خطأ أثناء التحديث');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error('الاسم والبريد الإلكتروني مطلوبان');
      return;
    }
    if (!isEdit && !form.password) {
      toast.error('كلمة المرور مطلوبة');
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      staffRole: selectedTemplate,
      staffRoleLabel: form.staffRoleLabel,
      permissions,
      ...(form.password ? { password: form.password } : {}),
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-start justify-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">البيانات الأساسية</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">الاسم الأول</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="محمد"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">الاسم الأخير</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أحمد"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isEdit}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="staff@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">رقم الهاتف (اختياري)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="05xxxxxxxx"
                />
              </div>
              {!isEdit && (
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="6 أحرف على الأقل"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Role Templates */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">نموذج الصلاحيات</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ROLE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className={`p-3 rounded-xl border-2 text-right transition-all ${
                    selectedTemplate === tpl.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-800">{tpl.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">{tpl.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">المسمى الوظيفي (اختياري)</label>
              <input
                type="text"
                value={form.staffRoleLabel}
                onChange={(e) => setForm({ ...form, staffRoleLabel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: مشرف المبيعات"
              />
            </div>
          </div>

          {/* Permission Editor */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">الصلاحيات المخصصة</h3>
            <PermissionEditor permissions={permissions} onChange={setPermissions} />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إضافة الموظف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Reset Password Modal ─────────────────────────────────────────────────────
interface ResetPasswordModalProps {
  member: StaffMember;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ member, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: () => staffAPI.resetPassword(member._id, newPassword),
    onSuccess: () => {
      toast.success('تم تغيير كلمة المرور بنجاح');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'حدث خطأ');
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">إعادة تعيين كلمة المرور</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          تعيين كلمة مرور جديدة للموظف:{' '}
          <span className="font-medium text-gray-700">
            {member.firstName} {member.lastName}
          </span>
        </p>

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            placeholder="كلمة المرور الجديدة"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            إلغاء
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={!newPassword || newPassword.length < 6 || mutation.isPending}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Staff Card ───────────────────────────────────────────────────────────────
interface StaffCardProps {
  member: StaffMember;
  onEdit: () => void;
  onDelete: () => void;
  onResetPassword: () => void;
  onToggleActive: () => void;
}

const StaffCard: React.FC<StaffCardProps> = ({
  member,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleActive,
}) => {
  const activePermissions = Object.values(member.permissions || {}).filter(Boolean).length;
  const totalPermissions = ALL_PERMISSIONS.length;

  return (
    <div className={`bg-white rounded-xl border p-5 space-y-4 transition-opacity ${member.isActive === false ? 'opacity-60' : ''}`}>
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {member.firstName} {member.lastName}
            </p>
            <p className="text-xs text-gray-500">{member.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {member.isActive === false ? (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">معطّل</span>
          ) : (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">نشط</span>
          )}
        </div>
      </div>

      {/* Role & Permissions */}
      <div className="flex items-center justify-between">
        <div>
          {member.staffRoleLabel && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {member.staffRoleLabel}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {activePermissions} / {totalPermissions} صلاحية
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={onEdit}
          title="تعديل"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <PencilLine className="h-3.5 w-3.5" />
          تعديل
        </button>
        <button
          onClick={onResetPassword}
          title="تغيير كلمة المرور"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <KeyRound className="h-3.5 w-3.5" />
          كلمة المرور
        </button>
        <button
          onClick={onToggleActive}
          title={member.isActive === false ? 'تفعيل' : 'تعطيل'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {member.isActive === false ? (
            <><Shield className="h-3.5 w-3.5" /> تفعيل</>
          ) : (
            <><ShieldOff className="h-3.5 w-3.5" /> تعطيل</>
          )}
        </button>
        <button
          onClick={onDelete}
          title="حذف"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors mr-auto"
        >
          <Trash2 className="h-3.5 w-3.5" />
          حذف
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const StaffPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'create' | 'edit' | 'resetPassword' | null>(null);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffAPI.getAll().then((res) => res.data.data as StaffMember[]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => staffAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('تم حذف الموظف');
    },
    onError: () => toast.error('حدث خطأ أثناء الحذف'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      staffAPI.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('تم تحديث حالة الموظف');
    },
    onError: () => toast.error('حدث خطأ'),
  });

  const handleDelete = (member: StaffMember) => {
    if (window.confirm(`هل أنت متأكد من حذف ${member.firstName} ${member.lastName}؟`)) {
      deleteMutation.mutate(member._id);
    }
  };

  const handleToggleActive = (member: StaffMember) => {
    const newActive = member.isActive === false ? true : false;
    toggleActiveMutation.mutate({ id: member._id, isActive: newActive });
  };

  const staff = data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الموظفين</h1>
          <p className="text-gray-500 text-sm mt-0.5">أضف وأدر حسابات الموظفين وصلاحياتهم</p>
        </div>
        <button
          onClick={() => { setSelectedMember(null); setModal('create'); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          موظف جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              <p className="text-xs text-gray-500">إجمالي الموظفين</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter((s) => s.isActive !== false).length}
              </p>
              <p className="text-xs text-gray-500">نشط</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldOff className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter((s) => s.isActive === false).length}
              </p>
              <p className="text-xs text-gray-500">معطّل</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-5 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-700 mb-1">لا يوجد موظفون بعد</h3>
          <p className="text-sm text-gray-500 mb-4">ابدأ بإضافة موظفين وتحديد صلاحياتهم</p>
          <button
            onClick={() => { setSelectedMember(null); setModal('create'); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            إضافة موظف
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <StaffCard
              key={member._id}
              member={member}
              onEdit={() => { setSelectedMember(member); setModal('edit'); }}
              onDelete={() => handleDelete(member)}
              onResetPassword={() => { setSelectedMember(member); setModal('resetPassword'); }}
              onToggleActive={() => handleToggleActive(member)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {(modal === 'create' || modal === 'edit') && (
        <StaffModal
          member={modal === 'edit' ? selectedMember : null}
          onClose={() => { setModal(null); setSelectedMember(null); }}
        />
      )}
      {modal === 'resetPassword' && selectedMember && (
        <ResetPasswordModal
          member={selectedMember}
          onClose={() => { setModal(null); setSelectedMember(null); }}
        />
      )}
    </div>
  );
};

export default StaffPage;
