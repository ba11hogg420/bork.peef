import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import { getPlayerByWallet, createPlayer } from '@/lib/db';

// Simple in-memory rate limiter (use durable store like Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const MESSAGE_EXPIRY = 5 * 60 * 1000; // 5 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limiter = rateLimitMap.get(ip);

  if (!limiter || now > limiter.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (limiter.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  limiter.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, message, timestamp, nonce } = await request.json();

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate input
    if (!walletAddress || !signature || !message || !timestamp || !nonce) {
      return NextResponse.json(
        { error: 'Wallet address, signature, message, timestamp, and nonce are required' },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const messageTime = parseInt(timestamp);
    const now = Date.now();
    if (Number.isNaN(messageTime) || messageTime > now || now - messageTime > MESSAGE_EXPIRY) {
      return NextResponse.json(
        { error: 'Message expired or invalid timestamp' },
        { status: 401 }
      );
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nonce)) {
      return NextResponse.json(
        { error: 'Invalid nonce format' },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValid = await verifyMessage({
      address: walletAddress as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Check if player exists
    const existingPlayer = await getPlayerByWallet(walletAddress);

    if (existingPlayer) {
      // Player exists, return their data
      return NextResponse.json({
        player: existingPlayer,
        isNewUser: false,
      });
    }

    // Auto-generate username from wallet address (first 4 and last 4 chars)
    const username = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

    // Create player profile with generated user ID
    const userId = crypto.randomUUID();
    
    try {
      const playerData = await createPlayer(userId, walletAddress, username);

      return NextResponse.json({
        player: playerData,
        isNewUser: true,
      });
    } catch (error) {
      console.error('Player creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create player profile' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Wallet auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
