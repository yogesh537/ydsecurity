// Module Structure from Hacking Guide Book
const hackingModules = [
    {
        name: "Introduction to Ethical Hacking",
        description: "Fundamentals of ethical hacking and penetration testing",
        topics: [
            "Hacking Methodology",
            "Reconnaissance Techniques",
            "Scanning Networks",
            "System Hacking",
            "Malware Threats"
        ]
    },
    {
        name: "Network Scanning Mastery",
        description: "Advanced network scanning techniques with real-world commands",
        topics: [
            "Basic Nmap Commands",
            "Stealth Scanning",
            "Service Detection",
            "Vulnerability Scanning",
            "Network Mapping"
        ]
    },
    {
        name: "Web Application Security",
        description: "Web application vulnerabilities and security measures",
        topics: [
            "Web Application Penetration Testing",
            "OWASP Top 10 Vulnerabilities",
            "Authentication & Authorization",
            "Input Validation & Injection",
            "Session Management"
        ]
    },
    {
        name: "Network Security",
        description: "Network security concepts and attack vectors",
        topics: [
            "Network Scanning",
            "Sniffing Attacks",
            "Denial of Service",
            "Social Engineering",
            "Wireless Network Security"
        ]
    },
    {
        name: "System Security",
        description: "Operating system security and vulnerabilities",
        topics: [
            "Windows Security",
            "Linux Security",
            "Mobile Device Security",
            "Cloud Security",
            "IoT Security"
        ]
    }
];

// Game state variables
let currentModule = 0;
let currentQuestion = 0;
let score = 0;
let quizCompleted = false;
let currentQuestionData = null;
let generatedQuestions = new Set();
let completedModules = new Set();

// DOM Elements
const challengeTitle = document.getElementById('challenge-title');
const challengeDescription = document.getElementById('challenge-description');
const challengeInterface = document.getElementById('challenge-interface');
const submitButton = document.getElementById('submit-answer');
const scoreElement = document.getElementById('score');
const currentLevelElement = document.getElementById('current-level');
const moduleProgress = document.createElement('div');
moduleProgress.className = 'module-progress';
const ydSecurityLink = document.querySelector('.yd-security');

// Add module progress to header
document.querySelector('.challenge-header').appendChild(moduleProgress);

// Event Listeners
submitButton.addEventListener('click', () => {
    if (!quizCompleted) {
        checkAnswer();
    }
});

if (ydSecurityLink) {
    ydSecurityLink.addEventListener('click', () => {
        window.open('https://www.linkedin.com/in/yogesh-dhangar-956b3a1b5/', '_blank');
    });
}

// Functions
async function startQuiz() {
    currentModule = 0;
    currentQuestion = 0;
    score = 0;
    quizCompleted = false;
    generatedQuestions.clear();
    completedModules.clear();
    scoreElement.textContent = "0";
    updateModuleProgress();
    await showQuestion();
}

function updateModuleProgress() {
    const currentModuleData = hackingModules[currentModule];
    moduleProgress.innerHTML = `
        <div class="progress-container">
            <div class="module-name">${currentModuleData.name}</div>
            <div class="topic-name">${currentModuleData.description}</div>
            <div class="progress-bar">
                <div class="progress" style="width: ${(currentQuestion / 5) * 100}%"></div>
            </div>
        </div>
    `;
}

async function generateQuestion() {
    const currentModuleData = hackingModules[currentModule];
    const topic = currentModuleData.topics[currentQuestion];
    
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer AIzaSyBo3T4eKrSp6uFIUE8UPWHxwP0qA_6iZZg'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Generate a multiple choice question about ${topic} in ethical hacking.
                        Module: ${currentModuleData.name}
                        
                        Requirements:
                        1. Create a clear, specific question about ${topic}
                        2. Provide 4 distinct and realistic options
                        3. Only one correct answer
                        4. Include a detailed explanation
                        5. Make the question challenging but fair
                        6. Focus on practical knowledge
                        7. Include technical details where appropriate
                        
                        Format as JSON:
                        {
                            "question": "Your question here",
                            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                            "correct": 0,
                            "explanation": "Detailed explanation here"
                        }
                        
                        Ensure:
                        - Question is specific to ${topic}
                        - Options are clearly different
                        - Correct answer is clearly best
                        - Explanation covers both correct and incorrect options
                        - Return only the JSON object`
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            throw new Error('Invalid API response structure');
        }

        const questionText = data.candidates[0].content.parts[0].text.trim();
        let questionData;
        
        try {
            // Clean up the response text to ensure it's valid JSON
            const cleanText = questionText
                .replace(/```json\n?|\n?```/g, '') // Remove markdown code blocks
                .replace(/^\s*\[|\]\s*$/g, '') // Remove array brackets if present
                .replace(/^\s*\{|\}\s*$/g, '') // Remove object brackets if present
                .trim();
            
            questionData = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Error parsing question JSON:', parseError);
            console.error('Raw response:', questionText);
            return getFallbackQuestion(topic);
        }

        // Validate question structure
        if (!questionData.question || !Array.isArray(questionData.options) || 
            questionData.options.length !== 4 || typeof questionData.correct !== 'number' || 
            !questionData.explanation) {
            console.error('Invalid question structure:', questionData);
            return getFallbackQuestion(topic);
        }

        // Validate options are unique
        const uniqueOptions = new Set(questionData.options);
        if (uniqueOptions.size !== 4) {
            console.error('Duplicate options found:', questionData);
            return getFallbackQuestion(topic);
        }

        // Validate correct answer index
        if (questionData.correct < 0 || questionData.correct >= 4) {
            console.error('Invalid correct answer index:', questionData);
            return getFallbackQuestion(topic);
        }

        // Check for duplicate questions
        const questionKey = `${questionData.question}-${topic}-${currentModuleData.name}`;
        if (generatedQuestions.has(questionKey)) {
            console.log('Duplicate question detected, generating new one...');
            return getFallbackQuestion(topic);
        }

        generatedQuestions.add(questionKey);
        return questionData;
    } catch (error) {
        console.error('Error generating question:', error);
        return getFallbackQuestion(topic);
    }
}

function getFallbackQuestion(topic) {
    const fallbackQuestions = {
        // Introduction to Ethical Hacking Module
        "Hacking Methodology": {
            question: "What is the first phase of the hacking methodology?",
            options: ["Reconnaissance", "Exploitation", "Maintaining Access", "Covering Tracks"],
            correct: 0,
            explanation: "Reconnaissance is the first phase where hackers gather information about their target."
        },
        "Reconnaissance Techniques": {
            question: "Which of these is a passive reconnaissance technique?",
            options: ["Port Scanning", "Social Media Research", "Network Sniffing", "System Hacking"],
            correct: 1,
            explanation: "Social media research is a passive technique as it doesn't directly interact with the target system."
        },
        "Scanning Networks": {
            question: "What is the primary purpose of network scanning?",
            options: ["To hack systems", "To identify open ports", "To steal data", "To create malware"],
            correct: 1,
            explanation: "Network scanning is used to identify open ports and potential vulnerabilities in a network."
        },
        "System Hacking": {
            question: "Which of these is a common system hacking technique?",
            options: ["Email Spam", "Password Cracking", "Web Browsing", "File Sharing"],
            correct: 1,
            explanation: "Password cracking is a common technique used in system hacking to gain unauthorized access."
        },
        "Malware Threats": {
            question: "What type of malware encrypts files and demands ransom?",
            options: ["Virus", "Ransomware", "Worm", "Trojan"],
            correct: 1,
            explanation: "Ransomware is a type of malware that encrypts files and demands payment for decryption."
        },

        // Web Application Security Module
        "Web Application Penetration Testing": {
            question: "What is the first step in web application penetration testing?",
            options: ["SQL Injection", "Information Gathering", "XSS Attack", "CSRF Attack"],
            correct: 1,
            explanation: "Information gathering is the first step to understand the target application's structure and potential vulnerabilities."
        },
        "OWASP Top 10 Vulnerabilities": {
            question: "Which vulnerability is ranked #1 in OWASP Top 10 2021?",
            options: ["SQL Injection", "Broken Access Control", "Cross-Site Scripting", "Security Misconfiguration"],
            correct: 1,
            explanation: "Broken Access Control is ranked #1 in OWASP Top 10 2021 as it's one of the most critical vulnerabilities."
        },
        "Authentication & Authorization": {
            question: "What is the main difference between authentication and authorization?",
            options: [
                "Authentication verifies identity, authorization checks permissions",
                "Authentication checks permissions, authorization verifies identity",
                "They are the same thing",
                "Authentication is for users, authorization is for systems"
            ],
            correct: 0,
            explanation: "Authentication verifies who you are, while authorization determines what you can do."
        },
        "Input Validation & Injection": {
            question: "Which of these is NOT a type of injection attack?",
            options: ["SQL Injection", "XSS Injection", "Password Hashing", "Command Injection"],
            correct: 2,
            explanation: "Password hashing is a security measure, not an injection attack."
        },
        "Session Management": {
            question: "What is the purpose of session tokens?",
            options: [
                "To store passwords",
                "To maintain user state between requests",
                "To encrypt data",
                "To scan networks"
            ],
            correct: 1,
            explanation: "Session tokens are used to maintain user state and track authenticated sessions."
        },

        // Network Security Module
        "Network Scanning": {
            question: "Which tool is commonly used for network scanning?",
            options: ["Microsoft Word", "Nmap", "Adobe Reader", "Windows Media Player"],
            correct: 1,
            explanation: "Nmap is a powerful network scanning tool used to discover hosts and services on a network."
        },
        "Sniffing Attacks": {
            question: "What is the primary purpose of a packet sniffer?",
            options: [
                "To create malware",
                "To capture and analyze network traffic",
                "To encrypt data",
                "To scan ports"
            ],
            correct: 1,
            explanation: "Packet sniffers are used to capture and analyze network traffic for legitimate or malicious purposes."
        },
        "Denial of Service": {
            question: "What is the main goal of a DoS attack?",
            options: [
                "To steal data",
                "To make a service unavailable",
                "To encrypt files",
                "To gain unauthorized access"
            ],
            correct: 1,
            explanation: "DoS attacks aim to make a service unavailable to legitimate users."
        },
        "Social Engineering": {
            question: "Which of these is a common social engineering technique?",
            options: ["Port Scanning", "Phishing", "Buffer Overflow", "DDoS Attack"],
            correct: 1,
            explanation: "Phishing is a social engineering technique that tricks users into revealing sensitive information."
        },
        "Wireless Network Security": {
            question: "Which wireless security protocol is considered the most secure?",
            options: ["WEP", "WPA", "WPA2", "Open Network"],
            correct: 2,
            explanation: "WPA2 is currently considered the most secure wireless security protocol."
        },

        // System Security Module
        "Windows Security": {
            question: "What is the purpose of Windows Defender?",
            options: [
                "To create viruses",
                "To protect against malware",
                "To hack systems",
                "To share files"
            ],
            correct: 1,
            explanation: "Windows Defender is Microsoft's built-in antivirus and security solution."
        },
        "Linux Security": {
            question: "Which command is used to change file permissions in Linux?",
            options: ["chmod", "chown", "ls", "cd"],
            correct: 0,
            explanation: "The chmod command is used to modify file permissions in Linux."
        },
        "Mobile Device Security": {
            question: "What is the purpose of device encryption on mobile devices?",
            options: [
                "To make the device faster",
                "To protect data if the device is lost",
                "To share files",
                "To connect to WiFi"
            ],
            correct: 1,
            explanation: "Device encryption protects data by making it unreadable if the device is lost or stolen."
        },
        "Cloud Security": {
            question: "What is the shared responsibility model in cloud security?",
            options: [
                "Only cloud provider is responsible",
                "Only customer is responsible",
                "Both cloud provider and customer share security responsibilities",
                "No one is responsible"
            ],
            correct: 2,
            explanation: "The shared responsibility model divides security responsibilities between the cloud provider and customer."
        },
        "IoT Security": {
            question: "What is a common security risk with IoT devices?",
            options: [
                "They are too fast",
                "Default passwords",
                "They are too expensive",
                "They are too small"
            ],
            correct: 1,
            explanation: "Many IoT devices come with default passwords that are rarely changed, making them vulnerable to attacks."
        },

        // Network Scanning Mastery Module
        "Basic Nmap Commands": {
            question: "Which Nmap command is used for a basic TCP SYN scan?",
            options: [
                "nmap -sS target",
                "nmap -sT target",
                "nmap -sU target",
                "nmap -sV target"
            ],
            correct: 0,
            explanation: "nmap -sS target performs a TCP SYN scan, which is faster and stealthier than a full connect scan. It sends SYN packets and analyzes responses without completing the TCP handshake."
        },
        "Stealth Scanning": {
            question: "What is the purpose of the Nmap command 'nmap -sS -T2 -p- target'?",
            options: [
                "To perform a quick scan",
                "To perform a stealth scan with timing template 2 and all ports",
                "To perform a UDP scan",
                "To perform a service version scan"
            ],
            correct: 1,
            explanation: "This command performs a stealth SYN scan (-sS) with timing template 2 (-T2) for slower, more reliable scanning, and scans all ports (-p-). Timing template 2 is ideal for evading IDS/IPS systems."
        },
        "Service Detection": {
            question: "Which Nmap command is used to detect service versions and OS?",
            options: [
                "nmap -sV -O target",
                "nmap -sS target",
                "nmap -sT target",
                "nmap -sU target"
            ],
            correct: 0,
            explanation: "nmap -sV -O target performs service version detection (-sV) and OS fingerprinting (-O). This helps identify running services and their versions, which is crucial for vulnerability assessment."
        },
        "Vulnerability Scanning": {
            question: "What is the purpose of the Nmap NSE script 'http-vuln*'?",
            options: [
                "To scan for web vulnerabilities",
                "To perform port scanning",
                "To detect OS versions",
                "To map network topology"
            ],
            correct: 0,
            explanation: "The http-vuln* NSE scripts are used to scan for common web vulnerabilities like XSS, SQL injection, and other HTTP-related security issues. Example: nmap -sV --script http-vuln* target"
        },
        "Network Mapping": {
            question: "Which Nmap command is used to create a network topology map?",
            options: [
                "nmap -sS target",
                "nmap -sV target",
                "nmap -sP --traceroute target",
                "nmap -sT target"
            ],
            correct: 2,
            explanation: "nmap -sP --traceroute target performs a ping scan (-sP) with traceroute to map the network topology. This helps understand the network structure and identify potential routing issues."
        }
    };

    return fallbackQuestions[topic] || {
        question: `What is the primary purpose of ${topic} in ethical hacking?`,
        options: [
            "To identify vulnerabilities",
            "To create malware",
            "To hack systems",
            "To share passwords"
        ],
        correct: 0,
        explanation: `The primary purpose of ${topic} is to identify vulnerabilities in systems and networks to improve security.`
    };
}

async function showQuestion() {
    let question;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        question = await generateQuestion();
        if (question) {
            break;
        }
        attempts++;
        
        if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    if (!question) {
        generatedQuestions.clear();
        question = await generateQuestion();
    }

    if (!question) {
        showMessage('Error generating question. Please try again.', 'error');
        return;
    }

    currentQuestionData = question;
    currentLevelElement.textContent = `${currentQuestion + 1}/5`;
    challengeTitle.textContent = hackingModules[currentModule].name;
    challengeDescription.textContent = `Question ${currentQuestion + 1} of 5 - ${hackingModules[currentModule].topics[currentQuestion]}`;
    
    const questionHTML = `
        <div class="question-container">
            <div class="question-text">${question.question}</div>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <div class="option" data-index="${index}">
                        <input type="radio" name="answer" value="${index}" id="option${index}">
                        <label for="option${index}">${option}</label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    challengeInterface.innerHTML = questionHTML;
    
    // Add hover effects to options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.classList.add('option-hover');
        });
        option.addEventListener('mouseleave', () => {
            option.classList.remove('option-hover');
        });
    });
}

function createCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        celebration.appendChild(confetti);
    }
    
    document.body.appendChild(celebration);
    setTimeout(() => {
        celebration.classList.add('active');
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }, 100);
}

// Add this CSS to your stylesheet
const style = document.createElement('style');
style.textContent = `
    .question-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
        position: relative;
        min-height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 80px;
    }

    .question-text {
        font-size: 1.5em;
        color: #00ffff;
        margin-bottom: 30px;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        text-align: center;
        width: 100%;
    }

    .options-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 40px;
        width: 100%;
    }

    .option {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #00ffff;
        border-radius: 5px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .option:hover {
        background: rgba(0, 255, 255, 0.1);
        transform: translateX(10px);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    }

    .option input[type="radio"] {
        display: none;
    }

    .option label {
        color: #fff;
        cursor: pointer;
        flex: 1;
    }

    .option.selected {
        background: rgba(0, 255, 255, 0.2);
        border-color: #00ffff;
    }

    .option.correct-answer {
        background: rgba(0, 255, 0, 0.2);
        border-color: #00ff00;
    }

    .submit-container {
        position: fixed;
        bottom: 800px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    .cyber-btn {
        background: linear-gradient(45deg, #00ffff, #00cccc);
        border: none;
        padding: 15px 30px;
        color: #000;
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        position: relative;
        overflow: hidden;
        min-width: 240px;
        justify-content: center;
        pointer-events: auto;
        margin: -80px auto;
    }

    .cyber-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transition: 0.5s;
    }

    .cyber-btn:hover::before {
        left: 100%;
    }

    .cyber-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    }

    .cyber-btn:disabled {
        background: #666;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    .btn-icon {
        font-size: 1.2em;
    }

    .hacking-effect {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: none;
        justify-content: center;
        align-items: center;
    }

    .hacking-effect.active {
        display: flex;
    }

    .hacking-text {
        color: #00ff00;
        font-family: monospace;
        font-size: 24px;
        text-shadow: 0 0 10px #00ff00;
        white-space: pre;
        animation: glitch 0.3s infinite;
    }

    @keyframes glitch {
        0% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                         0.025em 0.04em 0 #fffc00;
        }
        15% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                         0.025em 0.04em 0 #fffc00;
        }
        16% {
            text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                         -0.05em -0.05em 0 #fffc00;
        }
        49% {
            text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                         -0.05em -0.05em 0 #fffc00;
        }
        50% {
            text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                         0 -0.04em 0 #fffc00;
        }
        99% {
            text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                         0 -0.04em 0 #fffc00;
        }
        100% {
            text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
                         -0.04em -0.025em 0 #fffc00;
        }
    }

    .challenge-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        border-radius: 5px;
        color: #fff;
        font-weight: bold;
        z-index: 1000;
        animation: slideDown 0.3s ease;
    }

    .challenge-message.success {
        background: rgba(0, 255, 0, 0.2);
        border: 2px solid #00ff00;
    }

    .challenge-message.error {
        background: rgba(255, 0, 0, 0.2);
        border: 2px solid #ff0000;
    }

    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
        }
        to {
            transform: translate(-50%, 0);
        }
    }

    .module-complete-effect {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: none;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .module-complete-effect.active {
        display: flex;
    }

    .matrix-rain {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .matrix-rain canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .module-complete-content {
        position: relative;
        z-index: 1;
        text-align: center;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 10px #00ff00;
    }

    .module-complete-title {
        font-size: 48px;
        margin-bottom: 20px;
        animation: glitch 0.3s infinite;
    }

    .module-complete-message {
        font-size: 24px;
        margin-bottom: 30px;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.5s forwards;
    }

    .module-complete-stats {
        font-size: 20px;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.5s forwards 0.3s;
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .binary-code {
        position: absolute;
        font-size: 14px;
        color: rgba(0, 255, 0, 0.3);
        pointer-events: none;
        animation: float 20s linear infinite;
    }

    @keyframes float {
        from {
            transform: translateY(100vh);
        }
        to {
            transform: translateY(-100vh);
        }
    }
`;
document.head.appendChild(style);

// Add hacking effect function
function createHackingEffect() {
    const effect = document.createElement('div');
    effect.className = 'hacking-effect';
    
    const text = document.createElement('div');
    text.className = 'hacking-text';
    text.textContent = `> Initializing hack sequence...
> Bypassing security protocols...
> Accessing mainframe...
> Decrypting data...
> Hack successful!`;
    
    effect.appendChild(text);
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.classList.add('active');
        setTimeout(() => {
            effect.classList.remove('active');
            setTimeout(() => {
                effect.remove();
            }, 500);
        }, 2000);
    }, 100);
}

// Update checkAnswer function to include hacking effect
async function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        showMessage('Please select an answer!', 'error');
        return;
    }
    
    createHackingEffect();
    
    const selectedIndex = parseInt(selectedOption.value);
    const selectedElement = selectedOption.closest('.option');
    
    if (selectedIndex === currentQuestionData.correct) {
        const points = 20; // 20 points per correct answer
        score += points;
        scoreElement.textContent = score;
        selectedElement.classList.add('correct-answer');
        createCelebration();
        showMessage(`Correct! +${points} points! ${currentQuestionData.explanation}`, 'success');
    } else {
        showMessage('Incorrect. ' + currentQuestionData.explanation, 'error');
    }
    
    setTimeout(async () => {
        if (currentQuestion < 4) {
            currentQuestion++;
            await showQuestion();
        } else {
            await completeModule();
        }
    }, 2000);
}

// Add new function for module completion animation
function createModuleCompleteEffect(moduleName, nextModuleName) {
    const effect = document.createElement('div');
    effect.className = 'module-complete-effect';
    
    // Create Matrix rain effect
    const matrixRain = document.createElement('div');
    matrixRain.className = 'matrix-rain';
    const canvas = document.createElement('canvas');
    matrixRain.appendChild(canvas);
    effect.appendChild(matrixRain);

    // Create content
    const content = document.createElement('div');
    content.className = 'module-complete-content';
    content.innerHTML = `
        <div class="module-complete-title">MODULE COMPLETE</div>
        <div class="module-complete-message">${moduleName} Mastered!</div>
        <div class="module-complete-stats">Preparing for ${nextModuleName}...</div>
    `;
    effect.appendChild(content);

    // Add binary code animation
    for (let i = 0; i < 50; i++) {
        const binary = document.createElement('div');
        binary.className = 'binary-code';
        binary.textContent = Math.random().toString(2).substring(2, 8);
        binary.style.left = `${Math.random() * 100}%`;
        binary.style.animationDelay = `${Math.random() * 5}s`;
        effect.appendChild(binary);
    }

    document.body.appendChild(effect);

    // Initialize Matrix rain
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    const matrixInterval = setInterval(drawMatrix, 33);

    // Show effect
    setTimeout(() => {
        effect.classList.add('active');
        setTimeout(() => {
            effect.classList.remove('active');
            setTimeout(() => {
                effect.remove();
                clearInterval(matrixInterval);
            }, 500);
        }, 3000);
    }, 100);
}

// Update completeModule function to use new animation
async function completeModule() {
    completedModules.add(currentModule);
    
    if (currentModule < hackingModules.length - 1) {
        createModuleCompleteEffect(
            hackingModules[currentModule].name,
            hackingModules[currentModule + 1].name
        );
        
        setTimeout(async () => {
            currentModule++;
            currentQuestion = 0;
            generatedQuestions.clear();
            updateModuleProgress();
            await showQuestion();
        }, 3500);
    } else {
        showFinalScore();
    }
}

function showFinalScore() {
    quizCompleted = true;
    const totalPossibleScore = hackingModules.length * 100; // 5 questions * 20 points per module
    const percentage = (score / totalPossibleScore) * 100;
    const message = percentage >= 70 ? 
        'Excellent! You are a cybersecurity expert!' : 
        percentage >= 50 ? 
        'Good effort! Keep learning!' : 
        'Keep studying! You can do better!';
    
    challengeInterface.innerHTML = `
        <div class="final-score">
            <h2>All Modules Completed!</h2>
            <div class="score-display">Your Score: ${score}/${totalPossibleScore}</div>
            <div class="score-message">${message}</div>
            <div class="completed-modules">
                <h3>Completed Modules:</h3>
                <ul>
                    ${Array.from(completedModules).map(moduleIndex => 
                        `<li>${hackingModules[moduleIndex].name}</li>`
                    ).join('')}
                </ul>
            </div>
            <button class="cyber-btn" onclick="startQuiz()">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">Try Again</span>
            </button>
        </div>
    `;
    submitButton.disabled = true;
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `challenge-message ${type}`;
    messageDiv.textContent = message;
    
    challengeInterface.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Start the quiz when the page loads
startQuiz(); 