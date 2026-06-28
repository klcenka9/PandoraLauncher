import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase } from './database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  status: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const db = getDatabase()

    // Kontrola, zda uživatel už existuje
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    )

    if (existingUser) {
      return {
        success: false,
        message: 'Uživatel s tímto e-mailem nebo jménem už existuje',
      }
    }

    // Hashovací heslo
    const hashedPassword = await hashPassword(password)
    const userId = uuidv4()

    // Vytvoření uživatele
    await db.run(
      'INSERT INTO users (id, username, email, password, status) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, hashedPassword, 'offline']
    )

    const user: User = {
      id: userId,
      username,
      email,
      status: 'offline',
    }

    const token = generateToken(userId)

    return {
      success: true,
      message: 'Registrace úspěšná',
      user,
      token,
    }
  } catch (error) {
    console.error('Chyba při registraci:', error)
    return {
      success: false,
      message: 'Chyba při registraci',
    }
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const db = getDatabase()

    // Hledání uživatele
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email])

    if (!user) {
      return {
        success: false,
        message: 'Uživatel nenalezen',
      }
    }

    // Ověření hesla
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Nesprávné heslo',
      }
    }

    // Aktualizace statusu na online
    await db.run('UPDATE users SET status = ? WHERE id = ?', ['online', user.id])

    const userData: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: 'online',
    }

    const token = generateToken(user.id)

    return {
      success: true,
      message: 'Přihlášení úspěšné',
      user: userData,
      token,
    }
  } catch (error) {
    console.error('Chyba při přihlášení:', error)
    return {
      success: false,
      message: 'Chyba při přihlášení',
    }
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = getDatabase()
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId])

    if (!user) return null

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
    }
  } catch (error) {
    console.error('Chyba při získávání uživatele:', error)
    return null
  }
}

export async function setUserStatus(
  userId: string,
  status: string
): Promise<boolean> {
  try {
    const db = getDatabase()
    await db.run('UPDATE users SET status = ? WHERE id = ?', [status, userId])
    return true
  } catch (error) {
    console.error('Chyba při aktualizaci statusu:', error)
    return false
  }
}
