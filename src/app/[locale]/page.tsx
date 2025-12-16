import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-helpers'
import { getTranslations } from 'next-intl/server'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Check, ArrowRight, Monitor, TrendingUp, Briefcase, Code, Shield, Globe } from 'lucide-react'

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations()
  
  // Redirect authenticated users to dashboard
  const session = await getSession()
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-semibold text-gray-900 hidden sm:inline">Eternal Echoes & Visions</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors scroll-smooth">
                {t('nav.features')}
              </a>
              <a href="#solutions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors scroll-smooth">
                {t('nav.solutions')}
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors scroll-smooth">
                {t('nav.pricing')}
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link href="/auth/sign-in">
                <Button variant="ghost" className="text-gray-700">
                  {t('nav.signIn')}
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white">
                  {t('nav.getStarted')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#6366f1] text-white px-4 py-1.5 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>{t('hero.badge')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
              <br />
              <span className="text-[#6366f1]">{t('hero.titleHighlight')}</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              {t('hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8">
                  {t('hero.ctaPrimary')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features" className="scroll-smooth">
                <Button size="lg" variant="outline" className="px-8">
                  <Monitor className="mr-2 h-5 w-5" />
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="mt-16 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b border-gray-200">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 text-center max-w-xs mx-auto">
                unified-biz-os.vercel.app/dashboard
              </div>
            </div>
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-[#f97316] rounded"></div>
                      <div className="h-4 bg-[#6366f1] rounded w-24"></div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { color: 'bg-blue-200' },
                      { color: 'bg-purple-200' },
                      { color: 'bg-green-200' },
                      { color: 'bg-yellow-200' },
                    ].map((card, i) => (
                      <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className={`${card.color} h-8 w-8 rounded mb-4`}></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { key: 'crm', icon: '👥' },
              { key: 'payments', icon: '💳' },
              { key: 'ai', icon: '🤖' },
              { key: 'projects', icon: '📋' },
              { key: 'secure', icon: '🛡️' },
              { key: 'global', icon: '🌍' },
            ].map((feature) => (
              <div
                key={feature.key}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`features.${feature.key}.title`)}</h3>
                <p className="text-gray-600">{t(`features.${feature.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#6366f1]/10 text-[#6366f1] px-3 py-1 rounded-full text-sm font-medium mb-4">
                {t('solutions.badge')}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('solutions.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('solutions.description')}
              </p>

              <div className="space-y-6">
                {[
                  { key: 'sales', icon: TrendingUp },
                  { key: 'agencies', icon: Briefcase },
                  { key: 'developers', icon: Code },
                ].map((solution) => {
                  const Icon = solution.icon
                  return (
                    <div key={solution.key} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="h-6 w-6 text-[#6366f1]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{t(`solutions.${solution.key}.title`)}</h3>
                        <p className="text-gray-600">{t(`solutions.${solution.key}.description`)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-8 border border-gray-200">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded p-4 border border-gray-200">
                    <div className="h-24 bg-[#6366f1]/20 rounded mb-2 flex items-end p-2">
                      <div className="flex space-x-1 w-full">
                        <div className="bg-[#6366f1] h-8 w-full rounded"></div>
                        <div className="bg-[#6366f1] h-12 w-full rounded"></div>
                        <div className="bg-[#6366f1] h-16 w-full rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded p-4 border border-gray-200">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded p-4 border border-gray-200 h-24"></div>
                  <div className="bg-gray-50 rounded p-4 border border-gray-200 h-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.free.name')}</h3>
              <p className="text-gray-600 mb-6">{t('pricing.free.description')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{t('pricing.free.price')}</span>
                <span className="text-gray-600">{t('pricing.free.period')}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.raw('pricing.free.features').map((feature: string) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-[#6366f1] mr-3" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button variant="outline" className="w-full">
                  {t('pricing.free.cta')}
                </Button>
              </Link>
            </div>

            {/* Starter Plan */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.starter.name')}</h3>
              <p className="text-gray-600 mb-6">{t('pricing.starter.description')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{t('pricing.starter.price')}</span>
                <span className="text-gray-600">{t('pricing.starter.period')}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.raw('pricing.starter.features').map((feature: string) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-[#6366f1] mr-3" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button variant="outline" className="w-full">
                  {t('pricing.starter.cta')}
                </Button>
              </Link>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-white rounded-xl p-8 border-2 border-[#6366f1] relative shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#6366f1] text-white px-4 py-1 rounded-full text-sm font-medium">
                  {t('pricing.pro.badge')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.pro.name')}</h3>
              <p className="text-gray-600 mb-6">{t('pricing.pro.description')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{t('pricing.pro.price')}</span>
                <span className="text-gray-600">{t('pricing.pro.period')}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.raw('pricing.pro.features').map((feature: string) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-[#6366f1] mr-3" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white">
                  {t('pricing.pro.cta')}
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.enterprise.name')}</h3>
              <p className="text-gray-600 mb-6">{t('pricing.enterprise.description')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{t('pricing.enterprise.price')}</span>
                <span className="text-gray-600">{t('pricing.enterprise.period')}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {t.raw('pricing.enterprise.features').map((feature: string) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-[#6366f1] mr-3" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button variant="outline" className="w-full">
                  {t('pricing.enterprise.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline" className="bg-white text-[#6366f1] hover:bg-gray-100 border-white px-8">
                {t('cta.primary')}
              </Button>
            </Link>
            <Link href="/support">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 px-8">
                {t('cta.secondary')}
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/80 mt-6">
            {t('cta.disclaimer')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Logo className="h-6 w-6" />
              <span className="text-sm font-semibold text-gray-900">Eternal Echoes & Visions</span>
            </div>
            <div className="text-sm text-gray-600 text-center md:text-right">
              {t('footer.copyright')}
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Shield className="h-5 w-5 text-gray-400" />
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

