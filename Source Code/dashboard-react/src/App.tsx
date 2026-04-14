import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import { RequirePermission } from './components/RequirePermission';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Overview from './pages/dashboard/Overview';
import { ProductsList } from './pages/products/ProductsList';
import { AddProduct } from './pages/products/AddProduct';
import { EditProduct } from './pages/products/EditProduct';
import { ViewProduct } from './pages/products/ViewProduct';
import { OrdersList } from './pages/orders/OrdersList';
import { OrderDetails } from './pages/orders/OrderDetails';
import { CustomersList } from './pages/customers/CustomersList';
import { CustomerDetails } from './pages/customers/CustomerDetails';
import { Settings } from './pages/settings/Settings';
import { Reports } from './pages/reports/Reports';
import StaffPage from './pages/staff/StaffPage';
import OnboardingWizard from './pages/onboarding/OnboardingWizard';
import StoreDesignPage from './pages/store-design/StoreDesignPage';
import SubscriptionPage from './pages/SubscriptionPage';
import FinancePage from './pages/finance/FinancePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="products" element={<RequirePermission permission="products.view"><ProductsList /></RequirePermission>} />
            <Route path="products/new" element={<RequirePermission permission="products.create"><AddProduct /></RequirePermission>} />
            <Route path="products/:id" element={<RequirePermission permission="products.view"><ViewProduct /></RequirePermission>} />
            <Route path="products/:id/edit" element={<RequirePermission permission="products.edit"><EditProduct /></RequirePermission>} />
            <Route path="orders" element={<RequirePermission permission="orders.view"><OrdersList /></RequirePermission>} />
            <Route path="orders/:id" element={<RequirePermission permission="orders.view"><OrderDetails /></RequirePermission>} />
            <Route path="customers" element={<RequirePermission permission="customers.view"><CustomersList /></RequirePermission>} />
            <Route path="customers/:id" element={<RequirePermission permission="customers.view"><CustomerDetails /></RequirePermission>} />
            <Route path="reports" element={<RequirePermission permission="reports.view"><Reports /></RequirePermission>} />
            <Route path="settings" element={<Settings />} />
            <Route path="staff" element={<RequirePermission permission="staff.view"><StaffPage /></RequirePermission>} />
            <Route path="store-design" element={<StoreDesignPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="finance" element={<FinancePage />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />

          {/* Onboarding (outside dashboard layout, full screen wizard) */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingWizard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-center" richColors closeButton duration={3000} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
