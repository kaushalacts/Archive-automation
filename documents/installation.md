# 📋 Installation Guide

## Prerequisites

- Ubuntu/Debian/CentOS Linux system
- Root or sudo access
- Basic shell access
- Git (for cloning repository)

## Quick Installation

### 1. Clone the Repository
```bash
# Clone from GitHub
git clone https://github.com/yourusername/log-archive-automation.git
cd log-archive-automation
```

### 2. Setup Script
```bash
# Copy script to system location
sudo cp scripts/log-archive.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/log-archive.sh
```

### 3. Create Required Directories
```bash
# Create application and archive directories
sudo mkdir -p /opt/app/logs
sudo mkdir -p /var/log-archive
```

### 4. Test Installation
```bash
# Create test logs (manual verification method)
sudo mkdir -p /opt/app/logs

# Create realistic test logs using vi editor
sudo vi /opt/app/logs/app.log
# Add content: Application startup and database connection logs

sudo vi /opt/app/logs/error.log  
# Add content: Database timeouts and memory exceptions

sudo vi /opt/app/logs/access.log
# Add content: HTTP requests with response codes

# Run script manually to verify
sudo /usr/local/bin/log-archive.sh

# Check results
ls -la /var/log-archive/
sudo cat /var/log/log-archive-script.log
```

### 5. Setup Cron Job
```bash
# Edit root crontab
sudo crontab -e

# Add this line for daily 1:00 AM execution
0 1 * * * /usr/local/bin/log-archive.sh
```

## Manual Installation Steps

### Step 1: Script Creation
If you prefer manual setup without git:

```bash
# Create script using vi editor
sudo vi /usr/local/bin/log-archive.sh
```

Copy the complete script content from `scripts/log-archive.sh` in this repository.

### Step 2: Directory Structure
```bash
# Create complete directory structure
sudo mkdir -p /opt/app/logs
sudo mkdir -p /var/log-archive
sudo touch /var/log/log-archive-script.log
```

### Step 3: Permissions
```bash
# Set proper permissions
sudo chmod +x /usr/local/bin/log-archive.sh
sudo chown root:root /usr/local/bin/log-archive.sh
```

## Verification Steps

### Test Log Creation (Manual Method)
This is the exact verification process used during development:

1. **Create Application Logs**
```bash
sudo vi /opt/app/logs/app.log
```
Add realistic content:
```
2025-08-16 10:30:15 [INFO] Application started successfully
2025-08-16 10:30:16 [INFO] Database connection established
2025-08-16 10:35:22 [WARNING] High memory usage detected: 85%
2025-08-16 10:40:18 [INFO] User login: admin@example.com
```

2. **Create Error Logs**
```bash
sudo vi /opt/app/logs/error.log
```
Add error scenarios:
```
2025-08-16 08:15:22 [ERROR] Database timeout after 30 seconds
2025-08-16 09:22:45 [CRITICAL] Out of memory exception in module UserAuth
2025-08-16 09:55:12 [ERROR] File not found: /tmp/upload_temp.txt
```

3. **Create Access Logs**
```bash
sudo vi /opt/app/logs/access.log
```
Add HTTP requests:
```
192.168.1.100 - - [16/Aug/2025:10:30:15 +0000] "GET /api/users HTTP/1.1" 200 1024
192.168.1.101 - - [16/Aug/2025:10:31:22 +0000] "POST /api/login HTTP/1.1" 200 512
192.168.1.102 - - [16/Aug/2025:10:32:18 +0000] "GET /dashboard HTTP/1.1" 404 256
```

### Manual Testing Process

1. **Initial Script Test**
```bash
# Run script manually
sudo /usr/local/bin/log-archive.sh

# Verify archive creation
ls -la /var/log-archive/

# Check archive contents
sudo tar -tzf /var/log-archive/app-logs-$(date '+%Y-%m-%d').tar.gz

# Review operation log
sudo cat /var/log/log-archive-script.log
```

2. **Cleanup Logic Test**
```bash
# Create multiple fake archives to test cleanup
for i in {01..12}; do
    sudo touch "/var/log-archive/app-logs-2025-08-${i}.tar.gz"
done

# Run script to test cleanup (should keep only 10)
sudo /usr/local/bin/log-archive.sh

# Verify only 10 archives remain
ls -1 /var/log-archive/app-logs-*.tar.gz | wc -l
```

3. **Lock File Test**
```bash
# Test lock file mechanism by running script twice
sudo /usr/local/bin/log-archive.sh & sudo /usr/local/bin/log-archive.sh

# Check log for lock file prevention message
sudo tail /var/log/log-archive-script.log
```

## Troubleshooting

### Common Issues

**Issue 1: Permission Denied**
```bash
# Fix script permissions
sudo chmod +x /usr/local/bin/log-archive.sh
sudo chown root:root /usr/local/bin/log-archive.sh
```

**Issue 2: Directory Not Found**
```bash
# Create missing directories
sudo mkdir -p /opt/app/logs /var/log-archive
```

**Issue 3: Cron Job Not Running**
```bash
# Check cron service
sudo systemctl status cron
sudo systemctl start cron

# Verify crontab entry
sudo crontab -l
```

**Issue 4: Archive Count Issues**
The script counts only archive files, not directory entries:
```bash
# Correct way to count archives
ls -1 /var/log-archive/app-logs-*.tar.gz | wc -l

# Not this (includes directory entries)
ls -la /var/log-archive/ | wc -l
```

## Configuration Options

### Customizable Variables
Edit these variables in the script as needed:

```bash
SCRIPT_DIR="/opt/app"              # Application directory
LOG_DIR="/opt/app/logs"            # Source logs location
ARCHIVE_DIR="/var/log-archive"     # Archive storage location
LOG_FILE="/var/log/log-archive-script.log"  # Operation log file
LOCK_FILE="/tmp/log-archive.lock"  # Lock file location
```

### Archive Retention
To change the number of archives kept (default is 10):
```bash
# Find this line in the script and modify the number
if [ "$ARCHIVE_COUNT" -gt 10 ]; then
```

## Next Steps

After installation:
1. Monitor `/var/log/log-archive-script.log` for operation status
2. Check archive creation after 1:00 AM daily
3. Verify disk space usage in `/var/log-archive/`
4. Review archive integrity periodically

## Interactive Flow Diagram

View the complete process flow in our interactive diagram:
👉 [Interactive Process Diagram](../web/index.html)

## Support

For issues or questions:
- Check the [Usage Guide](usage.md)
- Review common troubleshooting steps above
- Create an issue in the GitHub repository