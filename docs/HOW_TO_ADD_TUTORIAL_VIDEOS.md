# How to Add Video Tutorials

## Quick Guide

The Video Tutorials page is now set up to support external links. You can easily add YouTube, Vimeo, or any external video links.

## How to Add a Video URL

1. **Open the file:** `src/app/(app)/docs/tutorials/page.tsx`

2. **Find the tutorial you want to update** in the `tutorials` array

3. **Add the `url` field** with your video link:

```typescript
{
  title: 'Getting Started with UnifiedBizOS',
  description: 'A complete overview of the platform and its main features.',
  duration: '5 min',
  category: 'Basics',
  thumbnail: '🎬',
  url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // ← Add your URL here
},
```

## Supported URL Formats

### YouTube (Recommended)
```typescript
url: 'https://www.youtube.com/watch?v=VIDEO_ID'
// or
url: 'https://youtu.be/VIDEO_ID'
```

### Vimeo
```typescript
url: 'https://vimeo.com/VIDEO_ID'
```

### Local Video Files
If you want to host videos locally, upload them to:
```
public/videos/tutorials/your-video.mp4
```

Then use:
```typescript
url: '/videos/tutorials/your-video.mp4'
```

⚠️ **Note:** Vercel has file size limits (100MB free tier). For large videos, use YouTube/Vimeo.

### External Links
```typescript
url: 'https://your-tutorial-page.com'
url: 'https://your-blog.com/tutorial'
```

## How It Works

- **With URL:** Clicking the tutorial card opens the video/link in a new tab
- **Without URL:** Clicking shows a "Coming Soon" dialog
- **Visual Indicator:** Tutorials with URLs show an "Available" badge

## Example

Here's a complete example with a YouTube video:

```typescript
{
  title: 'Getting Started with UnifiedBizOS',
  description: 'A complete overview of the platform and its main features.',
  duration: '5 min',
  category: 'Basics',
  thumbnail: '🎬',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Your YouTube video
},
```

## Tips

- You can add URLs one at a time as videos are created
- Leave `url: undefined` for tutorials not ready yet
- All URLs open in a new tab for better user experience
- The "Available" badge automatically appears when a URL is added

---

*That's it! Just update the `url` field and your tutorial will be clickable.*

