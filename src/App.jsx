import Header from './components/Header';
import Hero from './components/Hero';
import Mobile from './components/Mobile';
import Services from './components/Services';
import Winter from './components/Winter';
import BeforeAfter from './components/BeforeAfter';
import Yachts from './components/Yachts';
import Packages from './components/Packages';
import Process from './components/Process';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MobileBar from './components/MobileBar';

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <Mobile />
        <Services />
        <Winter />
        <BeforeAfter />
        <Yachts />
        <Packages />
        <Process />
        <Gallery />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
