// Mount React components into the page
const heroPhoneEl = document.getElementById('hero-phone');
if (heroPhoneEl) ReactDOM.createRoot(heroPhoneEl).render(<HeroPhone />);

const navLogoEl = document.getElementById('nav-logo');
if (navLogoEl) ReactDOM.createRoot(navLogoEl).render(<PulseLogo size={40} />);

const footerLogoEl = document.getElementById('footer-logo');
if (footerLogoEl) ReactDOM.createRoot(footerLogoEl).render(<PulseLogo size={40} />);

// Hero icon : grosse icône à côté du titre. User feedback : "en plus gros".
const heroIconEl = document.getElementById('hero-logo');
if (heroIconEl) ReactDOM.createRoot(heroIconEl).render(<PulseLogo size={120} withGlow={true} />);

const scrollyEl = document.getElementById('scrolly-section');
if (scrollyEl) ReactDOM.createRoot(scrollyEl).render(<Scrollytelling />);

const themesEl = document.getElementById('themes-grid-mount');
if (themesEl) ReactDOM.createRoot(themesEl).render(<ThemesGallery />);

const galleryEl = document.getElementById('gallery-section');
if (galleryEl) ReactDOM.createRoot(galleryEl).render(<FeatureGallery />);
