#!/usr/bin/env bash
cd "$(dirname "$0")/app"

PORT=3000

# Free the port if something is already listening on it
PIDS=$(lsof -ti tcp:"$PORT" -sTCP:LISTEN 2>/dev/null || true)
if [ -n "$PIDS" ]; then
  echo "Port $PORT in use by PID(s): $PIDS — stopping them"
  kill $PIDS 2>/dev/null || true
  # Give them a moment, then force-kill any survivors
  sleep 1
  PIDS=$(lsof -ti tcp:"$PORT" -sTCP:LISTEN 2>/dev/null || true)
  [ -n "$PIDS" ] && kill -9 $PIDS 2>/dev/null || true
fi

echo "Maths Pathway → http://localhost:$PORT"
open "http://localhost:$PORT" 2>/dev/null || true
node server.js
