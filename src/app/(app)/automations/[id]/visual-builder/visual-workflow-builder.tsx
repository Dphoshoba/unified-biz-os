'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Play, Pause, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Automation } from '@prisma/client'
import { updateAutomation } from '@/lib/automations/actions'
import { useRouter } from 'next/navigation'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface VisualWorkflowBuilderProps {
  automation: Automation
}

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  delay: DelayNode,
}

const TRIGGERS = [
  { id: 'CONTACT_CREATED', label: 'New Contact', color: '#10B981' },
  { id: 'DEAL_WON', label: 'Deal Won', color: '#10B981' },
  { id: 'FORM_SUBMITTED', label: 'Form Submitted', color: '#10B981' },
  { id: 'PAYMENT_RECEIVED', label: 'Payment Received', color: '#10B981' },
]

const ACTIONS = [
  { id: 'SEND_EMAIL', label: 'Send Email', color: '#3B82F6' },
  { id: 'ADD_TAG', label: 'Add Tag', color: '#3B82F6' },
  { id: 'CREATE_TASK', label: 'Create Task', color: '#3B82F6' },
  { id: 'WEBHOOK', label: 'Webhook', color: '#3B82F6' },
]

const CONDITIONS = [
  { id: 'IF_VALUE', label: 'If Value >', color: '#F59E0B' },
  { id: 'IF_STATUS', label: 'If Status =', color: '#F59E0B' },
]

function TriggerNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 bg-emerald-500 text-white rounded-lg shadow-lg min-w-[150px] text-center">
      <div className="text-sm font-medium">{data.label}</div>
      <div className="text-xs opacity-75 mt-1">Trigger</div>
    </div>
  )
}

function ActionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 bg-blue-500 text-white rounded-lg shadow-lg min-w-[150px] text-center">
      <div className="text-sm font-medium">{data.label}</div>
      <div className="text-xs opacity-75 mt-1">Action</div>
    </div>
  )
}

function ConditionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 bg-amber-500 text-white rounded-lg shadow-lg min-w-[150px] text-center">
      <div className="text-sm font-medium">{data.label}</div>
      <div className="text-xs opacity-75 mt-1">Condition</div>
    </div>
  )
}

function DelayNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 bg-purple-500 text-white rounded-lg shadow-lg min-w-[150px] text-center">
      <div className="text-sm font-medium">{data.label || 'Delay'}</div>
      <div className="text-xs opacity-75 mt-1">Delay</div>
    </div>
  )
}

export function VisualWorkflowBuilder({ automation: initialAutomation }: VisualWorkflowBuilderProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [showPalette, setShowPalette] = useState(false)

  // Initialize nodes from automation config or create default
  const getInitialNodes = (): Node[] => {
    try {
      if (initialAutomation.actionConfig && typeof initialAutomation.actionConfig === 'object') {
        const config = initialAutomation.actionConfig as any
        if (config.nodes && Array.isArray(config.nodes)) {
          return config.nodes.map((n: any) => ({
            id: n.id,
            type: n.type,
            position: { x: n.x || 100, y: n.y || 100 },
            data: { label: n.label || n.id },
          }))
        }
      }
    } catch (error) {
      console.error('Failed to parse automation config:', error)
    }

    // Default: create trigger and action nodes
    return [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'New Contact', id: 'CONTACT_CREATED' },
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 400, y: 100 },
        data: { label: 'Send Email', id: 'SEND_EMAIL' },
      },
    ]
  }

  const getInitialEdges = (): Edge[] => {
    try {
      if (initialAutomation.actionConfig && typeof initialAutomation.actionConfig === 'object') {
        const config = initialAutomation.actionConfig as any
        if (config.connections && Array.isArray(config.connections)) {
          return config.connections.map((conn: any) => ({
            id: `e${conn.from}-${conn.to}`,
            source: conn.from,
            target: conn.to,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
          }))
        }
      }
    } catch (error) {
      console.error('Failed to parse connections:', error)
    }

    return [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'action-1',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ]
  }

  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes())
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges())

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  const handleAddNode = (type: string, label: string, id: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 200,
      },
      data: { label, id },
    }
    setNodes((nds) => [...nds, newNode])
    setShowPalette(false)
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const workflowConfig = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          x: node.position.x,
          y: node.position.y,
          label: node.data.label,
          configId: node.data.id,
        })),
        connections: edges.map((edge) => ({
          from: edge.source,
          to: edge.target,
        })),
      }

      await updateAutomation({
        id: initialAutomation.id,
        actionConfig: workflowConfig as any,
      })

      router.refresh()
    } catch (error) {
      console.error('Failed to save workflow:', error)
      alert('Failed to save workflow')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 h-screen flex flex-col">
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

      <div className="flex-1 flex gap-4">
        {/* Node Palette */}
        <Card className="rounded-2xl w-64 flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-base">Add Nodes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-emerald-600">Triggers</h4>
              <div className="space-y-2">
                {TRIGGERS.map((trigger) => (
                  <Button
                    key={trigger.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddNode('trigger', trigger.label, trigger.id)}
                    className="w-full justify-start rounded-xl text-xs"
                  >
                    <div
                      className="h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: trigger.color }}
                    />
                    {trigger.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-amber-600">Conditions</h4>
              <div className="space-y-2">
                {CONDITIONS.map((condition) => (
                  <Button
                    key={condition.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddNode('condition', condition.label, condition.id)}
                    className="w-full justify-start rounded-xl text-xs"
                  >
                    <div
                      className="h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: condition.color }}
                    />
                    {condition.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-blue-600">Actions</h4>
              <div className="space-y-2">
                {ACTIONS.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddNode('action', action.label, action.id)}
                    className="w-full justify-start rounded-xl text-xs"
                  >
                    <div
                      className="h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: action.color }}
                    />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-purple-600">Delay</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddNode('delay', 'Delay 1 hour', 'DELAY_1H')}
                className="w-full justify-start rounded-xl text-xs"
              >
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2" />
                Delay
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="rounded-2xl flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Workflow Canvas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Drag nodes to reposition. Connect nodes by dragging from one node to another.
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-muted/30"
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
