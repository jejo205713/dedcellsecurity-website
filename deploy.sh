#!/usr/bin/env bash
# One-step publish: commit + push to GitHub, then deploy to Vercel production
# Usage: ./deploy.sh "your commit message"
set -euo pipefail

cd "$(dirname "$0")"

MSG="${1:-Update site}"

# 1. Commit any changes (skip if nothing to commit)
git add -A
if ! git diff --cached --quiet; then
  git commit -m "$MSG"
else
  echo "No changes to commit."
fi

# 2. Push to GitHub (credentials are cached via git credential.helper store)
git push origin main

# 3. Deploy to Vercel production -> aliases dedcellsecurity.in
vercel --prod --yes

echo
echo "Done. Live at https://dedcellsecurity.in"
