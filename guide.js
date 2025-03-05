// Gemini API Configuration
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBo3T4eKrSp6uFIUE8UPWHxwP0qA_6iZZg";

// Module data
const modules = {
    1: "Introduction to Ethical Hacking",
    2: "Footprinting and Reconnaissance",
    3: "Scanning Networks",
    4: "Enumeration",
    5: "Vulnerability Analysis",
    6: "System Hacking",
    7: "Malware Threats",
    8: "Sniffing",
    9: "Social Engineering",
    10: "Denial-of-Service",
    11: "Session Hijacking",
    12: "Evading IDS, Firewalls, and Honeypots",
    13: "Hacking Web Servers",
    14: "Hacking Web Applications",
    15: "SQL Injection",
    16: "Hacking Wireless Networks",
    17: "Hacking Mobile Platforms",
    18: "IoT Hacking",
    19: "Cloud Computing",
    20: "Cryptography"
};

// DOM Elements
const moduleButtons = document.querySelectorAll('.module-btn');
const moduleTitle = document.getElementById('module-title');
const moduleContent = document.getElementById('module-content');
const generateBtn = document.getElementById('generate-btn');
const saveBtn = document.getElementById('save-btn');
const loadingAnimation = document.getElementById('loading-animation');

let currentModule = null;

// Event Listeners
moduleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const moduleNumber = button.getAttribute('data-module');
        selectModule(moduleNumber);
    });
});

generateBtn.addEventListener('click', () => {
    if (currentModule) {
        generateContent(currentModule);
    }
});

saveBtn.addEventListener('click', () => {
    if (currentModule) {
        saveContent(currentModule);
    }
});

// Functions
function selectModule(moduleNumber) {
    currentModule = moduleNumber;
    moduleTitle.textContent = `Module ${moduleNumber}: ${modules[moduleNumber]}`;
    moduleContent.innerHTML = `<p class="welcome-text">Click "Generate Content" to create content for this module.</p>`;
    generateBtn.disabled = false;
}

async function generateContent(moduleNumber) {
    try {
        loadingAnimation.style.display = 'flex';
        moduleContent.innerHTML = '';

        const prompt = `Create a comprehensive chapter about ${modules[moduleNumber]} for an ethical hacking guide. Include:
        1. Introduction and key concepts
        2. Detailed explanation of the topic
        3. Common techniques and tools
        4. Best practices and security measures
        5. Real-world examples and case studies
        6. Hands-on exercises and labs
        7. Summary and key takeaways`;

        const response = await fetch(Api_Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        const generatedContent = data.candidates[0].content.parts[0].text;

        // Format and display the content
        const formattedContent = formatContent(generatedContent);
        moduleContent.innerHTML = formattedContent;
    } catch (error) {
        console.error('Error generating content:', error);
        moduleContent.innerHTML = `
            <div class="error-message">
                Error generating content. Please try again.
            </div>
        `;
    } finally {
        loadingAnimation.style.display = 'none';
    }
}

function formatContent(content) {
    // Split content into sections
    const sections = content.split('\n\n');
    
    // Format each section
    return sections.map(section => {
        if (section.startsWith('1.') || section.startsWith('2.') || 
            section.startsWith('3.') || section.startsWith('4.') || 
            section.startsWith('5.') || section.startsWith('6.') || 
            section.startsWith('7.')) {
            return `<div class="section-title">${section}</div>`;
        }
        return `<div class="content-section">${section}</div>`;
    }).join('');
}

function saveContent(moduleNumber) {
    const content = moduleContent.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `module-${moduleNumber}-${modules[moduleNumber].toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
} 