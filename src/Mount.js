// Mount React components into the page
const heroPhoneEl = document.getElementById('hero-phone');
if (heroPhoneEl) ReactDOM.createRoot(heroPhoneEl).render(/*#__PURE__*/React.createElement(HeroPhone, null));
const navLogoEl = document.getElementById('nav-logo');
if (navLogoEl) ReactDOM.createRoot(navLogoEl).render(/*#__PURE__*/React.createElement(PulseLogo, {
  size: 40
}));
const footerLogoEl = document.getElementById('footer-logo');
if (footerLogoEl) ReactDOM.createRoot(footerLogoEl).render(/*#__PURE__*/React.createElement(PulseLogo, {
  size: 40
}));
const scrollyEl = document.getElementById('scrolly-section');
if (scrollyEl) ReactDOM.createRoot(scrollyEl).render(/*#__PURE__*/React.createElement(Scrollytelling, null));
const themesEl = document.getElementById('themes-grid-mount');
if (themesEl) ReactDOM.createRoot(themesEl).render(/*#__PURE__*/React.createElement(ThemesGallery, null));
const galleryEl = document.getElementById('gallery-section');
if (galleryEl) ReactDOM.createRoot(galleryEl).render(/*#__PURE__*/React.createElement(FeatureGallery, null));