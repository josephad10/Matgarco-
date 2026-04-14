import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" dir="rtl">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-500 mb-8">الرابط الذي تبحث عنه غير موجود أو تم نقله.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
        >
          <Home className="w-4 h-4" />
          الرجوع للوحة التحكم
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
