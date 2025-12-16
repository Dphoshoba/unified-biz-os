'use client'

import Tesseract from 'tesseract.js'

export interface ReceiptData {
  vendor?: string
  date?: string
  amount?: string
  items?: string[]
  total?: string
}

export interface BusinessCardData {
  name?: string
  email?: string
  phone?: string
  company?: string
  title?: string
  website?: string
  address?: string
}

/**
 * Extract text from an image using OCR
 */
export async function extractTextFromImage(imageFile: File): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(imageFile, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        // Progress updates can be handled here
      }
    },
  })
  return text
}

/**
 * Parse receipt data from OCR text
 */
export function parseReceiptData(text: string): ReceiptData {
  const lines = text.split('\n').filter(line => line.trim())
  
  // Extract vendor (usually first line or contains common business terms)
  const vendor = lines.find(line => 
    /(inc|llc|corp|company|store|shop|restaurant)/i.test(line)
  ) || lines[0] || 'Unknown Vendor'

  // Extract date (look for date patterns)
  const dateMatch = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/)
  const date = dateMatch ? dateMatch[0] : new Date().toLocaleDateString()

  // Extract amount (look for currency patterns)
  const amountMatches = text.match(/\$[\d,]+\.?\d*/g)
  const amounts = amountMatches?.map(m => m.replace(/[$,]/g, '')) || []
  const total = amounts.length > 0 ? amounts[amounts.length - 1] : undefined
  const amount = total ? `$${parseFloat(total).toFixed(2)}` : undefined

  // Extract items (lines that might be products)
  const items = lines
    .filter(line => {
      // Skip lines that are clearly not items
      if (/(total|subtotal|tax|date|receipt|thank)/i.test(line)) return false
      if (line.length < 3) return false
      return true
    })
    .slice(0, 10) // Limit to first 10 items

  return {
    vendor: vendor.trim(),
    date,
    amount,
    total: amount,
    items: items.length > 0 ? items : undefined,
  }
}

/**
 * Parse business card data from OCR text
 */
export function parseBusinessCardData(text: string): BusinessCardData {
  const lines = text.split('\n').filter(line => line.trim())
  
  // Extract name (usually first or second line, capitalized)
  const nameLine = lines.find(line => {
    const words = line.split(/\s+/)
    return words.length >= 2 && words.every(w => /^[A-Z]/.test(w))
  }) || lines[0] || ''

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/i)
  const email = emailMatch ? emailMatch[0] : undefined

  // Extract phone (various formats)
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  const phone = phoneMatch ? phoneMatch[0] : undefined

  // Extract company (look for business terms)
  const companyLine = lines.find(line => 
    /(inc|llc|corp|corporation|company|ltd|limited)/i.test(line)
  )
  const company = companyLine || undefined

  // Extract title (look for job titles)
  const titleLine = lines.find(line => 
    /(manager|director|president|ceo|cto|cfo|vp|vice|president|executive|senior|junior|lead|head|chief)/i.test(line)
  )
  const title = titleLine || undefined

  // Extract website
  const websiteMatch = text.match(/(www\.)?[\w.-]+\.(com|org|net|io|co)/i)
  const website = websiteMatch ? websiteMatch[0] : undefined

  return {
    name: nameLine.trim() || undefined,
    email,
    phone,
    company,
    title,
    website,
  }
}

/**
 * Process receipt image and extract data
 */
export async function scanReceipt(imageFile: File): Promise<ReceiptData> {
  const text = await extractTextFromImage(imageFile)
  return parseReceiptData(text)
}

/**
 * Process business card image and extract data
 */
export async function scanBusinessCard(imageFile: File): Promise<BusinessCardData> {
  const text = await extractTextFromImage(imageFile)
  return parseBusinessCardData(text)
}

