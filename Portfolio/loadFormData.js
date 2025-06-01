// Function to load countries from locales.json
async function loadCountries() {
    try {
        const response = await fetch('./locales.json');
        const data = await response.json();
        
        const countrySelect = document.getElementById('country');
        
        // Clear the loading option
        countrySelect.innerHTML = '';
        
        // Add a default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a country';
        countrySelect.appendChild(defaultOption);
        
        // Assuming the JSON structure has countries in an array or object
        // You may need to adjust this based on your actual JSON structure
        let countries;
        
        // Handle different possible JSON structures
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
                countrySelect.appendChild(option);
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
                countrySelect.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error('Error loading countries:', error);
        const countrySelect = document.getElementById('country');
        countrySelect.innerHTML = '<option value="">Error loading countries</option>';
    }
}

// Load countries when the page loads
document.addEventListener('DOMContentLoaded', loadCountries);