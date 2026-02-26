import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">FitRecommend 💪</div>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/rutinas">Rutinas</Link></li>
        <li><Link to="/perfil">Perfil</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;