# Consultancy Frontend

A Next.js + Tailwind CSS frontend for your real estate consultancy.

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev
```

## Building for Production

```bash
# Create production build
npm run build

# The output will be in .next/standalone/
```

## Deployment to DigitalOcean

### Option 1: Static Export (Simplest)

If you don't need server-side features, you can export as static HTML:

1. Update `next.config.js`:
   ```js
   const nextConfig = {
     output: 'export',
   };
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Copy the `out/` folder to your droplet and serve with Nginx.

### Option 2: Standalone Server

The current config uses `output: 'standalone'` which creates a minimal Node.js server:

1. Build:
   ```bash
   npm run build
   ```

2. Copy these to your droplet:
   - `.next/standalone/` (the server)
   - `.next/static/` → `.next/standalone/.next/static/`
   - `public/` → `.next/standalone/public/`

3. Run on the server:
   ```bash
   cd .next/standalone
   node server.js
   ```

4. Configure Nginx to proxy to port 3000.

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout (header, footer, fonts)
│   ├── page.tsx        # Homepage
│   ├── globals.css     # Tailwind + custom styles
│   └── contact/
│       └── page.tsx    # Contact page
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
├── public/             # Static assets (images, favicon, etc.)
├── tailwind.config.js
└── next.config.js
```

## Customization

- **Brand name**: Currently set to "Altiplano". Search and replace to change.
- **Colors**: Edit `tailwind.config.js` → `theme.extend.colors.brand`
- **Email**: Update in `app/contact/page.tsx`
- **Content**: Edit the text in `app/page.tsx`
# Altiplano
