import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../components/Footer/Footer";
import styles from "./VehicleView.module.css";

type Item = {
    label: string;
    description: string;
};

type Car = {
    id: string;
    name: string;
    description: string;
    price: number;
    cover: string;
    banner: string;
    images: string[];
    itens: Item[];
    category?: string;
};

export function VehicleView() {
    const { id } = useParams();

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    async function loadCar() {
        if (!id) return;

        try {
            setLoading(true);

            const res = await fetch(
                `http://localhost:8080/api/cars?id=${id}`,
                { headers: { accept: "*/*" } }
            );

            if (!res.ok) throw new Error();

            const data: Car = await res.json();
            setCar(data);
            setActiveImage(0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCar();
    }, [id]);

    if (loading || !car) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingDots}>
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>

            {/* HERO */}
            <div className={styles.hero}>
                <img src={car.banner || car.cover} />
                <div className={styles.heroOverlay} />
            </div>

            {/* BODY */}
            <div className={styles.container}>
                <div className={styles.content}>

                    {/* LEFT */}
                    <div className={styles.left}>

                        {/* GALERIA */}
                        {car.images?.length > 0 && (
                            <div className={styles.galleryWrapper}>

                                <div className={styles.mainImageWrapper}>
                                    <button
                                        className={styles.navLeft}
                                        onClick={() =>
                                            setActiveImage((prev) =>
                                                prev === 0
                                                    ? car.images.length - 1
                                                    : prev - 1
                                            )
                                        }
                                    >
                                        ‹
                                    </button>

                                    <img
                                        src={car.images[activeImage]}
                                        className={styles.mainImage}
                                        alt=""
                                    />

                                    <button
                                        className={styles.navRight}
                                        onClick={() =>
                                            setActiveImage((prev) =>
                                                prev === car.images.length - 1
                                                    ? 0
                                                    : prev + 1
                                            )
                                        }
                                    >
                                        ›
                                    </button>
                                </div>

                                <div className={styles.thumbnailRow}>
                                    {car.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            className={`${styles.thumb} ${i === activeImage
                                                    ? styles.activeThumb
                                                    : ""
                                                }`}
                                            onClick={() => setActiveImage(i)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 🔥 DESTAQUES FINAL */}
                        {car.itens?.length > 0 && (
                            <div className={styles.featuresCard}>

                                <h2 className={styles.featuresTitle}>
                                    Destaques
                                </h2>

                                <div className={styles.featuresList}>
                                    {car.itens.map((item, i) => (
                                        <div key={i} className={styles.featureItem}>

                                            <div className={styles.featureName}>
                                                {item.label}
                                            </div>

                                            <div className={styles.featureDescription}>
                                                {item.description}
                                            </div>

                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}

                    </div>

                    {/* RIGHT */}
                    <div className={styles.right}>
                        <div className={styles.card}>

                            <h3 className={styles.cardTitle}>
                                Informações
                            </h3>

                            <div className={styles.row}>
                                <span className={styles.label}>Veículo</span>
                                <strong className={styles.value}>
                                    {car.name}
                                </strong>
                            </div>

                            <div className={styles.row}>
                                <span className={styles.label}>Descrição</span>
                                <span className={styles.valueText}>
                                    {car.description}
                                </span>
                            </div>

                            <div className={styles.row}>
                                <span className={styles.label}>Preço</span>
                                <strong className={styles.price}>
                                    R$ {car.price?.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2
                                    })}
                                </strong>
                            </div>

                            <button className={styles.button}>
                                Negociar
                            </button>

                        </div>
                    </div>

                </div>
            </div>

            <Footer />

        </div>
    );
}