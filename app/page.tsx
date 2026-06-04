import Background3D from './components/Background3D';
import SmoothScroll from './components/SmoothScroll';
import ScrollEffects from './components/ScrollEffects';
import Navbar from './components/navbar';
import Hero from './components/hero';
import About from './components/about';
import Skills from './components/skills';
import Projects from './components/projects';
import Footer from './components/footer';

export default function Home() {
  return (
    <main className="bg-black">
      <SmoothScroll />
      <ScrollEffects />
      <Background3D />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Footer />
    </main>
  );
}
