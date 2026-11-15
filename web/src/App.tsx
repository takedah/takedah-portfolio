import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { About } from './sections/About'
import { Architecture } from './sections/Architecture'
import { Certifications } from './sections/Certifications'
import { Expertise } from './sections/Expertise'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Writing } from './sections/Writing'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Certifications />
        <Writing />
        <Projects />
        <Architecture />
      </main>
      <Footer />
    </>
  )
}

export default App
