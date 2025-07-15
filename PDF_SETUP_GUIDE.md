# 📁 PDF Setup Guide - Cosmic Daily Planner

## 🎯 **Quick Setup**

You need to add **12 zodiac PDF files** to make your system work.

### **Step 1: Check Current Status**
```bash
node scripts/pdf-helper.js check
```
This shows which PDF files are missing.

### **Step 2: Create Test Files (Optional)**
```bash
node scripts/pdf-helper.js test
```
This creates placeholder PDF files for testing.

### **Step 3: Add Your Real PDFs**
Replace the test files with your actual zodiac calendars.

## 📂 **Required Files**

Place these **exact filenames** in `public/pdfs/`:

| Zodiac Sign | Filename | Status |
|------------|----------|--------|
| Aries ♈ | `aries-calendar.pdf` | ❌ Missing |
| Taurus ♉ | `taurus-calendar.pdf` | ❌ Missing |
| Gemini ♊ | `gemini-calendar.pdf` | ❌ Missing |
| Cancer ♋ | `cancer-calendar.pdf` | ❌ Missing |
| Leo ♌ | `leo-calendar.pdf` | ❌ Missing |
| Virgo ♍ | `virgo-calendar.pdf` | ❌ Missing |
| Libra ♎ | `libra-calendar.pdf` | ❌ Missing |
| Scorpio ♏ | `scorpio-calendar.pdf` | ❌ Missing |
| Sagittarius ♐ | `sagittarius-calendar.pdf` | ❌ Missing |
| Capricorn ♑ | `capricorn-calendar.pdf` | ❌ Missing |
| Aquarius ♒ | `aquarius-calendar.pdf` | ❌ Missing |
| Pisces ♓ | `pisces-calendar.pdf` | ❌ Missing |

## 🔄 **How to Add Your PDFs**

### **Method 1: Drag & Drop**
1. Open your file explorer
2. Navigate to `public/pdfs/` folder
3. Drag your PDF files into the folder
4. Rename them to match the exact names above

### **Method 2: Copy & Rename**
1. Copy your zodiac PDF files
2. Paste them in `public/pdfs/`
3. Right-click → Rename to exact filenames
4. Make sure they're all lowercase with hyphens

## 🧪 **Testing Your Setup**

### **1. Check Files**
```bash
node scripts/pdf-helper.js check
```

### **2. Test the App**
```bash
npm run dev
```

### **3. Try the Free Calendar**
1. Fill out the form
2. Select any zodiac sign
3. Click "Get Free Calendar"
4. Check browser console for logs

## ✅ **Verification Checklist**

- [ ] All 12 PDF files are in `public/pdfs/`
- [ ] Filenames match exactly (lowercase, hyphens)
- [ ] Files open properly when clicked
- [ ] Test email system works
- [ ] All zodiac signs show correct PDFs

## 🚀 **Production Deployment**

When ready for Hostinger:
1. Upload entire `public/pdfs/` folder
2. Files will be at: `https://yourdomain.com/pdfs/aries-calendar.pdf`
3. Email system will work automatically

## 🆘 **Need Help?**

**Common Issues:**
- **Wrong filename**: Must be exact (lowercase, hyphens)
- **Wrong location**: Must be in `public/pdfs/` folder
- **File not opening**: Check if PDF is corrupted
- **Email not sending**: Check console logs

**File Size Limits:**
- Recommended: Under 10MB per PDF
- Maximum: 25MB per PDF
- Total: Under 300MB for all files

## 📝 **Example File Structure**
```
public/pdfs/
├── aries-calendar.pdf          ✅
├── taurus-calendar.pdf         ✅
├── gemini-calendar.pdf         ✅
├── cancer-calendar.pdf         ✅
├── leo-calendar.pdf            ✅
├── virgo-calendar.pdf          ✅
├── libra-calendar.pdf          ✅
├── scorpio-calendar.pdf        ✅
├── sagittarius-calendar.pdf    ✅
├── capricorn-calendar.pdf      ✅
├── aquarius-calendar.pdf       ✅
└── pisces-calendar.pdf         ✅
```

**Your system is ready when all files show ✅** 