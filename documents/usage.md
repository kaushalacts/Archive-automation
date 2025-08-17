# 📖 Usage Guide

## Overview

The Log Archive Automation script provides automated daily log archiving with comprehensive safety features and monitoring capabilities.

## How It Works

### Daily Automation Process
1. **1:00 AM Daily**: Cron job triggers the script
2. **Lock Check**: Prevents multiple instances from running
3. **Log Collection**: Archives all files from `/opt/app/logs/`
4. **Compression**: Creates dated `.tar.gz` file
5. **Cleanup**: Removes original logs after successful archive
6. **Rotation**: Keeps only the 10 most recent archives
7. **Logging**: Records all operations with timestamps

## Manual Operations

### Running the Script Manually
```bash
# Execute immediate archiving
sudo /usr/local/bin/log-archive.sh

# Check execution status
echo $?  # 0 = success, 1 = error/already running
```

### Monitoring Operations
```bash
# View recent log entries
sudo tail -f /var/log/log-archive-script.log

# Check current archives
ls -la /var/log-archive/

# Count total archives
ls -1 /var/log-archive/app-logs-*.tar.gz | wc -l

# View archive contents without extracting
sudo tar -tzf /var/log-archive/app-logs-2025-08-16.tar.gz
```

### Manual Testing Process (Development Method)

This section documents the exact testing methodology used during script development:

#### Test Log Creation Process
**Step 1: Create Realistic Application Logs**
```bash
sudo vi /opt/app/logs/app.log
```
Manual content added during testing:
```
2025-08-16 10:30:15 [INFO] Application started successfully
2025-08-16 10:30:16 [INFO] Database connection established  
2025-08-16 10:35:22 [WARNING] High memory usage detected: 85%
2025-08-16 10:40:18 [INFO] User login: admin@example.com
2025-08-16 10:45:33 [ERROR] Failed to connect to external API
2025-08-16 10:50:12 [INFO] Backup process initiated
```

**Step 2: Create Error Scenarios**
```bash
sudo vi /opt/app/logs/error.log
```
Realistic error content:
```
2025-08-16 08:15:22 [ERROR] Database timeout after 30 seconds
2025-08-16 09:22:45 [CRITICAL] Out of memory exception in module UserAuth
2025-08-16 09:55:12 [ERROR] File not found: /tmp/upload_temp.txt
2025-08-16 10:12:33 [ERROR] Invalid JSON format in API request
```

**Step 3: Create Web Server Access Logs**
```bash
sudo vi /opt/app/logs/access.log
```
HTTP request simulation:
```
192.168.1.100 - - [16/Aug/2025:10:30:15 +0000] "GET /api/users HTTP/1.1" 200 1024
192.168.1.101 - - [16/Aug/2025:10:31:22 +0000] "POST /api/login HTTP/1.1" 200 512
192.168.1.102 - - [16/Aug/2025:10:32:18 +0000] "GET /dashboard HTTP/1.1" 404 256
192.168.1.103 - - [16/Aug/2025:10:33:45 +0000] "PUT /api/profile HTTP/1.1" 500 128
```

#### Verification Testing Steps

**Test 1: Basic Archive Creation**
```bash
# Initial manual execution
sudo /usr/local/bin/log-archive.sh

# Verification commands used
ls -la /var/log-archive/
sudo cat /var/log/log-archive-script.log
sudo tar -tzf /var/log-archive/app-logs-$(date '+%Y-%m-%d').tar.gz
```

**Test 2: Cleanup Logic Verification**
```bash
# Created multiple test archives
for i in {01..12}; do
    sudo touch "/var/log-archive/app-logs-2025-08-${i}.tar.gz"
done

# Verified count before cleanup
ls -1 /var/log-archive/app-logs-*.tar.gz | wc -l

# Ran script to test cleanup
sudo /usr/local/bin/log-archive.sh

# Verified only 10 archives remained
ls -1 /var/log-archive/app-logs-*.tar.gz | wc -l
```

**Test 3: Lock File Mechanism**
```bash
# Tested simultaneous execution prevention
sudo /usr/local/bin/log-archive.sh & sudo /usr/local/bin/log-archive.sh

# Checked for lock file error message
sudo tail /var/log/log-archive-script.log
```

**Test 4: Edge Case Handling**
```bash
# Tested empty log directory
sudo rm -rf /opt/app/logs/*
sudo /usr/local/bin/log-archive.sh

# Tested non-existent log directory
sudo rm -rf /opt/app/logs
sudo /usr/local/bin/log-archive.sh
```

#### Troubleshooting Issues Discovered

**Issue 1: File Count Confusion**
- Problem: `ls -la | wc -l` was counting directory entries
- Solution: Use `ls -1 /var/log-archive/app-logs-*.tar.gz | wc -l`

**Issue 2: Empty Directory Archiving**
- Problem: Script tried to archive empty directories
- Solution: Added check for existing files before archiving

**Issue 3: Lock File Cleanup**
- Problem: Lock file remained if script crashed
- Solution: Added trap command for cleanup on exit

## Cron Job Management

### View Current Cron Jobs
```bash
# List active cron jobs
sudo crontab -l

# Check cron service status
sudo systemctl status cron
```

### Modify Schedule
```bash
# Edit crontab
sudo crontab -e

# Example schedules:
# Daily at 1:00 AM (default)
0 1 * * * /usr/local/bin/log-archive.sh

# Daily at 2:30 AM
30 2 * * * /usr/local/bin/log-archive.sh

# Twice daily (1 AM and 1 PM)
0 1,13 * * * /usr/local/bin/log-archive.sh
```

### Temporarily Disable
```bash
# Comment out the cron job
sudo crontab -e
# Add # at the beginning of the line
# 0 1 * * * /usr/local/bin/log-archive.sh
```

## Archive Management

### Extracting Archived Logs
```bash
# Extract to temporary directory
mkdir /tmp/log-extract
cd /tmp/log-extract
sudo tar -xzf /var/log-archive/app-logs-2025-08-16.tar.gz

# View extracted files
ls -la logs/
```

### Manual Archive Cleanup
```bash
# Remove archives older than 30 days
find /var/log-archive/ -name "app-logs-*.tar.gz" -mtime +30 -delete

# Remove specific archive
sudo rm /var/log-archive/app-logs-2025-08-01.tar.gz
```

### Archive Verification
```bash
# Test archive integrity
sudo tar -tzf /var/log-archive/app-logs-2025-08-16.tar.gz > /dev/null
echo $?  # 0 = archive is valid

# Check archive size
du -h /var/log-archive/app-logs-*.tar.gz
```

## Configuration Customization

### Changing Archive Location
Edit the script and modify:
```bash
ARCHIVE_DIR="/var/log-archive"
```

### Changing Retention Policy
Modify the cleanup logic:
```bash
# Keep 15 archives instead of 10
if [ "$ARCHIVE_COUNT" -gt 15 ]; then
    REMOVE_COUNT=$((ARCHIVE_COUNT - 15))
```

### Changing Log Sources
Modify the source directory:
```bash
LOG_DIR="/opt/app/logs"
```

## Monitoring and Alerts

### Log File Monitoring
```bash
# Real-time monitoring
sudo tail -f /var/log/log-archive-script.log

# Search for errors
sudo grep "ERROR" /var/log/log-archive-script.log

# Check recent operations
sudo tail -20 /var/log/log-archive-script.log
```

### Disk Space Monitoring
```bash
# Check archive directory space usage
du -sh /var/log-archive/

# Check available space
df -h /var/log-archive/
```

### Setting Up Alerts
```bash
# Create simple email alert script
sudo vi /usr/local/bin/check-archive-status.sh
```

Add email notification for failures:
```bash
#!/bin/bash
if grep -q "ERROR" /var/log/log-archive-script.log; then
    mail -s "Log Archive Error" admin@yourdomain.com < /var/log/log-archive-script.log
fi
```

## Performance Considerations

### Large Log Files
For applications generating large log files:
- Consider compression level adjustment
- Monitor archive creation time
- Plan storage capacity accordingly

### High-Frequency Logging
For high-volume applications:
- Consider hourly archiving instead of daily
- Implement log rotation before archiving
- Monitor disk I/O during archive operations

## Security Considerations

### File Permissions
```bash
# Secure archive directory
sudo chmod 750 /var/log-archive
sudo chown root:adm /var/log-archive

# Secure log files
sudo chmod 640 /var/log/log-archive-script.log
```

### Archive Encryption
For sensitive logs, consider encrypting archives:
```bash
# Example: GPG encryption
gpg --cipher-algo AES256 --compress-algo 1 --symmetric archive.tar.gz
```

## Interactive Process Flow

For a visual understanding of the entire process, view our interactive diagram:
👉 [Interactive Flow Diagram](../web/index.html)

This diagram shows:
- Complete process flow
- Decision points
- Error handling paths
- Manual intervention points

## Best Practices

1. **Regular Monitoring**: Check operation logs weekly
2. **Disk Space**: Monitor archive directory space usage
3. **Testing**: Periodically test archive extraction
4. **Backup**: Consider backing up critical archives off-site
5. **Documentation**: Keep configuration changes documented

## Common Use Cases

### Development Environment
- Set shorter retention (5 archives)
- Run more frequently for testing
- Include debug logs

### Production Environment  
- Maintain longer retention (10+ archives)
- Monitor disk space closely
- Set up failure alerts
- Regular integrity checks

### High-Availability Systems
- Consider redundant archive storage
- Implement archive replication
- Set up monitoring dashboards

## Support and Troubleshooting

For additional help:
1. Check the [Installation Guide](installation.md)
2. Review error messages in operation log
3. Verify file permissions and ownership
4. Test with minimal log files first
5. Create GitHub issue for persistent problems