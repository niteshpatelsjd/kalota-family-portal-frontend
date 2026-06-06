import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import LoginPage from './pages/auth/LoginPage'

import AdminLayout from './components/layout/AdminLayout'

import UsersPage from './pages/users/UsersPage'
import RolesPage from './pages/roles/RolesPage'
import ModulesPage from './pages/modules/ModulesPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import LocationsPage from './pages/locations/LocationsPage'

import ProtectedRoute from './components/common/ProtectedRoute'

import FamiliesPage from './pages/family/FamiliesPage'
import FamilyDetailsPage from './pages/family/FamilyDetailsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <DashboardPage />
            }
          />

          <Route
            path="users"
            element={<UsersPage />}
          />

          <Route
            path="roles"
            element={<RolesPage />}
          />

          <Route
            path="modules"
            element={<ModulesPage />}
          />

          <Route
            path="location"
            element={
              <LocationsPage />
            }
          />

          <Route
            path="families"
            element={
              <FamiliesPage />
            }
          />

          <Route
            path="families/:id"
            element={
              <FamilyDetailsPage />
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
