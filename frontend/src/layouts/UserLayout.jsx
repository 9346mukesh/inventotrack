import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const AUTH_ROUTES = ["/login", "/register"];

const UserLayout = () => {
  const { pathname } = useLocation();
  const hideNavbar = AUTH_ROUTES.includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

export default UserLayout;