import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AnalysisDashboard from './pages/AnalysisDashboard';
import ImprovementEditor from './pages/ImprovementEditor';
import KeywordLab from './pages/KeywordLab';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarWithParams />
      <main className="flex-1 bg-bgSecondary relative overflow-y-auto p-10">
        <Outlet />
      </main>
    </div>
  );
};

// Extracted sidebar wrapper to get access to route params reactively
const SidebarWithParams = () => {
  const location = useLocation();
  const params = location.pathname.split('/');
  const idMatch = params.length > 2 ? params[2] : null; 
  return <Sidebar id={idMatch} />;
};

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<LandingPage />} />
            <Route path="/insights/:id" element={<AnalysisDashboard />} />
            <Route path="/improvement/:id" element={<ImprovementEditor />} />
            <Route path="/keyword-lab/:id" element={<KeywordLab />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
