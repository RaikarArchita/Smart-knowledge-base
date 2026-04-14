import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../components/layout/MainLayout";

const Login = lazy(() => import("../views/login/Login"));
const Register = lazy(() => import("../views/register/Register"));
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const Workspace = lazy(() => import("../views/workspace/Workspace"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/sign-in" replace />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace">
            <Route index element={<Workspace />} />
            <Route path=":folderId" element={<Workspace />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
