# 🚀 Vercel Blob Storage Setup Guide

This guide will help you set up Vercel Blob storage for your zodiac calendar PDFs on Vercel hosting.

## 📋 Prerequisites

- Vercel account with a deployed project
- PDF files ready for upload
- Vercel CLI installed (`npm i -g vercel`)

## 🔧 Step 1: Create Vercel Blob Storage

### 1.1 Access Your Project Dashboard
1. Go to [vercel.com](https://vercel.com) and log in
2. Navigate to your project dashboard
3. Click on the **Storage** tab

### 1.2 Create Blob Store
1. Click **"Connect Database"** button
2. Under **"Create New"** tab, select **"Blob"**
3. Click **"Continue"**
4. Give your store a name (e.g., "zodiac-pdfs")
5. Select **"Create a new Blob store"**
6. Choose environments (Production, Preview, Development)
7. Click **"Create"**

### 1.3 Get Environment Variables
After creation, Vercel automatically adds:
- `BLOB_READ_WRITE_TOKEN` - Your blob storage token

## 🔑 Step 2: Set Up Local Environment

### 2.1 Pull Environment Variables
```bash
# Make sure you're in your project directory
cd cosmic-daily-planner

# Pull environment variables from Vercel
vercel env pull
```

This creates a `.env.local` file with your `BLOB_READ_WRITE_TOKEN`.

### 2.2 Verify Environment Setup
```bash
# Check if the token is available
echo $BLOB_READ_WRITE_TOKEN
```

## 📁 Step 3: Prepare Your PDF Files

### 3.1 Create PDFs Directory
```bash
mkdir pdfs
```

### 3.2 Add Your PDF Files
Place your PDF files in the `pdfs/` directory with these exact names:
- `aries-calendar.pdf`
- `taurus-calendar.pdf`
- `gemini-calendar.pdf`
- `cancer-calendar.pdf`
- `leo-calendar.pdf`
- `virgo-calendar.pdf`
- `libra-calendar.pdf`
- `scorpio-calendar.pdf`
- `sagittarius-calendar.pdf`
- `capricorn-calendar.pdf`
- `aquarius-calendar.pdf`
- `pisces-calendar.pdf`

### 3.3 Verify Files
```bash
ls pdfs/
```

You should see all 12 PDF files listed.

## ⬆️ Step 4: Upload PDFs to Vercel Blob

### 4.1 Run Upload Script
```bash
node scripts/pdf-upload-to-blob.js
```

The script will:
- ✅ Check for environment variables
- ✅ Verify PDF files exist
- ⬆️ Upload each PDF to Vercel Blob
- 📝 Update `zodiacPdfMapping.ts` with Blob URLs
- 📊 Show upload summary

### 4.2 Expected Output
```
🚀 Starting PDF upload to Vercel Blob...
📄 Found aries-calendar.pdf
📄 Found taurus-calendar.pdf
...
⬆️  Uploading aries-calendar.pdf to Vercel Blob...
✅ Successfully uploaded aries-calendar.pdf
   URL: https://your-blob-url.vercel-storage.com/zodiac-calendars/aries-calendar.pdf
...
📝 Generating updated zodiac mapping...
✅ Updated zodiacPdfMapping.ts with Blob URLs
📊 Upload Summary:
✅ Successful uploads: 12
❌ Failed uploads: 0
🎉 All PDFs uploaded successfully!
```

## 🧪 Step 5: Test Your Setup

### 5.1 Check Blob Dashboard
1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Select your blob store
4. You should see all 12 PDF files in the `zodiac-calendars/` folder

### 5.2 Test PDF URLs
The URLs will look like:
```
https://your-store-id.public.blob.vercel-storage.com/zodiac-calendars/aries-calendar.pdf
```

### 5.3 Test Email System
```bash
# Start your development server
npm run dev

# Test the free calendar system
# Go to http://localhost:3000 and try getting a free calendar
```

## 🚀 Step 6: Deploy to Production

### 6.1 Commit and Push Changes
```bash
git add .
git commit -m "Add Vercel Blob storage for PDFs"
git push origin main
```

### 6.2 Verify Deployment
1. Your app will automatically deploy on Vercel
2. Test the live site with the free calendar feature
3. Check that PDFs are being sent via email

## 📊 Step 7: Monitor Usage

### 7.1 Blob Observability
- Go to your Vercel dashboard
- Click **Observability** tab
- Select **Blob** to see:
  - Data transfer usage
  - Download volume
  - API operations
  - Cache activity

### 7.2 Usage Limits
**Free Plan:**
- 1 GB storage
- 10 GB data transfer
- 10,000 simple operations
- 2,000 advanced operations

**Pro Plan:**
- 5 GB storage (included)
- 100 GB data transfer (included)
- Additional usage billed per GB/operation

## 🛠️ Troubleshooting

### Common Issues

#### ❌ "BLOB_READ_WRITE_TOKEN not found"
```bash
# Pull environment variables again
vercel env pull

# Or manually add to .env.local
echo "BLOB_READ_WRITE_TOKEN=your-token-here" >> .env.local
```

#### ❌ "PDF files not found"
```bash
# Check if files exist
ls -la pdfs/

# Verify exact filenames (case-sensitive)
```

#### ❌ "Upload failed"
- Check internet connection
- Verify Vercel account has blob storage enabled
- Check file sizes (max 5TB per file)

#### ❌ "Email not working"
- Verify PDF URLs are accessible
- Check email service configuration
- Test with mock email service first

### Getting Help

1. **Vercel Docs**: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)
2. **Vercel Support**: Available in your dashboard
3. **Community**: [vercel.com/community](https://vercel.com/community)

## 🎯 Next Steps

After successful setup:

1. **Test thoroughly** - Try all zodiac signs
2. **Set up real email service** - Replace mock with SendGrid/Nodemailer
3. **Add PayPal integration** - For premium subscriptions
4. **Monitor usage** - Keep track of blob storage costs
5. **Optimize PDFs** - Compress files to reduce storage/transfer costs

## 🔐 Security Notes

- ✅ Blob URLs are public but unguessable
- ✅ Upload requires authentication token
- ✅ Files are served via Vercel's CDN
- ✅ Automatic HTTPS encryption
- ⚠️ Don't commit `.env.local` to git

## 💰 Cost Optimization

- **Compress PDFs** before uploading
- **Use caching** (automatically handled by Vercel)
- **Monitor usage** in the dashboard
- **Consider file sizes** - smaller files = lower costs

---

🎉 **Congratulations!** Your zodiac calendar system is now powered by Vercel Blob storage and ready for production use! 