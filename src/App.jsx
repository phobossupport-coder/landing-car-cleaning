import Header from './components/Header';
import HeroStory from './components/HeroStory';
import SpecStrip from './components/SpecStrip';
import Mobile from './components/Mobile';
import Services from './components/Services';
import Winter from './components/Winter';
import BeforeAfter from './components/BeforeAfter';
import Yachts from './components/Yachts';
import Packages from './components/Packages';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Reviews from './components/Reviews';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import Footer from './components/Footer';
import MobileBar from './components/MobileBar';

export default function App() {
  return (
    <>
      <Header />
      <HeroStory />
      <main>
        <SpecStrip />
        <Mobile />
        <Services />
        <Winter />
        <BeforeAfter />
        <Packages />
        <Yachts />
        <Process />
        <Portfolio />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <Privacy />
    </>
  );
}
