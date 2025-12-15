import { Scan, Receipt, CreditCard, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SmartScanUpload } from './smart-scan-upload'

export default async function SmartScanPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Smart Scan"
        description="Instantly digitize receipts and business cards with AI."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Receipt Scanner */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <CardTitle>Scan Receipt</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Extract vendor, date, and amount for expenses
            </p>
          </CardHeader>
          <CardContent>
            <SmartScanUpload type="receipt" />
          </CardContent>
        </Card>

        {/* Business Card Scanner */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Scan Business Card</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Extract contact info for the CRM
            </p>
          </CardHeader>
          <CardContent>
            <SmartScanUpload type="business-card" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Recent Scans</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent scans. Upload a receipt or business card to get started.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
