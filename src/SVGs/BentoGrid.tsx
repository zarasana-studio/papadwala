export const defs = () => (
  <defs>
    <radialGradient id="gradPapad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="80%" stopColor="#f59e0b" />
      <stop offset="100%" stopColor="#d97706" />
    </radialGradient>
    <radialGradient
      id="gradPapadDark"
      cx="50%"
      cy="50%"
      r="50%"
      fx="30%"
      fy="30%"
    >
      <stop offset="0%" stopColor="#fde047" />
      <stop offset="80%" stopColor="#d97706" />
      <stop offset="100%" stopColor="#b45309" />
    </radialGradient>
  </defs>
);

export const SvgQuality = () => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-xl"
  >
    {defs()}
    <g className="transition-all duration-700 ease-[0.22,1,0.36,1] group-hover:-translate-y-8 origin-center group-hover:scale-105">
      <ellipse
        cx="100"
        cy="150"
        rx="70"
        ry="35"
        className="fill-brand-dark/5 transition-all duration-700 group-hover:scale-90 group-hover:opacity-50"
      />

      <g className="transition-transform duration-700 delay-[50ms] ease-out group-hover:-translate-y-2">
        <path d="M 30 130 v 8 a 70 35 0 0 0 140 0 v -8 Z" fill="#b45309" />
        <ellipse cx="100" cy="130" rx="70" ry="35" fill="#f59e0b" />
        <ellipse cx="100" cy="130" rx="66" ry="32" fill="url(#gradPapadDark)" />
      </g>

      <g className="transition-transform duration-700 delay-100 ease-out group-hover:-translate-y-8 group-hover:-rotate-2 origin-[100px_115px]">
        <path d="M 30 115 v 8 a 70 35 0 0 0 140 0 v -8 Z" fill="#b45309" />
        <ellipse cx="100" cy="115" rx="70" ry="35" fill="#f59e0b" />
        <ellipse cx="100" cy="115" rx="66" ry="32" fill="url(#gradPapadDark)" />
      </g>

      <g className="transition-transform duration-700 delay-150 ease-out group-hover:-translate-y-16 group-hover:rotate-3 origin-[100px_100px]">
        <path d="M 30 100 v 8 a 70 35 0 0 0 140 0 v -8 Z" fill="#b45309" />
        <ellipse cx="100" cy="100" rx="70" ry="35" fill="#fbbf24" />
        <ellipse cx="100" cy="100" rx="66" ry="32" fill="url(#gradPapad)" />
        <circle cx="90" cy="95" r="2" fill="#92400e" opacity="0.6" />
        <circle cx="120" cy="105" r="3" fill="#92400e" opacity="0.4" />
        <circle cx="70" cy="110" r="2.5" fill="#92400e" opacity="0.5" />
        <circle cx="110" cy="90" r="1.5" fill="#92400e" opacity="0.7" />
        <circle cx="130" cy="115" r="2" fill="#92400e" opacity="0.5" />
      </g>
    </g>
  </svg>
);

export const SvgTraditional = () => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-xl"
  >
    {defs()}
    <g className="transition-all duration-700 ease-[0.22,1,0.36,1] group-hover:scale-105 origin-center">
      <ellipse
        cx="100"
        cy="140"
        rx="60"
        ry="30"
        className="fill-brand-dark/5 transition-all duration-700 group-hover:scale-110"
      />

      <g className="transition-transform duration-700 ease-out group-hover:-translate-y-2">
        <path d="M 40 120 v 10 a 60 30 0 0 0 120 0 v -10 Z" fill="#78350f" />
        <ellipse cx="100" cy="120" rx="60" ry="30" fill="#92400e" />
        <ellipse cx="100" cy="120" rx="56" ry="28" fill="#b45309" />
      </g>

      <g className="transition-all duration-1000 ease-[0.22,1,0.36,1] group-hover:-translate-y-10 group-hover:rotate-[12deg] group-hover:scale-110 origin-[100px_105px]">
        <path d="M 50 105 v 4 a 50 25 0 0 0 100 0 v -4 Z" fill="#b45309" />
        <ellipse cx="100" cy="105" rx="50" ry="25" fill="#fbbf24" />
        <ellipse cx="100" cy="105" rx="47" ry="23" fill="url(#gradPapad)" />
      </g>

      <g className="transition-transform duration-1000 delay-100 ease-[0.22,1,0.36,1] group-hover:-translate-y-16 group-hover:-translate-x-8 group-hover:-rotate-12 origin-[100px_70px] -rotate-6 translate-y-2">
        <path d="M 40 70 L 160 30 L 165 40 L 45 80 Z" fill="#92400e" />
        <path d="M 50 65 L 150 32 L 152 42 L 52 75 Z" fill="#b45309" />
        <path
          d="M 30 75 L 45 70 L 50 82 L 35 87 Z"
          fill="#78350f"
          stroke="#78350f"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M 155 35 L 170 30 L 175 42 L 160 47 Z"
          fill="#78350f"
          stroke="#78350f"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </svg>
);

export const SvgHandmade = () => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-xl"
  >
    {defs()}
    <g className="transition-all duration-700 ease-[0.22,1,0.36,1] group-hover:-translate-y-4 group-hover:scale-105 origin-center">
      <ellipse
        cx="100"
        cy="150"
        rx="55"
        ry="27.5"
        className="fill-brand-dark/5 transition-transform duration-700 group-hover:scale-90"
      />

      <g className="transition-transform duration-700 delay-[50ms] ease-out group-hover:-translate-y-4 group-hover:-translate-x-5">
        <circle cx="65" cy="125" r="22" fill="#f59e0b" />
        <circle cx="63" cy="123" r="20" fill="url(#gradPapadDark)" />
      </g>

      <g className="transition-transform duration-700 delay-100 ease-out group-hover:-translate-y-8 group-hover:translate-x-2">
        <circle cx="140" cy="115" r="18" fill="#f59e0b" />
        <circle cx="138" cy="113" r="16" fill="url(#gradPapadDark)" />
      </g>

      <g className="transition-transform duration-1000 delay-150 ease-[0.22,1,0.36,1] group-hover:-translate-y-14 group-hover:rotate-6 origin-center">
        <path d="M 40 90 v 5 a 60 30 0 0 0 120 0 v -5 Z" fill="#b45309" />
        <ellipse cx="100" cy="90" rx="60" ry="30" fill="#fbbf24" />
        <ellipse cx="100" cy="90" rx="57" ry="28" fill="url(#gradPapad)" />
      </g>
    </g>
  </svg>
);

export const SvgOrganic = () => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-xl"
  >
    {defs()}
    <g className="transition-all duration-700 ease-[0.22,1,0.36,1] group-hover:-translate-y-6 origin-center group-hover:scale-105">
      <ellipse
        cx="100"
        cy="130"
        rx="60"
        ry="30"
        className="fill-brand-dark/5 transition-transform duration-700 group-hover:scale-90"
      />

      <g className="transition-transform duration-1000 ease-out group-hover:-translate-y-4 origin-[100px_120px] group-hover:-rotate-3">
        <path d="M 40 110 v 6 a 60 30 0 0 0 120 0 v -6 Z" fill="#b45309" />
        <ellipse cx="100" cy="110" rx="60" ry="30" fill="#fbbf24" />
        <ellipse cx="100" cy="110" rx="57" ry="28" fill="url(#gradPapad)" />
      </g>

      <g className="transition-transform duration-700 delay-100 ease-[0.25,1,0.5,1] group-hover:-translate-y-12 group-hover:-translate-x-6 group-hover:-rotate-12 origin-center">
        <path
          d="M 75 75 C 55 55, 35 75, 75 95 C 95 75, 85 55, 75 75"
          fill="#10b981"
        />
        <path d="M 75 75 C 65 65, 55 75, 75 95" fill="#059669" />
      </g>

      <g className="transition-transform duration-700 delay-[150ms] ease-[0.25,1,0.5,1] group-hover:-translate-y-16 group-hover:translate-x-8 group-hover:rotate-[15deg] origin-center -rotate-6 translate-x-2">
        <path
          d="M 125 60 C 155 35, 175 65, 125 90 C 115 65, 105 45, 125 60"
          fill="#34d399"
        />
        <path d="M 125 60 C 140 45, 155 65, 125 90" fill="#10b981" />
      </g>

      <g className="transition-transform duration-700 delay-[200ms] ease-[0.25,1,0.5,1] group-hover:-translate-y-10 group-hover:-rotate-6 origin-center scale-90 translate-y-6">
        <path
          d="M 100 45 C 90 25, 70 35, 100 65 C 120 45, 110 25, 100 45"
          fill="#6ee7b7"
        />
        <path d="M 100 45 C 95 35, 85 40, 100 65" fill="#34d399" />
      </g>
    </g>
  </svg>
);
