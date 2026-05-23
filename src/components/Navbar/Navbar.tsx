import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <a href="#" className={styles.navLink}>Home</a>
      </div>

      <div className={styles.center}>
        <img
          src="/public/icons/honda-logo.svg"
          className={styles.logo}
          alt="Logo"
        />
      </div>

      <div className={styles.right}>
        <a href="#" className={styles.login}>Login</a>
      </div>
    </nav>
  );
}