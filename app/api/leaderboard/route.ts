import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number(searchParams.get('limit'));
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.floor(requestedLimit), 5), 50)
      : 10;

    const { data, error } = await supabaseAdmin
      .from('players')
      .select('id, username, bankroll, total_hands_played, hands_won, hands_lost, biggest_win')
      .order('bankroll', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Leaderboard query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    const leaderboard = (data ?? []).map((player) => ({
      ...player,
      win_rate: player.total_hands_played > 0
        ? (player.hands_won / player.total_hands_played) * 100
        : 0,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
