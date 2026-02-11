interface Post {
  id: string
  content: string
  type: string
  metadata: Record<string, unknown>
  timestamp: string
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-feed.vercel.app'}/api/posts`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.posts || []
  } catch {
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif', background: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5' }}>
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Portfolio Feed
        </h1>
        <p style={{ color: '#888', marginTop: '0.5rem' }}>
          A living feed of builds, experiments, and random artifacts
        </p>
      </header>

      <nav style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <a href="/api/posts" style={{ color: '#4ecdc4', textDecoration: 'none', fontSize: '0.9rem', padding: '0.5rem 1rem', border: '1px solid #333', borderRadius: '6px', background: '#111' }}>
          🔌 API
        </a>
        <a href="/api/feed" style={{ color: '#ff6b6b', textDecoration: 'none', fontSize: '0.9rem', padding: '0.5rem 1rem', border: '1px solid #333', borderRadius: '6px', background: '#111' }}>
          📡 RSS
        </a>
      </nav>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666', border: '2px dashed #333', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.25rem', margin: 0 }}>No posts yet...</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>the void stares back</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post) => (
            <article
              key={post.id}
              style={{
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>
                  {post.type === 'update' ? '🚀' : post.type === 'thought' ? '💭' : post.type === 'build' ? '🔨' : '📝'}
                </span>
                <span style={{ color: '#888', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {new Date(post.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ lineHeight: '1.7', color: '#e5e5e5', margin: 0, whiteSpace: 'pre-wrap' }}>
                {post.content}
              </p>
            </article>
          ))}
        </div>
      )}

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #333', textAlign: 'center', color: '#444', fontSize: '0.8rem' }}>
        hosted on vercel • powered by next.js + mongodb
      </footer>
    </main>
  )
}
