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
import TutorDashboard from "../components/tutor/TutorDashboard";
import AdminDashboard from "../components/admin/AdminDashboard";
import CreateCourse from "../components/tutor/CreateCourses";
import ScheduleLiveClass from "../components/tutor/ScheduleLiveClass";

// User components

import CodeRoom from "../components/user/CodeRoom";
import CodeEditor from "../components/user/CodeEditor";
import PracticeEditor from "../components/user/PracticeEditor";
import Courses from "../components/user/Courses";
import LiveClasses from "../components/user/LiveClasses";
import ChallengesList from "../components/user/ChallengesList";
import ChallengeEditor from "../components/user/ChallengeEditor";
import Leaderboard from "../components/user/Leaderboard";
import MockInterview from "../components/user/MockInterview";
import CoursePlayer from "../components/user/CoursePlayer";
import TutorCourseManagement from "../components/tutor/TutorCourseManagement";
import AdminCourseApproval from "../components/admin/AdminCourseApproval";
import AdminPurchases from "../components/admin/AdminPurchases";
import TutorPurchases from "../components/tutor/TutorPurchases";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";
import ResumeBuilder from "../components/user/ResumeBuilder";
import Profile from "../components/user/Profile";

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
          path="/user/live-classes"
          element={
            <ProtectedRoute role="user">
              <LiveClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/schedule-live-class"
          element={
            <ProtectedRoute role="tutor">
              <ScheduleLiveClass />
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
          path="/resume-builder"
          element={
            <ProtectedRoute roles={["user", "tutor"]}>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/courses"
          element={
            <ProtectedRoute role="user">
              <Courses />
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
              <PracticeEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/challenges"
          element={
            <ProtectedRoute role="user">
              <ChallengesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/challenges/:challengeId"
          element={
            <ProtectedRoute role="user">
              <ChallengeEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/leaderboard"
          element={
            <ProtectedRoute role="user">
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/mock-interview"
          element={
            <ProtectedRoute role="user">
              <MockInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/courses/:courseId/player"
          element={
            <ProtectedRoute role="user">
              <CoursePlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor"
          element={
            <ProtectedRoute role="tutor">
              <TutorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/manage-courses"
          element={
            <ProtectedRoute role="tutor">
              <TutorCourseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/purchases"
          element={
            <ProtectedRoute role="tutor">
              <TutorPurchases />
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
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute role="admin">
              <AdminCourseApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/purchases"
          element={
            <ProtectedRoute role="admin">
              <AdminPurchases />
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
