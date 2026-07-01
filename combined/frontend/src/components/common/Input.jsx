export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>}
      <input
        {...props}
        className={`w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 ${className}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}