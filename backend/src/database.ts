import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

let db: any = null

export async function initializeDatabase() {
  db = await open({
    filename: path.join(process.cwd(), 'pandora.db'),
    driver: sqlite3.Database,
  })

  await db.exec('PRAGMA foreign_keys = ON')

  // Vytvoření tabulky uživatelů
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      status TEXT DEFAULT 'online',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Vytvoření tabulky zpráv
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      channel TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `)

  // Vytvoření tabulky přátel
  await db.exec(`
    CREATE TABLE IF NOT EXISTS friends (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      friend_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (friend_id) REFERENCES users(id),
      UNIQUE(user_id, friend_id)
    )
  `)

  // Vytvoření tabulky pro blokované uživatele
  await db.exec(`
    CREATE TABLE IF NOT EXISTS blocked_users (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      blocked_user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (blocked_user_id) REFERENCES users(id),
      UNIQUE(user_id, blocked_user_id)
    )
  `)

  // Vytvoření tabulky voice channels
  await db.exec(`
    CREATE TABLE IF NOT EXISTS voice_channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      user_limit INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Vytvoření tabulky přímých zpráv
  await db.exec(`
    CREATE TABLE IF NOT EXISTS direct_messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      content TEXT NOT NULL,
      read BOOLEAN DEFAULT 0,
      edited_at DATETIME,
      deleted BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    )
  `)

  // Vytvoření tabulky reaction na zprávy
  await db.exec(`
    CREATE TABLE IF NOT EXISTS message_reactions (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      emoji TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(message_id, user_id, emoji)
    )
  `)

  console.log('✅ Databáze inicializována')
  return db
}

export function getDatabase() {
  if (!db) {
    throw new Error('Databáze není inicializována')
  }
  return db
}
