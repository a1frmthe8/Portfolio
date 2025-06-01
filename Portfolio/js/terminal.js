/**
 * Terminal Component
 * Handles interactive terminal functionality with extended commands
 */

class Terminal {
    constructor() {
        this.terminalBody = document.getElementById('terminalBody');
        this.commandInput = document.getElementById('commandInput');
        this.currentLine = document.querySelector('.current-line');
        this.commandHistory = [];
        this.historyIndex = 0;
        
        this.commands = {
            'help': 'Available commands:\n• help - Show this help message\n• clear - Clear terminal\n• whoami - Display current user\n• date - Show current date and time\n• pwd - Print working directory\n• echo [text] - Display text\n• git status - Show git repository status\n• git log - Show commit history\n• npm --version - Show npm version\n• node --version - Show Node.js version\n• python3 --version - Show Python version\n• skills - Display technical skills\n• projects - Show recent projects\n• contact - Display contact information\n• neofetch - Show system information\n• ls - List directory contents\n• cat [file] - Display file contents',
            'clear': 'CLEAR_COMMAND',
            'whoami': 'adam',
            'date': () => new Date().toString(),
            'pwd': '/Users/adam/portfolio',
            'git status': 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean',
            'git log': 'commit 2f8a1b9c (HEAD -> main, origin/main)\nAuthor: Adam <adam@portfolio.dev>\nDate: Sat May 31 14:23:17 2025\n\n    Add interactive terminal and modern styling\n\ncommit 1a5c2d8f\nAuthor: Adam <adam@portfolio.dev>\nDate: Fri May 30 18:45:32 2025\n\n    Implement responsive portfolio layout\n\ncommit 8b3e4f1a\nAuthor: Adam <adam@portfolio.dev>\nDate: Thu May 29 12:15:28 2025\n\n    Initial portfolio setup with hero section',
            'npm --version': '10.5.0',
            'node --version': 'v20.12.2',
            'python3 --version': 'Python 3.11.8',
            'skills': 'Technical Skills:\n\n🎨 Frontend:\n• React, Vue.js, Angular\n• TypeScript, JavaScript (ES6+)\n• HTML5, CSS3, SASS\n• Tailwind CSS, Bootstrap\n• Next.js, Nuxt.js\n• Webpack, Vite\n\n⚙️ Backend:\n• Node.js, Express.js\n• Python, Django, Flask\n• MongoDB, PostgreSQL, MySQL\n• GraphQL, REST APIs\n• Docker, Kubernetes\n\n☁️ Cloud & DevOps:\n• AWS, Google Cloud, Azure\n• CI/CD, GitHub Actions\n• Nginx, Apache\n• Linux, Ubuntu',
            'projects': 'Recent Projects:\n\n1. 🌐 E-Commerce Platform\n   • React + Node.js + MongoDB\n   • Payment integration with Stripe\n   • Admin dashboard with analytics\n   • Live: ecommerce-demo.portfolio.dev\n\n2. 📱 Task Management App\n   • Vue.js + Express + PostgreSQL\n   • Real-time collaboration\n   • PWA with offline support\n   • Live: taskapp.portfolio.dev\n\n3. 🎨 Design System Library\n   • React components + Storybook\n   • TypeScript + SASS\n   • NPM package with 1k+ downloads\n   • GitHub: github.com/adam-dev/design-system\n\n4. 🤖 AI Chat Interface\n   • Next.js + OpenAI API\n   • Real-time messaging\n   • Markdown support\n   • Live: ai-chat.portfolio.dev',
            'contact': 'Contact Information:\n\n📧 Email: adam@portfolio.dev\n💼 LinkedIn: linkedin.com/in/adam-dev\n🐙 GitHub: github.com/adam-dev\n🌐 Website: portfolio.dev\n📱 Phone: Available upon request\n\n💬 Feel free to reach out for:\n• Web development projects\n• Technical consultations\n• Collaboration opportunities\n• Speaking engagements',
            'neofetch': 'NEOFETCH_COMMAND',
            'ls': 'total 24\ndrwxr-xr-x   8 adam  staff   256 May 31 14:23 .\ndrwxr-xr-x   3 root  wheel    96 May 30 10:15 ..\n-rw-r--r--   1 adam  staff   220 May 31 14:20 .bash_profile\ndrwxr-xr-x   3 adam  staff    96 May 31 12:30 Desktop\ndrwxr-xr-x   4 adam  staff   128 May 31 11:45 Documents\ndrwxr-xr-x   6 adam  staff   192 May 31 13:15 Projects\n-rw-r--r--   1 adam  staff  1024 May 31 14:23 README.md\n-rw-r--r--   1 adam  staff   512 May 31 14:21 portfolio.js\n-rw-r--r--   1 adam  staff   2048 May 31 14:22 styles.css'
        };

        this.fileContents = {
            'README.md': '# Adam\'s Portfolio\n\nWelcome to my web development portfolio! This site showcases my skills in:\n\n- Frontend Development (React, Vue.js, TypeScript)\n- Backend Development (Node.js, Express, MongoDB)\n- UI/UX Design & Responsive Web Design\n- Modern Web Technologies & Performance Optimization\n- Cloud Infrastructure & DevOps\n\nFeel free to explore my projects and get in touch if you\'d like to collaborate!\n\n## Recent Updates\n- Added interactive terminal interface\n- Implemented modern design system\n- Enhanced responsive layout\n- Optimized performance metrics',
            '.bash_profile': '# Adam\'s Bash Profile\n\n# Environment Variables\nexport NODE_ENV=development\nexport EDITOR=code\nexport PATH="/usr/local/bin:$PATH"\n\n# Aliases\nalias ll="ls -la"\nalias gs="git status"\nalias gc="git commit"\nalias gp="git push"\nalias npm-update="npm update -g"\n\n# Welcome message\necho "Welcome back, Adam! 👋"\necho "Current directory: $(pwd)"\necho "Git branch: $(git branch --show-current 2>/dev/null || echo \'not a git repo\')"\n\n# Node.js version manager\nexport NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.focusInput();
    }

    setupEventListeners() {
        // Handle command input
        this.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autocomplete();
            }
        });

        // Focus input when clicking on terminal
        this.terminalBody.addEventListener('click', () => {
            this.focusInput();
        });

        // Setup traffic light controls
        this.setupTrafficLights();
    }

    setupTrafficLights() {
        const closeBtn = document.querySelector('.traffic-light.close');
        const minimizeBtn = document.querySelector('.traffic-light.minimize');
        const maximizeBtn = document.querySelector('.traffic-light.maximize');

        closeBtn?.addEventListener('click', () => {
            document.querySelector('.iterm-window').style.display = 'none';
        });

        minimizeBtn?.addEventListener('click', () => {
            const window = document.querySelector('.iterm-window');
            window.style.transform = 'scale(0.1)';
            window.style.opacity = '0';
            setTimeout(() => {
                window.style.transform = 'scale(1)';
                window.style.opacity = '1';
            }, 1000);
        });

        maximizeBtn?.addEventListener('click', () => {
            const window = document.querySelector('.iterm-window');
            if (window.style.width === '100vw') {
                window.style.width = '100%';
                window.style.height = 'auto';
                window.style.borderRadius = '12px';
                window.style.maxWidth = '900px';
                window.style.margin = '0 auto';
            } else {
                window.style.width = '100vw';
                window.style.height = '100vh';
                window.style.borderRadius = '0';
                window.style.maxWidth = 'none';
                window.style.margin = '0';
            }
        });
    }

    executeCommand() {
        const command = this.commandInput.value.trim();
        if (!command) return;

        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;

        // Display command
        this.addCommandLine(command);

        // Process command
        this.processCommand(command);

        // Clear input
        this.commandInput.value = '';
        this.scrollToBottom();
    }

    addCommandLine(command) {
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="prompt">adam@MacBook-Pro ~ %</span><span class="command">${command}</span>`;
        this.terminalBody.insertBefore(commandLine, this.currentLine);
    }

    processCommand(command) {
        const [cmd, ...args] = command.split(' ');

        if (cmd === 'clear') {
            this.clearTerminal();
            return;
        }

        if (cmd === 'echo') {
            this.addOutput(args.join(' '));
            return;
        }

        if (cmd === 'cat') {
            this.handleCatCommand(args[0]);
            return;
        }

        if (this.commands[command]) {
            if (command === 'neofetch') {
                this.displayNeofetch();
            } else {
                const output = typeof this.commands[command] === 'function' 
                    ? this.commands[command]() 
                    : this.commands[command];
                
                const className = cmd === 'git' ? 'success' : '';
                this.addOutput(output, className);
            }
        } else {
            this.addOutput(`zsh: command not found: ${cmd}`, 'error');
        }
    }

    handleCatCommand(filename) {
        if (!filename) {
            this.addOutput('cat: missing file operand', 'error');
            return;
        }

        if (this.fileContents[filename]) {
            this.addOutput(this.fileContents[filename]);
        } else {
            this.addOutput(`cat: ${filename}: No such file or directory`, 'error');
        }
    }

    addOutput(text, className = '') {
        const output = document.createElement('div');
        output.className = `output ${className}`;
        output.textContent = text;
        this.terminalBody.insertBefore(output, this.currentLine);
    }

    displayNeofetch() {
        // Add the existing neofetch display from your terminal
        const neofetchOutput = document.querySelector('.ascii-art').cloneNode(true);
        const systemInfo = document.querySelector('.output.info').cloneNode(true);
        
        this.terminalBody.insertBefore(neofetchOutput, this.currentLine);
        this.terminalBody.insertBefore(systemInfo, this.currentLine);
    }

    clearTerminal() {
        // Remove all elements except the current line
        const children = Array.from(this.terminalBody.children);
        children.forEach(child => {
            if (!child.classList.contains('current-line')) {
                child.remove();
            }
        });
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.commandInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.commandInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex++;
            this.commandInput.value = '';
        }
    }

    autocomplete() {
        const input = this.commandInput.value;
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.commandInput.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`Available commands: ${matches.join(', ')}`);
        }
    }

    focusInput() {
        this.commandInput.focus();
    }

    scrollToBottom() {
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});