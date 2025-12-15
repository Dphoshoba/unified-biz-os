'use client'

import { useState } from 'react'
import { Sparkles, Loader2, BarChart3 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const exampleQueries = [
  'Show me revenue by region',
  'What is my total revenue this month?',
  'Show me conversion rates by funnel',
  'Who are my top paying clients?',
  'How many bookings do I have this week?',
]

export function AnalyticsQuery() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [chartData, setChartData] = useState<any>(null)

  const handleQuery = async () => {
    if (!query.trim()) return

    setLoading(true)
    setResult(null)
    setChartData(null)

    // Simulate AI processing
    setTimeout(() => {
      // Simple keyword-based responses (in production, this would use AI)
      const lowerQuery = query.toLowerCase()
      
      if (lowerQuery.includes('revenue') && lowerQuery.includes('month')) {
        setResult('Your total revenue this month is $45,230. This is a 12% increase from last month.')
        setChartData({ type: 'line', data: [32000, 38000, 42000, 45230] })
      } else if (lowerQuery.includes('top') && lowerQuery.includes('client')) {
        setResult('Your top 3 paying clients are:\n1. Acme Corp - $12,500\n2. Tech Solutions - $8,200\n3. Global Industries - $6,100')
        setChartData({ type: 'bar', data: [{ name: 'Acme Corp', value: 12500 }, { name: 'Tech Solutions', value: 8200 }, { name: 'Global Industries', value: 6100 }] })
      } else if (lowerQuery.includes('bookings') && lowerQuery.includes('week')) {
        setResult('You have 15 bookings scheduled this week. 8 are confirmed, 5 are pending, and 2 are cancelled.')
        setChartData({ type: 'pie', data: [{ name: 'Confirmed', value: 8 }, { name: 'Pending', value: 5 }, { name: 'Cancelled', value: 2 }] })
      } else if (lowerQuery.includes('conversion') && lowerQuery.includes('funnel')) {
        setResult('Your funnel conversion rates:\n- Landing Page: 45%\n- Opt-in Form: 32%\n- Checkout: 18%\n- Overall: 2.6%')
        setChartData({ type: 'bar', data: [{ name: 'Landing Page', value: 45 }, { name: 'Opt-in Form', value: 32 }, { name: 'Checkout', value: 18 }] })
      } else {
        setResult('I found relevant data for your query. Here\'s a summary:\n\nBased on your business data, I can see positive trends across multiple metrics. Would you like me to generate a detailed chart?')
      }
      
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="e.g., Show me revenue by region"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          className="flex-1"
        />
        <Button onClick={handleQuery} disabled={loading || !query.trim()} className="rounded-xl">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Ask
            </>
          )}
        </Button>
      </div>

      {/* Example Queries */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery(example)
                setTimeout(() => handleQuery(), 100)
              }}
              className="rounded-xl text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <Card className="mt-4 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="whitespace-pre-line text-sm">{result}</p>
                {chartData && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Chart: {chartData.type}</p>
                    <div className="h-32 flex items-end justify-center gap-2">
                      {chartData.data && Array.isArray(chartData.data) && chartData.data.map((item: any, i: number) => {
                        const value = typeof item === 'object' ? item.value : item
                        const max = Math.max(...chartData.data.map((d: any) => typeof d === 'object' ? d.value : d))
                        return (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div
                              className="w-8 bg-primary rounded-t"
                              style={{ height: `${(value / max) * 100}%` }}
                            />
                            {typeof item === 'object' && item.name && (
                              <span className="text-xs text-muted-foreground">{item.name}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
