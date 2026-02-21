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
import EditCourse from "../components/tutor/EditCourse";
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
import TutorEnrollments from "../components/tutor/TutorEnrollments";
import TutorPortfolio from "../components/tutor/TutorPortfolio";
import AdminTutorApproval from "../components/admin/AdminTutorApproval";
import AdminCourseManagement from "../components/admin/AdminCourseManagement";
import ManageUsers from "../components/admin/ManageUsers";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";
import ResumeBuilder from "../components/user/ResumeBuilder";
import Profile from "../components/user/Profile";
import PublicTutorPortfolio from "../components/user/PublicTutorPortfolio";
import Layout from "../components/common/Layout";
import TutorDoubts from "../components/tutor/TutorDoubts";
import NotificationManager from "../components/common/NotificationManager";
import ContactUs from "../components/common/ContactUs";
import SupportChat from "../components/common/SupportChat";
import AdminSupport from "../components/admin/AdminSupport";
import Settings from "../components/common/Settings";

const AppRoutes = () => {
  return (
    <Router>
      <NotificationManager />
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
              <Layout>
                <UserDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/user/dashboard" element={<Navigate to="/user" />} />
        <Route
          path="/user/live-classes"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <LiveClasses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/schedule-live-class"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <ScheduleLiveClass />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor/create-course"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <CreateCourse />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <ProtectedRoute roles={["user", "tutor"]}>
              <Layout>
                <ResumeBuilder />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/courses"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <Courses />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/code-room"
          element={
            <ProtectedRoute roles={["user", "tutor"]}>
              <Layout>
                <CodeRoom />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Code Editor with Room ID */}
        <Route
          path="/code-room/:roomId"
          element={
            <ProtectedRoute roles={["user", "tutor"]}>
              <Layout>
                <CodeEditor />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/practice-editor"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <PracticeEditor />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/challenges"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <ChallengesList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/challenges/:challengeId"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <ChallengeEditor />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/leaderboard"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <Leaderboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/mock-interview"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <MockInterview />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/courses/:courseId/player"
          element={
            <ProtectedRoute roles={["user", "tutor"]}>
              <Layout>
                <CoursePlayer />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/profile/:id"
          element={
            <ProtectedRoute roles={["user", "tutor", "admin"]}>
              <Layout>
                <PublicTutorPortfolio />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/contact" element={<Layout><ContactUs /></Layout>} />

        <Route
          path="/support"
          element={
            <ProtectedRoute roles={["user", "tutor", "admin"]}>
              <Layout>
                <SupportChat />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["user", "tutor", "admin"]}>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <TutorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/manage-courses"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <TutorCourseManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/courses/:id/edit"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <EditCourse />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/purchases"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <TutorPurchases />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/enrollments"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <TutorEnrollments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/portfolio"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <TutorPortfolio />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/doubts"
          element={
            <ProtectedRoute role="tutor">
              <Layout>
                <TutorDoubts />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminCourseApproval />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminSupport />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tutor-approvals"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminTutorApproval />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/purchases"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminPurchases />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/course-management"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminCourseManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <ManageUsers />
              </Layout>
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
