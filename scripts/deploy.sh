#!/bin/sh
# Publish dist/ to the gh-pages branch (Settings → Pages → Deploy from a branch → gh-pages).
# Keeps the branch history in .deploy/ so each push only uploads what changed.
set -e

REPO=${DEPLOY_REPO:-git@github.com:TonkyShan/EchoTo.github.io.git}
DIR=.deploy

[ -d dist ] || { echo "dist/ not found, run astro build first" >&2; exit 1; }

if [ ! -d "$DIR/.git" ]; then
  git init -q -b gh-pages "$DIR"
fi

cd "$DIR"
# Start from what is published, in case another machine deployed since
if git fetch -q "$REPO" gh-pages 2>/dev/null; then
  git reset -q --soft FETCH_HEAD
fi

rsync -a --delete --exclude .git ../dist/ ./
git add -A
if git diff --cached --quiet; then
  echo "Nothing to deploy"
  exit 0
fi
git commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push "$REPO" HEAD:gh-pages
