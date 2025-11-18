# Production Environment - Blackjack Game

## Repository Structure

**Production Repository:** https://github.com/ba11hogg420/bork.peef
- **Directory:** `C:\Projects\blackjack-game`
- **Branch:** `main`
- **Deployment:** Auto-deploy to Vercel on push

## Workflow

### Making Changes

1. **Work in production directory:**
```bash
cd C:\Projects\blackjack-game
```

2. **Start development server:**
```bash
npm run dev
```

3. **Test changes locally:**
   - Open http://localhost:3000
   - Test wallet connection
   - Test game functionality
   - Check console for errors

4. **Commit and push:**
```bash
git add .
git commit -m "Your descriptive message"
git push origin main
```

5. **Vercel auto-deploys** within 2-3 minutes

### Vercel Project

- **Project:** `blackjack-game`
- **Organization:** `0xnorts-projects`
- **Production URL:** Check Vercel dashboard
- **Dashboard:** https://vercel.com/0xnorts-projects/blackjack-game

### Environment Variables (Already Configured)

```env
NEXT_PUBLIC_SUPABASE_URL=https://nzybhiefzwwnmkcudgmz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=17ab61a21e875ea2d91a6d46a5626541
```

### Database (Supabase)

- **Project:** nzybhiefzwwnmkcudgmz
- **URL:** https://nzybhiefzwwnmkcudgmz.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/nzybhiefzwwnmkcudgmz

**Required SQL Scripts:**
1. `supabase-schema.sql` - Main database schema
2. `supabase-security-fix.sql` - Function security patches

### Manual Deployment

If auto-deploy fails or you need to redeploy:

```bash
cd C:\Projects\blackjack-game
vercel --prod
```

### Checking Deployment Status

```bash
# View recent deployments
vercel ls

# View logs for specific deployment
vercel logs [deployment-url]
```

### Rollback

If a deployment breaks production:

1. Go to https://vercel.com/0xnorts-projects/blackjack-game/deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

### Git Remote

```bash
# View current remote
git remote -v

# Should show:
# origin  https://github.com/ba11hogg420/bork.peef.git (fetch)
# origin  https://github.com/ba11hogg420/bork.peef.git (push)
```

### Latest Commits

```
46971a7 - Migrate from @web3modal/wagmi to @reown/appkit
3dff8b2 - Update README with Web3 features and proper workflow documentation
64ff553 - Remove unnecessary markdown files and add SQL security fix
d4c8ea3 - Add @vercel/speed-insights for production monitoring
fb0f47e - Fix vercel.json: Remove unsupported checks property
```

## Development Environment (Optional)

For a separate development environment:

1. **Create new directory:**
```bash
mkdir C:\Projects\blackjack-dev
cd C:\Projects\blackjack-dev
```

2. **Clone repository:**
```bash
git clone https://github.com/ba11hogg420/bork.peef.git .
git checkout -b develop
```

3. **Create separate .env.local** with test database

4. **Push develop branch:**
```bash
git push -u origin develop
```

5. **Link to Vercel preview:**
```bash
vercel link
```

## Security Checklist

- ✅ All environment variables set in Vercel
- ✅ Supabase RLS policies enabled
- ✅ Row level security on all tables
- ✅ Rate limiting on authentication endpoints
- ✅ Security headers configured in next.config.mjs
- ✅ Wallet signature verification with timestamp/nonce
- ✅ Database functions have search_path set

## Monitoring

- **Speed Insights:** Enabled via @vercel/speed-insights
- **Analytics:** Check Vercel dashboard
- **Errors:** Check Vercel logs and browser console
- **Database:** Monitor Supabase dashboard for query performance

## Support

- **GitHub Issues:** https://github.com/ba11hogg420/bork.peef/issues
- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support

---

**Last Updated:** November 17, 2025  
**Status:** ✅ Production Ready
