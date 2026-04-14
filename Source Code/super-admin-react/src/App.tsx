import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import MerchantsList from './pages/MerchantsList';
import MerchantDetails from './pages/MerchantDetails';
import Subscriptions from './pages/Subscriptions';
import ThemesList from './pages/ThemesList';
import GlobalSettings from './pages/GlobalSettings';
import SupportCenter from './pages/SupportCenter';
import AdminStaffPage from './pages/AdminStaffPage';
import Payouts from './pages/Payouts';
import ThemeMaker from './pages/ThemeMaker';
import PlansManager from './pages/PlansManager';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/themes/:id/builder" element={<ThemeMaker />} />
      
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/merchants" element={<MerchantsList />} />
        <Route path="/merchants/:id" element={<MerchantDetails />} />
        <Route path="/finance" element={<Subscriptions />} />
        <Route path="/plans" element={<PlansManager />} />
        <Route path="/themes" element={<ThemesList />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/support" element={<SupportCenter />} />
        <Route path="/settings" element={<GlobalSettings />} />
        <Route path="/staff" element={<AdminStaffPage />} />
      </Route>
    </Routes>
  );
}

export default App;
