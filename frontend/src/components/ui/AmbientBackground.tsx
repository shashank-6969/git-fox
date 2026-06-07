export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0d1117]">
      {/* Top Left Blue Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#58a6ff] opacity-[0.07] blur-[120px]" />
      
      {/* Bottom Right Purple Glow */}
      <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#8957e5] opacity-[0.06] blur-[120px]" />
      
      {/* Subtle Noise Texture (Optional, but adds premium feel) */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  );
}
