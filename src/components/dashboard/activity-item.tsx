import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItemProps {
  title: string
  description: string
  timestamp: string
  icon: LucideIcon
  iconClassName?: string
  className?: string
}

export function ActivityItem({
  title,
  description,
  timestamp,
  icon: Icon,
  iconClassName,
  className,
}: ActivityItemProps) {
  return (
    <div className={cn('activity-item', className)}>
      {/* Icon */}
      <div className={cn(
        'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-primary/10',
        iconClassName
      )}>
        <Icon className="h-5 w-5 text-primary" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-foreground truncate">
          {title}
        </p>
        <p className="text-body-sm text-muted-foreground truncate">
          {description}
        </p>
      </div>

      {/* Timestamp */}
      <div className="flex-shrink-0">
        <span className="text-caption text-muted-foreground whitespace-nowrap">
          {timestamp}
        </span>
      </div>
    </div>
  )
}



