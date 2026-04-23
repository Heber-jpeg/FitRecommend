import "./css/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ perfilData, onAbrirPerfil }) {

  const navigate = useNavigate();
  const location = useLocation();

  const objetivoLabel = {
    musculo: "Ganar músculo",
    perder_grasa: "Perder grasa",
    resistencia: "Resistencia"
  };

  const links = [
    { path: "/",            icon: "🏠", label: "Inicio"      },
    { path: "/rutinas",     icon: "⚡", label: "Rutinas"     },
    { path: "/calendario",  icon: "📅", label: "Calendario"  },
    { path: "/mis-rutinas", icon: "📋", label: "Mis rutinas" },
  ];

  return (
    <aside className="sidebar">

      {perfilData ? (
        <div className="sidebar-perfil-card" onClick={onAbrirPerfil}>
          <div className="sidebar-perfil-avatar">
            {perfilData.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-perfil-info">
            <span className="sidebar-perfil-nombre">{perfilData.nombre}</span>
            <span className="sidebar-perfil-nivel">{perfilData.nivel}</span>
            <span className="sidebar-perfil-objetivo">
              {objetivoLabel[perfilData.objetivo] || perfilData.objetivo}
            </span>
          </div>
          <span className="sidebar-perfil-edit">✏️</span>
        </div>
      ) : (
        <div className="sidebar-perfil-card sidebar-perfil-vacio" onClick={onAbrirPerfil}>
          <span>👤 Completa tu perfil</span>
        </div>
      )}

      <div className="sidebar-divider" />

      <h3 className="sidebar-seccion">Navegación</h3>

      {links.map((link) => (
        <button
          key={link.path}
          className={`sidebar-btn ${location.pathname === link.path ? "active" : ""}`}
          onClick={() => navigate(link.path)}
        >
          {link.icon} {link.label}
        </button>
      ))}

      <div className="sidebar-divider" />

      <button
        className="sidebar-btn"
        onClick={onAbrirPerfil}
      >
        👤 Mi perfil
      </button>

    </aside>
  );
}

export default Sidebar;