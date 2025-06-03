// Theme switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle'); // <-- fix here
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.className = currentTheme;
    themeToggle.checked = currentTheme === 'dark';

    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.className = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            body.className = 'light';
            localStorage.setItem('theme', 'light');
        }
    });

    // Optional: Add keyboard support (Space/Enter to toggle)
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
    });
});