import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-helpers'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, Monitor, TrendingUp, Briefcase, Code, Shield, Globe } from 'lucide-react'

export default async function LandingPage() {
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
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-semibold text-gray-900 hidden sm:inline">Eternal Echoes & Visions</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors scroll-smooth">
                Features
              </a>
              <a href="#solutions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors scroll-smooth">
                Solutions
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors scroll-smooth">
                Pricing
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/auth/sign-in">
                <Button variant="ghost" className="text-gray-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white">
                  Get Started
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
              <span>New: Gemini Live Voice Assistant</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              The Operating System
              <br />
              <span className="text-[#6366f1]">for Modern Business</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Nexus unifies your CRM, Project Management, Finance, and AI Automation into one seamless platform. Stop switching apps. Start growing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features" className="scroll-smooth">
                <Button size="lg" variant="outline" className="px-8">
                  <Monitor className="mr-2 h-5 w-5" />
                  View Features
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
              Everything you need to scale
            </h2>
            <p className="text-xl text-gray-600">
              Modular by design. Powerful by default.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '👥',
                title: 'CRM',
                description: 'Track leads and manage customer relationships with visual pipelines.',
              },
              {
                icon: '💳',
                title: 'Payments',
                description: 'Invoicing, subscriptions, and financial reporting built-in.',
              },
              {
                icon: '🤖',
                title: 'AI Assistant',
                description: 'Gemini-powered insights, drafting, and voice control.',
              },
              {
                icon: '📋',
                title: 'Projects',
                description: 'Keep teams on track and manage workflows efficiently.',
              },
              {
                icon: '🛡️',
                title: 'Secure',
                description: 'Enterprise-grade security with advanced encryption.',
              },
              {
                icon: '🌍',
                title: 'Global',
                description: 'Multi-currency and multi-language support.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
                SOLUTIONS
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Tailored for your specific workflow
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Whether you&apos;re a lean startup or a scaling enterprise, Nexus adapts to your team structure and goals.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <TrendingUp className="h-6 w-6 text-[#6366f1]" />,
                    title: 'For Sales Teams',
                    description: 'Automate follow-ups and close deals faster with AI-driven insights.',
                  },
                  {
                    icon: <Briefcase className="h-6 w-6 text-[#6366f1]" />,
                    title: 'For Agencies',
                    description: 'Manage multiple clients, projects, and billing in a single view.',
                  },
                  {
                    icon: <Code className="h-6 w-6 text-[#6366f1]" />,
                    title: 'For Developers',
                    description: 'Integrate via API and extend functionality with custom modules.',
                  },
                ].map((solution, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">{solution.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{solution.title}</h3>
                      <p className="text-gray-600">{solution.description}</p>
                    </div>
                  </div>
                ))}
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
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start for free, upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">For individuals and freelancers.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['1 User', 'Basic CRM', '50 AI Credits/mo', 'Community Support'].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-[#6366f1] mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button variant="outline" className="w-full">
                  Start Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-white rounded-xl p-8 border-2 border-[#6366f1] relative shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#6366f1] text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For growing teams and startups.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['5 Users', 'Advanced Automations', 'Unlimited AI Credits', 'Priority Support', 'Custom Domain'].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-[#6366f1] mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 mb-6">For scaling organizations.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited Users', 'SSO & Advanced Security', 'Dedicated Success Manager', 'API Access', 'Audit Logs'].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-[#6366f1] mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button variant="outline" className="w-full">
                  Get Started
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
            Ready to streamline your business?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of companies running on Nexus OS.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline" className="bg-white text-[#6366f1] hover:bg-gray-100 border-white px-8">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/support">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 px-8">
                Contact Sales
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/80 mt-6">
            No credit card required. Cancel anytime.
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
              © 2024 Eternal Echoes & Visions Inc. All rights reserved.
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
