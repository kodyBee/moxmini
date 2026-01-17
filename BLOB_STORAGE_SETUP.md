# Vercel Blob Storage Setup Guide

This guide will help you set up Vercel Blob Storage for image uploads in your application.

## Prerequisites

- A Vercel account with your project deployed or connected
- Your Next.js application

## Step 1: Enable Blob Storage in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Blob** from the storage options
6. Click **Continue** and follow the prompts to enable Blob Storage

## Step 2: Install Vercel Blob Package

Run this command in your project directory:

```bash
npm install @vercel/blob
```

## Step 3: Configure Environment Variables

Vercel automatically adds the `BLOB_READ_WRITE_TOKEN` environment variable to your project when you enable Blob Storage.

For local development:
1. Go to your project settings in Vercel
2. Navigate to **Settings** > **Environment Variables**
3. Find the `BLOB_READ_WRITE_TOKEN`
4. Click **"Pull"** or copy the value
5. Add it to your `.env.local` file:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

Or simply run:
```bash
vercel env pull .env.local
```

## Step 4: Test the Upload

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin products page (you may need to log in first)
3. Try creating a new product and uploading an image
4. Check your Vercel Dashboard > Storage > Blob to verify the upload

## How It Works

Uploaded images are stored in Vercel's Blob Storage with:
- Automatic CDN distribution for fast loading worldwide
- Public URLs that are instantly accessible
- Organized folder structure (`premade/` for pre-painted miniatures)

### Folder Structure

Uploaded images will be organized as:
```
premade/
  ├── 1234567890-abc123.jpg
  ├── 1234567891-def456.png
  └── ...
```

## File Specifications

- **Supported formats**: JPG, PNG, GIF, WebP
- **Max file size**: 5MB (configurable in the form)
- **Storage**: Unlimited on paid plans, 1GB on Hobby plan

## Troubleshooting

### Upload Fails
- **Check file size**: Ensure images are under 5MB
- **Check file type**: Only image files are allowed
- **Check environment variable**: Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- **Check browser console**: Look for detailed error messages

### Images Don't Display
- Verify the returned URL is accessible
- Check network tab in browser dev tools
- Ensure the upload completed successfully

### Local Development Issues
- Make sure you've pulled the environment variables: `vercel env pull .env.local`
- Restart your dev server after adding environment variables
- Check that the token starts with `vercel_blob_rw_`

## Pricing

- **Hobby Plan**: 1GB storage included, $0.15/GB thereafter
- **Pro Plan**: 1GB included, $0.15/GB thereafter
- **Enterprise**: Custom pricing

Bandwidth is included with your Vercel plan.

## Security Notes

- The `BLOB_READ_WRITE_TOKEN` gives full read/write access to your Blob Storage
- Keep this token secret and never commit it to version control
- Blob URLs are public by default (anyone with the URL can access the image)
- Consider implementing authentication checks before allowing uploads

## Deployment

When you deploy to Vercel:
1. The `BLOB_READ_WRITE_TOKEN` is automatically available
2. No additional configuration needed
3. Images uploaded in production are separate from development

## Optional: Configure Custom Domains

You can configure custom domains for your blob storage in Vercel project settings for branded URLs.

---

For more information, visit the [Vercel Blob documentation](https://vercel.com/docs/storage/vercel-blob).

