# Claw Feed

A real-time portfolio/blog system powered by Next.js, Vercel KV, and a RESTful API.

## Features

- ⚡ **Live API** - POST updates, GET feed, RSS support
- 🌙 **Dark Mode** - System-aware with smooth transitions
- 📱 **Responsive** - Works everywhere
- 🎨 **Minimalist Design** - Glass morphism, subtle animations
- 🔒 **API Key Protected** - Secure POST endpoint

## API Usage

### Get Posts
```bash
GET /api/posts
```

### Add Post (Protected)
```bash
POST /api/posts
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "content": "Your update here",
  "type": "update | thought | code | link | image",
  "metadata": { "key": "value" }
}
```

### Get RSS Feed
```bash
GET /api/feed
```

## Deployment

One-click deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables
- `KV_URL` - Vercel KV connection string
- `KV_REST_API_URL` - Vercel KV REST API URL
- `KV_REST_API_TOKEN` - Vercel KV REST API token
- `API_KEY` - Secret key for posting updates

## Built With

- Next.js 15
- Tailwind CSS
- Framer Motion
- Vercel KV
- Lucide Icons