export interface BottleProps {
  idx: number;
  c1: string;
  c2: string;
  code: string;
  variant: number;
  size?: 'big' | 'mini';
}

const SHAPES = [
  'M34 40h52a10 10 0 0 1 10 10v92a10 10 0 0 1-10 10H34a10 10 0 0 1-10-10V50a10 10 0 0 1 10-10z',
  'M60 36c26 0 38 22 38 52 0 34-14 64-38 64S22 122 22 88c0-30 12-52 38-52z',
  'M30 58h60a8 8 0 0 1 8 8v76a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8V66a8 8 0 0 1 8-8z',
  'M42 38h36l16 114H26z',
  'M38 50a22 16 0 0 1 44 0v92a10 10 0 0 1-10 10H48a10 10 0 0 1-10-10z',
];

const CAPS = [
  <rect key={0} x="50" y="8" width="20" height="22" rx="4" />,
  <circle key={1} cx="60" cy="16" r="11" />,
  <rect key={2} x="42" y="12" width="36" height="16" rx="4" />,
  <rect key={3} x="51" y="6" width="18" height="24" rx="3" />,
  <rect key={4} x="53" y="10" width="14" height="20" rx="6" />,
];

export function BottleBig({ idx, c1, c2, code, variant }: BottleProps) {
  const v = ((variant % 5) + 5) % 5;
  const s = SHAPES[v];
  const bgId = `bg${idx}`;
  const blId = `bl${idx}`;
  const bcId = `bc${idx}`;
  const goldId = `gold${idx}`;
  return (
    <svg className="bottle" viewBox="0 -34 120 200" aria-hidden="true">
      <defs>
        <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8c877" />
          <stop offset=".5" stopColor="#a97f33" />
          <stop offset="1" stopColor="#e0bd6b" />
        </linearGradient>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} stopOpacity=".5" />
          <stop offset="1" stopColor={c2} stopOpacity=".85" />
        </linearGradient>
        <linearGradient id={blId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <clipPath id={bcId}>
          <path d={s} />
        </clipPath>
      </defs>
      <ellipse cx="60" cy="156" rx="36" ry="5" fill="rgba(0,0,0,.35)" />
      <g fill={`url(#${goldId})`}>{CAPS[v]}</g>
      <rect x="55" y="28" width="10" height="32" fill="#3a2a18" />
      <path d={s} fill={`url(#${bgId})`} stroke="rgba(255,236,200,.28)" strokeWidth="1.2" />
      <g clipPath={`url(#${bcId})`}>
        <rect className="liq" x="16" y="96" width="88" height="72" fill={`url(#${blId})`} opacity=".92" />
        <ellipse cx="60" cy="96" rx="44" ry="6" fill={c1} opacity=".75" />
      </g>
      <path d="M34 48q-5 48 3 96" stroke="rgba(255,255,255,.2)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="41" y="104" width="38" height="28" rx="4" fill="#f2e4c4" opacity=".94" />
      <text
        x="60"
        y="120"
        textAnchor="middle"
        fontSize={code.length > 2 ? 9 : 12}
        fontWeight="700"
        fill="#4a3418"
        fontFamily="Tajawal,sans-serif"
      >
        {code}
      </text>
      <text
        x="60"
        y="128"
        textAnchor="middle"
        fontSize="4.5"
        letterSpacing="2"
        fill="#8a6a33"
        fontFamily="Tajawal,sans-serif"
      >
        PARFUM
      </text>
    </svg>
  );
}

export function BottleMini(_props: BottleProps) {
  return (
    <svg viewBox="0 0 40 56" className="mini" aria-hidden="true">
      <rect x="15" y="1" width="10" height="9" rx="2" fill="#9fb7ad" />
      <rect x="17" y="9" width="6" height="6" fill="#2c3b35" />
      <rect x="8" y="14" width="24" height="38" rx="7" fill="rgba(159,216,201,.28)" stroke="rgba(200,240,228,.5)" />
      <rect x="11" y="30" width="18" height="19" rx="5" fill="#6fae9b" />
      <rect x="13" y="21" width="14" height="7" rx="2" fill="#eef7f2" opacity=".9" />
    </svg>
  );
}
