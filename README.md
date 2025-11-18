# 🃏 Blackjack Web3 Game

Production-ready two-deck blackjack with **Web3 wallet authentication**, built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and WalletConnect.

## Features

**Game:** Two-deck blackjack • Hit/Stand/Double/Split/Insurance • Dealer stands soft 17 • 3:2 blackjack • 2:1 insurance • $1,000 start • $5 min bet • Auto-save game state

**Authentication:** Web3 wallet login (MetaMask, WalletConnect, Coinbase Wallet) • No passwords • Guest mode available • Cryptographic signature verification

**UI:** Framer Motion animations • Premium landing page • Mobile responsive • Dark casino theme

**Backend:** Supabase (PostgreSQL + RLS) • Real-time leaderboard • Player stats tracking • Rate limiting • Secure API routes

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier)
- WalletConnect Project ID ([Get one free](https://cloud.walletconnect.com))
- Vercel account (optional, for deployment)

### Development Workflow

**Important:** All development should be done in `C:\Projects\blackjack-game` directory. This is the production directory linked to GitHub and Vercel.

### Setup

**1. Install dependencies:**
```bash
cd C:\Projects\blackjack-game
npm install
```

**2. Setup Supabase:**

- Create project at [supabase.com](https://supabase.com)
- Go to SQL Editor → Run `supabase-schema.sql` → Execute
- Run `supabase-security-fix.sql` to fix function security warnings
- Go to Settings → API → Copy Project URL and anon key

**3. Get WalletConnect Project ID:**

- Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
- Create free account → Create new project
- Copy your Project ID

**4. Configure environment:**

Create `.env.local` in `C:\Projects\blackjack-game`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

**5. Run development server:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Making Changes

1. **Edit files** in `C:\Projects\blackjack-game`
2. **Test locally** with `npm run dev`
3. **Commit changes:**
```bash
cd C:\Projects\blackjack-game
git add .
git commit -m "Your commit message"
git push
```
4. **Vercel auto-deploys** from GitHub main branch

## Deployment

### Vercel (Automatic)

1. **Link repository:**
```bash
cd C:\Projects\blackjack-game
vercel link --yes
```

2. **Add environment variables:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
```

3. **Push to GitHub:**
```bash
git push
```
Vercel will automatically build and deploy!

### Manual Deployment

```bash
cd C:\Projects\blackjack-game
vercel --prod
```

## Game Rules

Two 52-card decks (104 total) • Dealer stands soft 17 • Blackjack pays 3:2 • Insurance pays 2:1 • Split pairs • Double on first two cards • $5 min / bankroll max • $1,000 starting

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   └── leaderboard/route.ts
│   ├── game/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── game/
│       ├── BlackjackTable.tsx
│       ├── Card.tsx
│       ├── ChipSelector.tsx
│       └── Leaderboard.tsx
├── lib/
│   ├── gameLogic.ts
│   ├── localStorage.ts
│   ├── soundManager.ts
│   ├── supabase.ts
│   └── types.ts
├── public/
│   └── sounds/
│       ├── card-deal.mp3
│       ├── chip-clink.mp3
│       ├── win.mp3
│       ├── loss.mp3
│       ├── casino-ambience.mp3
│       └── README.md
├── supabase-schema.sql
├── vercel.json
├── .env.local.example
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Web3 (wagmi, viem, WalletConnect)
- **Real-time**: Supabase Realtime
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **Analytics**: Vercel Speed Insights

## 🔒 Security Features

- **Web3 Authentication:** Signature-based verification with timestamp and nonce
- **Rate Limiting:** 10 requests/min per IP on authentication endpoints
- **Database Security:** Row Level Security (RLS) on all tables
- **Input Validation:** Regex patterns, length checks, sanitization
- **Security Headers:** HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- **Environment Variables:** Secure storage of sensitive data
- **Function Security:** search_path locked to prevent privilege escalation

See `SECURITY.md` for complete security documentation.

## 📁 Key Files

- `app/page.tsx` - Premium landing page with guest mode
- `app/auth/page.tsx` - Web3 wallet authentication
- `app/game/page.tsx` - Main blackjack game interface
- `app/api/auth/wallet/route.ts` - Wallet signature verification API
- `lib/web3.ts` - WalletConnect configuration
- `lib/gameLogic.ts` - Blackjack rules and logic
- `lib/supabase.ts` - Database client with RLS
- `supabase-schema.sql` - Complete database schema
- `supabase-security-fix.sql` - Function security patches
- `next.config.mjs` - Security headers and optimizations

## 🎨 Design Features

- Dark casino theme with #0f172a background
- Green felt table aesthetic
- Animated card dealing with 150ms stagger
- Card flip animations (300ms)
- Win effects (green glow)
- Bust effects (red shake)
- Realistic poker chip designs
- Mobile-responsive layout
- Smooth transitions and hover effects

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**Database errors:** Verify Supabase URL/keys in `.env.local`, ensure schema was executed, check RLS policies enabled

**Sounds not playing:** Check files in `/public/sounds/`, click unmute button, check browser console

**Build errors:** Delete `.next` folder and rebuild, check TypeScript errors with `npm run build`

**Login fails:** Clear localStorage, verify database setup, check API keys correct

## Tech Stack

Next.js 14 • TypeScript • Tailwind CSS • Supabase (PostgreSQL + Auth + Realtime) • Framer Motion • Howler.js

## License

MIT License - Open source
