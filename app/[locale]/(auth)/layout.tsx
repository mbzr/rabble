import { Link } from '@/i18n/navigation'

const AuthLayout = ({ children }: LayoutProps<'/[locale]'>) => (
  <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
    <Link href="/" className="text-xl font-semibold">
      Rabble
    </Link>
    <div className="w-full max-w-sm">{children}</div>
  </main>
)

export default AuthLayout
