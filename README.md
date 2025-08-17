# 🔄 Log Archive Automation

Automated log archiving solution with interactive flow visualization for production environments. This project implements a robust shell script that handles daily log archiving with comprehensive safety features and manual verification processes.

## 🌟 Features

- ✅ **Automated Log Archiving** - Daily compression and storage at 1:00 AM
- ✅ **Lock Mechanism** - Prevents multiple instances with file locking
- ✅ **Archive Rotation** - Maintains exactly 10 most recent archives
- ✅ **Integrity Verification** - Ensures archive quality and completeness
- ✅ **Interactive Flow Diagram** - Visual process flow representation
- ✅ **Comprehensive Logging** - Detailed operation logs with timestamps
- ✅ **Manual Testing Framework** - Realistic log creation for verification
- ✅ **Production Ready** - Handles edge cases and error scenarios

## 🚀 Quick Start

### One-Line Installation
```bash
git clone https://github.com/kaushalacts/Archive-automation.git && cd archive-automation && sudo cp scripts/log-archive.sh /usr/local/bin/ && sudo chmod +x /usr/local/bin/log-archive.sh
```

### Setup Cron Job
```bash
echo "0 1 * * * /usr/local/bin/log-archive.sh" | sudo crontab -
```

### Create Test Environment
```bash
sudo mkdir -p /opt/app/logs /var/log-archive
```

## 🎯 Interactive Diagram

**👉 [View Live Interactive Process Flow](https://kaushalacts.github.io/Archive-automation/)**
 
The interactive diagram shows:
- Complete automation workflow
- Manual testing procedures  
- Error handling mechanisms
- Lock file management
- Archive cleanup process

## 📁 Repository Structure

```
log-archive-automation/
├── README.md                    # This file
├── scripts/
│   ├── log-archive.sh          # Main automation script
│   └── log-archive-simple.sh   # Simplified version
├── web/
│   ├── index.html              # Interactive flow diagram
│   ├── css/
│   │   └── style.css          # Diagram styling
│   └── js/
│       └── script.js          # Interactive functionality
├── docs/
│   ├── installation.md        # Detailed installation guide
│   └── usage.md              # Usage and troubleshooting
├── examples/
│   ├── crontab-example.txt    # Cron configuration examples
│   └── test-logs/             # Sample log files for testing
└── LICENSE                    # MIT License
```

## 📖 Documentation

### 📋 [Installation Guide](docs/installation.md)
Complete setup instructions including:
- Prerequisites and dependencies
- Manual installation steps
- Directory structure creation
- Permission configuration
- Verification procedures

### 📖 [Usage Guide](docs/usage.md)  
Comprehensive usage documentation featuring:
- Daily operation procedures
- Manual testing methodology
- Troubleshooting common issues
- Performance considerations
- Security best practices

## 🧪 Manual Testing Process

This project includes a comprehensive manual testing framework developed during implementation:

### Test Log Creation
```bash
# Create realistic application logs
sudo vi /opt/app/logs/app.log
# Content: Application startup, database connections, memory warnings

sudo vi /opt/app/logs/error.log  
# Content: Database timeouts, memory exceptions, API failures

sudo vi /opt/app/logs/access.log
# Content: HTTP requests with response codes and IP addresses
```

### Verification Steps
```bash
# Test script execution
sudo /usr/local/bin/log-archive.sh

# Verify archive creation
ls -la /var/log-archive/

# Check archive contents  
sudo tar -tzf /var/log-archive/app-logs-$(date '+%Y-%m-%d').tar.gz

# Review operation logs
sudo cat /var/log/log-archive-script.log
```

### Edge Case Testing
- **Lock File Mechanism**: Tested simultaneous execution prevention
- **Cleanup Logic**: Verified retention of exactly 10 archives
- **Empty Directory Handling**: Tested behavior with no logs
- **File Count Accuracy**: Resolved directory entry counting issues

## 🔧 Configuration

### Default Settings
```bash
SCRIPT_DIR="/opt/app"                           # Application directory
LOG_DIR="/opt/app/logs"                        # Source logs location  
ARCHIVE_DIR="/var/log-archive"                 # Archive storage
LOG_FILE="/var/log/log-archive-script.log"    # Operation log
LOCK_FILE="/tmp/log-archive.lock"              # Lock file location
```

### Customization Options
- **Archive Retention**: Modify archive count (default: 10)
- **Schedule**: Change cron timing (default: 1:00 AM daily)
- **Directories**: Customize source and destination paths
- **Compression**: Adjust tar compression settings

## 🛠️ Troubleshooting

### Common Issues Resolved During Development

**File Counting Problem**
```bash
# Issue: ls -la | wc -l counted directory entries  
# Solution: Use specific pattern matching
ls -1 /var/log-archive/app-logs-*.tar.gz | wc -l
```

**Lock File Management**
```bash
# Issue: Lock files remained after script crashes
# Solution: Added trap command for cleanup on exit
trap cleanup EXIT
```

**Empty Directory Archiving**
```bash
# Issue: Script tried to archive empty directories
# Solution: Added file existence check before archiving
if [ -z "$(ls -A "$LOG_DIR" 2>/dev/null)" ]; then
```

## 🎨 Interactive Features

### Web-Based Flow Diagram
- **Real-time Process Visualization**: See the complete workflow
- **Interactive Elements**: Click through each step
- **Mobile Responsive**: Works on all devices
- **Error Path Visualization**: Shows troubleshooting flows

### Manual Testing Integration
- **Step-by-Step Verification**: Follow exact testing procedures
- **Real Log Examples**: Use actual log content from testing
- **Validation Checkpoints**: Verify each stage manually

## 🔒 Security Features

- **File Permission Management**: Secure access controls
- **Lock File Prevention**: Prevents concurrent execution
- **Audit Logging**: Complete operation history
- **Error Handling**: Graceful failure management

## 📊 Monitoring

### Operation Monitoring
```bash
# Real-time log monitoring
sudo tail -f /var/log/log-archive-script.log

# Check recent archives
ls -lt /var/log-archive/ | head -10

# Verify archive integrity
sudo tar -tzf /var/log-archive/app-logs-*.tar.gz
```

### Performance Metrics
- Archive creation time tracking
- Compression ratio monitoring  
- Disk space utilization
- Error rate analysis

## 🤝 Contributing

### Development Process
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/improvement`)
3. **Test** manually using provided framework
4. **Commit** changes (`git commit -am 'Add improvement'`)
5. **Push** to branch (`git push origin feature/improvement`)
6. **Create** Pull Request

### Testing Requirements
- All new features must include manual testing procedures
- Update documentation for any configuration changes
- Verify edge case handling
- Test with realistic log data

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💻 Author

 * Kaushal Kishore*
- GitHub: [@github](https://github.com/kaushalacts)
- LinkedIn: [My Profile](https://linkedin.com/in/kaushalacts)
- Project: [Log Archive Automation](https://github.com/kaushalacts/log-archive-automation)

## 🙏 Acknowledgments

- Developed as part of 100 Days of Linux System Administration
- Manual testing methodology inspired by production troubleshooting
- Interactive diagram designed for educational purposes

---

## 🌐 Live Demo

**Interactive Process Flow**: https://kaushalacts.github.io/log-archive-automation/web/

**Repository**: https://github.com/kaushalacts/log-archive-automation

**Documentation**: [Installation](docs/installation.md) | [Usage](docs/usage.md)

---

*Built with ❤️ for production environments and educational purposes*
