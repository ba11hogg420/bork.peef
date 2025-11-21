import { sql } from '@vercel/postgres';

export interface Player {
  id: string;
  user_id: string;
  wallet_address: string;
  username: string;
  bankroll: number;
  total_hands_played: number;
  hands_won: number;
  hands_lost: number;
  biggest_win: number;
  created_at: Date;
  updated_at: Date;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  bankroll: number;
  total_hands_played: number;
  hands_won: number;
  hands_lost: number;
  biggest_win: number;
  win_rate: number;
}

// Get player by wallet address
export async function getPlayerByWallet(walletAddress: string): Promise<Player | null> {
  const { rows } = await sql<Player>`
    SELECT * FROM players 
    WHERE wallet_address = ${walletAddress.toLowerCase()} 
    LIMIT 1
  `;
  return rows[0] || null;
}

// Create new player
export async function createPlayer(
  userId: string,
  walletAddress: string,
  username: string
): Promise<Player> {
  const { rows } = await sql<Player>`
    INSERT INTO players (
      user_id, 
      wallet_address, 
      username, 
      bankroll, 
      total_hands_played, 
      hands_won, 
      hands_lost, 
      biggest_win
    ) VALUES (
      ${userId},
      ${walletAddress.toLowerCase()},
      ${username},
      1000,
      0,
      0,
      0,
      0
    )
    RETURNING *
  `;
  return rows[0];
}

// Update player stats
export async function updatePlayerStats(
  playerId: string,
  bankroll: number,
  totalHandsPlayed: number,
  handsWon: number,
  handsLost: number,
  biggestWin: number
): Promise<void> {
  await sql`
    UPDATE players 
    SET 
      bankroll = ${bankroll},
      total_hands_played = ${totalHandsPlayed},
      hands_won = ${handsWon},
      hands_lost = ${handsLost},
      biggest_win = ${biggestWin},
      updated_at = NOW()
    WHERE id = ${playerId}
  `;
}

// Get leaderboard
export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  const clampedLimit = Math.min(Math.max(Math.floor(limit), 5), 50);
  
  const { rows } = await sql<Omit<LeaderboardEntry, 'win_rate'>>`
    SELECT 
      id, 
      username, 
      bankroll, 
      total_hands_played, 
      hands_won, 
      hands_lost, 
      biggest_win
    FROM players
    ORDER BY bankroll DESC
    LIMIT ${clampedLimit}
  `;

  return rows.map((player) => ({
    ...player,
    win_rate: player.total_hands_played > 0
      ? (player.hands_won / player.total_hands_played) * 100
      : 0,
  }));
}
