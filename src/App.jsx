import { Box } from '@mui/material';
import Header from './components/Header';
import HeroStory from './components/HeroStory';
import Marquee from './components/Marquee';
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
import { carBrands } from './data';
import { useLang } from './i18n';
import MobileBar from './components/MobileBar';

export default function App() {
  const { t } = useLang();
  return (
    <>
      <Header />
      <HeroStory />
      <main>
        <Box sx={{ bgcolor: '#070708', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Marquee label={t.hero.marqueeCars} items={carBrands} speed={70} />
        </Box>
        <Mobile />
        <Services />
        <Winter />
        <BeforeAfter />
        <Packages />
        <Yachts />
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
