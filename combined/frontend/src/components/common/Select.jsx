export default function Select({
  label,
  error,
  options = [],
  className = "",
  ...props
}) {
  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>}
      <select
        {...props}
        className={`w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 ${className}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}