import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header({
    isCustodian = false,
    isAdmin = false,
    genderFilter = null,
    isAuthenticated = false,
    onGenderFilterChange,
    onLogout,
    loggingOut = false,
}) {
    return (
        <header
                className={`${styles.header} ${
                    isAuthenticated ? styles.authenticated : ""
                }`}
            >
            <div className={styles.headerContent}>
                <div className={styles.brand}>
                    <div className={styles.brandMark} aria-hidden="true">
                        wc
                    </div>

                    <div className={styles.brandText}>
                        <h1>CUCEI</h1>
                        <span>Servicios sanitarios del campus</span>
                    </div>
                </div>

                <div className={styles.headerActions}>

                    {!isAuthenticated && (
                        <p className={styles.headerDescription}>
                            Encuentra un baño disponible.
                        </p>
                    )}

                    {!isCustodian && !isAdmin && (
                        <Link to="/login" className={styles.loginButton}>
                            Iniciar sesión
                        </Link>
                    )}

                    {isCustodian && (
                        <button
                            type="button"
                            className={`${styles.loginButton} ${styles.logoutButton}`}
                            onClick={onLogout}
                            disabled={loggingOut}
                        >
                            {loggingOut
                                ? "Cerrando sesión..."
                                : "Cerrar sesión"}
                        </button>
                    )}

                    {isAdmin && (
                        <>
                            <Link to="/admin/map" className={styles.adminBackButton}>
                                Ver mapa
                            </Link>

                            <button
                                type="button"
                                className={`${styles.loginButton} ${styles.logoutButton}`}
                                onClick={onLogout}
                                disabled={loggingOut}
                            >
                                {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                            </button>
                        </>
                    )}

                   {!isAuthenticated && (
                        <div
                            className={styles.genderFilters}
                            aria-label="Filtrar baños"
                        >
                        <button
                            type="button"
                            className={`${styles.genderButton} ${
                                genderFilter === "Hombres"
                                    ? `${styles.active} ${styles.men}`
                                    : ""
                            }`}
                            aria-pressed={genderFilter === "Hombres"}
                            onClick={() =>
                                onGenderFilterChange("Hombres")
                            }
                        >
                            <span aria-hidden="true">♂</span>
                            Hombres
                        </button>

                        <button
                            type="button"
                            className={`${styles.genderButton} ${
                                genderFilter === "Mujeres"
                                    ? `${styles.active} ${styles.women}`
                                    : ""
                            }`}
                            aria-pressed={genderFilter === "Mujeres"}
                            onClick={() =>
                                onGenderFilterChange("Mujeres")
                            }
                        >
                            <span aria-hidden="true">♀</span>
                            Mujeres
                        </button>

                            </div>
)}
                    </div>
                </div>
        </header>
    );
}