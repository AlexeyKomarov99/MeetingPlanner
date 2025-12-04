function MeetingCardSkeleton() {
  return (
    <div className="border border-[var(--border-light)] rounded-xl p-5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-[var(--bg-secondary)] rounded w-3/4"></div>
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-[var(--bg-secondary)] rounded w-full mb-3"></div>
      <div className="h-4 bg-[var(--bg-secondary)] rounded w-2/3 mb-4"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/4"></div>
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/4"></div>
      </div>
    </div>
  )
}

export default MeetingCardSkeleton