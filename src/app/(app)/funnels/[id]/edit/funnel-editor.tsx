'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Palette, Type, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Funnel, FunnelStep } from '@prisma/client'
import { updateFunnel, updateFunnelStep, UpdateFunnelInput, UpdateFunnelStepInput } from '@/lib/funnels/actions'

type FunnelWithSteps = Funnel & {
  steps: FunnelStep[]
}

interface FunnelEditorProps {
  funnel: FunnelWithSteps
}

export function FunnelEditor({ funnel: initialFunnel }: FunnelEditorProps) {
  const router = useRouter()
  const [funnel, setFunnel] = useState(initialFunnel)
  const [selectedStepId, setSelectedStepId] = useState<string | null>(funnel.steps[0]?.id || null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectedStep = funnel.steps.find(s => s.id === selectedStepId)

  const handleFunnelUpdate = async (updates: Partial<UpdateFunnelInput & { logoUrl?: string | null }>) => {
    setSaving(true)
    setSaved(false)
    try {
      const result = await updateFunnel({
        id: funnel.id,
        ...updates,
      })
      if (result.success && result.funnel) {
        setFunnel(prev => ({ ...prev, ...result.funnel }))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to update funnel:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleStepUpdate = async (updates: Partial<UpdateFunnelStepInput>) => {
    if (!selectedStepId) return

    setSaving(true)
    setSaved(false)
    try {
      const result = await updateFunnelStep({
        id: selectedStepId,
        ...updates,
      })
      if (result.success && result.step) {
        setFunnel(prev => ({
          ...prev,
          steps: prev.steps.map(s => s.id === selectedStepId ? result.step! : s),
        }))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to update step:', error)
    } finally {
      setSaving(false)
    }
  }

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/f/${funnel.slug}`

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/funnels" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Funnels
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{funnel.name}</h1>
            <p className="text-muted-foreground">Edit your funnel content and design</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(publicUrl, '_blank')}
              className="rounded-xl"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => handleFunnelUpdate({})}
              disabled={saving}
              className="rounded-xl"
            >
              {saving ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Saved!
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Steps List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Funnel Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {funnel.steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setSelectedStepId(step.id)}
                    className={`w-full text-left p-4 hover:bg-muted transition-colors ${
                      selectedStepId === step.id ? 'bg-muted border-l-4 border-primary' : ''
                    }`}
                  >
                    <div className="font-semibold">{step.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Step {index + 1} • {step.type.replace('_', ' ')}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Funnel Settings */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Funnel Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={funnel.primaryColor}
                    onChange={(e) => handleFunnelUpdate({ primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={funnel.primaryColor}
                    onChange={(e) => handleFunnelUpdate({ primaryColor: e.target.value })}
                    className="flex-1"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <div>
                <Label>Logo URL (optional)</Label>
                <Input
                  value={funnel.logoUrl || ''}
                  onChange={(e) => handleFunnelUpdate({ logoUrl: e.target.value || undefined })}
                  placeholder="https://example.com/logo.png"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={funnel.description || ''}
                  onChange={(e) => handleFunnelUpdate({ description: e.target.value })}
                  placeholder="Describe your funnel..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Step Editor */}
        <div className="lg:col-span-2">
          {selectedStep ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Edit: {selectedStep.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="cta">Call-to-Action</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-4">
                    <div>
                      <Label>Headline</Label>
                      <Input
                        value={selectedStep.headline || ''}
                        onChange={(e) => handleStepUpdate({ headline: e.target.value })}
                        placeholder="Enter your main headline..."
                        className="mt-1 text-lg"
                      />
                    </div>
                    <div>
                      <Label>Subheadline</Label>
                      <Textarea
                        value={selectedStep.subheadline || ''}
                        onChange={(e) => handleStepUpdate({ subheadline: e.target.value })}
                        placeholder="Enter supporting text..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="cta" className="space-y-4 mt-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <MousePointerClick className="h-4 w-4" />
                        CTA Button Text
                      </Label>
                      <Input
                        value={selectedStep.ctaText || ''}
                        onChange={(e) => handleStepUpdate({ ctaText: e.target.value })}
                        placeholder="Get Started, Download Now, etc."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>CTA Button URL (optional)</Label>
                      <Input
                        value={selectedStep.ctaUrl || ''}
                        onChange={(e) => handleStepUpdate({ ctaUrl: e.target.value })}
                        placeholder="https://example.com or leave empty for next step"
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border rounded-lg p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-[400px]">
                      <div className="text-center space-y-4">
                        {selectedStep.headline && (
                          <h2 className="text-3xl font-bold">{selectedStep.headline}</h2>
                        )}
                        {selectedStep.subheadline && (
                          <p className="text-xl text-muted-foreground">{selectedStep.subheadline}</p>
                        )}
                        {selectedStep.ctaText && (
                          <div className="pt-4">
                            <Button
                              style={{ backgroundColor: funnel.primaryColor }}
                              className="px-8"
                            >
                              {selectedStep.ctaText}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Select a step to edit
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

