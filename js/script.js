let currentStep = 0;
let isAnimating = false;

const stepInfo = {
    'start': {
        title: '🚀 Script Initialization',
        description: 'Script starts execution. Variables are initialized including LOG_DIR="/opt/app/logs", ARCHIVE_DIR="/var/log-archive", and LOCK_FILE="/tmp/log-archive.lock". Log file entry is created marking the start of the process with timestamp.'
    },
    'lock': {
        title: '🔒 Lock File Check',
        description: 'Checks if another instance of the script is already running by looking for a lock file at /tmp/log-archive.lock. This prevents multiple instances from running simultaneously and corrupting data.'
    },
    'lock-decision': {
        title: '🤔 Lock Decision Point',
        description: 'Decision point: If lock file exists and process is still running, script exits with error message. If stale lock found (process no longer exists), it removes the lock and continues execution.'
    },
    'lock-create': {
        title: '✅ Create Lock File',
        description: 'Creates a new lock file with current process ID ($$) to prevent other instances from running simultaneously. Uses trap command to ensure cleanup on script exit.'
    },
    'validate': {
        title: '📁 Directory Validation',
        description: 'Validates that source log directory /opt/app/logs exists and is accessible. Creates archive directory /var/log-archive if it doesn\'t exist. Ensures all required paths have proper permissions.'
    },
    'check-logs': {
        title: '📄 Log File Detection',
        description: 'Scans /opt/app/logs/ directory for any log files using ls -A command. If no log files found, script exits gracefully with warning message. This was discovered during manual testing with vi-created logs.'
    },
    'archive': {
        title: '📦 Archive Creation',
        description: 'Creates a compressed tar.gz archive of all log files with date-based naming format: app-logs-YYYY-MM-DD.tar.gz. Uses tar -czf command from the application directory to maintain relative paths.'
    },
    'verify': {
        title: '✅ Archive Verification',
        description: 'Verifies the integrity of the created archive by testing if it can be read using tar -tzf command. If verification fails, the archive is deleted and script exits with error. This prevents corrupted archives.'
    },
    'cleanup': {
        title: '🧹 Archive Cleanup & Rotation',
        description: 'Removes old archives to maintain exactly 10 most recent archives. Counts existing archives using ls -1 pattern, calculates how many to remove, and uses ls -1t | tail to identify oldest files for deletion.'
    },
    'complete': {
        title: '🎉 Process Complete',
        description: 'All operations completed successfully. Final summary is logged with timestamp, original log files are removed from source directory, lock file is removed, and script exits with success code 0.'
    }
};

// Manual testing procedures discovered during development
const manualTestingSteps = {
    'log-creation': {
        title: '📝 Manual Log Creation Process',
        description: 'During development, realistic test logs were created using vi editor:\n\n• sudo vi /opt/app/logs/app.log - Added application startup, database connections, memory warnings\n• sudo vi /opt/app/logs/error.log - Added database timeouts, memory exceptions, API failures\n• sudo vi /opt/app/logs/access.log - Added HTTP requests with response codes and IP addresses'
    },
    'verification': {
        title: '✅ Manual Verification Steps',
        description: 'Testing process included:\n\n• sudo /usr/local/bin/log-archive.sh (manual execution)\n• ls -la /var/log-archive/ (verify archive creation)\n• sudo tar -tzf archive-file.tar.gz (check contents)\n• sudo cat /var/log/log-archive-script.log (review operations)\n• ls -1 /var/log-archive/app-logs-*.tar.gz | wc -l (count archives)'
    },
    'troubleshooting': {
        title: '🔧 Troubleshooting Issues Found',
        description: 'Issues discovered and resolved:\n\n• File counting problem: ls -la | wc -l counted directory entries, fixed with ls -1 pattern\n• Empty directory archiving: Added file existence check before archiving\n• Lock file cleanup: Added trap command for proper cleanup on script exit\n• Archive verification: Added integrity check before marking success'
    }
};

function showInfo(stepId) {
    const panel = document.getElementById('infoPanel');
    const title = document.getElementById('infoTitle');
    const description = document.getElementById('infoDescription');
    
    if (stepInfo[stepId]) {
        title.textContent = stepInfo[stepId].title;
        description.textContent = stepInfo[stepId].description;
        panel.classList.add('show');
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            panel.classList.remove('show');
        }, 8000);
    } else if (manualTestingSteps[stepId]) {
        title.textContent = manualTestingSteps[stepId].title;
        description.textContent = manualTestingSteps[stepId].description;
        panel.classList.add('show');
        
        setTimeout(() => {
            panel.classList.remove('show');
        }, 10000);
    }
}

function updateProgress(step) {
    const progressFill = document.getElementById('progressFill');
    const percentage = (step / 10) * 100;
    progressFill.style.width = percentage + '%';
}

function animateStep(stepNumber) {
    return new Promise((resolve) => {
        const step = document.querySelector(`[data-step="${stepNumber}"]`);
        const arrow = document.querySelector(`.arrow${stepNumber}`);
        
        if (step) {
            // Remove any existing classes
            step.classList.remove('completed', 'error');
            step.classList.add('active');
            updateProgress(stepNumber);
            
            // Show step information automatically during animation
            const stepIds = ['start', 'lock', 'lock-decision', 'lock-create', 'validate', 'check-logs', 'archive', 'verify', 'cleanup', 'complete'];
            if (stepIds[stepNumber - 1]) {
                setTimeout(() => showInfo(stepIds[stepNumber - 1]), 200);
            }
            
            setTimeout(() => {
                step.classList.remove('active');
                step.classList.add('completed');
                
                if (arrow) {
                    arrow.classList.add('animated');
                }
                
                setTimeout(resolve, 500);
            }, 1500);
        } else {
            resolve();
        }
    });
}

async function startAnimation() {
    if (isAnimating) return;
    
    isAnimating = true;
    resetAnimation();
    
    console.log('Starting log archive automation process...');
    
    try {
        for (let i = 1; i <= 10; i++) {
            console.log(`Executing step ${i}...`);
            await animateStep(i);
            
            // Special handling for decision point
            if (i === 3) {
                console.log('Evaluating lock file decision...');
                await new Promise(resolve => setTimeout(resolve, 800));
            }
            
            // Simulate brief pause between steps
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Final completion animation
        setTimeout(() => {
            const allSteps = document.querySelectorAll('.step');
            allSteps.forEach((step, index) => {
                setTimeout(() => {
                    step.style.animation = 'pulse 0.5s';
                }, index * 100);
            });
            
            console.log('Log archive automation process completed successfully!');
            
            // Show completion message
            setTimeout(() => {
                showInfo('complete');
            }, 1000);
            
            isAnimating = false;
        }, 500);
        
    } catch (error) {
        console.error('Animation error:', error);
        isAnimating = false;
    }
}

function resetAnimation() {
    const steps = document.querySelectorAll('.step');
    const arrows = document.querySelectorAll('.arrow');
    const progressFill = document.getElementById('progressFill');
    
    steps.forEach(step => {
        step.classList.remove('active', 'completed', 'error');
        step.style.animation = '';
    });
    
    arrows.forEach(arrow => {
        arrow.classList.remove('animated');
    });
    
    progressFill.style.width = '0%';
    currentStep = 0;
    isAnimating = false;
    
    console.log('Animation reset');
    
    // Hide info panel
    document.getElementById('infoPanel').classList.remove('show');
}

function simulateError() {
    if (isAnimating) return;
    
    resetAnimation();
    isAnimating = true;
    
    console.log('Simulating error scenario...');
    
    // Animate up to archive creation step, then show error
    (async () => {
        for (let i = 1; i <= 6; i++) {
            await animateStep(i);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Show error at archive creation step
        setTimeout(() => {
            const errorStep = document.querySelector('[data-step="7"]');
            errorStep.classList.add('error');
            updateProgress(6);
            
            // Show error information
            const panel = document.getElementById('infoPanel');
            const title = document.getElementById('infoTitle');
            const description = document.getElementById('infoDescription');
            
            title.textContent = '❌ Archive Creation Failed';
            description.textContent = 'Error occurred during archive creation. This could be due to:\n\n• Insufficient disk space in /var/log-archive/\n• Permission issues with tar command\n• Corrupted source log files\n• Network interruption during file operations\n\nScript will exit with error code 1. Check /var/log/log-archive-script.log for detailed error messages.';
            panel.classList.add('show');
            
            console.error('Archive creation failed - simulated error');
            
            setTimeout(() => {
                panel.classList.remove('show');
                isAnimating = false;
            }, 8000);
            
        }, 1000);
    })();
}

// Enhanced click handlers for better user experience
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Enter':
            case ' ':
                if (!isAnimating) startAnimation();
                e.preventDefault();
                break;
            case 'Escape':
            case 'r':
            case 'R':
                resetAnimation();
                e.preventDefault();
                break;
            case 'e':
            case 'E':
                if (!isAnimating) simulateError();
                e.preventDefault();
                break;
        }
    });
    
    // Add tooltips for better UX
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (button.textContent.includes('Start')) {
                button.title = 'Start the animation (Spacebar or Enter)';
            } else if (button.textContent.includes('Reset')) {
                button.title = 'Reset the animation (R key)';
            } else if (button.textContent.includes('Error')) {
                button.title = 'Simulate error scenario (E key)';
            }
        });
    });
    
    // Enhanced step click handlers
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            if (!isAnimating && !step.classList.contains('active')) {
                step.style.transform = 'scale(1.02)';
            }
        });
        
        step.addEventListener('mouseleave', function() {
            if (!isAnimating && !step.classList.contains('active')) {
                step.style.transform = '';
            }
        });
    });
});

// Auto-hide info panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('infoPanel');
    if (!panel.contains(e.target) && !e.target.classList.contains('step')) {
        panel.classList.remove('show');
    }
});

// Add smooth scrolling for better mobile experience
function smoothScroll() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Performance optimization: debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions if needed
        console.log('Window resized, recalculating layout...');
    }, 250);
});

// Add loading state management
function setLoadingState(isLoading) {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.disabled = isLoading;
        if (isLoading) {
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        } else {
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    });
}

// Initial welcome message with instructions
setTimeout(() => {
    const panel = document.getElementById('infoPanel');
    const title = document.getElementById('infoTitle');
    const description = document.getElementById('infoDescription');
    
    title.textContent = '👋 Welcome to Log Archive Automation';
    description.textContent = 'This interactive diagram shows the complete log archiving process developed with manual testing verification. Click any step for details, use the buttons above to start animation, or press Space to begin. This system was built during Day 7 of 100 Linux Challenge with comprehensive troubleshooting.';
    panel.classList.add('show');
    
    // Auto-hide welcome message
    setTimeout(() => {
        panel.classList.remove('show');
    }, 10000);
}, 1500);

// Add analytics tracking for interactions (privacy-friendly)
function trackInteraction(action, element) {
    console.log(`User interaction: ${action} on ${element}`);
    // Here you could add privacy-friendly analytics if needed
}

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error occurred:', e.error);
    // Gracefully handle any errors without breaking the user experience
});

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels for better accessibility
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.setAttribute('role', 'button');
        step.setAttribute('tabindex', '0');
        step.setAttribute('aria-label', `Step ${index + 1}: ${step.textContent}`);
    });
    
    // Add keyboard navigation for steps
    steps.forEach((step) => {
        step.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                step.click();
                e.preventDefault();
            }
        });
    });
});