// PulseCalendar logo — uses the official PNG assets
function PulseLogo({ size = 28, withGlow = false, withBadge = true }) {
  // App icon: 610x609 (square), Notif icon: 183x179 (slightly wider for badge)
  const src = withBadge ? "assets/pulse-notif-icon-v2.png" : "assets/pulse-app-icon-v2.png";
  const aspect = withBadge ? (183 / 179) : 1;
  return (
    <img
      src={src}
      alt="PulseCalendar"
      style={{
        width: size * aspect,
        height: size,
        objectFit: 'contain',
        filter: withGlow ? 'drop-shadow(0 14px 40px rgba(217, 70, 130, 0.45)) drop-shadow(0 6px 22px rgba(98,68,214,0.4))' : 'none',
        display: 'block',
      }}
    />
  );
}

window.PulseLogo = PulseLogo;
