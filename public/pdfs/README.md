# Zodiac PDF Files

This directory contains the personalized astrology calendar PDF files for each zodiac sign.

## Required Files

Please place your zodiac PDF files in this directory with the following exact names:

- `aries-calendar.pdf` - For Aries ♈ customers
- `taurus-calendar.pdf` - For Taurus ♉ customers  
- `gemini-calendar.pdf` - For Gemini ♊ customers
- `cancer-calendar.pdf` - For Cancer ♋ customers
- `leo-calendar.pdf` - For Leo ♌ customers
- `virgo-calendar.pdf` - For Virgo ♍ customers
- `libra-calendar.pdf` - For Libra ♎ customers
- `scorpio-calendar.pdf` - For Scorpio ♏ customers
- `sagittarius-calendar.pdf` - For Sagittarius ♐ customers
- `capricorn-calendar.pdf` - For Capricorn ♑ customers
- `aquarius-calendar.pdf` - For Aquarius ♒ customers
- `pisces-calendar.pdf` - For Pisces ♓ customers

## File Requirements

- **Format**: PDF files only
- **Size**: Recommended maximum 10MB per file
- **Quality**: High resolution for printing
- **Naming**: Use exact filenames as listed above (lowercase, with hyphens)

## How It Works

1. Customer selects their zodiac sign during checkout
2. Payment is processed successfully
3. System automatically selects the corresponding PDF file
4. Email is sent with the zodiac-specific PDF attached

## Testing

For development/testing purposes, you can use placeholder PDF files. The system will:
- Validate that the PDF exists for the selected zodiac sign
- Show appropriate error messages if a PDF is missing
- Log the email sending process to the console

## Production Setup

When ready for production:
1. Upload all 12 zodiac PDF files to this directory
2. Configure your email service (SendGrid, Mailgun, etc.)
3. Update the email service configuration in `src/lib/emailService.ts`
4. Test the complete flow with real email delivery

## File Structure
```
public/pdfs/
├── README.md (this file)
├── aries-calendar.pdf
├── taurus-calendar.pdf
├── gemini-calendar.pdf
├── cancer-calendar.pdf
├── leo-calendar.pdf
├── virgo-calendar.pdf
├── libra-calendar.pdf
├── scorpio-calendar.pdf
├── sagittarius-calendar.pdf
├── capricorn-calendar.pdf
├── aquarius-calendar.pdf
└── pisces-calendar.pdf
``` 