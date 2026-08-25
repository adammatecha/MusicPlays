import { useEffect, useState, useRef } from 'react'
import { DiscordSDK } from '@discord/embedded-app-sdk'
import './App.css'

const CLIENT_ID = '1508856871346245904'

function App() {
  const [discordSdk, setDiscordSdk] = useState<DiscordSDK | null>(null)
  const [username, setUsername] = useState<string>('Loading...')
  const [url, setUrl] = useState('')
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const sdk = new DiscordSDK(CLIENT_ID)
    setDiscordSdk(sdk)

    async function setup() {
      try {
        await sdk.ready()
        setIsReady(true)

        // Try to get basic user info without full OAuth if possible
        // Full auth needs a backend for token exchange – for static hosting we keep it simple
        try {
          const { code } = await sdk.commands.authorize({
            client_id: CLIENT_ID,
            response_type: 'code',
            state: '',
            prompt: 'none',
            scope: ['identify', 'guilds'],
          })
          // Note: without backend we can't exchange the code.
          // We still show the player. Username will stay generic.
          console.log('Authorize code received (needs backend to exchange):', code ? 'yes' : 'no')
        } catch (e) {
          console.log('Authorize skipped or failed (normal for pure static):', e)
        }

        setUsername('MusicPlays User')
      } catch (err) {
        console.error('Discord SDK error:', err)
        setError('Nepodařilo se připojit k Discordu. Spusť Activity z Discordu.')
        setIsReady(true) // still show UI for testing outside Discord
      }
    }

    setup()
  }, [])

  function extractYouTubeId(input: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    for (const p of patterns) {
      const m = input.match(p)
      if (m) return m[1]
    }
    return null
  }

  function handlePlay() {
    const trimmed = url.trim()
    if (!trimmed) return

    // YouTube
    const ytId = extractYouTubeId(trimmed)
    if (ytId) {
      setEmbedUrl(`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`)
      setError(null)
      return
    }

    // Spotify track / playlist / album (open embed)
    if (trimmed.includes('open.spotify.com')) {
      // Convert to embed
      const embed = trimmed.replace('open.spotify.com', 'open.spotify.com/embed')
      setEmbedUrl(embed)
      setError(null)
      return
    }

    // Direct audio link
    if (trimmed.match(/\.(mp3|ogg|wav|m4a)(\?|$)/i)) {
      setEmbedUrl(null)
      // We could use <audio> but for simplicity show message
      setError('Přímé audio odkazy zatím podporujeme přes YouTube/Spotify embed.')
      return
    }

    setError('Podporujeme YouTube a Spotify odkazy. Zkus např. https://youtu.be/...')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handlePlay()
  }

  return (
    <div className="app">
      <div className="bg-stars"></div>

      <header className="header">
        <div className="logo">
          <div className="logo-icon">🎧</div>
          <div>
            <h1>MusicPlays</h1>
            <p className="subtitle">Listen together in Discord</p>
          </div>
        </div>
        <div className="user-info">
          {isReady ? (username || 'Připraveno') : 'Připojování...'}
        </div>
      </header>

      <main className="main">
        <div className="player-card">
          <div className="input-row">
            <input
              ref={inputRef}
              type="text"
              placeholder="Vlož YouTube nebo Spotify odkaz..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="url-input"
            />
            <button onClick={handlePlay} className="play-btn">
              ▶ Hrát
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="embed-container">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Music player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="embed"
              />
            ) : (
              <div className="placeholder">
                <div className="galaxy">🌌</div>
                <p>Vlož odkaz na skladbu a pusť si ji tady společně s kamarády</p>
                <p className="hint">Funguje s YouTube a Spotify</p>
              </div>
            )}
          </div>
        </div>

        <div className="tips">
          <h3>Tipy</h3>
          <ul>
            <li>YouTube: zkopíruj odkaz na video</li>
            <li>Spotify: otevři skladbu → Share → Copy link</li>
            <li>Activity běží uvnitř Discordu – všichni v callu ji vidí</li>
          </ul>
        </div>
      </main>

      <footer className="footer">
        MusicPlays • Discord Activity
      </footer>
    </div>
  )
}

export default App
