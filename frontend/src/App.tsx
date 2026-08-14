import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';


import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Home } from './pages/Home';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';
import { PrivateRoute } from './components/PrivateRoute';

import { CheckCircle, XCircle, WarningCircle, Info } from '@phosphor-icons/react';

import { ComponentsShowcaseScreen } from './screens/ComponentsShowcaseScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-right" 
        expand={true}
        gap={10}
        closeButton
        icons={{
          success: <CheckCircle size={26} weight="fill" className="text-[#16A34A] shrink-0" />,
          error: <XCircle size={26} weight="fill" className="text-[#DC2626] shrink-0" />,
          warning: <WarningCircle size={26} weight="fill" className="text-[#DBA212] shrink-0" />,
          info: <Info size={26} weight="fill" className="text-[#3B82F6] shrink-0" />,
        }}
      />

      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<MainLayout />}>
          <Route path="/components" element={<ComponentsShowcaseScreen />} />
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<PrivateRoute />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}