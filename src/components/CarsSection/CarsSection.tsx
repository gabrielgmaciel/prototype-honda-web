import styles from './CarsSection.module.css'

export function CarsSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Modelos em destaque</h2>

      <div className={styles.grid}>
        <div className={styles.card}>
          <img src="/cars/civic.jpg" />
          <h3>Honda Civic</h3>
        </div>

        <div className={styles.card}>
          <img src="/cars/accord.jpg" />
          <h3>Honda Accord</h3>
        </div>

        <div className={styles.card}>
          <img src="/cars/crv.jpg" />
          <h3>Honda CR-V</h3>
        </div>
      </div>
    </section>
  )
}