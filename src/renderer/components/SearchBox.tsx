import React, { useState, useEffect } from 'react'
import '../styles/SearchBox.css'

interface SearchResult {
  id: string
  content?: string
  username?: string
  [key: string]: any
}

interface SearchBoxProps {
  token: string
  onSearchMessages?: (results: SearchResult[]) => void
  onSearchUsers?: (results: SearchResult[]) => void
  onClose: () => void
}

export default function SearchBox({
  token,
  onSearchMessages,
  onSearchUsers,
  onClose,
}: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'messages' | 'users'>('messages')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length > 2) {
      performSearch()
    } else {
      setResults([])
    }
  }, [query, searchType])

  const performSearch = async () => {
    setLoading(true)
    try {
      const endpoint =
        searchType === 'messages' ? '/api/search/messages' : '/api/search/users'
      const response = await fetch(
        `http://localhost:3001${endpoint}?q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setResults(data.results)

        if (searchType === 'messages') {
          onSearchMessages?.(data.results)
        } else {
          onSearchUsers?.(data.results)
        }
      }
    } catch (error) {
      console.error('Chyba při hledání:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <input
            type="text"
            placeholder="Hledat zprávy nebo uživatele..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="search-input"
          />
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="search-tabs">
          <button
            className={`tab ${searchType === 'messages' ? 'active' : ''}`}
            onClick={() => setSearchType('messages')}
          >
            💬 Zprávy
          </button>
          <button
            className={`tab ${searchType === 'users' ? 'active' : ''}`}
            onClick={() => setSearchType('users')}
          >
            👥 Uživatelé
          </button>
        </div>

        <div className="search-results">
          {loading && <p className="loading">Hledám...</p>}
          {!loading && results.length === 0 && query.length > 2 && (
            <p className="no-results">Nic nenalezeno</p>
          )}
          {results.map((result) => (
            <div key={result.id} className="search-result">
              {searchType === 'messages' ? (
                <>
                  <div className="result-icon">💬</div>
                  <div className="result-content">
                    <p className="result-text">{result.content}</p>
                    <p className="result-meta">#{result.channel}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="result-icon">👤</div>
                  <div className="result-content">
                    <p className="result-text">{result.username}</p>
                    <p className="result-meta">{result.status}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
