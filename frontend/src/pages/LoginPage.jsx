import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, logout } from "../services/auth";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(username.trim(), password);

      if (user.role === "admin") {
        navigate("/admin", {
          replace: true,
          state: { user },
        });
      } else if (user.role === "custodian") {
        navigate("/custodian", {
          replace: true,
          state: { user },
        });
      } else {
        try {
          await logout();
        } catch {
          // Se conserva el mensaje de acceso denegado.
        }

        setError("Esta cuenta no tiene un rol autorizado.");
      }
    } catch (err) {
      setError(
        err.message || "No fue posible conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <Link
          to="/"
          className={styles.loginBrand}
          aria-label="Volver al mapa de wc CUCEI"
        >
          <div className={styles.brandMark} aria-hidden="true">
            wc
          </div>

          <div className={styles.loginBrandText}>
            <h1>CUCEI</h1>
            <span>Servicios sanitarios del campus</span>
          </div>
        </Link>

        <div className={styles.loginHeading}>
          <h2>Bienvenido</h2>
          <p>
            Inicia sesión para administrar los baños del campus.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.loginForm}
        >
          <div className={styles.loginField}>
            <label htmlFor="username">
              Nombre de usuario
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          <div className={styles.loginField}>
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className={styles.loginError} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.loginSubmit}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <Link to="/" className={styles.loginBack}>
          Volver al mapa
        </Link>
      </section>
    </main>
  );
}