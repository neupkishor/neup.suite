
'use server';

import { redirect } from 'next/navigation';

export async function signOut() {
  const signoutUrl = `https://neupgroup.com/account/auth/signout?redirect_to=${encodeURIComponent('https://neupgroup.com/suite')}`;

  redirect(signoutUrl);
}
