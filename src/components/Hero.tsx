export function Hero() {
  return (
    <section className="hero-video">
      <video autoPlay muted loop playsInline className="video-bg">
        <source src="/movie/home.mp4" type="video/mp4" />
      </video>

      <div className="hero-content">
        <h1>Performance. Inovação. Honda.</h1>
        <p>Experiência automotiva de próxima geração.</p>
      </div>
    </section>
  )
}