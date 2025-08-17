#!/bin/bash

# Log Archive Script - Day 7 of 100
# Runs daily at 1:00 AM via cron
# Usage: sudo ./log-archive.sh

SCRIPT_DIR="/opt/app"
LOG_DIR="/opt/app/logs"
ARCHIVE_DIR="/var/log-archive"
LOG_FILE="/var/log/log-archive-script.log"
LOCK_FILE="/tmp/log-archive.lock"
DATE=$(date '+%Y-%m-%d')
ARCHIVE_NAME="app-logs-${DATE}.tar.gz"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Check if script is already running
if [ -f "$LOCK_FILE" ]; then
    log_message "ERROR: Script already running. Lock file exists: $LOCK_FILE"
    exit 1
fi

# Create lock file
echo $$ > "$LOCK_FILE"

# Cleanup function to remove lock file on exit
cleanup() {
    rm -f "$LOCK_FILE"
}
trap cleanup EXIT

log_message "Starting log archive process"

# Create archive directory if it doesn't exist
if [ ! -d "$ARCHIVE_DIR" ]; then
    mkdir -p "$ARCHIVE_DIR"
    log_message "Created archive directory: $ARCHIVE_DIR"
fi

# Check if log directory exists and has files
if [ ! -d "$LOG_DIR" ] || [ -z "$(ls -A "$LOG_DIR" 2>/dev/null)" ]; then
    log_message "WARNING: No logs found in $LOG_DIR"
    exit 0
fi

# Archive logs
cd "$SCRIPT_DIR" || {
    log_message "ERROR: Cannot change to directory $SCRIPT_DIR"
    exit 1
}

if tar -czf "$ARCHIVE_DIR/$ARCHIVE_NAME" logs/ 2>/dev/null; then
    log_message "SUCCESS: Created archive $ARCHIVE_NAME"
    
    # Clean up original logs after successful archive
    rm -rf "$LOG_DIR"/*
    log_message "Cleaned up original logs from $LOG_DIR"
else
    log_message "ERROR: Failed to create archive"
    exit 1
fi

# Keep only last 10 archives
cd "$ARCHIVE_DIR" || {
    log_message "ERROR: Cannot change to archive directory"
    exit 1
}

# Count and remove old archives
ARCHIVE_COUNT=$(ls -1 app-logs-*.tar.gz 2>/dev/null | wc -l)
if [ "$ARCHIVE_COUNT" -gt 10 ]; then
    REMOVE_COUNT=$((ARCHIVE_COUNT - 10))
    ls -1t app-logs-*.tar.gz | tail -n "$REMOVE_COUNT" | xargs rm -f
    log_message "Removed $REMOVE_COUNT old archives, keeping last 10"
fi

log_message "Archive process completed successfully"