'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Automation } from '@prisma/client'
import { updateAutomation } from '@/lib/automations/actions'
import { useRouter } from 'next/navigation'

interface VisualWorkflowBuilderProps {
  automation: Automation
}

type NodeType = 'trigger' | 'condition' | 'action' | 'delay'

interface Node {
  id: string
  type: NodeType
  label: string
  x: number
  y: number
  config?: any
}

export function VisualWorkflowBuilder({ automation: initialAutomation }: VisualWorkflowBuilderProps) {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      label: 'New Lead',
      x: 100,
      y: 100,
    },
    {
      id: 'action-1',
      type: 'action',
      label: 'Send Email',
      x: 300,
      y: 100,
    },
  ])
  const [connections, setConnections] = useState<Array<{ from: string; to: string }>>([
    { from: 'trigger-1', to: 'action-1' },
  ])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Convert visual nodes to automation config
    const workflowConfig = {
      nodes,
      connections,
    }
    
    await updateAutomation({
      id: initialAutomation.id,
      actionConfig: workflowConfig as any,
    })
    
    setSaving(false)
    router.refresh()
  }

  const nodeColors = {
    trigger: 'bg-green-500',
    condition: 'bg-yellow-500',
    action: 'bg-blue-500',
    delay: 'bg-purple-500',
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/automations">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{initialAutomation.name}</h1>
            <p className="text-muted-foreground">Visual Workflow Builder</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            {initialAutomation.status === 'ACTIVE' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="rounded-xl">
            {saving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Workflow Canvas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag nodes to connect triggers, conditions, and actions
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative h-[600px] bg-muted/30 rounded-lg overflow-hidden">
            {/* Grid Background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Connections */}
            <svg className="absolute inset-0 pointer-events-none">
              {connections.map((conn, i) => {
                const fromNode = nodes.find(n => n.id === conn.from)
                const toNode = nodes.find(n => n.id === conn.to)
                if (!fromNode || !toNode) return null

                return (
                  <line
                    key={i}
                    x1={fromNode.x + 100}
                    y1={fromNode.y + 30}
                    x2={toNode.x}
                    y2={toNode.y + 30}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    markerEnd="url(#arrowhead)"
                  />
                )
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute ${nodeColors[node.type]} text-white rounded-lg p-3 cursor-move shadow-lg min-w-[120px] text-center`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                }}
              >
                <div className="text-xs font-medium">{node.label}</div>
                <div className="text-xs opacity-75 mt-1 capitalize">{node.type}</div>
              </div>
            ))}

            {/* Empty State */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Start building your workflow</p>
                  <p className="text-sm text-muted-foreground">
                    Add nodes from the sidebar to create your automation
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Node Palette */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Add Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { type: 'trigger', label: 'Trigger', color: 'bg-green-500' },
              { type: 'condition', label: 'Condition', color: 'bg-yellow-500' },
              { type: 'action', label: 'Action', color: 'bg-blue-500' },
              { type: 'delay', label: 'Delay', color: 'bg-purple-500' },
            ].map((nodeType) => (
              <Button
                key={nodeType.type}
                variant="outline"
                className="rounded-xl h-20 flex flex-col items-center justify-center"
                onClick={() => {
                  const newNode: Node = {
                    id: `${nodeType.type}-${Date.now()}`,
                    type: nodeType.type as NodeType,
                    label: nodeType.label,
                    x: Math.random() * 400 + 100,
                    y: Math.random() * 300 + 100,
                  }
                  setNodes([...nodes, newNode])
                }}
              >
                <div className={`h-8 w-8 ${nodeType.color} rounded mb-2`} />
                <span className="text-xs">{nodeType.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

