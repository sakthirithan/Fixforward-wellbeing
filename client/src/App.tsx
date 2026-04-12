import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ManualLog from './pages/ManualLog';
import InstitutionalView from './pages/InstitutionalView';
import Insights from './pages/Insights';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/manual-log" element={<Layout><ManualLog /></Layout>} />
            <Route path="/institutional" element={<Layout><InstitutionalView /></Layout>} />
            <Route path="/insights" element={<Layout><Insights /></Layout>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

