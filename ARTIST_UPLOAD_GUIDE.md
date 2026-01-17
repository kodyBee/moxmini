# Artist Image Upload - Quick Start Guide

## What Changed

Artists can now **upload images directly from their device** instead of pasting URLs! 🎨

## Setup (One-Time)

### 1. Install the package
```bash
npm install @vercel/blob
```

### 2. Enable Blob Storage in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Storage** tab → **Create Database** → **Blob**

### 3. Get environment variables for local development
```bash
vercel env pull .env.local
```

That's it! The `BLOB_READ_WRITE_TOKEN` is automatically set.

## How to Use (Artist Instructions)

### Adding a New Product

1. Log in to the admin panel at `/admin/login`
2. Go to **Manage Prepainted Miniatures**
3. Click **"Add New Product"**
4. Fill in the product details:
   - Product Name
   - SKU
   - Price
   - Original Price
   - Description
5. **Click "Choose File"** under "Product Image"
6. Select an image from your device
7. See the preview appear
8. Click **"Create Product"**

### Image Requirements

- ✅ **Formats**: JPG, PNG, GIF, WebP
- ✅ **Max size**: 5MB
- ✅ **Resolution**: Any (but 1000x1000px+ recommended)

### Editing a Product

1. Find the product in the list
2. Click **"Edit"**
3. To change the image:
   - Click **"Choose File"** again
   - Select a new image
   - The old image will be automatically deleted
4. Click **"Update Product"**

## What Happens Behind the Scenes

1. Image is uploaded to Vercel Blob Storage
2. Gets a permanent public URL (e.g., `https://abc123.public.blob.vercel-storage.com/premade/image.jpg`)
3. URL is saved to your Neon database
4. Image is served via Vercel's global CDN (super fast!)
5. Old images are automatically cleaned up when replaced

## Troubleshooting

### "Upload failed"
- Check file is under 5MB
- Make sure it's an image file
- Verify you're logged in

### "Image not showing"
- Wait a few seconds (upload may still be processing)
- Refresh the page
- Check browser console for errors

### Local development issues
- Run `vercel env pull .env.local` to get the token
- Restart your dev server: `npm run dev`

## Storage Costs

- **Included**: 1GB free on Vercel Hobby plan
- **Additional**: $0.15/GB per month
- **Bandwidth**: Included (no extra cost)

A typical product image is ~200KB, so 1GB = ~5,000 images!

## Need Help?

Check the detailed setup guide: [BLOB_STORAGE_SETUP.md](./BLOB_STORAGE_SETUP.md)
