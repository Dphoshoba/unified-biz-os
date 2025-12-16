import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

/**
 * Initialize Google Calendar OAuth2 client
 */
export function getGoogleCalendarClient(accessToken: string) {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

/**
 * Get Google Calendar authorization URL
 */
export function getGoogleAuthUrl() {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`
  )

  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeGoogleCode(code: string) {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`
  )

  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

/**
 * Sync booking to Google Calendar
 */
export async function syncBookingToGoogle(
  accessToken: string,
  booking: {
    title: string
    startTime: Date
    endTime: Date
    description?: string
    location?: string
    attendeeEmails?: string[]
  }
) {
  const calendar = getGoogleCalendarClient(accessToken)

  const event = {
    summary: booking.title,
    description: booking.description || '',
    start: {
      dateTime: booking.startTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: booking.endTime.toISOString(),
      timeZone: 'UTC',
    },
    location: booking.location,
    attendees: booking.attendeeEmails?.map(email => ({ email })),
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  })

  return response.data
}

/**
 * Get events from Google Calendar
 */
export async function getGoogleCalendarEvents(
  accessToken: string,
  timeMin?: Date,
  timeMax?: Date
) {
  const calendar = getGoogleCalendarClient(accessToken)

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin?.toISOString(),
    timeMax: timeMax?.toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  })

  return response.data.items || []
}

