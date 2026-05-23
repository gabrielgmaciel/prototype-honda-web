import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <video autoPlay muted loop className={styles.video}>
        <source src="/public/movie/home.mp4" type="video/mp4" />
      </video>

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1>Performance. Inovação. Honda.</h1>
        <p>Descubra a nova geração de veículos japoneses.</p>
      </div>
    </section>
  );
}