/**
 * Projects Component
 * Handles dynamic project loading and display
 */

class ProjectsManager {
    constructor() {
        this.projectsGrid = document.getElementById('projectsGrid');
        this.loadMoreBtn = document.getElementById('loadMoreProjects');
        this.currentPage = 0;
        this.projectsPerPage = 6;
        
        this.projects = [
            {
                title: "Portfolio Website",
                description: "Personal portfolio website with interactive terminal, project showcase, and contact form. Built with modern web technologies and optimized for performance.",
                image: "💼",
                tags: ["HTML5", "CSS3", "JavaScript", "Performance", "SEO"],
                githubUrl: "https://github.com/a1frmthe8/Portfolio/tree/main/Portfolio",
                featured: true
            },
            {
                title: "Restaurant Website",
                description: "Modern restaurant website with online reservations, menu management, and customer reviews. Includes admin panel for restaurant owners.",
                image: "🍽️",
                tags: ["HTML5", "CSS3", "Javascript", "Google Maps"],
                liveUrl: "https://restaurant-8s0.pages.dv/",
                githubUrl:"https://github.com/a1frmthe8/Restaurant",
                featured: true
            },
            {
                title: "Valentine's Day Card Web Page",
                description: "Valentine's Day Card with interactive buttons which change size depending on the decision made and changing the gif currently being show. Built as a Web app.",
                image: "❤️",
                tags: ["HTML5", "CSS3", "JavaScript", "Web App"],
                liveUrl: "https://love-3vu.pages.dev/",
                githubUrl: "https://github.com/adam-dev/task-manager",
                featured: true
            },
            {
                title: "Jarvis AI Assistant",
                description: "Modern AI assistant powered by OpenAI's GPT API. Features include real-time conversations, markdown support, conversation history.",
                image: "🤖",
                tags: ["Python"],
                githubUrl: "https://github.com/adam-dev/ai-chat",
                featured: true
            },
            {
                title: "Work in Progress",
                description: "Coming soon! This project is under development.",
                image: "🛒",
                tags: [""],
                featured: false
            },
            {
                title: "Work in Progress",
                description: "Coming soon! This project is under development.",
                image: "🛒",
                tags: [""],
                featured: false
            },
            {
                title: "Work in Progress",
                description: "Coming soon! This project is under development.",
                image: "🛒",
                tags: [""],
                featured: false
            },
            {
                title: "Work in Progress",
                description: "Coming soon! This project is under development.",
                image: "🛒",
                tags: [""],
                featured: false
            },
            {
                title: "Work in Progress",
                description: "Coming soon! This project is under development.",
                image: "🛒",
                tags: [""],
                featured: false
            },
        ];

        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.loadMoreBtn?.addEventListener('click', () => {
            this.loadMoreProjects();
        });
    }

    loadProjects() {
        // Load initial featured projects
        const featuredProjects = this.projects.filter(project => project.featured);
        this.renderProjects(featuredProjects);
        
        // Check if there are more projects to load
        if (this.projects.length > featuredProjects.length) {
            this.loadMoreBtn.style.display = 'inline-block';
        }
    }

    loadMoreProjects() {
        const remainingProjects = this.projects.filter(project => !project.featured);
        this.renderProjects(remainingProjects, true);
        this.loadMoreBtn.style.display = 'none';
    }

    renderProjects(projects, append = false) {
        if (!append) {
            this.projectsGrid.innerHTML = '';
        }

        projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project);
            this.projectsGrid.appendChild(projectCard);
            
            // Add staggered animation
            setTimeout(() => {
                projectCard.classList.add('loaded');
            }, index * 100);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card loading';
        
        // If project.image matches a URL, render an <img>, else render emoji
        const isImageUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)$/i.test(project.image);
        const imageHtml = isImageUrl
            ? `<img src="${project.image}" alt="${project.title} logo" class="project-img" style="max-width: 100%; max-height: 100%;" />`
            : `<span style="font-size: 3rem;">${project.image}</span>`;

        card.innerHTML = `
            <div class="project-image">
            ${imageHtml}
            </div>
            <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <div class="project-links">
            ${project.liveUrl ? `
                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
                Live Demo →
                </a> ` : ''}
            ${project.githubUrl ? `
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
                GitHub →
                </a> ` : ''}
            </div>
            </div>
        `;

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        return card;
    }

    // Method to add new project (for future use)
    addProject(project) {
        this.projects.unshift(project);
        this.renderProjects([project], false);
    }

    // Method to filter projects by tag
    filterByTag(tag) {
        const filteredProjects = this.projects.filter(project => 
            project.tags.some(projectTag => 
                projectTag.toLowerCase().includes(tag.toLowerCase())
            )
        );
        this.renderProjects(filteredProjects);
        this.loadMoreBtn.style.display = 'none';
    }

    // Method to search projects
    searchProjects(query) {
        const searchResults = this.projects.filter(project =>
            project.title.toLowerCase().includes(query.toLowerCase()) ||
            project.description.toLowerCase().includes(query.toLowerCase()) ||
            project.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        this.renderProjects(searchResults);
        this.loadMoreBtn.style.display = 'none';
    }

    // Method to reset to default view
    resetView() {
        this.loadProjects();
    }
}

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});