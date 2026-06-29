import { v4 as uuidv4 } from 'uuid'
import { getDatabase } from './database'

// ===== Voice Channels =====
export async function getVoiceChannels() {
  const db = getDatabase()
  return await db.all('SELECT * FROM voice_channels ORDER BY created_at')
}

export async function createVoiceChannel(
  name: string,
  description?: string,
  userLimit?: number
) {
  const db = getDatabase()
  const id = uuidv4()
  await db.run(
    'INSERT INTO voice_channels (id, name, description, user_limit) VALUES (?, ?, ?, ?)',
    [id, name, description || '', userLimit || 0]
  )
  return { id, name, description, userLimit }
}

// ===== Direct Messages =====
export async function getDMConversation(userId: string, targetUserId: string, limit = 50) {
  const db = getDatabase()
  return await db.all(
    `SELECT * FROM direct_messages
     WHERE deleted = 0 AND (
       (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
     )
     ORDER BY created_at DESC
     LIMIT ?`,
    [userId, targetUserId, targetUserId, userId, limit]
  )
}

export async function sendDirectMessage(
  senderId: string,
  receiverId: string,
  content: string
) {
  const db = getDatabase()
  const id = uuidv4()
  await db.run(
    'INSERT INTO direct_messages (id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)',
    [id, senderId, receiverId, content]
  )
  return {
    id,
    senderId,
    receiverId,
    content,
    read: false,
    created_at: new Date().toISOString()
  }
}

export async function getUnreadDMs(userId: string) {
  const db = getDatabase()
  const unreadConversations = await db.all(
    `SELECT DISTINCT sender_id as userId, COUNT(*) as unreadCount
     FROM direct_messages
     WHERE receiver_id = ? AND read = 0 AND deleted = 0
     GROUP BY sender_id`,
    [userId]
  )
  return unreadConversations
}

export async function markDMAsRead(senderId: string, receiverId: string) {
  const db = getDatabase()
  await db.run(
    'UPDATE direct_messages SET read = 1 WHERE sender_id = ? AND receiver_id = ? AND deleted = 0',
    [senderId, receiverId]
  )
  return { success: true }
}

export async function editDirectMessage(messageId: string, userId: string, newContent: string) {
  const db = getDatabase()
  const message = await db.get(
    'SELECT * FROM direct_messages WHERE id = ? AND sender_id = ? AND deleted = 0',
    [messageId, userId]
  )

  if (!message) {
    return { success: false, error: 'Zpráva nebyla nalezena nebo nemáš práva' }
  }

  await db.run(
    'UPDATE direct_messages SET content = ?, edited_at = CURRENT_TIMESTAMP WHERE id = ?',
    [newContent, messageId]
  )

  return { success: true, messageId, content: newContent }
}

export async function deleteDirectMessage(messageId: string, userId: string) {
  const db = getDatabase()
  const message = await db.get(
    'SELECT * FROM direct_messages WHERE id = ? AND sender_id = ? AND deleted = 0',
    [messageId, userId]
  )

  if (!message) {
    return { success: false, error: 'Zpráva nebyla nalezena nebo nemáš práva' }
  }

  await db.run('UPDATE direct_messages SET deleted = 1 WHERE id = ?', [messageId])

  return { success: true }
}

export async function getDMList(userId: string) {
  const db = getDatabase()
  const conversations = await db.all(
    `SELECT DISTINCT
      CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as other_user_id,
      MAX(created_at) as last_message_at,
      COUNT(CASE WHEN receiver_id = ? AND read = 0 THEN 1 END) as unread_count
     FROM direct_messages
     WHERE deleted = 0 AND (sender_id = ? OR receiver_id = ?)
     GROUP BY CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
     ORDER BY last_message_at DESC`,
    [userId, userId, userId, userId, userId]
  )

  // Načtení info o uživatelích
  const result = await Promise.all(
    conversations.map(async (conv: any) => {
      const otherUser = await db.get(
        'SELECT id, username, status, avatar FROM users WHERE id = ?',
        [conv.other_user_id]
      )
      return {
        userId: conv.other_user_id,
        user: otherUser,
        unreadCount: conv.unread_count,
        lastMessageAt: conv.last_message_at
      }
    })
  )

  return result
}

// ===== Message Reactions =====
export async function addReaction(
  messageId: string,
  userId: string,
  emoji: string
) {
  const db = getDatabase()
  const id = uuidv4()

  try {
    await db.run(
      'INSERT INTO message_reactions (id, message_id, user_id, emoji) VALUES (?, ?, ?, ?)',
      [id, messageId, userId, emoji]
    )
    return { success: true, id, emoji, userId }
  } catch (error) {
    return { success: false, error }
  }
}

export async function removeReaction(
  messageId: string,
  userId: string,
  emoji: string
) {
  const db = getDatabase()
  await db.run(
    'DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?',
    [messageId, userId, emoji]
  )
  return { success: true }
}

export async function getMessageReactions(messageId: string) {
  const db = getDatabase()
  return await db.all(
    'SELECT emoji, COUNT(*) as count FROM message_reactions WHERE message_id = ? GROUP BY emoji',
    [messageId]
  )
}

// ===== User List =====
export async function getAllUsers() {
  const db = getDatabase()
  return await db.all(
    'SELECT id, username, email, status, created_at FROM users ORDER BY username'
  )
}

export async function updateUserProfile(userId: string, data: any) {
  const db = getDatabase()
  const fields = []
  const values: any[] = []

  if (data.username !== undefined) {
    fields.push('username = ?')
    values.push(data.username)
  }
  if (data.avatar !== undefined) {
    fields.push('avatar = ?')
    values.push(data.avatar)
  }
  if (data.bio !== undefined) {
    fields.push('bio = ?')
    values.push(data.bio)
  }

  if (fields.length === 0) return

  values.push(userId)
  await db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)
}

// ===== Message Management =====
export async function editMessage(
  messageId: string,
  userId: string,
  newContent: string
) {
  const db = getDatabase()
  const message = await db.get(
    'SELECT * FROM messages WHERE id = ? AND author_id = ?',
    [messageId, userId]
  )

  if (!message) {
    return { success: false, error: 'Zpráva nebyla nalezena nebo nemáš práva' }
  }

  await db.run('UPDATE messages SET content = ?, edited_at = CURRENT_TIMESTAMP WHERE id = ?', [
    newContent,
    messageId,
  ])

  return { success: true, messageId }
}

export async function deleteMessage(messageId: string, userId: string) {
  const db = getDatabase()
  const message = await db.get(
    'SELECT * FROM messages WHERE id = ? AND author_id = ?',
    [messageId, userId]
  )

  if (!message) {
    return { success: false, error: 'Zpráva nebyla nalezena nebo nemáš práva' }
  }

  await db.run('DELETE FROM messages WHERE id = ?', [messageId])

  return { success: true }
}

// ===== Friend System =====
export async function sendFriendRequest(senderId: string, targetUserId: string) {
  const db = getDatabase()

  // Kontrola zda se jedná o stejného uživatele
  if (senderId === targetUserId) {
    return { success: false, error: 'Nemůžeš si přidat sebe' }
  }

  // Kontrola zda už je přátelé
  const existing = await db.get(
    'SELECT * FROM friends WHERE (user_id = ? AND friend_id = ? AND status = "accepted") OR (user_id = ? AND friend_id = ? AND status = "accepted")',
    [senderId, targetUserId, targetUserId, senderId]
  )

  if (existing) {
    return { success: false, error: 'Jste už přátelé' }
  }

  // Kontrola zda už je poslána žádost
  const pending = await db.get(
    'SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = "pending"',
    [senderId, targetUserId]
  )

  if (pending) {
    return { success: false, error: 'Žádost už byla poslána' }
  }

  const id = uuidv4()
  await db.run(
    'INSERT INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, ?)',
    [id, senderId, targetUserId, 'pending']
  )

  return { success: true, id }
}

export async function acceptFriendRequest(userId: string, requesterId: string) {
  const db = getDatabase()

  const request = await db.get(
    'SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = "pending"',
    [requesterId, userId]
  )

  if (!request) {
    return { success: false, error: 'Žádost nebyla nalezena' }
  }

  await db.run('UPDATE friends SET status = ? WHERE id = ?', ['accepted', request.id])

  // Vytvoření reverzní vazby
  const id = uuidv4()
  await db.run(
    'INSERT INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, ?)',
    [id, userId, requesterId, 'accepted']
  )

  return { success: true }
}

export async function declineFriendRequest(userId: string, requesterId: string) {
  const db = getDatabase()

  const request = await db.get(
    'SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = "pending"',
    [requesterId, userId]
  )

  if (!request) {
    return { success: false, error: 'Žádost nebyla nalezena' }
  }

  await db.run('DELETE FROM friends WHERE id = ?', [request.id])

  return { success: true }
}

export async function removeFriend(userId: string, friendId: string) {
  const db = getDatabase()

  await db.run(
    'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
    [userId, friendId, friendId, userId]
  )

  return { success: true }
}

export async function getFriendsList(userId: string) {
  const db = getDatabase()

  const friends = await db.all(
    `SELECT u.id, u.username, u.status, u.avatar
     FROM friends f
     JOIN users u ON (f.friend_id = u.id)
     WHERE f.user_id = ? AND f.status = 'accepted'`,
    [userId]
  )

  return friends
}

export async function getPendingRequests(userId: string) {
  const db = getDatabase()

  const requests = await db.all(
    `SELECT u.id, u.username, u.avatar
     FROM friends f
     JOIN users u ON (f.user_id = u.id)
     WHERE f.friend_id = ? AND f.status = 'pending'`,
    [userId]
  )

  return requests
}

export async function getSentRequests(userId: string) {
  const db = getDatabase()

  const requests = await db.all(
    `SELECT u.id, u.username, u.avatar
     FROM friends f
     JOIN users u ON (f.friend_id = u.id)
     WHERE f.user_id = ? AND f.status = 'pending'`,
    [userId]
  )

  return requests
}

export async function blockUser(userId: string, blockUserId: string) {
  const db = getDatabase()
  const id = uuidv4()

  try {
    await db.run(
      'INSERT INTO blocked_users (id, user_id, blocked_user_id) VALUES (?, ?, ?)',
      [id, userId, blockUserId]
    )
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

export async function unblockUser(userId: string, blockedUserId: string) {
  const db = getDatabase()

  await db.run(
    'DELETE FROM blocked_users WHERE user_id = ? AND blocked_user_id = ?',
    [userId, blockedUserId]
  )

  return { success: true }
}

export async function getBlockedUsers(userId: string) {
  const db = getDatabase()

  return await db.all(
    `SELECT u.id, u.username, u.avatar
     FROM blocked_users b
     JOIN users u ON (b.blocked_user_id = u.id)
     WHERE b.user_id = ?`,
    [userId]
  )
}

export async function isUserBlocked(userId: string, targetUserId: string): Promise<boolean> {
  const db = getDatabase()

  const blocked = await db.get(
    'SELECT * FROM blocked_users WHERE user_id = ? AND blocked_user_id = ?',
    [userId, targetUserId]
  )

  return !!blocked
}

// ===== Message Search =====
export async function searchMessages(
  userId: string,
  query: string,
  channel?: string,
  limit = 50
) {
  const db = getDatabase()

  let sql = `
    SELECT * FROM messages
    WHERE author_id = ? AND content LIKE ? AND deleted = 0
  `
  const params: any[] = [userId, `%${query}%`]

  if (channel) {
    sql += ` AND channel = ?`
    params.push(channel)
  }

  sql += ` ORDER BY created_at DESC LIMIT ?`
  params.push(String(limit))

  return await db.all(sql, params)
}

export async function searchDMs(
  userId: string,
  query: string,
  targetUserId?: string,
  limit = 50
) {
  const db = getDatabase()

  let sql = `
    SELECT * FROM direct_messages
    WHERE deleted = 0 AND content LIKE ?
    AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
  `
  const params = [
    `%${query}%`,
    userId,
    targetUserId || '%',
    targetUserId || '%',
    userId,
  ]

  sql += ` ORDER BY created_at DESC LIMIT ?`
  params.push(String(limit))

  return await db.all(sql, params)
}

export async function searchUsers(query: string, limit = 20) {
  const db = getDatabase()

  return await db.all(
    `SELECT id, username, status, avatar FROM users
     WHERE username LIKE ? AND deleted = 0
     ORDER BY username
     LIMIT ?`,
    [`%${query}%`, limit]
  )
}
