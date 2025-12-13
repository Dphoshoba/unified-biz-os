import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { createContact, CreateContactInput } from './contacts'
import { revalidatePath } from 'next/cache'

/**
 * Parse CSV file and return array of contact objects
 */
function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  
  // Parse rows
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }

  return rows
}

/**
 * Map CSV row to CreateContactInput
 */
function mapCSVRowToContact(row: Record<string, string>): CreateContactInput {
  // Try different common column names
  const firstName = row['First Name'] || row['FirstName'] || row['first_name'] || row['First'] || ''
  const lastName = row['Last Name'] || row['LastName'] || row['last_name'] || row['Last'] || ''
  const email = row['Email'] || row['email'] || row['Email Address'] || row['email_address'] || ''
  const phone = row['Phone'] || row['phone'] || row['Phone Number'] || row['phone_number'] || row['Mobile'] || ''
  const title = row['Title'] || row['title'] || row['Job Title'] || row['job_title'] || ''
  const company = row['Company'] || row['company'] || row['Company Name'] || row['company_name'] || ''
  const source = row['Source'] || row['source'] || row['Lead Source'] || row['lead_source'] || 'Import'
  const notes = row['Notes'] || row['notes'] || row['Description'] || row['description'] || ''

  return {
    firstName: firstName || 'Unknown',
    lastName: lastName || '',
    email: email || undefined,
    phone: phone || undefined,
    title: title || undefined,
    source: source || 'Import',
    notes: notes || undefined,
  }
}

/**
 * Import contacts from CSV
 */
export async function importContacts(csvText: string): Promise<{
  success: number
  failed: number
  errors: string[]
}> {
  const session = await requireAuthWithOrg()
  const rows = parseCSV(csvText)
  
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  }

  for (let i = 0; i < rows.length; i++) {
    try {
      const contactInput = mapCSVRowToContact(rows[i])
      
      // Skip if no email and no name
      if (!contactInput.email && (!contactInput.firstName || contactInput.firstName === 'Unknown')) {
        results.failed++
        results.errors.push(`Row ${i + 2}: Missing email and name`)
        continue
      }

      await createContact(contactInput)
      results.success++
    } catch (error) {
      results.failed++
      results.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  revalidatePath('/crm/contacts')
  return results
}

/**
 * Export contacts to CSV
 */
export async function exportContacts(options?: {
  status?: string
  search?: string
}): Promise<string> {
  const session = await requireAuthWithOrg()
  
  const contacts = await db.contact.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(options?.status && { status: options.status as any }),
      ...(options?.search && {
        OR: [
          { firstName: { contains: options.search, mode: 'insensitive' } },
          { lastName: { contains: options.search, mode: 'insensitive' } },
          { email: { contains: options.search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      company: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Generate CSV
  const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Title', 'Company', 'Status', 'Source', 'Notes']
  const rows = contacts.map(contact => [
    contact.firstName,
    contact.lastName,
    contact.email || '',
    contact.phone || '',
    contact.title || '',
    contact.company?.name || '',
    contact.status,
    contact.source || '',
    (contact.notes || '').replace(/"/g, '""'), // Escape quotes
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  return csv
}

