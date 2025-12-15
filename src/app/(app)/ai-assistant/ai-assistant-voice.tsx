'use client'

import { useState } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AIAssistantVoice() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleStartListening = () => {
    setIsListening(true)
    setTranscript('')
    setResponse('')

    // Simulate voice recognition
    setTimeout(() => {
      setTranscript('Brief me on my schedule for today')
      setIsListening(false)
      setProcessing(true)

      // Simulate AI processing
      setTimeout(() => {
        setResponse('You have 3 appointments scheduled for today:\n\n1. 10:00 AM - Consultation with Acme Corp\n2. 2:00 PM - Follow-up call with Tech Solutions\n3. 4:30 PM - Project review meeting')
        setProcessing(false)
      }, 2000)
    }, 3000)
  }

  const handleStopListening = () => {
    setIsListening(false)
  }

  return (
    <div className="space-y-4">
      {/* Voice Control */}
      <div className="flex flex-col items-center justify-center py-8">
        <Button
          onClick={isListening ? handleStopListening : handleStartListening}
          size="lg"
          className={`h-20 w-20 rounded-full ${
            isListening
              ? 'bg-destructive hover:bg-destructive/90'
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isListening ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          {isListening ? 'Listening...' : 'Tap to start voice conversation'}
        </p>
      </div>

      {/* Transcript */}
      {transcript && (
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">You said</Badge>
            </div>
            <p className="text-sm">{transcript}</p>
          </CardContent>
        </Card>
      )}

      {/* Response */}
      {processing && (
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Processing your request...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card className="rounded-xl border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary">AI Response</Badge>
            </div>
            <p className="text-sm whitespace-pre-line">{response}</p>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-medium">Try asking:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>"Brief me on my schedule for today"</li>
          <li>"Who are my top paying clients?"</li>
          <li>"What is my total revenue this month?"</li>
        </ul>
      </div>
    </div>
  )
}

