'use client'

import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import type { Role } from '@/lib/server/current-user'

interface UserMenuDropdownProps {
  name: string
  email: string
  role: Role
}

export const UserMenuDropdown = ({
  name,
  email,
  role,
}: UserMenuDropdownProps) => {
  const t = useTranslations('Header')
  const router = useRouter()
  const initial = name.trim().charAt(0).toUpperCase()
  const canTeach = role === 'instructor' || role === 'admin'

  const handleSignOut = async () => {
    await authClient.signOut()
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('openUserMenu')}
        className="focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <Avatar>
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="text-foreground block truncate text-sm font-medium">
              {name}
            </span>
            <span className="block truncate">{email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/my-learning" />}>
          {t('myLearning')}
        </DropdownMenuItem>
        {canTeach ? (
          <DropdownMenuItem render={<Link href="/studio" />}>
            {t('studio')}
          </DropdownMenuItem>
        ) : null}
        {role === 'admin' ? (
          <DropdownMenuItem render={<Link href="/admin" />}>
            {t('admin')}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem render={<Link href="/account" />}>
          {t('account')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
