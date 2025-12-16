import { Target } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { OKRsList } from './okrs-list'

export default async function StrategyPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Strategy"
        description="Align your team with Objectives and Key Results (OKRs)."
      />

      <OKRsList />
    </div>
  )
}

