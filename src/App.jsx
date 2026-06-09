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

import DistrictPage from './pages/locations/DistrictPage'
import TehsilPage from './pages/locations/TehsilPage'
import VillagePage from './pages/locations/VillagePage'

import ProtectedRoute from './components/common/ProtectedRoute'
import FamilyPage from './pages/family/FamilyPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* DEFAULT */}
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          {/* USERS */}
          <Route
            path="users"
            element={<UsersPage />}
          />

          {/* ROLES */}
          <Route
            path="roles"
            element={<RolesPage />}
          />

                    {/* ROLES */}
          <Route
            path="families"
            element={<FamilyPage />}
          />

          {/* MODULES */}
          <Route
            path="modules"
            element={<ModulesPage />}
          />

          {/* LOCATIONS */}
          <Route
            path="location"
            element={
              <Navigate
                to="/district"
                replace
              />
            }
          />

          {/* DISTRICT */}
          <Route
            path="district"
            element={<DistrictPage />}
          />

          {/* TEHSIL */}
          <Route
            path="tehsil"
            element={<TehsilPage />}
          />

          {/* VILLAGE */}
          <Route
            path="village"
            element={<VillagePage />}
          />
        </Route>

        {/* FALLBACK */}
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