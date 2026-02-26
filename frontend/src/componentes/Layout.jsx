import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;