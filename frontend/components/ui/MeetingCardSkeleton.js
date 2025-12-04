function MeetingCardSkeleton() {
  return (
    <div className="border border-[var(--border-light)] rounded-lg p-6 animate-pulse">
        {/* Заголовок */}
        <div className="h-6 bg-[var(--bg-secondary)] rounded w-3/4 mb-4"></div>
        
        {/* Дата и время блок */}
        <div className="space-y-3 mb-4">
            {/* Календарь */}
            <div className="flex items-center space-x-1">
            <div className="h-4 w-4 bg-[var(--bg-secondary)] rounded"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-16"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-4"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-10"></div>
            </div>
            
            {/* Часы */}
            <div className="flex items-center space-x-1">
            <div className="h-4 w-4 bg-[var(--bg-secondary)] rounded"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-12"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-4"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-12"></div>
            </div>
            
            {/* Местоположение */}
            <div className="flex items-center space-x-1">
            <div className="h-4 w-4 bg-[var(--bg-secondary)] rounded"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-32"></div>
            </div>
        </div>
        
        {/* Описание */}
        <div className="space-y-2 mb-6">
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-full"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-5/6"></div>
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-2/3"></div>
        </div>
        
        {/* Разделитель */}
        <div className="border-t border-[var(--border-light)] mb-4 mt-4"></div>
        
        {/* Кнопка */}
        <div className="w-full flex justify-end">
            <div className="h-9 bg-[var(--bg-secondary)] rounded-lg w-28"></div>
        </div>
    </div>
  )
}

export default MeetingCardSkeleton