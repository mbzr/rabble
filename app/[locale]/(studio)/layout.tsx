import { SiteHeader } from '@/components/site-header'
import { StudioApolloProvider } from '@/components/studio/apollo-provider'

const StudioLayout = ({ children }: LayoutProps<'/[locale]'>) => (
  <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
    <SiteHeader />
    <StudioApolloProvider>{children}</StudioApolloProvider>
  </main>
)

export default StudioLayout
