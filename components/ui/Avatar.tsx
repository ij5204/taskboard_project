export function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  )
}