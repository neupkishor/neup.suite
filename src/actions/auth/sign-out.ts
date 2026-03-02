
'use server';

import { redirect } from 'next/navigation';

export async function signOut() {
  const signoutUrl = `${process.env.NEXT_PUBLIC_NEUP_ACCOUNT_URL || 'https://neupgroup.com/account'}/auth/signout?redirect_to=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || 'https://neupgroup.com/suite')}`;

  redirect(signoutUrl);
}
