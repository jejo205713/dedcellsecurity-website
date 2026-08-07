'use client';

/**
 * Sign-out needs a fetch rather than a plain `<form method="post">`: the logout
 * route answers with JSON, so a form post would navigate the editor to a page
 * showing `{"success":true}`. Leaving the route's contract alone and doing the
 * redirect here keeps the change to one place.
 */
export function SignOutButton({ className }: { className: string }) {
  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    // Full navigation, not a router push: the new cookie state has to reach the
    // proxy on a real request.
    window.location.assign('/admin/login');
  }

  return (
    <button type="button" onClick={signOut} className={className}>
      Sign out
    </button>
  );
}
