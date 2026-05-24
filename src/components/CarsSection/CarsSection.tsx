// src/pages/admin/cars/components/CarsSection.tsx

import { useEffect, useState } from "react";

import styles from "./CarsSection.module.css";

type Car = {
  id: string;
  name: string;
  cover: string;
};

export function CarsSection() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

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
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <div className={styles.grid}>
          {cars.map((car) => (
            <div key={car.id} className={styles.card}>
              <img src={car.cover} alt={car.name} />
              <h3>{car.name}</h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}