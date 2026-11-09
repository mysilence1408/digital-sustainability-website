# Contact form: EmailJS setup

Add these values to `.env.local` in the project root, then restart the development server (or rebuild after deployment):

```dotenv
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Use the EmailJS **public** key here. No private key is needed.

In the EmailJS template, set the recipient to your team's email address and Reply-To to `{{reply_to}}`. The form provides these template variables:

- `{{name}}` and `{{from_name}}`: visitor's name
- `{{email}}`, `{{from_email}}`, and `{{reply_to}}`: visitor's email
- `{{message}}`: visitor's message

Example subject: `New companion enquiry from {{name}}`.

The form uses the [official EmailJS send endpoint](https://www.emailjs.com/docs/rest-api/send/), with required-field validation, an in-flight submission lock, and success/error feedback. Missing configuration shows an honest unavailable message; it never reports a message as sent.

Edit the image and decorative SVG lettering through **Contact page** in Pages CMS (stored in `content/contact.json`). EmailJS keys remain in `.env.local` or hosting environment settings, outside the CMS.
