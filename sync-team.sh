#!/bin/bash
# Sync team folder to organization repo
# Usage: ./sync-team.sh <TeamName> [--dry]
# Example: ./sync-team.sh AgileAngels
#          ./sync-team.sh AgileAngels --dry
#
# Clones the org repo into .sync/<TeamName>, copies src/ and guide/ over,
# commits and pushes changes. Safe to run repeatedly.
# With --dry flag, only shows what would be done without executing.

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m' # No Color

ORG="Czechitas-Hackathon-DATCJ26"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

TEAMS="DebugDivas AgileAngels Qaffeine RaIT Suverezity BootcampHeroes"

# Parse arguments
DRY=false
TEAM=""
for arg in "$@"; do
  if [ "$arg" = "--dry" ]; then
    DRY=true
  else
    TEAM="$arg"
  fi
done

if [ -z "$TEAM" ]; then
  echo -e "${BOLD}Usage:${NC} ./sync-team.sh ${CYAN}<TeamName>${NC} [--dry]"
  echo ""
  echo -e "${BOLD}Available teams:${NC}"
  for t in $TEAMS; do
    echo -e "  ${CYAN}$t${NC}"
  done
  echo ""
  echo -e "${BOLD}Options:${NC}"
  echo -e "  ${YELLOW}--dry${NC}    Show commands without executing"
  exit 1
fi

if ! echo "$TEAMS" | grep -qw "$TEAM"; then
  echo -e "${RED}Error:${NC} Unknown team '${BOLD}$TEAM${NC}'"
  echo -e "Available: ${CYAN}$TEAMS${NC}"
  exit 1
fi

LOCAL_PATH="$SCRIPT_DIR/$TEAM"
if [ ! -d "$LOCAL_PATH" ]; then
  echo -e "${RED}Error:${NC} Local folder '${BOLD}$LOCAL_PATH${NC}' does not exist"
  exit 1
fi

REMOTE="git@github.com:$ORG/$TEAM.git"
SYNC_DIR="$SCRIPT_DIR/.sync/$TEAM"

echo ""
if $DRY; then
  echo -e "${YELLOW}━━━ DRY RUN: Syncing ${BOLD}$TEAM${NC}${YELLOW} ━━━${NC}"
else
  echo -e "${GREEN}━━━ Syncing ${BOLD}$TEAM${NC}${GREEN} ━━━${NC}"
fi
echo -e "  ${DIM}Local:${NC}  $LOCAL_PATH"
echo -e "  ${DIM}Remote:${NC} ${BLUE}$REMOTE${NC}"
echo -e "  ${DIM}Sync:${NC}   $SYNC_DIR"
echo ""

# Fresh clone every time (remove old clone if exists)
if [ -d "$SYNC_DIR" ]; then
  echo -e "  ${DIM}→${NC} rm -rf $SYNC_DIR"
  $DRY || rm -rf "$SYNC_DIR"
fi

echo -e "  ${CYAN}→${NC} git clone ${BLUE}$REMOTE${NC}"
$DRY || { mkdir -p "$SCRIPT_DIR/.sync" && git clone "$REMOTE" "$SYNC_DIR"; }

# Copy src/ and guide/ over (overwrite existing files)
if [ -d "$LOCAL_PATH/src" ]; then
  echo -e "  ${CYAN}→${NC} cp -Rf ${BOLD}src/${NC}"
  $DRY || cp -Rf "$LOCAL_PATH/src" "$SYNC_DIR/"
fi

if [ -d "$LOCAL_PATH/guide" ]; then
  echo -e "  ${CYAN}→${NC} cp -Rf ${BOLD}guide/${NC}"
  $DRY || cp -Rf "$LOCAL_PATH/guide" "$SYNC_DIR/"
fi

if $DRY; then
  echo -e "  ${CYAN}→${NC} git add -A"
  echo -e "  ${CYAN}→${NC} git commit -m \"Sync from hackhaton-app-designs ...\""
  echo -e "  ${CYAN}→${NC} git push"
  echo ""
  echo -e "${YELLOW}━━━ DRY RUN complete (nothing was executed) ━━━${NC}"
  exit 0
fi

cd "$SYNC_DIR"

# Stage all changes
git add -A

# Commit and push only if there are changes
if git diff --cached --quiet; then
  echo -e "  ${GREEN}✓${NC} No changes to sync — already up to date"
else
  echo -e "  ${CYAN}→${NC} Changes detected, committing..."
  git commit -m "Sync from hackhaton-app-designs $(date +%Y-%m-%d\ %H:%M)"
  echo -e "  ${CYAN}→${NC} Pushing..."
  git push
  echo -e "  ${GREEN}✓${NC} Done!"
fi

echo ""
echo -e "${GREEN}━━━ ${BOLD}$TEAM${NC}${GREEN} sync complete ━━━${NC}"
