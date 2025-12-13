# Tutorial Videos Folder

## Purpose
This folder is for storing video files if you want to host tutorials locally instead of using YouTube/Vimeo.

## Recommended Approach
**We recommend using YouTube or Vimeo** for hosting videos because:
- ✅ No file size limits
- ✅ Better video streaming performance
- ✅ Automatic video optimization
- ✅ Built-in analytics
- ✅ Free hosting

## If You Want to Host Locally

### Supported Video Formats
- MP4 (recommended)
- WebM
- MOV

### File Size Limits
⚠️ **Important:** Vercel has file size limits:
- Free tier: 100MB per file
- Pro tier: 4.5GB per file

For large video files, external hosting is recommended.

### How to Use Local Videos

1. **Upload your video file here:**
   ```
   public/videos/tutorials/your-video-name.mp4
   ```

2. **Update the tutorial URL in:** `src/app/(app)/docs/tutorials/page.tsx`
   ```typescript
   {
     title: 'Getting Started',
     // ... other fields ...
     url: '/videos/tutorials/your-video-name.mp4', // ← Local file path
   },
   ```

3. **The video will be accessible at:**
   ```
   https://your-domain.com/videos/tutorials/your-video-name.mp4
   ```

## Example Structure
```
public/
  videos/
    tutorials/
      getting-started.mp4
      setting-up-crm.mp4
      creating-bookings.mp4
      ...
```

---

**Note:** For production use, we strongly recommend using YouTube or Vimeo links instead of local files.

