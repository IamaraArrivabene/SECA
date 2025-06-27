# SECA - Environmental and Climatic Studies System

This repository contains the modern website for SECA, a company specialized in providing consulting services, studies, and projects in the environmental area with an emphasis on air pollution since 1995.

## Project Overview

The SECA website features a responsive design optimized for various devices and includes:
- Information about company services and expertise
- Product showcases
- Training information
- Client references
- Blog integration
- Bilingual support (English/Portuguese)
- Animation showcases

## File Structure

```
modern-seca/
├── css/               # Stylesheets
│   └── styles.css     # Main stylesheet
├── images/            # Image assets
│   ├── BR_new.png     # Flag icon
│   └── Logo fit.png   # Company logo
├── js/                # JavaScript files
│   └── main.js        # Main script file
├── videos/            # Video assets
│   └── videorosaF.mp4 # Hero banner video
├── index.html         # Main redirect to home-en.html
├── modern-index.html  # Alternative redirect to home-en.html
├── home-en.html       # Main English homepage
├── old-reference.html # Legacy reference page
└── wordpress-integration.php # WordPress integration script
```

## Setup Instructions

1. Clone this repository to your local machine or web server
2. No build process is required - this is a static HTML website
3. Open index.html in a browser to view the site locally

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Modern UI**: Clean and professional interface with animations
- **Bilingual Support**: Toggle between English and Portuguese
- **WordPress Integration**: Optional blog integration

## Browser Compatibility

This website is compatible with modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

© 2025 SECA - Environmental and Climatic Studies System. All rights reserved.

## Email Setup Guide

The contact form can be configured to send emails using different methods:

### Option 1: EmailJS (Recommended for Static Sites)

**Steps to set up EmailJS:**

1. **Create EmailJS Account**
   - Go to [EmailJS.com](https://www.emailjs.com/)
   - Sign up for a free account (1000 emails/month)

2. **Connect Email Service**
   - In EmailJS dashboard, go to "Email Services"
   - Add your email provider (Gmail, Outlook, etc.)
   - Follow the authentication steps

3. **Create Email Template**
   - Go to "Email Templates"
   - Create a new template with these variables:
   ```
   Subject: New Contact Form Message: {{subject}}
   
   From: {{from_name}} ({{from_email}})
   Subject: {{subject}}
   
   Message:
   {{message}}
   ```

4. **Get Your Keys**
   - Note down your:
     - Service ID
     - Template ID 
     - Public Key (from Account settings)

5. **Update contact-en.html**
   - Replace these placeholders in the JavaScript:
   ```javascript
   const serviceID = 'YOUR_SERVICE_ID';
   const templateID = 'YOUR_TEMPLATE_ID';
   const publicKey = 'YOUR_PUBLIC_KEY';
   ```

### Option 2: PHP Backend (Requires Web Server)

Create `send-email.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $name = filter_var($input['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
    $subject = filter_var($input['subject'], FILTER_SANITIZE_STRING);
    $message = filter_var($input['message'], FILTER_SANITIZE_STRING);
    
    if ($name && $email && $subject && $message) {
        $to = 'seca@seca-ambiental.com.br';
        $subject = "Contact Form: " . $subject;
        $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
        $headers = "From: $email\r\nReply-To: $email\r\n";
        
        if (mail($to, $subject, $body, $headers)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to send email']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid input']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
```

### Option 3: Node.js Backend

**Install dependencies:**
```bash
npm init -y
npm install express cors nodemailer
```

**Create server.js:**
```javascript
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Configure email transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail', // or your email provider
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use app password for Gmail
    }
});

app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    const mailOptions = {
        from: email,
        to: 'seca@seca-ambiental.com.br',
        subject: `Contact Form: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### Option 4: Third-Party Form Services

**Simple alternatives (no coding required):**

1. **Formspree**: Add `action="https://formspree.io/f/YOUR_FORM_ID"` to your form
2. **Netlify Forms**: Add `netlify` attribute to your form (if hosted on Netlify)
3. **Getform**: Similar to Formspree with more features

## Deployment

- For EmailJS: No server required, works with static hosting
- For PHP: Requires PHP hosting (shared hosting, VPS)
- For Node.js: Requires Node.js hosting (Heroku, DigitalOcean, etc.)

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Modern UI**: Clean and professional interface with animations
- **Bilingual Support**: Toggle between English and Portuguese
- **WordPress Integration**: Optional blog integration
- **Contact Form**: Email integration
- **Tailwind CSS**: Modern UI with Tailwind CSS
- **Video Backgrounds**: Hero banner video
- **Animation Showcases**: Modern animations

## Browser Compatibility

This website is compatible with modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest) 