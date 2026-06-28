import React, { useState } from 'react'
import '../styles/ReactionPicker.css'

const EMOJIS = [
  '👍', '❤️', '😂', '😮', '😢', '🔥',
  '👏', '🎉', '💯', '✨', '🚀', '💪',
  '😍', '🤔', '👀', '💬', '🎯', '📌',
]

interface ReactionPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  return (
    <div className="reaction-picker-backdrop" onClick={onClose}>
      <div className="reaction-picker" onClick={(e) => e.stopPropagation()}>
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            className="reaction-btn"
            onClick={() => {
              onSelect(emoji)
              onClose()
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
