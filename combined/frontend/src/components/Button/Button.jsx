export default function Button({ children, variant = "primary", className = "", ...props }) {
  const styles =
    variant === "secondary"
      ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button
      {...props}
      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}