const shapes = [
  { className: "h-10 w-10", delay: "0s", dur: "7s", top: "12%", left: "8%" },
  { className: "h-6 w-6 rounded-full", delay: "1.2s", dur: "9s", top: "22%", left: "85%" },
  { className: "h-8 w-8 rounded-full", delay: "0.6s", dur: "8s", top: "70%", left: "12%" },
  { className: "h-14 w-14", delay: "2s", dur: "10s", top: "78%", left: "80%" },
  { className: "h-5 w-5", delay: "1.6s", dur: "6s", top: "45%", left: "92%" },
  { className: "h-7 w-7 rounded-full", delay: "0.3s", dur: "8.5s", top: "60%", left: "5%" },
];

export default function FloatingShapes({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const border = variant === "light" ? "border-brand/30" : "border-white/20";
  const bg = variant === "light" ? "bg-white" : "bg-white/5";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {shapes.map((shape, i) => (
        <div
          key={i}
          className={`absolute ${border} ${bg} ${shape.className} animate-float-3d rounded-lg border shadow-xl`}
          style={{
            top: shape.top,
            left: shape.left,
            animationDelay: shape.delay,
            animationDuration: shape.dur,
            transformStyle: "preserve-3d",
          }}
        />
      ))}
    </div>
  );
}