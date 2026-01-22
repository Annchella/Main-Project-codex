import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Dashboards
import UserDashboard from "../components/user/UserDashboard";
import TutorDasboard from "../components/tutor/TutorDasboard";
import AdminDashboard from "../components/admin/AdminDashboard";
import CreateCourse from "../components/tutor/CreateCourses";

// User components

import CodeRoom from "../components/user/CodeRoom";
import CodeEditor from "../components/user/CodeEditor";
import PraticeEditor from "../components/user/PraticeEditor";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Home (Loading / Auth check page) */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER ROUTES ================= */}

        {/* User Dashboard */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor/create-course"
          element={
            <ProtectedRoute role="tutor">
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/code-room"
          element={
            <ProtectedRoute roles={["user", "tutor"]}>
              <CodeRoom />
            </ProtectedRoute>
          }
        />

        {/* Code Editor with Room ID */}
        <Route
          path="/code-room/:roomId"
          element={
            <ProtectedRoute roles={["user", "tutor"]}>
              <CodeEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/practice-editor"
          element={
            <ProtectedRoute role="user">
              <PraticeEditor />
            </ProtectedRoute>
          }
        />

        {/* ================= TUTOR ROUTES ================= */}
        <Route
          path="/tutor"
          element={
            <ProtectedRoute role="tutor">
              <TutorDasboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
