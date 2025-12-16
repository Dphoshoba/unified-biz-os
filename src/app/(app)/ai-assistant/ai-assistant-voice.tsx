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

  const handleStartListening = async () => {
    setIsListening(true)
    setTranscript('')
    setResponse('')

    try {
      // Use Web Speech API for voice recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = async (event: any) => {
          const transcriptText = event.results[0][0].transcript
          setTranscript(transcriptText)
          setIsListening(false)
          setProcessing(true)

          try {
            // Call AI API with transcript
            const response = await fetch('/api/ai/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: transcriptText }),
            })

            const data = await response.json()
            if (data.success) {
              setResponse(data.response)
            } else {
              setResponse(data.fallback || 'I apologize, but I couldn\'t process that request.')
            }
          } catch (error) {
            console.error('Failed to get AI response:', error)
            setResponse('I apologize, but I\'m having trouble processing your request right now.')
          } finally {
            setProcessing(false)
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          setProcessing(false)
          setResponse('Sorry, I couldn\'t understand that. Please try again.')
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.start()
      } else {
        // Fallback: simulate voice recognition if browser doesn't support it
        setTimeout(() => {
          setTranscript('Brief me on my schedule for today')
          setIsListening(false)
          setProcessing(true)

          fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Brief me on my schedule for today' }),
          })
            .then(res => res.json())
            .then(data => {
              setResponse(data.success ? data.response : (data.fallback || 'I apologize, but I couldn\'t process that request.'))
              setProcessing(false)
            })
            .catch(error => {
              console.error('Failed to get AI response:', error)
              setResponse('I apologize, but I\'m having trouble processing your request right now.')
              setProcessing(false)
            })
        }, 2000)
      }
    } catch (error) {
      console.error('Voice recognition error:', error)
      setIsListening(false)
      setResponse('Sorry, voice recognition is not available in your browser.')
    }
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

