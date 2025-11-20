import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Look up the user by username to get their user_id
    const { data: playerData, error: playerError } = await supabaseAdmin
      .from('players')
      .select('user_id')
      .eq('username', username)
      .single();

    if (playerError || !playerData) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Get the user's email from auth.users
    const { data: { user: authUser }, error: userError } = await supabaseAdmin.auth.admin.getUserById(playerData.user_id);
    
    if (userError || !authUser || !authUser.email) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Sign in with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: authUser.email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to authenticate' },
        { status: 401 }
      );
    }

    // Get player profile
    const { data: playerProfile, error: profileError } = await supabaseAdmin
      .from('players')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError || !playerProfile) {
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: authData.user,
      player: playerProfile,
      session: authData.session,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
