// PulseCalendar logo — uses the official PNG v3 (detoured, transparent bg).
// User feedback : "il faur revoir l'icone… mettre celle la mais bien
// integré sans carré autour bien découpé et en plus gros". Le PNG v3
// est issu du banner officiel via rembg (background AI removal), donc
// l'icône 3D calendar + badge "1" est isolée sur fond transparent.
function PulseLogo({ size = 36, withGlow = false, withBadge = true }) {
  // v3 : 680x700 PNG transparent (icon + notif badge intégrés).
  // L'aspect ratio est 680/700 ≈ 0.971 — on garde la largeur effective
  // légèrement inférieure à la hauteur pour rendu correct.
  const src = "assets/pulse-app-icon-v3.png";
  const aspect = 680 / 700;
  return (
    <img
      src={src}
      alt="PulseCalendar"
      style={{
        width: size * aspect,
        height: size,
        objectFit: 'contain',
        filter: withGlow ? 'drop-shadow(0 18px 50px rgba(217, 70, 130, 0.55)) drop-shadow(0 8px 28px rgba(98,68,214,0.5))' : 'drop-shadow(0 6px 16px rgba(98,68,214,0.25))',
        display: 'block',
      }}
    />
  );
}

window.PulseLogo = PulseLogo;
