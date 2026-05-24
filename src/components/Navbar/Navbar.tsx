import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

type Car = {
  id: string;
  name: string;
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [vehiclesOpen, setVehiclesOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);

  const navigate = useNavigate();

  async function loadCars() {
    try {
      const res = await fetch("http://localhost:8080/api/cars/all");
      if (!res.ok) return;

      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  function handleNavigate(id: string) {
    setOpen(false);
    navigate(`/vehicle/view/${id}`);
  }

  return (
    <>
      <nav className={styles.navbar}>

        <div className={styles.left}>
          <button
            className={styles.menuButton}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={styles.center}>
          <Link to="/" onClick={() => setOpen(false)}>
            <img
              src="/public/icons/honda-logo.svg"
              className={styles.logo}
              alt="Logo"
            />
          </Link>
        </div>

        <div className={styles.right}>
          <Link to="/login" className={styles.login}>
            Login
          </Link>
        </div>

      </nav>

      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>

        <div className={styles.sidebarHeader}>Honda</div>

        <Link to="/" className={styles.sidebarLink} onClick={() => setOpen(false)}>
          Home
        </Link>

        <div
          className={styles.vehiclesToggle}
          onClick={() => setVehiclesOpen(!vehiclesOpen)}
        >
          <span>
            Veículos{" "}
            <span className={styles.chevron}>
              {vehiclesOpen ? "▾" : "▸"}
            </span>
          </span>
        </div>

        <div className={`${styles.carList} ${vehiclesOpen ? styles.carListOpen : ""}`}>
          {cars.map((car) => (
            <div
              key={car.id}
              className={styles.carItem}
              onClick={() => handleNavigate(car.id)}
            >
              {car.name}
            </div>
          ))}
        </div>

      </aside>
    </>
  );
}