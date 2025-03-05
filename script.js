let prompt = document.querySelector("#prompt")
let submitbtn = document.querySelector("#submit")
let chatContainer = document.querySelector(".chat-container")
let imagebtn = document.querySelector("#image")
let image = document.querySelector("#image img")
let imageinput = document.querySelector("#image input")

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBo3T4eKrSp6uFIUE8UPWHxwP0qA_6iZZg"

// Security knowledge base
const securityResponses = {
    cyber_attacks: {
        keywords: ['cyber attack', 'cyberattack', 'hack', 'breach', 'security threat', 'cyber threat', 'attack type', 'attack vector', 'cyber crime', 'cybercrime', 'exploit', 'vulnerability', 'cyber security', 'cybersecurity'],
        getResponse: () => {
            return {
                title: "🛡️ Common Types of Cyber Attacks",
                content: `Here are the major types of cyber attacks you should be aware of:

1. Network Attacks:
   • DDoS (Distributed Denial of Service)
   • Man-in-the-Middle (MITM)
   • DNS Spoofing
   • Port Scanning
   • Network Sniffing

2. Social Engineering:
   • Phishing
   • Spear Phishing
   • Whaling
   • Baiting
   • Social Media Exploitation

3. Malware-based Attacks:
   • Ransomware
   • Trojans
   • Worms
   • Spyware
   • Rootkits
   • Keyloggers

4. Web Application Attacks:
   • SQL Injection
   • Cross-Site Scripting (XSS)
   • Cross-Site Request Forgery (CSRF)
   • Session Hijacking
   • File Inclusion

5. System-Level Attacks:
   • Buffer Overflow
   • Privilege Escalation
   • Zero-Day Exploits
   • Brute Force Attacks
   • Password Attacks

Want to learn more about any specific type of attack?`
            };
        }
    },
    phishing: {
        keywords: ['phishing', 'scam', 'email scam', 'suspicious email', 'fake email', 'spam', 'social engineering'],
        getResponse: () => {
            return {
                title: "🛡️ Phishing Attack Prevention Guide",
                content: `Here's how to protect yourself from phishing attacks:

1. Email Security:
   • Never click on links from unknown senders
   • Check the sender's email address carefully
   • Be suspicious of urgent or threatening messages
   • Hover over links to preview URLs before clicking

2. Website Security:
   • Look for 'https://' and the padlock icon
   • Check for spelling errors in URLs
   • Never enter personal information on suspicious sites
   • Use bookmarks for important websites

3. General Tips:
   • Enable two-factor authentication
   • Keep software and browsers updated
   • Use spam filters
   • Report suspicious emails to your IT department

4. Red Flags to Watch For:
   • Requests for personal information
   • Urgency or threats
   • Generic greetings
   • Poor grammar or spelling
   • Offers that seem too good to be true

Need more specific information about any of these points?`
            };
        }
    },
    malware: {
        keywords: ['malware', 'virus', 'ransomware', 'spyware', 'trojan', 'worm', 'malicious software', 'malware detection'],
        getResponse: () => {
            return {
                title: "🦠 Malware Protection & Detection Guide",
                content: `Here's your comprehensive guide to malware protection:

1. Types of Malware:
   • Viruses: Self-replicating malicious code
   • Ransomware: Encrypts files for ransom
   • Spyware: Monitors user activity
   • Trojans: Disguised as legitimate software
   • Worms: Self-propagating through networks

2. Detection Signs:
   • Slow computer performance
   • Unexpected pop-ups
   • Modified or deleted files
   • Strange network activity
   • Disabled security tools

3. Prevention Measures:
   • Install reputable antivirus software
   • Keep all software updated
   • Use a firewall
   • Regular system scans
   • Backup important data
   • Don't download from untrusted sources

4. If Infected:
   • Disconnect from the internet
   • Boot in safe mode
   • Run full system scan
   • Remove suspicious programs
   • Reset passwords after cleanup

Want to learn more about any specific type of malware?`
            };
        }
    },
    gdpr: {
        keywords: ['gdpr', 'privacy', 'data protection', 'compliance', 'audit', 'privacy law'],
        getResponse: () => {
            return {
                title: "📋 GDPR Compliance & Data Protection Guide",
                content: `Understanding GDPR and Data Protection:

1. GDPR Basics:
   • Protection of personal data
   • Rights of data subjects
   • Consent requirements
   • Data breach notifications
   • Cross-border data transfers

2. Key Requirements:
   • Data minimization
   • Purpose limitation
   • Storage limitation
   • Accuracy maintenance
   • Integrity and confidentiality

3. Compliance Steps:
   • Data inventory
   • Privacy impact assessments
   • Documentation of processing
   • Security measures implementation
   • Staff training

4. Individual Rights:
   • Right to access
   • Right to be forgotten
   • Data portability
   • Object to processing
   • Withdraw consent

Need specific guidance on GDPR compliance?`
            };
        }
    },
    cybersecurity_career: {
        keywords: ['career', 'roadmap', 'learn', 'study', 'certification', 'job', 'path', 'become'],
        getResponse: () => {
            return {
                title: "🎯 Cybersecurity Career Roadmap",
                content: `Here's your guide to starting a career in cybersecurity:

1. Foundation Knowledge:
   • Computer Networks
   • Operating Systems
   • Programming Basics (Python, Shell)
   • Web Technologies
   • Database Management

2. Essential Skills:
   • Network Security
   • System Administration
   • Security Tools & Software
   • Incident Response
   • Risk Assessment

3. Recommended Certifications:
   • CompTIA Security+
   • CEH (Certified Ethical Hacker)
   • CISSP
   • CISM
   • OSCP

4. Specialization Paths:
   • Penetration Testing
   • Incident Response
   • Forensics
   • Security Architecture
   • Cloud Security
   • Application Security

5. Practical Experience:
   • Home Lab Setup
   • CTF Competitions
   • Bug Bounty Programs
   • Open Source Projects
   • Internships

6. Advanced Topics:
   • Reverse Engineering
   • Malware Analysis
   • Threat Intelligence
   • Zero Trust Architecture
   • DevSecOps

Would you like more details about any specific area?`
            };
        }
    },
    network_security: {
        keywords: ['network', 'firewall', 'vpn', 'router', 'wifi', 'wireless', 'network security'],
        getResponse: () => {
            return {
                title: "🌐 Network Security Guide",
                content: `Protect your network with these security measures:

1. Basic Network Security:
   • Strong WiFi passwords
   • WPA3 encryption
   • Regular firmware updates
   • Guest network setup
   • MAC address filtering

2. Advanced Protection:
   • Firewall configuration
   • VPN implementation
   • Network segmentation
   • IDS/IPS systems
   • Network monitoring

3. WiFi Security:
   • Hide SSID broadcasting
   • Change default credentials
   • Disable WPS
   • Regular security audits
   • Monitor connected devices

4. Best Practices:
   • Regular security assessments
   • Network documentation
   • Incident response plan
   • Employee training
   • Access control policies

Need specific network security advice?`
            };
        }
    },
    password_security: {
        keywords: ['password', 'passwords', 'strong password', 'password manager'],
        getResponse: () => {
            return {
                title: "🔐 Password Security Best Practices",
                content: `Create and manage secure passwords:

1. Password Creation:
   • Minimum 12 characters
   • Mix of upper/lowercase
   • Numbers and symbols
   • No personal information
   • Unique for each account

2. Password Management:
   • Use password managers
   • Regular password changes
   • Two-factor authentication
   • Secure password storage
   • Password recovery options

3. Common Mistakes:
   • Reusing passwords
   • Simple patterns
   • Dictionary words
   • Personal information
   • Sharing passwords

4. Additional Security:
   • Biometric authentication
   • Hardware security keys
   • Backup authentication
   • Recovery codes
   • Password rotation policy

Want to learn more about password security?`
            };
        }
    }
};

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
}

function formatResponse(response) {
    // Split sections and remove empty lines
    const sections = response.split('\n\n').filter(section => section.trim());
    let formattedHTML = '<div class="message-content">';

    // Format title
    if (sections[0].includes('🛡️') || sections[0].includes('🦠') || 
        sections[0].includes('📋') || sections[0].includes('🎯') || 
        sections[0].includes('🌐') || sections[0].includes('🔐')) {
        formattedHTML += `<div class="message-title">${sections[0].trim()}</div>`;
        sections.shift();
    }

    sections.forEach(section => {
        const trimmedSection = section.trim();
        if (trimmedSection) {
            if (trimmedSection.startsWith('Related topics')) {
                // Format related topics more compactly
                const [title, ...topics] = trimmedSection.split('\n').filter(line => line.trim());
                formattedHTML += `<div class="related-topics">
                    <div class="related-title">${title.trim()}</div>
                    ${topics.map(topic => `<div class="related-item">${topic.trim().replace('• ', '')}</div>`).join('')}
                </div>`;
            } else if (trimmedSection.match(/^\d+\./m)) {
                // Format numbered sections more compactly
                const lines = trimmedSection.split('\n').filter(line => line.trim());
                const title = lines[0];
                const items = lines.slice(1);
                
                formattedHTML += `<div class="message-section">
                    <div class="section-title">${title.trim()}</div>
                    <div class="bullet-list">
                        ${items.map(item => `<div class="bullet-item">${item.trim().replace('• ', '')}</div>`).join('')}
                    </div>
                </div>`;
            } else {
                // Format regular text without extra spacing
                formattedHTML += `<p>${trimmedSection}</p>`;
            }
        }
    });

    formattedHTML += '</div>';
    return formattedHTML;
}

// Cybersecurity topic detection
const cybersecurityTopics = {
    general: ['cyber', 'security', 'hack', 'threat', 'attack', 'protect', 'secure', 'breach', 'vulnerability', 'risk'],
    authentication: ['password', 'login', '2fa', 'authentication', 'credential', 'access', 'account'],
    network: ['network', 'wifi', 'router', 'firewall', 'vpn', 'dns', 'ip', 'traffic', 'port', 'protocol'],
    malware: ['malware', 'virus', 'ransomware', 'trojan', 'worm', 'spyware', 'botnet', 'keylogger', 'rootkit'],
    web: ['phishing', 'scam', 'spam', 'website', 'browser', 'email', 'url', 'http', 'ssl', 'encryption'],
    data: ['data', 'privacy', 'gdpr', 'compliance', 'leak', 'backup', 'encryption', 'sensitive', 'personal'],
    career: ['career', 'job', 'certification', 'training', 'learn', 'study', 'course', 'skill', 'professional']
};

function isCybersecurityRelated(message) {
    // Convert message to lowercase for case-insensitive matching
    const normalizedMessage = message.toLowerCase();
    
    // Check for exact cybersecurity-related phrases
    const exactPhrases = [
        'cyber security',
        'cybersecurity',
        'information security',
        'infosec',
        'cyber attack',
        'data protection',
        'network security'
    ];
    
    if (exactPhrases.some(phrase => normalizedMessage.includes(phrase))) {
        return true;
    }

    // Count how many cybersecurity-related terms appear in the message
    let securityTermCount = 0;
    let matchedCategories = new Set();

    for (const [category, terms] of Object.entries(cybersecurityTopics)) {
        for (const term of terms) {
            if (normalizedMessage.includes(term)) {
                securityTermCount++;
                matchedCategories.add(category);
                
                // If we find multiple terms or terms from different categories,
                // it's very likely cybersecurity-related
                if (securityTermCount > 1 || matchedCategories.size > 1) {
                    return true;
                }
            }
        }
    }

    // Check for common cybersecurity question patterns
    const questionPatterns = [
        /how (to|do I|can I) (protect|secure)/,
        /what is .*(security|attack)/,
        /is .*(safe|secure|dangerous)/,
        /how (to|do I) prevent/,
        /best (security|protection|defense)/
    ];

    if (questionPatterns.some(pattern => pattern.test(normalizedMessage))) {
        return true;
    }

    // If we found at least one security term and the message is a question
    const isQuestion = /^(what|how|why|is|are|can|should|will|does|do|where|when|which|whose|whom|who|whose|explain|tell)/i.test(normalizedMessage);
    
    return securityTermCount > 0 && isQuestion;
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area")
    const typingAnimation = text.querySelector('.typing-animation');
    
    // Check if the message is cybersecurity related using the new function
    if (!isCybersecurityRelated(user.message)) {
        typingAnimation.remove();
        text.innerHTML = `
            <div class="message-content">
                <div class="error-message">
                    I am a specialized cybersecurity assistant. I can only help you with cybersecurity-related questions. Please ask me about cybersecurity, network security, malware protection, or data privacy.
                </div>
            </div>`;
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        return;
    }

    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    { text: user.message },
                    (user.file.data ? [{ inline_data: user.file }] : [])
                ]
            }]
        })
    }
    try {
        let response = await fetch(Api_Url, RequestOption)
        let data = await response.json()
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()

        // Remove typing animation and show formatted response
        typingAnimation.remove();
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.style.opacity = '0';
        messageContent.innerHTML = formatResponse(apiResponse);
        text.appendChild(messageContent);

        // Fade in the message
        setTimeout(() => {
            messageContent.style.transition = 'opacity 0.3s ease-in-out';
            messageContent.style.opacity = '1';
        }, 100);
    }
    catch (error) {
        console.log(error);
        typingAnimation.remove();
        text.innerHTML = `
            <div class="message-content">
                <div class="error-message">
                    I apologize, but I need more specific information to help you with your cybersecurity question.
                </div>
                <div class="message-section">
                    <div class="section-title">Here are some ways you can ask:</div>
                    <div class="bullet-list">
                        <div class="bullet-item">For phishing: "How do I identify phishing emails?"</div>
                        <div class="bullet-item">For malware: "How do I protect against ransomware?"</div>
                        <div class="bullet-item">For passwords: "How do I create a strong password?"</div>
                        <div class="bullet-item">For network security: "How do I secure my WiFi?"</div>
                    </div>
                </div>
            </div>`;
    }
    finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })
        image.src = `img.svg`
        image.classList.remove("choose")
        user.file = {}
    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}

function handlechatResponse(userMessage) {
    if (!userMessage.trim()) return;

    user.message = userMessage
    let html = `<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`
    prompt.value = ""
    let userChatBox = createChatBox(html, "user-chat-box")
    chatContainer.appendChild(userChatBox)

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })

    setTimeout(() => {
        let html = `<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
        <div class="typing-animation">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        generateResponse(aiChatBox)
    }, 600)
}

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handlechatResponse(prompt.value)
    }
})

submitbtn.addEventListener("click", () => {
    handlechatResponse(prompt.value)
})

imageinput.addEventListener("change", () => {
    const file = imageinput.files[0]
    if (!file) return
    let reader = new FileReader()
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1]
        user.file = {
            mime_type: file.type,
            data: base64string
        }
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click()
})

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const promptInput = document.getElementById('prompt');
const submitButton = document.getElementById('submit');
const imageButton = document.getElementById('image');
const fileInput = imageButton.querySelector('input[type="file"]');

// Track user interactions for improvement
let userInteractions = [];

// Add message to chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-chat-box' : 'ai-chat-box';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = isUser ? 'user-chat-area' : 'ai-chat-area';
    contentDiv.textContent = message;
    
    if (!isUser) {
        const aiImg = document.createElement('img');
        aiImg.src = 'ai.png';
        aiImg.alt = 'AI Assistant';
        aiImg.width = '40';
        messageDiv.appendChild(aiImg);
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        indicator.appendChild(dot);
    }
    chatMessages.appendChild(indicator);
    return indicator;
}

// Process user message
async function processMessage(message) {
    let text = aiChatBox.querySelector(".ai-chat-area")
    
    // Track interaction with timestamp and message type
    userInteractions.push({
        timestamp: new Date().toISOString(),
        message: message,
        messageType: 'question',
        topics: [],
        response: null
    });

    const userMessage = message.toLowerCase();
    let matchedTopics = [];
    let confidenceScores = {};

    // Enhanced topic detection with confidence scoring
    for (const topic in securityResponses) {
        const keywordMatches = securityResponses[topic].keywords.filter(keyword => 
            userMessage.includes(keyword.toLowerCase()));
        
        if (keywordMatches.length > 0) {
            matchedTopics.push(topic);
            confidenceScores[topic] = keywordMatches.length / securityResponses[topic].keywords.length;
        }
    }

    // Sort topics by confidence score
    matchedTopics.sort((a, b) => confidenceScores[b] - confidenceScores[a]);

    // If no specific topics matched, provide an intelligent general response
    if (matchedTopics.length === 0) {
        const generalResponse = `Welcome to YD Security Assistant! I can help you with various cybersecurity topics:

1. 🛡️ Phishing Prevention - Learn to identify and avoid email scams
2. 🦠 Malware Protection - Protect your devices from viruses and malware
3. 📋 GDPR & Data Protection - Understand privacy laws and compliance
4. 🎯 Cybersecurity Career Path - Start your journey in cybersecurity
5. 🌐 Network Security - Secure your network and WiFi
6. 🔐 Password Security - Create and manage strong passwords

Please ask me about any of these topics! For example:
- "How do I create a strong password?"
- "What are signs of a phishing email?"
- "How can I protect against ransomware?"`;

        text.innerHTML = generalResponse;
        userInteractions[userInteractions.length - 1].response = generalResponse;
        return;
    }

    // Get primary topic response
    const primaryTopic = matchedTopics[0];
    const response = securityResponses[primaryTopic].getResponse();
    
    // Add related topics with confidence scores
    let additionalTopics = "";
    if (matchedTopics.length > 1) {
        additionalTopics = "\n\nRelated topics you might be interested in:\n" +
            matchedTopics.slice(1).map(topic => 
                `• ${securityResponses[topic].getResponse().title} (Relevance: ${Math.round(confidenceScores[topic] * 100)}%)`
            ).join("\n");
    }

    // Store topic and response data
    userInteractions[userInteractions.length - 1].topics = matchedTopics;
    userInteractions[userInteractions.length - 1].confidenceScores = confidenceScores;

    const finalResponse = `${response.title}\n\n${response.content}${additionalTopics}`;
    text.innerHTML = finalResponse;
    userInteractions[userInteractions.length - 1].response = finalResponse;

    // Analyze response effectiveness
    setTimeout(() => {
        analyzeUserInteractions();
    }, 1000);
}

// Function to analyze user interactions and improve responses
function analyzeUserInteractions() {
    if (userInteractions.length < 2) return;

    const lastInteraction = userInteractions[userInteractions.length - 1];
    const previousInteraction = userInteractions[userInteractions.length - 2];

    // Check if user asks follow-up questions on same topic
    if (lastInteraction.topics.some(topic => previousInteraction.topics.includes(topic))) {
        // Topic requires more detailed explanation
        console.log(`User needed more information about: ${lastInteraction.topics.join(', ')}`);
    }

    // Track commonly asked topics
    const topicFrequency = {};
    userInteractions.forEach(interaction => {
        interaction.topics.forEach(topic => {
            topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
        });
    });

    // Log insights for improvement
    console.log('Topic frequency:', topicFrequency);
}

// Handle submit button click
submitButton.addEventListener('click', async () => {
    const message = promptInput.value.trim();
    if (message) {
        addMessage(message, true);
        promptInput.value = '';
        
        const indicator = showTypingIndicator();
        
        // Simulate AI processing time
        setTimeout(async () => {
            indicator.remove();
            const response = await processMessage(message);
            addMessage(response);
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }
});

// Handle enter key
promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitButton.click();
    }
});

// Handle image upload
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        addMessage(`Uploaded image: ${file.name}`, true);
        addMessage("I can analyze security-related images, such as suspicious emails or error messages. However, please ensure no sensitive information is shared.", false);
    }
});

// Initial greeting
document.addEventListener('DOMContentLoaded', () => {
    addMessage("Hello! I'm your cybersecurity assistant. I can help you with:\n" +
        "- Password security\n" +
        "- Phishing prevention\n" +
        "- Malware protection\n" +
        "What would you like to know about?");
});

// Add event listeners for suggestion chips
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        prompt.value = query;
        handlechatResponse(query);
    });
});

// Enhance the typing animation
function showTypingAnimation(aiChatArea) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-animation';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        typingDiv.appendChild(dot);
    }
    aiChatArea.appendChild(typingDiv);
    return typingDiv;
}