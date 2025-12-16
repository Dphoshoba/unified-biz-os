'use client'

import { useState, useEffect } from 'react'
import { Target, Plus, CheckCircle2, AlertCircle, TrendingDown, MoreVertical, Trash2, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateObjectiveDialog } from './create-objective-dialog'
import { CreateKeyResultDialog } from './create-key-result-dialog'
import { getObjectives, deleteObjective } from '@/lib/strategy/actions'
import { Objective } from '@prisma/client'

export function OKRsList() {
  const [objectives, setObjectives] = useState<(Objective & { keyResults: any[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 2024')
  const [showCreateObjective, setShowCreateObjective] = useState(false)
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null)

  useEffect(() => {
    fetchObjectives()
  }, [selectedQuarter])

  const fetchObjectives = async () => {
    setLoading(true)
    try {
      const data = await getObjectives(selectedQuarter)
      setObjectives(data as (Objective & { keyResults: any[] })[])
    } catch (error) {
      console.error('Failed to fetch objectives:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this objective?')) return

    try {
      const result = await deleteObjective(id)
      if (result.success) {
        fetchObjectives()
      } else {
        alert(result.error || 'Failed to delete objective')
      }
    } catch (error) {
      console.error('Failed to delete objective:', error)
      alert('Failed to delete objective')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'ACTIVE':
        return <Target className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getKeyResultStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK':
        return 'bg-emerald-500'
      case 'AT_RISK':
        return 'bg-amber-500'
      case 'BEHIND':
        return 'bg-red-500'
      case 'COMPLETED':
        return 'bg-blue-500'
      default:
        return 'bg-muted'
    }
  }

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading OKRs...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Quarter Selector */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'].map((quarter) => (
              <Button
                key={quarter}
                variant={selectedQuarter === quarter ? 'default' : 'outline'}
                onClick={() => setSelectedQuarter(quarter)}
                className="rounded-xl"
              >
                {quarter}
              </Button>
            ))}
          </div>
          <Button onClick={() => setShowCreateObjective(true)} className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            New Objective
          </Button>
        </div>

        {objectives.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-16 text-center">
              <Target className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No objectives yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first objective to start tracking OKRs
              </p>
            </CardContent>
          </Card>
        ) : (
          objectives.map((objective) => (
            <Card key={objective.id} className="rounded-2xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(objective.status)}
                      <CardTitle>{objective.title}</CardTitle>
                      <Badge variant="outline">{objective.quarter}</Badge>
                    </div>
                    {objective.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {objective.description}
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{objective.progress}%</span>
                      </div>
                      <Progress value={objective.progress} className="h-2" />
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDelete(objective.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Key Results</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedObjective(objective.id)}
                      className="rounded-xl"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Key Result
                    </Button>
                  </div>
                  {objective.keyResults && objective.keyResults.length > 0 ? (
                    <div className="space-y-3">
                      {objective.keyResults.map((kr: any) => {
                        const current = parseFloat(kr.current) || 0
                        const target = parseFloat(kr.target) || 1
                        const progress = Math.min((current / target) * 100, 100)

                        return (
                          <div key={kr.id} className="p-4 border rounded-xl">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div
                                    className={`h-2 w-2 rounded-full ${getKeyResultStatusColor(kr.status)}`}
                                  />
                                  <span className="font-medium">{kr.title}</span>
                                </div>
                                {kr.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {kr.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-sm">
                                  <span>
                                    {kr.current} / {kr.target} {kr.unit}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {Math.round(progress)}% complete
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Progress value={progress} className="h-2 mt-2" />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No key results yet. Add one to start tracking progress.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateObjectiveDialog
        open={showCreateObjective}
        onOpenChange={setShowCreateObjective}
        onSuccess={fetchObjectives}
        defaultQuarter={selectedQuarter}
      />

      {selectedObjective && (
        <CreateKeyResultDialog
          open={!!selectedObjective}
          onOpenChange={(open) => !open && setSelectedObjective(null)}
          objectiveId={selectedObjective}
          onSuccess={fetchObjectives}
        />
      )}
    </>
  )
}

