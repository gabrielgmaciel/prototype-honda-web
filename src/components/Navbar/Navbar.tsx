import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
      </div>

      <div className={styles.center}>
        <img
          src="/public/icons/honda-logo.svg"
          className={styles.logo}
          alt="Logo"
        />
      </div>

      <div className={styles.right}>
        <Link to="/login" className={styles.login}>
          Login
        </Link>
      </div>
    </nav>
  );
}