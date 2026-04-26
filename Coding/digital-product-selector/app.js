// Digital Product Business Selector App Logic

// Application state
let currentQuestion = 0;
let userAnswers = {};
let productData = [];
let toolsData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    showSection('welcome');
});

// Initialize product and tools data
function initializeData() {
    productData = [
        {
            name: "Digital Templates/Printables",
            difficulty: "Beginner",
            time: "1-2 weeks",
            investment: "Very Low ($0-50)",
            income: "$200-8000",
            platforms: "Etsy, Creative Market, Gumroad",
            description: "Create design templates, planners, worksheets, and printable art using tools like Canva",
            skillMatch: ["writing", "design"],
            budgetMatch: ["under100"],
            timeMatch: ["1-2weeks"],
            incomeMatch: ["100-1000", "1000-5000"]
        },
        {
            name: "eBooks",
            difficulty: "Beginner-Intermediate",
            time: "2-4 weeks",
            investment: "Low ($0-100)",
            income: "$100-5000",
            platforms: "Amazon KDP, Gumroad, Etsy",
            description: "Write and publish digital books on topics you're knowledgeable about",
            skillMatch: ["writing", "teaching"],
            budgetMatch: ["under100"],
            timeMatch: ["1-2weeks", "1-2months"],
            incomeMatch: ["100-1000", "1000-5000"]
        },
        {
            name: "Online Courses",
            difficulty: "Intermediate-Advanced",
            time: "4-12 weeks",
            investment: "Low-Medium ($100-500)",
            income: "$500-20000",
            platforms: "Udemy, Teachable, Thinkific",
            description: "Create educational video content teaching skills or knowledge you possess",
            skillMatch: ["teaching", "technology"],
            budgetMatch: ["100-500", "500+"],
            timeMatch: ["1-2months", "3+months"],
            incomeMatch: ["1000-5000", "5000+"]
        },
        {
            name: "Stock Photography",
            difficulty: "Beginner-Intermediate",
            time: "Ongoing",
            investment: "Low ($50-200)",
            income: "$50-3000",
            platforms: "Shutterstock, Adobe Stock, Getty",
            description: "Sell photos and videos you capture to businesses and content creators",
            skillMatch: ["photography"],
            budgetMatch: ["under100", "100-500"],
            timeMatch: ["1-2weeks", "1-2months"],
            incomeMatch: ["100-1000", "1000-5000"]
        },
        {
            name: "Digital Art/Graphics",
            difficulty: "Beginner-Intermediate",
            time: "1-4 weeks",
            investment: "Very Low ($0-100)",
            income: "$100-5000",
            platforms: "Etsy, Creative Market, Society6",
            description: "Create digital illustrations, logos, icons, and graphics for various uses",
            skillMatch: ["design"],
            budgetMatch: ["under100"],
            timeMatch: ["1-2weeks", "1-2months"],
            incomeMatch: ["100-1000", "1000-5000"]
        },
        {
            name: "Software as a Service (SaaS)",
            difficulty: "Advanced",
            time: "3-12 months",
            investment: "Medium-High ($500-5000)",
            income: "$1000-50000+",
            platforms: "Own Website, App Stores",
            description: "Develop web-based software solutions for specific business needs",
            skillMatch: ["technology"],
            budgetMatch: ["500+"],
            timeMatch: ["3+months"],
            incomeMatch: ["5000+"]
        },
        {
            name: "Social Media Templates",
            difficulty: "Beginner",
            time: "1-2 weeks",
            investment: "Very Low ($0-50)",
            income: "$100-5000",
            platforms: "Etsy, Creative Market, Canva",
            description: "Create ready-to-use social media post templates and story designs",
            skillMatch: ["design", "writing"],
            budgetMatch: ["under100"],
            timeMatch: ["1-2weeks"],
            incomeMatch: ["100-1000", "1000-5000"]
        },
        {
            name: "Business Documents/Forms",
            difficulty: "Beginner-Intermediate",
            time: "1-3 weeks",
            investment: "Very Low ($0-100)",
            income: "$100-3000",
            platforms: "Etsy, Gumroad, Own Website",
            description: "Develop professional business forms, contracts, and document templates",
            skillMatch: ["writing", "teaching"],
            budgetMatch: ["under100"],
            timeMatch: ["1-2weeks", "1-2months"],
            incomeMatch: ["100-1000", "1000-5000"]
        }
    ];

    toolsData = [
        { name: "Canva", purpose: "Design templates, graphics, presentations", cost: "Free tier available" },
        { name: "ChatGPT", purpose: "Content creation, ideas, copywriting", cost: "Free tier available" },
        { name: "Etsy", purpose: "Marketplace for selling digital products", cost: "Free to start, small fees per sale" },
        { name: "Gumroad", purpose: "Platform for selling digital downloads", cost: "Free to start, percentage of sales" },
        { name: "Amazon KDP", purpose: "Self-publishing ebooks and paperbacks", cost: "Free to use" },
        { name: "Udemy", purpose: "Online course marketplace", cost: "Free to create, revenue sharing" },
        { name: "Shutterstock", purpose: "Stock photography marketplace", cost: "Free to submit, commission-based" }
    ];
}

// Question data
const questions = [
    {
        id: 'skill',
        question: "What's your current skill level?",
        options: [
            { value: 'beginner', title: 'Beginner', description: "I'm new to digital products" },
            { value: 'intermediate', title: 'Intermediate', description: "I have some experience" },
            { value: 'advanced', title: 'Advanced', description: "I'm tech-savvy and experienced" }
        ]
    },
    {
        id: 'time',
        question: "How much time can you invest initially?",
        options: [
            { value: '1-2weeks', title: '1-2 weeks', description: 'Quick start' },
            { value: '1-2months', title: '1-2 months', description: 'Standard timeline' },
            { value: '3+months', title: '3+ months', description: 'Long-term project' }
        ]
    },
    {
        id: 'budget',
        question: "What's your budget for tools and setup?",
        options: [
            { value: 'under100', title: 'Under $100', description: 'Minimal investment' },
            { value: '100-500', title: '$100-500', description: 'Moderate investment' },
            { value: '500+', title: '$500+', description: 'Higher investment' }
        ]
    },
    {
        id: 'interest',
        question: "What are you most interested in?",
        options: [
            { value: 'writing', title: 'Writing and content creation', description: 'Books, articles, copywriting' },
            { value: 'design', title: 'Design and visual arts', description: 'Graphics, templates, illustrations' },
            { value: 'teaching', title: 'Teaching and education', description: 'Courses, tutorials, guides' },
            { value: 'technology', title: 'Technology and software', description: 'Apps, websites, tools' },
            { value: 'photography', title: 'Photography and media', description: 'Stock photos, videos, visual content' }
        ]
    },
    {
        id: 'income',
        question: "What's your income goal?",
        options: [
            { value: '100-1000', title: '$100-1000/month', description: 'Side income' },
            { value: '1000-5000', title: '$1000-5000/month', description: 'Part-time income' },
            { value: '5000+', title: '$5000+/month', description: 'Full-time income' }
        ]
    }
];

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function startQuestionnaire() {
    currentQuestion = 0;
    userAnswers = {};
    showSection('questionnaire');
    displayQuestion();
}

function restartQuestionnaire() {
    startQuestionnaire();
}

function goToWelcome() {
    showSection('welcome');
}

// Question display and navigation
function displayQuestion() {
    const question = questions[currentQuestion];
    if (!question) return;
    
    const container = document.getElementById('questionContainer');
    if (!container) return;
    
    // Update progress
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressText) progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    
    // Generate question HTML
    container.innerHTML = `
        <div class="question fade-in">
            <h3>${question.question}</h3>
            <div class="options">
                ${question.options.map(option => `
                    <div class="option" data-value="${option.value}" tabindex="0">
                        <div class="option-title">${option.title}</div>
                        <div class="option-description">${option.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add click event listeners to options
    const options = container.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            selectOption(this.getAttribute('data-value'));
        });
        
        // Add keyboard support
        option.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption(this.getAttribute('data-value'));
            }
        });
    });
    
    // Update navigation buttons
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (backBtn) backBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
    if (nextBtn) nextBtn.disabled = !userAnswers[question.id];
    
    // Select previously chosen option
    if (userAnswers[question.id]) {
        selectOption(userAnswers[question.id], false);
    }
}

function selectOption(value, updateAnswer = true) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`[data-value="${value}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    if (updateAnswer) {
        const question = questions[currentQuestion];
        if (question) {
            userAnswers[question.id] = value;
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.disabled = false;
        }
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        generateRecommendations();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

// Recommendation engine
function generateRecommendations() {
    const recommendations = calculateRecommendations();
    displayRecommendations(recommendations);
    displayResources(recommendations);
    showSection('results');
}

function calculateRecommendations() {
    const scores = productData.map(product => {
        let score = 0;
        let matchReasons = [];
        
        // Skill level matching
        if (userAnswers.skill === 'beginner' && product.difficulty.includes('Beginner')) {
            score += 3;
            matchReasons.push('Perfect for beginners');
        } else if (userAnswers.skill === 'intermediate' && product.difficulty.includes('Intermediate')) {
            score += 3;
            matchReasons.push('Matches your experience level');
        } else if (userAnswers.skill === 'advanced') {
            score += 2;
            matchReasons.push('Suitable for your skill level');
        }
        
        // Time investment matching
        if (product.timeMatch && product.timeMatch.includes(userAnswers.time)) {
            score += 2;
            matchReasons.push('Fits your timeline');
        }
        
        // Budget matching
        if (product.budgetMatch && product.budgetMatch.includes(userAnswers.budget)) {
            score += 2;
            matchReasons.push('Within your budget');
        }
        
        // Interest matching
        if (product.skillMatch && product.skillMatch.includes(userAnswers.interest)) {
            score += 3;
            matchReasons.push('Aligns with your interests');
        }
        
        // Income goal matching
        if (product.incomeMatch && product.incomeMatch.includes(userAnswers.income)) {
            score += 2;
            matchReasons.push('Meets your income goals');
        }
        
        return {
            product,
            score,
            matchReasons: matchReasons.length > 0 ? matchReasons : ['Good option to consider']
        };
    });
    
    // Sort by score and return top 3
    return scores.sort((a, b) => b.score - a.score).slice(0, 3);
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsGrid');
    if (!container) return;
    
    container.innerHTML = recommendations.map((rec, index) => `
        <div class="recommendation-card fade-in">
            <div class="recommendation-rank">${index + 1}</div>
            <h3>${rec.product.name}</h3>
            
            <div class="match-reason">
                <strong>Why this matches you:</strong> ${rec.matchReasons.join(', ')}
            </div>
            
            <div class="product-details">
                <div class="detail-item">
                    <div class="detail-label">Potential Earnings</div>
                    <div class="detail-value">${rec.product.income}/month</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Time to Create</div>
                    <div class="detail-value">${rec.product.time}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Investment Needed</div>
                    <div class="detail-value">${rec.product.investment}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Difficulty Level</div>
                    <div class="detail-value">${rec.product.difficulty}</div>
                </div>
            </div>
            
            <div class="platforms">
                <h4>Best Platforms to Sell:</h4>
                <div class="platform-tags">
                    ${rec.product.platforms.split(', ').map(platform => 
                        `<span class="platform-tag">${platform}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="getting-started">
                <h4>Getting Started:</h4>
                <p>${rec.product.description}</p>
            </div>
        </div>
    `).join('');
}

function displayResources(recommendations) {
    // Display action items
    const actionItems = document.getElementById('actionItems');
    if (actionItems && recommendations.length > 0) {
        const topRecommendation = recommendations[0].product;
        const actions = generateActionItems(topRecommendation);
        actionItems.innerHTML = actions.map(action => `<li>${action}</li>`).join('');
    }
    
    // Display tools
    const toolsList = document.getElementById('toolsList');
    if (toolsList && recommendations.length > 0) {
        const topRecommendation = recommendations[0].product;
        const relevantTools = getRelevantTools(topRecommendation);
        
        toolsList.innerHTML = relevantTools.map(tool => `
            <div class="tool-item">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-purpose">${tool.purpose}</div>
                <div class="tool-cost">${tool.cost}</div>
            </div>
        `).join('');
    }
}

function generateActionItems(product) {
    const baseActions = [
        'Research your target audience and their needs',
        'Study successful competitors in your chosen niche',
        'Create your first product prototype or sample'
    ];
    
    const specificActions = {
        'Digital Templates/Printables': [
            'Learn Canva or similar design tools',
            'Create 5-10 template variations',
            'Set up an Etsy shop with professional listings'
        ],
        'eBooks': [
            'Outline your book chapters and content',
            'Write your first draft (aim for 10,000+ words)',
            'Create an eye-catching book cover design'
        ],
        'Online Courses': [
            'Plan your course curriculum and modules',
            'Record your first lesson videos',
            'Set up your course on Udemy or Teachable'
        ],
        'Stock Photography': [
            'Build a portfolio of 100+ high-quality images',
            'Research trending keywords and themes',
            'Submit to multiple stock photo platforms'
        ],
        'Digital Art/Graphics': [
            'Develop your unique art style',
            'Create a portfolio of 20+ designs',
            'Research trending graphic design needs'
        ]
    };
    
    return [...baseActions, ...(specificActions[product.name] || [])];
}

function getRelevantTools(product) {
    const toolMap = {
        'Digital Templates/Printables': ['Canva', 'Etsy'],
        'eBooks': ['ChatGPT', 'Amazon KDP', 'Canva'],
        'Online Courses': ['Udemy', 'ChatGPT'],
        'Stock Photography': ['Shutterstock'],
        'Digital Art/Graphics': ['Canva', 'Etsy'],
        'Social Media Templates': ['Canva', 'Etsy'],
        'Business Documents/Forms': ['ChatGPT', 'Etsy', 'Gumroad']
    };
    
    const relevantToolNames = toolMap[product.name] || ['Canva', 'Etsy', 'Gumroad'];
    return toolsData.filter(tool => relevantToolNames.includes(tool.name));
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const questionnaireSection = document.getElementById('questionnaire');
    if (questionnaireSection && questionnaireSection.classList.contains('active')) {
        if (e.key === 'Enter') {
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn && !nextBtn.disabled) {
                nextQuestion();
            }
        } else if (e.key === 'Escape') {
            if (currentQuestion > 0) {
                previousQuestion();
            }
        }
    }
});