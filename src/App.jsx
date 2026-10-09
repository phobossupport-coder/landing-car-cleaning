import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BeforeAfter from './components/BeforeAfter';
import Protection from './components/Protection';
import Process from './components/Process';
import Gallery from './components/Gallery';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <Services />
        <BeforeAfter />
        <Protection />
        <Process />
        <Gallery />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
