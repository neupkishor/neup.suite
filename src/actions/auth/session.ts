
'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function getSession() {
  const cookieStore = await cookies();
  const authAccountId = cookieStore.get('auth_account_id')?.value;
  const authSessionId = cookieStore.get('auth_session_id')?.value;
  const authSessionKey = cookieStore.get('auth_session_key')?.value;

  if (!authAccountId || !authSessionId || !authSessionKey) {
    return null;
  }

  try {
    // 1. Local Check
    let user = await prisma.user.findUnique({
      where: { account_id: authAccountId },
    });

    // 2. Conditional Verification
    const appId = 'neupsuite';
    const verifyUrl = 'https://neupgroup.com/account/bridge/api.v1/auth/verify';

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId,
        appType: 'internal',
        auth_account_id: authAccountId,
        auth_session_id: authSessionId,
        auth_session_key: authSessionKey,
        signup: !user, // Signup if user is missing locally
      }),
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (result.success && result.user) {
      // 3. Data Persistence & Constraints
      // If user didn't exist or we need to refresh (Best Practice: refresh on new session)
      user = await prisma.user.upsert({
        where: { account_id: result.user.accountId },
        update: {
          display_name: result.user.displayName,
          display_image: result.user.photo || result.user.displayImage || null,
          neup_id: result.user.neupId,
        },
        create: {
          account_id: result.user.accountId,
          display_name: result.user.displayName,
          display_image: result.user.photo || result.user.displayImage || null,
          neup_id: result.user.neupId,
        },
      });

      return user;
    }

    return null;
  } catch (error) {
    console.error('Auth verification error:', error);
    // If account service is unreachable, use local copy (Data Persistence requirement)
    return prisma.user.findUnique({
      where: { account_id: authAccountId },
    });
  }
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}
