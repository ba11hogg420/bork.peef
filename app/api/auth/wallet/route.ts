import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyMessage } from 'viem';

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
    const { walletAddress, signature, message, username, timestamp, nonce } = await request.json();

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
    const { data: existingPlayer } = await supabaseAdmin
      .from('players')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (existingPlayer) {
      // Player exists, return their data
      return NextResponse.json({
        player: existingPlayer,
        isNewUser: false,
      });
    }

    // New player - validate username
    if (!username || username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Check if username is taken
    const { data: usernameCheck } = await supabaseAdmin
      .from('players')
      .select('username')
      .eq('username', username)
      .single();

    if (usernameCheck) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create auth user with wallet address as email (workaround for Supabase auth)
    const fakeEmail = `${walletAddress.toLowerCase()}@wallet.blackjack`;
    const randomPassword = crypto.randomUUID();

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: fakeEmail,
      password: randomPassword,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('Auth creation error:', authError);
      return NextResponse.json(
        { error: 'Failed to create authentication' },
        { status: 500 }
      );
    }

    // Create player profile
    const { data: playerData, error: playerError } = await supabaseAdmin
      .from('players')
      .insert({
        user_id: authData.user.id,
        wallet_address: walletAddress.toLowerCase(),
        username,
        bankroll: 1000,
        total_hands_played: 0,
        hands_won: 0,
        hands_lost: 0,
        biggest_win: 0,
      })
      .select()
      .single();

    if (playerError) {
      // Cleanup on failure
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create player profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      player: playerData,
      isNewUser: true,
    });

  } catch (error) {
    console.error('Wallet auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
