import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import './App.css'
import IngestionPage from './components/IngestionPage';
import AdminLogin from './components/AdminLogin';
import Admin from './components/Admin';
import Gratitude from './components/Gratitude';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
                <>
                    <Route path="/" element={<Navigate to="/test/customer" />} />
                    <Route path="/:autobody" element={<Navigate to="/:autobody/customer" />} />
                    <Route path="/:autobody/customer" element={<IngestionPage />} />
                    <Route path="/:autobody/gratitude" element={<Gratitude />} />
                    <Route path="/:autobody/admin/login" element={<AdminLogin />} />
                    <Route path="/:autobody/admin" element={<Admin />} />
                </>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
