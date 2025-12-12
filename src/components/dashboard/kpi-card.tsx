import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary',
  className,
}: KpiCardProps) {
  const isPositive = change ? change.value >= 0 : true

  return (
    <div className={cn('kpi-card', className)}>
      {/* Icon - Top Right */}
      <div className={cn(
        'absolute top-5 right-5 p-2.5 rounded-xl bg-primary/10',
        iconColor.replace('text-', 'bg-').replace('primary', 'primary/10')
      )}>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-body text-muted-foreground font-medium">{title}</p>
        <p className="text-display font-bold tracking-tight tabular-nums">{value}</p>
      </div>

      {/* Change indicator */}
      {change && (
        <div className="mt-4 flex items-center gap-1.5">
          <div className={cn(
            'flex items-center gap-0.5 text-caption font-medium',
            isPositive ? 'text-success' : 'text-destructive'
          )}>
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{isPositive ? '+' : ''}{change.value}%</span>
          </div>
          <span className="text-caption text-muted-foreground">
            {change.label}
          </span>
        </div>
      )}
    </div>
  )
}


