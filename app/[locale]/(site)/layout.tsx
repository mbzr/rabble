import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const SiteLayout = ({ children }: LayoutProps<'/[locale]'>) => (
  <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
    <SiteHeader />
    {children}
    <SiteFooter />
  </main>
)

export default SiteLayout
