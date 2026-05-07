import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/Auth.css";

function Verificar() {

  const { token }   = useParams();
  const navigate    = useNavigate();
  const [estado, setEstado] = useState("cargando");
  const ejecutado   = useRef(false); // ← evita doble llamada

  useEffect(() => {
    if (ejecutado.current) return;
    ejecutado.current = true;

    fetch(`http://localhost:3000/api/auth/verificar/${token}`)
      .then(r => r.json())
      .then(data => setEstado(data.ok ? "ok" : "error"))
      .catch(() => setEstado("error"));
  }, [token]);

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {estado === "cargando" && (
          <>
            <span className="auth-icon">⏳</span>
            <h2>Verificando tu cuenta...</h2>
          </>
        )}
        {estado === "ok" && (
          <>
            <span className="auth-icon">✅</span>
            <h2>¡Cuenta verificada!</h2>
            <p className="auth-sub">Ya puedes iniciar sesión.</p>
            <button className="auth-btn" onClick={() => navigate("/login")}>
              Ir al login
            </button>
          </>
        )}
        {estado === "error" && (
          <>
            <span className="auth-icon">❌</span>
            <h2>Token inválido</h2>
            <p className="auth-sub">El enlace expiró o ya fue usado.</p>
            <button className="auth-btn" onClick={() => navigate("/login")}>
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Verificar;