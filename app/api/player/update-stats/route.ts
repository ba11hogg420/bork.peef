import { NextRequest, NextResponse } from 'next/server';
import { updatePlayerStats } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { playerId, bankroll, totalHandsPlayed, handsWon, handsLost, biggestWin } = await request.json();

    if (!playerId || typeof bankroll !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    await updatePlayerStats(playerId, bankroll, totalHandsPlayed, handsWon, handsLost, biggestWin);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update stats error:', error);
    return NextResponse.json(
      { error: 'Failed to update player stats' },
      { status: 500 }
    );
  }
}
