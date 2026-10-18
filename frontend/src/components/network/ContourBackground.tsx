import React from 'react';

export const ContourBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-30">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="40%" stopColor="#1C3C53" stopOpacity="0" />
            <stop offset="100%" stopColor="#1C3C53" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        {/* Agricultural field and village zone soft land patches */}
        <path
          d="M 60,700 Q 180,640 320,720 T 580,700 T 880,740 L 950,880 L 50,880 Z"
          fill="#446882"
          fillOpacity="0.08"
        />
        <path
          d="M 220,100 Q 380,60 520,140 T 820,110 L 850,260 Q 620,320 400,240 Z"
          fill="#D2C1B7"
          fillOpacity="0.06"
        />
        <circle cx="510" cy="440" r="140" fill="#0892C1" fillOpacity="0.05" />

        {/* Topographic elevation contour lines */}
        <path
          d="M 50,180 C 200,120 400,130 600,80 S 850,140 950,110"
          fill="none"
          stroke="#0892C1"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.3"
        />
        <path
          d="M 30,340 C 220,290 440,320 680,270 S 870,330 970,300"
          fill="none"
          stroke="#0892C1"
          strokeWidth="1"
          strokeDasharray="3 5"
          strokeOpacity="0.25"
        />
        <path
          d="M 40,510 C 260,470 510,480 730,440 S 910,500 980,480"
          fill="none"
          stroke="#D2C1B7"
          strokeWidth="1"
          strokeDasharray="2 4"
          strokeOpacity="0.2"
        />
        <path
          d="M 40,680 C 240,640 480,660 720,620 S 900,680 970,660"
          fill="none"
          stroke="#446882"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.25"
        />

        {/* Soft Vignette Overlay */}
        <rect width="1000" height="900" fill="url(#vignette)" />
      </svg>
    </div>
  );
};
