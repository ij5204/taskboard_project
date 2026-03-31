export function LabelBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: color + '22', color }}
    >
      {name}
    </span>
  )
}