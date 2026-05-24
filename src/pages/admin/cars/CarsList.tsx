import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CarsList.module.css";

type Car = {
  id: string;
  name: string;
  description: string;
  cover: string;
};

export function CarsList() {

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    async function loadCars() {

      try {

        const response = await fetch(
          "http://localhost:8080/api/cars/all"
        );

        const data = await response.json();

        setCars(data);

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    }

    loadCars();

  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        Carregando veículos...
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <div className={styles.header}>

        <div>
          <h1>Veículos</h1>

          <p>
            Gerencie os veículos cadastrados
          </p>
        </div>

      </div>

      <div className={styles.grid}>

        {cars.map((car) => (

          <div
            key={car.id}
            className={styles.card}
          >

            <img
              src={car.cover}
              alt={car.name}
              className={styles.image}
            />

            <div className={styles.content}>

              <h2>{car.name}</h2>

              <p>{car.description}</p>

              <button
                className={styles.editButton}
                onClick={() =>
                  navigate(
                    `/admin/cars/edit/${car.id}`
                  )
                }
              >
                Editar veículo
              </button>

            </div>

          </div>

        ))}

      </div>

      <div className={styles.footer}>

        <button
          className={styles.addVehicleButton}
          onClick={() =>
            navigate("/admin/cars/create")
          }
        >
          Adicionar novo veículo
        </button>

      </div>

    </div>
  );
}