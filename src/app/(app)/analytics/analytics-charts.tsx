'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

interface RevenueData {
  date: string
  revenue: number
  deals: number
}

interface ContactGrowthData {
  date: string
  contacts: number
}

interface DealPipelineData {
  stage: string
  count: number
  value: number
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

export function AnalyticsCharts() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [contactGrowth, setContactGrowth] = useState<ContactGrowthData[]>([])
  const [pipelineData, setPipelineData] = useState<DealPipelineData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      const [revenue, contacts, pipeline] = await Promise.all([
        fetch('/api/analytics/revenue').then(r => r.json()),
        fetch('/api/analytics/contacts').then(r => r.json()),
        fetch('/api/analytics/pipeline').then(r => r.json()),
      ])

      if (revenue.success) setRevenueData(revenue.data)
      if (contacts.success) setContactGrowth(contacts.data)
      if (pipeline.success) setPipelineData(pipeline.data)
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading charts...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Revenue Trend */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monthly revenue and closed deals
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                name="Revenue ($)"
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="deals" 
                stroke="#10B981" 
                name="Deals Closed"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contact Growth */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Contact Growth</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total contacts over time
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contactGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="contacts" fill="#8B5CF6" name="Total Contacts" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Deal Pipeline */}
      <Card className="rounded-2xl md:col-span-2">
        <CardHeader>
          <CardTitle>Deal Pipeline</CardTitle>
          <p className="text-sm text-muted-foreground">
            Deals by stage (count and value)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-4">Deal Count</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pipelineData as any}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.stage}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Deal Value</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={pipelineData as any} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" name="Value ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
