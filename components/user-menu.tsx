import { getTranslations } from 'next-intl/server'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/lib/server/current-user'
import { UserMenuDropdown } from './user-menu-dropdown'

export const UserMenu = async () => {
  const [currentUser, t] = await Promise.all([
    getCurrentUser(),
    getTranslations('Auth'),
  ])

  if (!currentUser) {
    return (
      <>
        <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>
          {t('signIn')}
        </Link>
        <Link href="/signup" className={buttonVariants()}>
          {t('signUpLink')}
        </Link>
      </>
    )
  }

  return (
    <UserMenuDropdown
      name={currentUser.name}
      email={currentUser.email}
      role={currentUser.role}
    />
  )
}
