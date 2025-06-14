import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rute yang dilindungi, hanya bisa diakses jika user login */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect ke /dashboard/home jika hanya /dashboard */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />

        {/* Rute untuk halaman login/register */}
        <Route path="/auth/*" element={<Auth />} />

        {/* Rute fallback */}
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
