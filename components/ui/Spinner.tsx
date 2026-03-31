export function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen"
      style={{ background: '#0f0f0f' }}>
      <div className="w-5 h-5 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )
}