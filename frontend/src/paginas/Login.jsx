import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Auth.css";

function Login() {

  const navigate = useNavigate();
  const [modo, setModo] = useState("login"); // "login" | "registro" | "exito"

  const [form, setForm] = useState({
    username: "",
    correo:   "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLogin = async () => {
    if (!form.correo || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:3000/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ correo: form.correo, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      localStorage.setItem("token",   data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/");

    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async () => {
    if (!form.username || !form.correo || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:3000/api/auth/registro", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setModo("exito");

    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (modo === "exito") {
    return (
      <div className="auth-bg">
        <div className="auth-card">
          <span className="auth-icon">📧</span>
          <h2>Revisa tu correo</h2>
          <p className="auth-sub">
            Te enviamos un enlace de verificación a <strong>{form.correo}</strong>.
            Verifica tu cuenta para poder iniciar sesión.
          </p>
          <button className="auth-btn" onClick={() => setModo("login")}>
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">

        <h1 className="auth-logo">FitRecommend 💪</h1>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${modo === "login" ? "active" : ""}`}
            onClick={() => { setModo("login"); setError(""); }}
          >
            Iniciar sesión
          </button>
          <button
            className={`auth-tab ${modo === "registro" ? "active" : ""}`}
            onClick={() => { setModo("registro"); setError(""); }}
          >
            Registrarse
          </button>
        </div>

        <div className="auth-form">

          {modo === "registro" && (
            <div className="auth-campo">
              <label>Nombre de usuario</label>
              <input
                type="text"
                name="username"
                placeholder="tu_username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="auth-campo">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={handleChange}
            />
          </div>

          <div className="auth-campo">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            className="auth-btn"
            onClick={modo === "login" ? handleLogin : handleRegistro}
            disabled={loading}
          >
            {loading
              ? "Cargando..."
              : modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Login;