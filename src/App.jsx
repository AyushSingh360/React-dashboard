import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import EmployeeTable from './pages/EmployeeTable';
import EmployeeDetails from './pages/EmployeeDetails';
import Analytics from './pages/Analytics';
import AuditHistory from './pages/AuditHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/list" element={<EmployeeTable />} />
                  <Route path="/details/:id" element={<EmployeeDetails />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/audits" element={<AuditHistory />} />
                  <Route path="*" element={<Navigate to="/list" replace />} />
                </Routes>
              </Layout>
            } />
          </Route>

          <Route path="/" element={<Navigate to="/list" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
