/**
 * Generates the credentials for the single publisher account.
 *
 * Run:  npm run auth:hash -- 'your-password-here'
 *
 * Prints the three environment variables to set. The plaintext password is
 * never written anywhere - only the PBKDF2 hash, which cannot be reversed.
 *
 * Quote the password in your shell, and prefix the command with a space if your
 * shell records history (` npm run auth:hash …`), so it does not land in
 * ~/.bash_history.
 */
import { hashPassword, PBKDF2_ITERATIONS } from '../lib/auth';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run auth:hash -- \'your-password\'');
  process.exit(1);
}

if (password.length < 16) {
  console.error(
    `\nPassword is ${password.length} characters. Use at least 16.\n\n` +
      'This is the only secret protecting publish access, and the username is\n' +
      'effectively public, so every guess targets it directly. Use a generated\n' +
      'passphrase from a password manager, not something memorable.\n',
  );
  process.exit(1);
}

function randomSecret(bytes = 32): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(bytes))).toString('base64url');
}

const main = async () => {
  const hash = await hashPassword(password);

  console.log(`
Add these to your Vercel project's environment variables
(Settings -> Environment Variables), then redeploy.

  ADMIN_USERNAME=<pick a username>
  ADMIN_PASSWORD_HASH=${hash}
  AUTH_SECRET=${randomSecret()}

Notes:
  - AUTH_SECRET signs session cookies. Rotating it invalidates every session
    immediately - that is the lever to pull if credentials are ever suspected.
  - PBKDF2-HMAC-SHA256, ${PBKDF2_ITERATIONS.toLocaleString()} iterations, 16-byte random salt.
  - Set all three on Production AND Preview, or the CMS 404s on previews.
  - Never commit these. .env.local is gitignored.
`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
