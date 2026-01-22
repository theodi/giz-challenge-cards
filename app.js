// Parse CSV with proper handling of quoted fields
function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];
    
    // Get headers
    const headers = parseCSVLine(lines[0]);
    const data = [];
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    
    return data;
}

// Parse a single CSV line, handling quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add last field
    result.push(current.trim());
    
    return result;
}

// Get challenge number from URL parameter
function getChallengeNumber() {
    const params = new URLSearchParams(window.location.search);
    const challenge = params.get('challenge');
    return challenge ? parseInt(challenge, 10) : null;
}

// Load challenge title from challenges.csv
async function getChallengeTitle(challengeNumber) {
    try {
        const response = await fetch('link-lists/challenges.csv');
        if (!response.ok) {
            return null;
        }
        const csvText = await response.text();
        const challenges = parseCSV(csvText);
        const challenge = challenges.find(c => parseInt(c.challenge, 10) === challengeNumber);
        return challenge ? challenge.title : null;
    } catch (error) {
        console.error('Error loading challenge titles:', error);
        return null;
    }
}

// Load and display all challenges as a list
async function loadChallengeList() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const contentEl = document.getElementById('challenge-content');
    const pageTitleEl = document.querySelector('.page-title');
    
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    contentEl.innerHTML = '';
    
    try {
        const response = await fetch('link-lists/challenges.csv');
        if (!response.ok) {
            throw new Error('Could not load challenges list');
        }
        
        const csvText = await response.text();
        const challenges = parseCSV(csvText);
        
        if (challenges.length === 0) {
            throw new Error('No challenges found');
        }
        
        // Update page title
        pageTitleEl.textContent = 'Reference Lists';
        document.title = 'Reference Lists | ODI';
        
        // Create the list
        const section = document.createElement('section');
        section.className = 'reference-section';
        
        const list = document.createElement('ul');
        list.className = 'reference-list';
        
        challenges.forEach(challenge => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'reference-link';
            link.href = `?challenge=${challenge.challenge}`;
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'reference-title';
            titleSpan.textContent = challenge.title || `Challenge ${challenge.challenge}`;
            
            link.appendChild(titleSpan);
            li.appendChild(link);
            list.appendChild(li);
        });
        
        section.appendChild(list);
        contentEl.appendChild(section);
        loadingEl.style.display = 'none';
        
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `Error loading challenges: ${error.message}`;
        console.error('Error loading challenges:', error);
    }
}

// Load and display challenge
async function loadChallenge(challengeNumber) {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const contentEl = document.getElementById('challenge-content');
    const pageTitleEl = document.querySelector('.page-title');
    
    // Reset
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    contentEl.innerHTML = '';
    
    // If no challenge specified, show the list of all challenges
    if (!challengeNumber || isNaN(challengeNumber)) {
        loadChallengeList();
        return;
    }
    
    try {
        // Get challenge title
        const challengeTitle = await getChallengeTitle(challengeNumber);
        
        // Fetch CSV file
        const csvPath = `link-lists/Challenge_${challengeNumber}.csv`;
        const response = await fetch(csvPath);
        
        if (!response.ok) {
            throw new Error(`Challenge ${challengeNumber} not found (${response.status})`);
        }
        
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        if (data.length === 0) {
            throw new Error('No data found in CSV file');
        }
        
        // Render the challenge
        renderChallenge(data, challengeNumber, challengeTitle);
        
        // Update page title (h1)
        if (challengeTitle) {
            pageTitleEl.textContent = challengeTitle;
        }
        
        loadingEl.style.display = 'none';
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `Error loading challenge: ${error.message}`;
        console.error('Error loading challenge:', error);
    }
}

// Group data by category
function groupByCategory(data) {
    const groups = {};
    const uncategorised = [];
    
    data.forEach(item => {
        const category = item.category ? item.category.trim() : '';
        if (category) {
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
        } else {
            uncategorised.push(item);
        }
    });
    
    return { groups, uncategorised };
}

// Render challenge data
function renderChallenge(data, challengeNumber, challengeTitle) {
    const contentEl = document.getElementById('challenge-content');
    
    const section = document.createElement('section');
    section.className = 'reference-section';
    
    // Group resources by category
    const { groups, uncategorised } = groupByCategory(data);
    const categoryNames = Object.keys(groups);
    
    // If there are categories, render grouped content
    if (categoryNames.length > 0) {
        // Render each category group
        categoryNames.forEach(categoryName => {
            // Add sub-heading
            const subHeading = document.createElement('h3');
            subHeading.textContent = categoryName;
            section.appendChild(subHeading);
            
            // Add resource list for this category
            const list = document.createElement('ul');
            list.className = 'reference-list';
            
            groups[categoryName].forEach(item => {
                const li = createResourceListItem(item);
                list.appendChild(li);
            });
            
            section.appendChild(list);
        });
        
        // Render any uncategorised items at the end
        if (uncategorised.length > 0) {
            const subHeading = document.createElement('h3');
            subHeading.textContent = 'Other Resources';
            section.appendChild(subHeading);
            
            const list = document.createElement('ul');
            list.className = 'reference-list';
            
            uncategorised.forEach(item => {
                const li = createResourceListItem(item);
                list.appendChild(li);
            });
            
            section.appendChild(list);
        }
    } else {
        // No categories - render flat list (backwards compatible)
        const list = document.createElement('ul');
        list.className = 'reference-list';
        
        data.forEach(item => {
            const li = createResourceListItem(item);
            list.appendChild(li);
        });
        
        section.appendChild(list);
    }
    
    contentEl.appendChild(section);
    
    // Update page title (browser tab)
    if (challengeTitle) {
        document.title = `${challengeTitle} | ODI Reference Lists`;
    } else {
        document.title = `Challenge ${challengeNumber} | ODI Reference Lists`;
    }
}

// Create a single resource list item
function createResourceListItem(item) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'reference-link';
    link.href = item.url || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    const titleSpan = document.createElement('span');
    titleSpan.className = 'reference-title';
    titleSpan.textContent = item.title || 'Untitled';
    
    const descSpan = document.createElement('span');
    descSpan.className = 'reference-description';
    descSpan.textContent = item.description || '';
    
    link.appendChild(titleSpan);
    link.appendChild(descSpan);
    li.appendChild(link);
    
    return li;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const challengeNumber = getChallengeNumber();
    loadChallenge(challengeNumber);
});
