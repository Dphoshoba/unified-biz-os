'use server'

import { hash } from 'bcryptjs'
import { db } from '@/lib/db'

export async function signUp(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Validation
  if (!name || !email || !password) {
    return { error: 'All fields are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (existingUser) {
    return { error: 'An account with this email already exists' }
  }

  // Hash password
  const hashedPassword = await hash(password, 12)

  // Create user
  try {
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Sign up error:', error)
    return { error: 'Failed to create account. Please try again.' }
  }
}



