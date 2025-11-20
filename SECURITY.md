# Security Policy

## Overview
This document outlines the security measures implemented in the Blackjack Web3 Game.

## Security Features

### 1. Authentication & Authorization
- **Web3 Wallet Authentication**: Cryptographic signature verification using `viem`
- **No Password Storage**: Zero-knowledge authentication via wallet signatures
- **Rate Limiting**: 10 requests per minute per IP for authentication endpoints
- **Session Management**: Secure PKCE flow with Supabase Auth

### 2. Database Security
- **Row Level Security (RLS)**: All tables protected with Supabase RLS policies
- **Parameterized Queries**: All database queries use prepared statements
- **CHECK Constraints**: Prevents negative bankrolls and invalid game states
- **Immutable Timestamps**: `created_at` fields cannot be modified
- **Cascading Deletes**: Proper foreign key relationships with ON DELETE CASCADE

### 3. Network Security
- **HTTPS Enforced**: Strict Transport Security (HSTS) with 2-year max-age
- **Content Security Policy (CSP)**: Restricts resource loading to trusted sources
- **CORS Protection**: API routes restricted to same origin
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME sniffing

### 4. Input Validation
- **Wallet Address Validation**: Regex validation for Ethereum address format
- **Username Sanitization**: Alphanumeric + underscores only
- **Timestamp Validation**: 5-minute expiry window for signed messages
- **Nonce Verification**: UUID format validation
- **Bet Amount Validation**: Client and server-side checks

### 5. API Security
- **Rate Limiting**: Protects against brute force and DoS attacks
- **Request Validation**: All inputs validated before processing
- **Error Handling**: Generic error messages to prevent information disclosure
- **No Console Logs in Production**: Sensitive data not logged

### 6. Client-Side Security
- **XSS Prevention**: React's built-in escaping + CSP
- **CSRF Protection**: SameSite cookies + state validation
- **Secure Storage**: Sensitive data in httpOnly cookies when possible
- **Input Sanitization**: All user inputs sanitized before rendering

## Environment Variables

### Required Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

### Security Guidelines
- ✅ Use `.env.local` for local development
- ✅ Store production secrets in Vercel environment variables
- ✅ Never commit `.env.local` to version control
- ✅ Rotate keys every 90 days
- ✅ Use different keys for development and production
- ❌ Never expose service role keys to the client

### Credential Rotation Runbook
1. **Supabase**
   - Create new anon/public API key and a new service role key in the Supabase dashboard.
   - Update `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel + local `.env` files.
   - Redeploy the app, verify connections, then revoke the old keys in Supabase > Settings > API.
2. **WalletConnect**
   - Generate a new project in <https://cloud.walletconnect.com> with the same domain allow-list.
   - Replace `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` values, redeploy, and delete the previous project ID to invalidate it.
3. **Repository Hygiene**
   - If secrets were ever committed (e.g., `.env.local`), purge them from git history (`git filter-repo`) and invalidate the exposed credentials before merging.

## Database Security Checklist

### Before Production Deployment
- [ ] Run `supabase-schema.sql` to create tables with RLS enabled
- [ ] Run `supabase-migration-wallet.sql` to add wallet_address column
- [ ] Verify RLS policies are active: `SELECT * FROM pg_policies;`
- [ ] Enable realtime only for necessary tables
- [ ] Set up database backups (hourly recommended)
- [ ] Review and test all RLS policies
- [ ] Limit connection pooling in Supabase settings
- [ ] Enable SSL enforcement for database connections

### Row Level Security Policies

#### Players Table
- **SELECT**: Users can read their own data + public leaderboard data
- **UPDATE**: Users can only update their own records
- **INSERT**: Users can only create their own records
- **DELETE**: Not allowed (use soft deletes if needed)

#### Game History Table
- **SELECT**: Users can only read their own game history
- **INSERT**: Users can only insert their own game records
- **UPDATE**: Not allowed (historical data is immutable)
- **DELETE**: Not allowed (audit trail preservation)

## API Endpoints Security

### `/api/auth/wallet` (POST)
- Rate limited: 10 req/min per IP
- Signature verification required
- Timestamp must be within 5 minutes
- Nonce must be unique UUID format
- Returns 400/401/429 for invalid requests

### Future API Endpoints
When adding new endpoints, ensure:
- [ ] Rate limiting implemented
- [ ] Input validation
- [ ] Authentication check
- [ ] Authorization check (if needed)
- [ ] Error handling
- [ ] Logging (without sensitive data)

## Vulnerability Management

### Reporting Security Issues
If you discover a security vulnerability, please email: ba11hogg420@gmail.com

**Do not** create public GitHub issues for security vulnerabilities.

### Security Update Policy
- Critical vulnerabilities: Patched within 24 hours
- High severity: Patched within 7 days
- Medium/Low severity: Patched in next release

### Dependency Security
```bash
# Check for vulnerabilities
npm audit

# Fix non-breaking issues
npm audit fix

# Review breaking changes before applying
npm audit fix --force
```

Current known vulnerabilities (as of last audit):
- 25 low severity (Web3 dependencies)
- 5 high severity (glob CLI - does not affect runtime)

## Production Deployment Checklist

### Pre-Deployment
- [ ] Run `npm audit` and review findings
- [ ] Update all dependencies to latest secure versions
- [ ] Test RLS policies thoroughly
- [ ] Verify CSP headers don't block legitimate resources
- [ ] Test rate limiting under load
- [ ] Review error messages for information disclosure
- [ ] Enable Vercel security features (DDoS protection)

### Post-Deployment
- [ ] Monitor error logs for security events
- [ ] Set up alerts for authentication failures
- [ ] Configure uptime monitoring
- [ ] Test all authentication flows in production
- [ ] Verify HTTPS is enforced
- [ ] Test CSP headers in browser console

## Incident Response Plan

### If Security Breach Detected
1. **Immediate**: Disable affected services/endpoints
2. **Investigate**: Review logs, identify scope of breach
3. **Contain**: Rotate all affected credentials
4. **Notify**: Inform affected users within 72 hours (GDPR)
5. **Remediate**: Fix vulnerability, deploy patch
6. **Document**: Create post-mortem report
7. **Monitor**: Enhanced monitoring for 30 days

## Compliance

### Data Protection
- **GDPR Compliant**: Users can request data deletion
- **Minimal Data Collection**: Only necessary information stored
- **Data Encryption**: All data encrypted at rest and in transit
- **Right to be Forgotten**: User deletion removes all personal data

### Blockchain Privacy
- Wallet addresses are publicly visible on-chain
- Game results and bankrolls are private to the user
- No linking of wallet addresses to real-world identities

## Security Best Practices for Users

### Wallet Security
- ✅ Use hardware wallets for large amounts
- ✅ Verify transaction details before signing
- ✅ Only connect to official domain
- ✅ Check SSL certificate before connecting wallet
- ❌ Never share private keys or seed phrases
- ❌ Don't approve unlimited token spending

### Account Security
- ✅ Disconnect wallet when not in use
- ✅ Use unique usernames (no personal info)
- ✅ Clear browser cache on shared computers
- ❌ Don't share your session data

## Security Tools Used

- **viem**: Ethereum wallet signature verification
- **Supabase**: Database with built-in RLS
- **Next.js**: Secure-by-default framework
- **Vercel**: DDoS protection and edge security
- **WalletConnect**: Secure wallet connection protocol

## Security Headers Reference

```javascript
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [See next.config.mjs for full policy]
```

## Regular Security Tasks

### Weekly
- [ ] Review authentication logs for anomalies
- [ ] Check error rates and suspicious patterns
- [ ] Monitor database query performance

### Monthly
- [ ] Run `npm audit` and update dependencies
- [ ] Review RLS policies for gaps
- [ ] Test disaster recovery procedures
- [ ] Update security documentation

### Quarterly
- [ ] Rotate API keys and credentials
- [ ] Conduct security audit
- [ ] Review and update CSP policies
- [ ] Penetration testing (if budget allows)

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Web3 Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

**Last Updated**: November 17, 2025  
**Version**: 2.0  
**Maintained by**: Development Team
