export function PizzaPoster({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="crust" cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="#E2B581" />
          <stop offset="92%" stopColor="#B17A3F" />
          <stop offset="100%" stopColor="#7A4A22" />
        </radialGradient>
        <radialGradient id="sauce" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C13A2A" />
          <stop offset="80%" stopColor="#9B2A23" />
          <stop offset="100%" stopColor="#6E1D18" />
        </radialGradient>
        <radialGradient id="mozz" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7E8" />
          <stop offset="80%" stopColor="#F4E5C2" />
          <stop offset="100%" stopColor="#D8C088" />
        </radialGradient>
        <radialGradient id="salami" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A12424" />
          <stop offset="60%" stopColor="#7A1A1A" />
          <stop offset="100%" stopColor="#511010" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      <circle cx="300" cy="300" r="290" fill="url(#crust)" />
      <circle cx="300" cy="300" r="252" fill="url(#sauce)" />

      <g filter="url(#soft)">
        {[
          [220, 200, 32], [380, 220, 28], [260, 320, 30], [400, 360, 26],
          [180, 380, 24], [340, 280, 22], [300, 420, 28], [220, 280, 18]
        ].map(([x, y, r], i) => (
          <ellipse key={`m-${i}`} cx={x} cy={y} rx={r} ry={(r as number) * 0.86} fill="url(#mozz)" />
        ))}
      </g>

      {[
        [240, 240, 30], [360, 200, 26], [200, 340, 28],
        [380, 320, 28], [300, 250, 24], [260, 400, 26], [400, 280, 22]
      ].map(([x, y, r], i) => (
        <g key={`s-${i}`}>
          <circle cx={x as number} cy={y as number} r={r as number} fill="url(#salami)" />
          {[0.35, 0.55, 0.75].map((d, j) => {
            const angle = (i * 1.7 + j * 2.1);
            return (
              <circle
                key={j}
                cx={(x as number) + Math.cos(angle) * (r as number) * d}
                cy={(y as number) + Math.sin(angle) * (r as number) * d}
                r={1.6}
                fill="#FBE8C7"
                opacity="0.7"
              />
            );
          })}
        </g>
      ))}

      {[
        [205, 245, 6], [285, 215, 5], [355, 265, 6], [325, 345, 5],
        [245, 365, 6], [395, 215, 5], [185, 295, 5], [415, 405, 6]
      ].map(([x, y, r], i) => (
        <g key={`b-${i}`}>
          <ellipse cx={x as number} cy={y as number} rx={(r as number) * 1.15} ry={(r as number) * 0.7} fill="#3F6B4D" transform={`rotate(${i * 37} ${x} ${y})`} />
        </g>
      ))}

      <circle cx="300" cy="300" r="290" fill="none" stroke="rgba(21,19,15,0.08)" />
    </svg>
  );
}
