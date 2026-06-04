// 12 themes mini gallery (showcasing the 28 theme system)
const THEMES = [{
  name: 'Onyx',
  bg: 'linear-gradient(145deg, #0a0612 0%, #1a1230 100%)',
  accent: '#7B5CF0',
  tone: 'dark'
}, {
  name: 'Aurora',
  bg: 'linear-gradient(145deg, #0d1f2d 0%, #1a4a5c 50%, #2d8a6f 100%)',
  accent: '#4DD0B5',
  tone: 'dark'
}, {
  name: 'Saphir',
  bg: 'linear-gradient(145deg, #0a1a3a 0%, #1e3a8a 100%)',
  accent: '#4DA8FF',
  tone: 'dark'
}, {
  name: 'Tropical Mango',
  bg: 'linear-gradient(145deg, #ff6b35 0%, #f7931e 50%, #ffc857 100%)',
  accent: 'white',
  tone: 'light'
}, {
  name: 'Caraibe',
  bg: 'linear-gradient(145deg, #00b4a6 0%, #0099b3 100%)',
  accent: 'white',
  tone: 'light'
}, {
  name: 'Crepuscule',
  bg: 'linear-gradient(145deg, #2d1b4e 0%, #c44569 50%, #f8b500 100%)',
  accent: 'white',
  tone: 'mid'
}, {
  name: 'Miami',
  bg: 'linear-gradient(145deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
  accent: 'white',
  tone: 'light'
}, {
  name: 'Ember',
  bg: 'linear-gradient(145deg, #1a0a0a 0%, #6b1a1a 50%, #e85d04 100%)',
  accent: '#ff9a3c',
  tone: 'dark'
}, {
  name: 'Neon Gold',
  bg: 'linear-gradient(145deg, #1a1206 0%, #4a3818 50%, #f5c518 100%)',
  accent: '#ffd866',
  tone: 'mid'
}, {
  name: 'ProBlue',
  bg: 'linear-gradient(145deg, #0a0a1a 0%, #1e3a8a 50%, #3b82f6 100%)',
  accent: '#7dd3fc',
  tone: 'dark'
}, {
  name: 'Forest',
  bg: 'linear-gradient(145deg, #0a1f0e 0%, #1a3a1e 50%, #4ade80 100%)',
  accent: '#a7f3d0',
  tone: 'dark'
}, {
  name: 'Rose Or',
  bg: 'linear-gradient(145deg, #2d0a1e 0%, #c4326c 50%, #f8b4d0 100%)',
  accent: 'white',
  tone: 'mid'
}];
function ThemesGallery() {
  return /*#__PURE__*/React.createElement("div", {
    className: "themes-grid"
  }, THEMES.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "theme-card",
    style: {
      background: t.bg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 3,
      opacity: 0.85
    }
  }, Array.from({
    length: 35
  }).map((_, j) => {
    const isToday = j === 17;
    const hasDot = [3, 7, 12, 18, 22, 27, 31].includes(j);
    return /*#__PURE__*/React.createElement("div", {
      key: j,
      style: {
        aspectRatio: 1,
        borderRadius: 3,
        background: isToday ? t.accent : t.tone === 'light' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)',
        position: 'relative'
      }
    }, hasDot && !isToday && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 1,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 2.5,
        height: 2.5,
        borderRadius: '50%',
        background: t.tone === 'light' ? 'white' : t.accent
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "tname"
  }, t.name))), /*#__PURE__*/React.createElement("div", {
    className: "theme-card",
    style: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px dashed rgba(255,255,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 800,
      color: '#7B5CF0'
    }
  }, "+16"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#b9b4cf',
      fontWeight: 500,
      textAlign: 'center'
    }
  }, "autres themes"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: '#7d7798',
      fontFamily: 'Geist Mono, monospace',
      marginTop: 2
    }
  }, "28 au total")));
}
window.ThemesGallery = ThemesGallery;