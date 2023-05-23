import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const Navbar = () => {
  const { setAuth } = useAuth();
  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
  };
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/orders/list" className="nav-link">
            Orders List
          </Link>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="control-sidebar"
            data-controlsidebar-slide="true"
            href="#"
            role="button"
          >
            <i className="fas fa-sign-out-alt" onClick={logout}></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
