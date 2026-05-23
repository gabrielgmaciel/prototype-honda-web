export function CarsSection() {
  const cars = ['Civic Type R', 'Accord', 'CR-V', 'NSX']

  return (
    <section id="cars" className="section dark">
      <h2>Modelos</h2>

      <div className="grid">
        {cars.map((car) => (
          <div key={car} className="card">
            <h3>{car}</h3>
            <p>Performance e tecnologia Honda</p>
          </div>
        ))}
      </div>
    </section>
  )
}