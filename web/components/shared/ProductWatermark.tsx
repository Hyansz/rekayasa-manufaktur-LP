const watermarkSvg = (fill: string) =>
  "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>" +
  "<text x='168' y='200' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' " +
  "font-size='16' font-weight='700' letter-spacing='5' fill='" +
  fill +
  "' transform='rotate(-30 160 160)'>REKAYASA MANUFAKTUR</text>" +
  "</svg>";

const patternDataUri = (fill: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(watermarkSvg(fill))}")`;

export default function ProductWatermark() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: patternDataUri("#0a1929"),
          backgroundRepeat: "repeat",
          opacity: 0.12,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage: patternDataUri("#ffffff"),
          backgroundRepeat: "repeat",
          opacity: 0.12,
        }}
      />
    </div>
  );
}