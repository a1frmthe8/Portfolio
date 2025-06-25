/**
 * Form Component
 * Handles contact form functionality and country loading
 */

class FormManager {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.countrySelect = document.getElementById('country');
        this.submitButton = this.contactForm?.querySelector('.submit-button');
        
        this.init();
    }

    init() {
        this.loadCountries();
        this.setupFormValidation();
        this.setupFormSubmission();
    }

    async loadCountries() {
        try {
            // Try to load from locales.json first
            const response = await fetch('./locales.json');
            const data = await response.json();
            this.populateCountries(data);
        } catch (error) {
            console.warn('Could not load locales.json, using fallback countries');
            this.loadFallbackCountries();
        }
    }

    populateCountries(data) {
        if (!this.countrySelect) return;

        // Clear loading option
        this.countrySelect.innerHTML = '<option value="">Select a country</option>';
        
        let countries;
        
        // Handle different JSON structures
        if (Array.isArray(data)) {
            countries = data;
        } else if (data.countries) {
            countries = data.countries;
        } else if (data.locales) {
            countries = data.locales;
        } else {
            // If it's an object with country codes as keys
            countries = Object.keys(data).map(key => ({
                name: data[key].name || data[key],
                code: key
            }));
        }
        
        // Sort countries alphabetically
        if (countries[0] && typeof countries[0] === 'string') {
            countries.sort();
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                this.countrySelect.appendChild(option);
            });
        } else {
            // If countries is an array of objects
            countries.sort((a, b) => {
                const nameA = a.name || a.label || a.value || '';
                const nameB = b.name || b.label || b.value || '';
                return nameA.localeCompare(nameB);
            });
            
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code || country.value || country.name;
                option.textContent = country.name || country.label || country.value;
                this.countrySelect.appendChild(option);
            });
        }
    }

    loadFallbackCountries() {
        const fallbackCountries = [
            'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
            'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark',
            'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore',
            'Brazil', 'Mexico', 'Argentina', 'India', 'China', 'Russia'
        ].sort();

        this.countrySelect.innerHTML = '<option value="">Select a country</option>';
        
        fallbackCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            this.countrySelect.appendChild(option);
        });
    }

    setupFormValidation() {
        if (!this.contactForm) return;

        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Name validation (no numbers)
        if ((field.id === 'fname' || field.id === 'lname') && value) {
            const nameRegex = /^[a-zA-Z\s'-]+$/;
            if (!nameRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid name';
            }
        }

        // Minimum length for message
        if (field.id === 'subject' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Please provide more details (minimum 10 characters)';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--error)';
        field.style.background = '#fef2f2';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.background = '';
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    setupFormSubmission() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    async handleFormSubmit() {
    // Validate all fields
    const inputs = this.contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!this.validateField(input)) {
            isFormValid = false;
        }
    });

    // --- RECAPTCHA CHECK ---
    const recaptcha = document.querySelector('.g-recaptcha');
    if (recaptcha) {
        const response = grecaptcha.getResponse();
        if (!response) {
            this.showFormMessage('Please complete the reCAPTCHA to prove you are human.', 'error');
            return;
        }
    }
    // --- END RECAPTCHA CHECK ---

    if (!isFormValid) {
        this.showFormMessage('Please correct the errors above', 'error');
        return;
    }

    // Show loading state
    this.setSubmitButtonState('loading');

    try {
        // Collect form data
        const formData = new FormData(this.contactForm);
        // Submit to Formspree endpoint
        await this.submitFormData(formData);

        // Show success message
        this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        this.contactForm.reset();
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        this.setSubmitButtonState('default');
    }
}

    async submitFormData(formData) {
        // Submit form data to Formspree endpoint
        const response = await fetch('https://formspree.io/f/xgvynbwr', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Formspree submission failed');
        }
        return response.json();
    }

    setSubmitButtonState(state) {
        if (!this.submitButton) return;

        const span = this.submitButton.querySelector('span');
        const svg = this.submitButton.querySelector('svg');

        switch (state) {
            case 'loading':
                this.submitButton.disabled = true;
                span.textContent = 'Sending...';
                svg.style.animation = 'spin 1s linear infinite';
                break;
            case 'success':
                span.textContent = 'Sent!';
                svg.style.animation = '';
                setTimeout(() => {
                    if (span) span.textContent = 'Send Message';
                }, 2000);
                break;
            case 'default':
            default:
                this.submitButton.disabled = false;
                span.textContent = 'Send Message';
                svg.style.animation = '';
                break;
        }
    }

    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Style the message
        messageElement.style.padding = '1rem';
        messageElement.style.borderRadius = '8px';
        messageElement.style.marginBottom = '1rem';
        messageElement.style.fontWeight = '500';
        
        if (type === 'success') {
            messageElement.style.background = '#ecfdf5';
            messageElement.style.color = '#065f46';
            messageElement.style.border = '1px solid #a7f3d0';
        } else {
            messageElement.style.background = '#fef2f2';
            messageElement.style.color = '#991b1b';
            messageElement.style.border = '1px solid #fecaca';
        }

        // Insert message at the top of the form
        this.contactForm.insertBefore(messageElement, this.contactForm.firstChild);

        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
}

// Add CSS for the loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize form manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormManager();
});

// Disable submit button by default if reCAPTCHA is present
document.addEventListener('DOMContentLoaded', function() {
    var recaptcha = document.querySelector('.g-recaptcha');
    var submitBtn = document.getElementById('submitBtn');
    if (recaptcha && submitBtn) {
        submitBtn.disabled = true;
        window.enableSubmit = function() {
            submitBtn.disabled = false;
        };
        window.disableSubmit = function() {
            submitBtn.disabled = true;
        };
    }
});