'use client'

import { useState, useEffect, useTransition } from 'react'
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead,
  type NotificationWithDetails 
} from '@/lib/notifications'

const notificationIcons: Record<string, string> = {
  INFO: '💬',
  SUCCESS: '✅',
  WARNING: '⚠️',
  ERROR: '❌',
  TEAM_INVITE: '👋',
  DEAL_UPDATE: '💼',
  BOOKING_NEW: '📅',
  BOOKING_CANCELLED: '🚫',
  PAYMENT_RECEIVED: '💰',
  MENTION: '@',
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationWithDetails[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        getNotifications(20),
        getUnreadCount(),
      ])
      setNotifications(notifs)
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Refresh when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const handleMarkAsRead = async (id: string) => {
    startTransition(async () => {
      await markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, readAt: new Date() } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    })
  }

  const handleMarkAllAsRead = async () => {
    startTransition(async () => {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, readAt: new Date() })))
      setUnreadCount(0)
    })
  }

  const handleNotificationClick = (notification: NotificationWithDetails) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
    if (notification.link) {
      window.location.href = notification.link
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <span className="text-lg shrink-0">
                  {notificationIcons[notification.type] || '📣'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



