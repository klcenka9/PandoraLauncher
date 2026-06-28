import React, { useState } from 'react'
import '../styles/MessageReactions.css'
import ReactionPicker from './ReactionPicker'

interface Reaction {
  emoji: string
  count: number
  userReacted: boolean
}

interface MessageReactionsProps {
  reactions: Reaction[]
  onAddReaction: (emoji: string) => void
  onRemoveReaction: (emoji: string) => void
  canReact?: boolean
}

export default function MessageReactions({
  reactions,
  onAddReaction,
  onRemoveReaction,
  canReact = true,
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)

  const handleReactionClick = (emoji: string, userReacted: boolean) => {
    if (userReacted) {
      onRemoveReaction(emoji)
    } else {
      onAddReaction(emoji)
    }
  }

  return (
    <div className="message-reactions">
      {reactions.length > 0 && (
        <div className="reactions-list">
          {reactions.map((reaction) => (
            <button
              key={reaction.emoji}
              className={`reaction ${reaction.userReacted ? 'user-reacted' : ''}`}
              onClick={() => handleReactionClick(reaction.emoji, reaction.userReacted)}
              title={`${reaction.count} ${reaction.emoji}`}
            >
              <span className="emoji">{reaction.emoji}</span>
              <span className="count">{reaction.count}</span>
            </button>
          ))}
        </div>
      )}

      {canReact && (
        <div className="add-reaction">
          <button className="add-btn" onClick={() => setShowPicker(!showPicker)}>
            +
          </button>
          {showPicker && (
            <ReactionPicker
              onSelect={onAddReaction}
              onClose={() => setShowPicker(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
