import { useEffect, useState } from "react";
import api from "../api/api";

type Car = {
    id: string;
    name: string;
    description: string;
    image: string;
};

export default function Home() {

    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        try {
            const res = await api.get("/cars");
            setCars(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>

            {/* HERO */}
            <div style={styles.hero}>
                <h1>Honda Store</h1>
                <p>Encontre sua próxima máquina</p>
            </div>

            {/* GRID */}
            <div style={styles.grid}>
                {cars.map((car) => (
                    <div key={car.id} style={styles.card}>
                        <img src={car.image} style={styles.img} />
                        <h3>{car.name}</h3>
                        <p>{car.description}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

const styles: any = {
    hero: {
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
            "url('https://images.unsplash.com/photo-1603386329225-868f9b1ee6f4')",
        backgroundSize: "cover",
        color: "white"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
        padding: 40
    },

    card: {
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 10
    },

    img: {
        width: "100%",
        borderRadius: 10
    }
};