import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">FitRecommend 💪</div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>Inicio</li>
        <li>Rutinas</li>
        <li>Perfil</li>
      </ul>
    </nav>
  );
}

export default Navbar;