# Wallet Authentication API

## Security Features

### 1. Rate Limiting
- **10 requests per minute** per IP address
- Prevents brute force attacks and abuse
- Returns 429 status code when limit exceeded

### 2. Signature Verification
- Uses `viem` library for cryptographic verification
- Validates that the message was signed by the wallet address
- Prevents impersonation attacks

### 3. Timestamp Validation
- Messages expire after **5 minutes**
- Prevents replay attacks
- Validates timestamp is not in the future

### 4. Nonce Verification
- Requires UUID format nonce
- Prevents message reuse
- Should be unique per authentication attempt

### 5. Input Validation
- Wallet address: Must match Ethereum address format (0x + 40 hex chars)
- Username: 3-30 characters, alphanumeric + underscores only
- Prevents SQL injection and XSS attacks

### 6. Secure Message Format
The signed message should include:
```
Sign this message to authenticate with Blackjack Game.

Wallet: {walletAddress}
Timestamp: {timestamp}
Nonce: {nonce}
```

## Usage

### Client-Side (Example)
```typescript
import { signMessage } from 'wagmi/actions';

const timestamp = Date.now().toString();
const nonce = crypto.randomUUID();
const message = `Sign this message to authenticate with Blackjack Game.\n\nWallet: ${address}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;

const signature = await signMessage({ message });

const response = await fetch('/api/auth/wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: address,
    signature,
    message,
    timestamp,
    nonce,
    username: newUsername // Only for new users
  })
});
```

## Production Recommendations

1. **Use Redis for Rate Limiting**: Replace in-memory Map with Redis for distributed systems
2. **Add Nonce Tracking**: Store used nonces in database to prevent reuse
3. **Implement IP Whitelisting**: For administrative access
4. **Add Monitoring**: Track authentication attempts and failures
5. **Enable CORS**: Restrict to your frontend domain only
6. **Add Logging**: Log authentication events for audit trail (without sensitive data)
