// src/pages/admin/cars/components/CarsSection.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CarsSection.module.css";

type Car = {
  id: string;
  name: string;
  cover: string;
};

export function CarsSection() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loadCars() {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/api/cars/all"
      );

      if (!res.ok) throw new Error();

      const data: Car[] = await res.json();
      setCars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Veículos</h2>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingDots}>
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {cars.map((car) => (
            <div key={car.id} className={styles.card} onClick={() => navigate(`/vehicle/view/${car.id}`)}>
              <img src={car.cover} alt={car.name} />
              <h3>{car.name}</h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}