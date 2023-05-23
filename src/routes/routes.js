import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import RequireAuth from "../components/requireAuth";
import path from "./paths";
import useAuth from "../hooks/useAuth";
const loadRoutes = (routes, Layout) => {
  const { auth, isLoading } = useAuth();
  return routes.map((item) => {
    if (item?.public) return;
    if (item?.roles && item.roles.includes(auth?.user?.role)) {
      return (
        <Route
          key={item.path}
          path={item.path}
          element={<Layout>{item.component}</Layout>}
        />
      );
    } else if (
      !item?.roles ||
      (item?.roles && item.roles.includes(auth?.user?.role))
    ) {
      return (
        <Route
          key={item.path}
          path={item.path}
          element={<Layout>{item.component}</Layout>}
        />
      );
    }
  });
};

const loadPublic = (routes) => {
  return routes.map((item) => {
    if (item.public) {
      return (
        <Route key={item.path} path={item.path} element={<item.component />} />
      );
    }
  });
};

const RoutesComponent = () => {
  const { auth, isLoading } = useAuth();
  console.log(auth);
  return (
    <Routes>
      {loadPublic(path)}
      <Route element={<RequireAuth />}>{loadRoutes(path, Layout)}</Route>{" "}
      {/* {!isLoading && ( */}
      <Route key={"all"} path={"/*"} element={<Navigate to={"/"} replace />} />
      {/* )} */}
    </Routes>
  );
};
export default RoutesComponent;
