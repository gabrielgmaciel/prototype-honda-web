import { Navbar } from "../../components/Navbar/Navbar";
import { Hero } from '../../components/Hero/Hero'
import { CarsSection } from '../../components/CarsSection/CarsSection'
import { Footer } from '../../components/Footer/Footer'

export function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CarsSection />
      <Footer />
    </>
  )
}