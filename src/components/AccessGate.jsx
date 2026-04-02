import { useState } from 'react'

const VALID_CODES = [
  'TANGERINE', 'WATERMELON', 'NECTARINE', 'GRAPEFRUIT',
  'CRANBERRY', 'LIME', 'FEIJOA', 'BLUEBERRY',
  'DRAGONFRUIT', 'BLACKBERRY', 'PLUM', 'COCONUT'
]

export default function AccessGate({ children }) {
  const [input, setInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)

  function handleSubmit() {
    if (VALID_CODES.includes(input.trim().toUpperCase())) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (unlocked) return children

  return (
    <div className="access-gate">
      <p className="access-gate-label">Got a beta code? Unlock your download.</p>
      <div className="access-gate-row">
        <input
          className={`access-gate-input ${error ? 'access-gate-input--error' : ''}`}
          type="text"
          placeholder="Your code"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          maxLength={12}
          autoCapitalize="characters"
        />
        <button className="access-gate-btn" onClick={handleSubmit}>
          Unlock ✦
        </button>
      </div>
      {error && <p className="access-gate-error">That code doesn't look right</p>}
    </div>
  )
}