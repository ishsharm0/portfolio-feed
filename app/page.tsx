interface Post {
  _id: string
  title: string
  content: string
  author: string
  createdAt: string
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, {
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
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
        Portfolio Feed v2
      </h1>
      
      <div style={{ marginBottom: '2rem', color: '#666' }}>
        <a href="/api/feed" style={{ color: '#0066cc', textDecoration: 'none' }}>
          📡 RSS Feed
        </a>
      </div>
      
      {posts.length === 0 ? (
        <p style={{ color: '#666' }}>No posts yet. Add some via the API!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post) => (
            <article key={post._id} style={{ 
              border: '1px solid #e1e4e8', 
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#fafafa'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                {post.title}
              </h2>
              <p style={{ 
                color: '#666', 
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p style={{ lineHeight: '1.6', color: '#333' }}>
                {post.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
