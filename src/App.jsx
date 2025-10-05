import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./components/auth/Login";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ReportHighValue from "./pages/ReportHighValue";
import Report2 from "./pages/Report2";
import Report3 from "./pages/Report3";
import Report4 from "./pages/Report4";
import Report5 from "./pages/Report5";

import {
  ReportAccChangSpeciSignature,
  ReportReverseEntries,
  ReportManualInterestPostingDtls,
  ReportSuspiciousCashTrans,
  ReportCancelledScrolls,
  ReportFDDeletEntries,
  ReportMultipleDepLoanIssuesonSingleFDR,
  ReportDupFDRIssue,
  ReportReopenAccDtls,
  ReportChangingofNom,
  ReportSBStatusChang,
  ReportHighValueTrans,
  ReportUserOperatorChang,
  ReportUserRight,
  ReportChangePasswordLog,
  ReportUserRightTransfer,
  ReportDocument,
} from "./components/reports";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background:
            "linear-gradient(135deg, #FF6600 0%, #FF8533 35%, #004B87 100%)",
          color: "white",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// App Routes component (needs to be inside AuthProvider)
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Protected routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reporthighvalue"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportHighValue />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/report2"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Report2 />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/report3"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Report3 />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/report4"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Report4 />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/report5"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Report5 />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Dynamic report routes */}
      <Route
        path="/reports/ReportAccChangSpeciSignature"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportAccChangSpeciSignature />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportReverseEntries"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportReverseEntries />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportManualInterestPostingDtls"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportManualInterestPostingDtls />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportSuspiciousCashTrans"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportSuspiciousCashTrans />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportCancelledScrolls"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportCancelledScrolls />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportFDDeletEntries"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportFDDeletEntries />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportMultipleDepLoanIssuesonSingleFDR"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportMultipleDepLoanIssuesonSingleFDR />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportDupFDRIssue"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportDupFDRIssue />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportReopenAccDtls"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportReopenAccDtls />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportChangingofNom"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportChangingofNom />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportSBStatusChang"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportSBStatusChang />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportHighValueTrans"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportHighValueTrans />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportUserOperatorChang"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportUserOperatorChang />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportUserRight"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportUserRight />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportChangePasswordLog"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportChangePasswordLog />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportUserRightTransfer"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportUserRightTransfer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/ReportDocument"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportDocument />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
