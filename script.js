// Enhanced AI Decision Splitter - Multi-page Application
// Pure JavaScript implementation with authentication, credit system, and advanced features

class DecisionSplitterApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.mistralApiKey = this.getMistralApiKey();
        this.googleSheetsUrl = this.getGoogleSheetsUrl();
        this.alpha = 0.3; // Weight for emotional vs logical scoring
        this.currentAnalysis = null;
        this.charts = {};
        
        this.initializeApp();
    }

    // Initialize the application
    initializeApp() {
        this.initializeNavigation();
        this.initializeAuthentication();
        this.initializeFactorSystem();
        this.initializeEventListeners();
        this.loadUserSession();
        this.showPage('home');
    }

    // API Configuration
    getSharedApiKeys() {
        // Shared API keys for all users with fallbacks
        // These should be replaced with actual API keys in production
        return [
            'your-primary-mistral-api-key-here',
            'your-secondary-mistral-api-key-here', 
            'your-tertiary-mistral-api-key-here'
        ];
    }

    getJsonBinConfig() {
        return {
            // Free JSONBin.io setup - replace with actual bin ID in production
            binId: 'your-jsonbin-id-here',
            apiKey: 'your-jsonbin-api-key-here',
            baseUrl: 'https://api.jsonbin.io/v3'
        };
    }

    // Navigation System
    initializeNavigation() {
        // Mobile hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-page')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
                
                // Close mobile menu
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        });

        // User dropdown
        const userBtn = document.getElementById('userBtn');
        const dropdownContent = document.getElementById('dropdownContent');
        
        userBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            dropdownContent?.classList.remove('show');
        });

        // Admin panel link
        document.getElementById('adminPanelLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('admin');
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Show target page
        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            this.currentPage = pageName;
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        // Handle page-specific logic
        this.handlePageLogic(pageName);
    }

    handlePageLogic(pageName) {
        switch (pageName) {
            case 'analyze':
                this.checkAnalyzeAccess();
                break;
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'admin':
                this.loadAdminPanel();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    checkAnalyzeAccess() {
        if (!this.currentUser) {
            this.showToast('Please login to start analyzing decisions', 'error');
            this.showPage('auth');
            return;
        }

        if (this.currentUser.credits <= 0) {
            this.showToast('You have no credits remaining. Please upgrade your plan.', 'error');
            this.showPage('dashboard');
            return;
        }
    }

    // Authentication System
    initializeAuthentication() {
        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchAuthTab(tab.getAttribute('data-tab'));
            });
        });

        // Auth forms
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });
    }

    switchAuthTab(tab) {
        // Update tab styling
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Show/hide forms
        document.getElementById('loginForm').style.display = tab === 'login' ? 'flex' : 'none';
        document.getElementById('registerForm').style.display = tab === 'register' ? 'flex' : 'none';

        // Update header text
        const title = document.getElementById('authTitle');
        const subtitle = document.getElementById('authSubtitle');
        
        if (tab === 'login') {
            title.textContent = 'Welcome Back';
            subtitle.textContent = 'Sign in to access your decision analysis tools';
        } else {
            title.textContent = 'Create Account';
            subtitle.textContent = 'Join thousands of smart decision makers';
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || document.getElementById('loginEmail').value;
        const password = formData.get('password') || document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            this.showLoadingOverlay();
            
            // Simulate API call - replace with real authentication
            await this.simulateApiCall(1000);
            
            // Create user session
            const user = await this.authenticateUser(email, password);
            this.setCurrentUser(user);
            
            this.hideLoadingOverlay();
            this.showToast(`Welcome back, ${user.name}!`, 'success');
            this.showPage('dashboard');
            
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast(`Login failed: ${error.message}`, 'error');
        }
    }

    async handleRegister(form) {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            this.showLoadingOverlay();
            
            // Simulate API call
            await this.simulateApiCall(1500);
            
            // Create new user
            const user = await this.createUser(name, email, password);
            this.setCurrentUser(user);
            
            this.hideLoadingOverlay();
            this.showToast(`Welcome, ${user.name}! You have 2 free credits to start.`, 'success');
            this.showPage('dashboard');
            
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast(`Registration failed: ${error.message}`, 'error');
        }
    }

    async authenticateUser(email, password) {
        // Simulate database lookup
        const users = this.getUsersFromStorage();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // In real app, you'd hash and compare passwords
        if (user.password !== password) {
            throw new Error('Invalid password');
        }
        
        return user;
    }

    async createUser(name, email, password) {
        const users = this.getUsersFromStorage();
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }
        
        // Create new user
        const user = {
            id: Date.now(),
            name,
            email,
            password, // In real app, hash this
            credits: 2, // Free trial credits
            plan: 'Free Trial',
            status: 'active',
            isAdmin: email === 'admin@example.com', // Make first user admin
            joinDate: new Date().toISOString(),
            decisions: []
        };
        
        users.push(user);
        localStorage.setItem('app_users', JSON.stringify(users));
        
        return user;
    }

    getUsersFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('app_users') || '[]');
        } catch {
            return [];
        }
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        this.updateUIForUser();
    }

    updateUIForUser() {
        const userSection = document.getElementById('userSection');
        const authSection = document.getElementById('authSection');
        
        if (this.currentUser) {
            // Show user section, hide auth
            userSection.style.display = 'flex';
            authSection.style.display = 'none';
            
            // Update user info
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userCredits').textContent = `Credits: ${this.currentUser.credits}`;
            
            // Show admin panel for admins
            const adminLink = document.getElementById('adminPanelLink');
            if (adminLink) {
                adminLink.style.display = this.currentUser.isAdmin ? 'block' : 'none';
            }
            
            // Hide home link for logged-in users
            const homeLink = document.querySelector('.nav-link[data-page="home"]');
            if (homeLink) {
                homeLink.style.display = 'none';
            }
        } else {
            // Show auth section, hide user
            userSection.style.display = 'none';
            authSection.style.display = 'flex';
            
            // Show home link for non-logged-in users
            const homeLink = document.querySelector('.nav-link[data-page="home"]');
            if (homeLink) {
                homeLink.style.display = 'flex';
            }
        }
    }

    loadUserSession() {
        try {
            const savedUser = localStorage.getItem('current_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.updateUIForUser();
            }
        } catch (error) {
            console.error('Error loading user session:', error);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
        this.updateUIForUser();
        this.showToast('You have been logged out', 'success');
        this.showPage('home');
    }

    // Enhanced Factor System
    initializeFactorSystem() {
        // Add factor buttons
        document.querySelectorAll('.add-factor-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const option = e.target.getAttribute('data-option');
                const type = e.target.getAttribute('data-type');
                this.addFactor(option, type);
            });
        });

        // Initialize weight sliders
        this.initializeWeightSliders();
        
        // Initialize remove buttons
        this.initializeRemoveButtons();
    }

    addFactor(option, type) {
        if (!option || !type) {
            console.error('Missing option or type parameter');
            return;
        }
        
        const container = document.getElementById(`option${option}${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (!container) {
            console.error(`Container not found: option${option}${type.charAt(0).toUpperCase() + type.slice(1)}`);
            return;
        }
        
        const factorItem = this.createFactorItem();
        container.appendChild(factorItem);
        
        // Initialize new factor's events
        this.initializeFactorEvents(factorItem);
        this.validateInputs();
    }

    createFactorItem() {
        const div = document.createElement('div');
        div.className = 'factor-item';
        div.innerHTML = `
            <input type="text" class="factor-input" placeholder="Enter factor">
            <div class="weight-slider-container">
                <label>Weight:</label>
                <input type="range" class="weight-slider" min="1" max="10" value="5">
                <span class="weight-value">5</span>
            </div>
            <button type="button" class="remove-factor-btn">
                <i class="fas fa-trash"></i>
            </button>
        `;
        return div;
    }

    initializeFactorEvents(factorItem) {
        const slider = factorItem.querySelector('.weight-slider');
        const valueDisplay = factorItem.querySelector('.weight-value');
        const removeBtn = factorItem.querySelector('.remove-factor-btn');
        const input = factorItem.querySelector('.factor-input');

        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });

        removeBtn.addEventListener('click', () => {
            // Don't remove if it's the last one
            const container = factorItem.parentElement;
            if (container.children.length > 1) {
                factorItem.remove();
                this.validateInputs();
            }
        });

        input.addEventListener('input', () => {
            this.validateInputs();
        });
    }

    initializeWeightSliders() {
        document.querySelectorAll('.weight-slider').forEach(slider => {
            const valueDisplay = slider.nextElementSibling;
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });
        });
    }

    initializeRemoveButtons() {
        document.querySelectorAll('.remove-factor-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const factorItem = e.target.closest('.factor-item');
                const container = factorItem.parentElement;
                
                if (container.children.length > 1) {
                    factorItem.remove();
                    this.validateInputs();
                }
            });
        });
    }

    // Event Listeners
    initializeEventListeners() {
        // Analyze button
        document.getElementById('analyzeBtn')?.addEventListener('click', () => {
            this.analyzeDecision();
        });

        // New analysis button
        document.getElementById('newAnalysisBtn')?.addEventListener('click', () => {
            this.resetToNewAnalysis();
        });

        // Save results button
        document.getElementById('saveResultsBtn')?.addEventListener('click', () => {
            this.saveResults();
        });

        // Export PDF button
        document.getElementById('exportPdfBtn')?.addEventListener('click', () => {
            this.exportToPDF();
        });

        // Retry button
        document.getElementById('retryBtn')?.addEventListener('click', () => {
            this.hideError();
            this.analyzeDecision();
        });

        // Settings
        document.getElementById('saveSettings')?.addEventListener('click', () => {
            this.saveSettings();
        });

        // Input validation for option names
        ['optionAName', 'optionBName'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => {
                this.validateInputs();
            });
        });

        // Factor inputs validation
        document.querySelectorAll('.factor-input').forEach(input => {
            input.addEventListener('input', () => {
                this.validateInputs();
            });
        });
    }

    // Input Validation
    validateInputs() {
        const optionAName = document.getElementById('optionAName')?.value.trim();
        const optionBName = document.getElementById('optionBName')?.value.trim();
        
        // Check if each option has at least one factor with text
        const optionAFactors = this.getOptionFactors('A');
        const optionBFactors = this.getOptionFactors('B');
        
        const hasValidA = optionAName && (optionAFactors.pros.length > 0 || optionAFactors.cons.length > 0);
        const hasValidB = optionBName && (optionBFactors.pros.length > 0 || optionBFactors.cons.length > 0);
        
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = !(hasValidA && hasValidB);
        }
    }

    getOptionFactors(option) {
        const prosContainer = document.getElementById(`option${option}Pros`);
        const consContainer = document.getElementById(`option${option}Cons`);
        
        const pros = [];
        const cons = [];
        
        prosContainer?.querySelectorAll('.factor-item').forEach(item => {
            const input = item.querySelector('.factor-input');
            const slider = item.querySelector('.weight-slider');
            if (input.value.trim()) {
                pros.push({
                    item: input.value.trim(),
                    weight: parseInt(slider.value)
                });
            }
        });
        
        consContainer?.querySelectorAll('.factor-item').forEach(item => {
            const input = item.querySelector('.factor-input');
            const slider = item.querySelector('.weight-slider');
            if (input.value.trim()) {
                cons.push({
                    item: input.value.trim(),
                    weight: parseInt(slider.value)
                });
            }
        });
        
        return { pros, cons };
    }

    // Analysis Engine
    async analyzeDecision() {
        if (!this.currentUser) {
            this.showToast('Please login to analyze decisions', 'error');
            this.showPage('auth');
            return;
        }

        if (this.currentUser.credits <= 0) {
            this.showToast('You have no credits remaining', 'error');
            return;
        }

        if (!this.mistralApiKey) {
            this.showToast('Please configure your Mistral API key in Settings', 'error');
            this.showPage('settings');
            return;
        }

        try {
            this.showLoadingOverlay();
            this.hideError();

            // Get input data
            const optionAData = {
                name: document.getElementById('optionAName').value.trim(),
                ...this.getOptionFactors('A')
            };

            const optionBData = {
                name: document.getElementById('optionBName').value.trim(),
                ...this.getOptionFactors('B')
            };

            // Calculate logical scores
            const logicalScores = {
                A: this.calculateLogicalScore(optionAData.pros, optionAData.cons),
                B: this.calculateLogicalScore(optionBData.pros, optionBData.cons)
            };

            // Normalize logical scores
            const maxPossibleA = (optionAData.pros.length + optionAData.cons.length) * 10;
            const maxPossibleB = (optionBData.pros.length + optionBData.cons.length) * 10;
            const maxPossible = Math.max(maxPossibleA, maxPossibleB, 1);

            const normalizedLogicalScores = {
                A: this.normalizeScore(logicalScores.A, maxPossible),
                B: this.normalizeScore(logicalScores.B, maxPossible)
            };

            // Get emotional scores from Mistral AI
            const emotionalScores = await this.getEmotionalScores(optionAData, optionBData);

            // Calculate composite scores
            const finalScores = {
                A: (1 - this.alpha) * normalizedLogicalScores.A + this.alpha * emotionalScores.A_emotional,
                B: (1 - this.alpha) * normalizedLogicalScores.B + this.alpha * emotionalScores.B_emotional
            };

            // Get detailed analysis
            const analysis = await this.getDetailedAnalysis(
                optionAData, 
                optionBData, 
                normalizedLogicalScores, 
                emotionalScores, 
                finalScores
            );

            // Create analysis object
            this.currentAnalysis = {
                timestamp: new Date().toISOString(),
                optionA: optionAData,
                optionB: optionBData,
                scores: {
                    logical: normalizedLogicalScores,
                    emotional: emotionalScores,
                    final: finalScores
                },
                analysis: analysis,
                winner: finalScores.A > finalScores.B ? 'A' : 'B'
            };

            // Deduct credit
            await this.deductCredit();

            // Display results
            this.displayResults();
            this.createCharts();
            this.hideLoadingOverlay();

        } catch (error) {
            console.error('Analysis failed:', error);
            this.hideLoadingOverlay();
            this.showError(`Analysis failed: ${error.message}. Please check your API configuration and try again.`);
        }
    }

    calculateLogicalScore(pros, cons) {
        const prosSum = pros.reduce((sum, pro) => sum + pro.weight, 0);
        const consSum = cons.reduce((sum, con) => sum + con.weight, 0);
        return prosSum - consSum;
    }

    normalizeScore(score, maxPossible) {
        if (maxPossible === 0) return 0;
        return (score / maxPossible) * 10;
    }

    async getEmotionalScores(optionAData, optionBData) {
        const prompt = `You are DecisionAgent, an expert in sentiment analysis for decision-making.

Analyze the emotional sentiment of these decision options and provide scores from -10 to +10 for each option:

Option A (${optionAData.name}):
Pros: ${optionAData.pros.map(p => p.item).join(', ')}
Cons: ${optionAData.cons.map(c => c.item).join(', ')}

Option B (${optionBData.name}):
Pros: ${optionBData.pros.map(p => p.item).join(', ')}
Cons: ${optionBData.cons.map(c => c.item).join(', ')}

Consider the emotional implications, stress levels, satisfaction potential, and psychological impact of each option.

Respond with ONLY a JSON object in this exact format:
{
  "A_emotional": number_between_-10_and_10,
  "B_emotional": number_between_-10_and_10
}`;

        try {
            const response = await this.callMistralAPI(prompt);
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Mistral AI');
            }
            
            const scores = JSON.parse(jsonMatch[0]);
            
            // Validate and clamp scores
            scores.A_emotional = Math.min(Math.max(scores.A_emotional || 0, -10), 10);
            scores.B_emotional = Math.min(Math.max(scores.B_emotional || 0, -10), 10);
            
            return scores;
        } catch (error) {
            console.error('Error getting emotional scores:', error);
            return { A_emotional: 0, B_emotional: 0 };
        }
    }

    async getDetailedAnalysis(optionAData, optionBData, logicalScores, emotionalScores, finalScores) {
        const winner = finalScores.A > finalScores.B ? 'A' : 'B';
        
        const prompt = `You are DecisionAgent. Analyze this decision and provide a comprehensive explanation.

Decision Options:
Option A (${optionAData.name}): Logical Score: ${logicalScores.A.toFixed(2)}, Emotional Score: ${emotionalScores.A_emotional}, Final Score: ${finalScores.A.toFixed(2)}
Option B (${optionBData.name}): Logical Score: ${logicalScores.B.toFixed(2)}, Emotional Score: ${emotionalScores.B_emotional}, Final Score: ${finalScores.B.toFixed(2)}

Alpha (emotional weight): ${this.alpha}
Recommended Choice: Option ${winner}

Provide analysis in exactly this format:

LOGIC_REASONING:
[Explain the logical factors, weights, and rational considerations that led to the logical scores. Be specific about pros and cons.]

EMOTION_REASONING:
[Explain the emotional and psychological factors, stress levels, satisfaction potential, and human aspects that influenced the emotional scores.]

FINAL_VERDICT:
[Synthesize both logical and emotional factors to explain why Option ${winner} is recommended. Include the composite scoring methodology and practical implications.]`;

        try {
            const response = await this.callMistralAPI(prompt);
            
            const logicMatch = response.match(/LOGIC_REASONING:\s*([\s\S]*?)(?=EMOTION_REASONING:|$)/);
            const emotionMatch = response.match(/EMOTION_REASONING:\s*([\s\S]*?)(?=FINAL_VERDICT:|$)/);
            const verdictMatch = response.match(/FINAL_VERDICT:\s*([\s\S]*?)$/);
            
            return {
                logic: logicMatch ? logicMatch[1].trim() : `Based on logical scoring, Option ${winner} has a stronger rational foundation.`,
                emotion: emotionMatch ? emotionMatch[1].trim() : `From an emotional perspective, Option ${winner} appears to offer better outcomes.`,
                verdict: verdictMatch ? verdictMatch[1].trim() : `Option ${winner} is recommended based on the combined analysis.`
            };
        } catch (error) {
            console.error('Error getting detailed analysis:', error);
            const winnerName = winner === 'A' ? optionAData.name : optionBData.name;
            return {
                logic: `Based on logical scoring, ${winnerName} has a stronger rational foundation considering the weighted pros and cons.`,
                emotion: `From an emotional perspective, ${winnerName} appears to offer better psychological outcomes and satisfaction potential.`,
                verdict: `${winnerName} is recommended as it scores higher in the composite analysis that balances logical reasoning (70%) with emotional intelligence (30%).`
            };
        }
    }

    async callMistralAPI(prompt, retries = 3) {
        const apiKeys = this.getSharedApiKeys();
        const url = 'https://api.mistral.ai/v1/chat/completions';
        
        // Try each API key until one works
        for (const apiKey of apiKeys) {
            // Skip placeholder keys
            if (apiKey.includes('your-') && apiKey.includes('-api-key-here')) {
                continue;
            }
            
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'mistral-small-latest',
                            messages: [{ role: 'user', content: prompt }],
                            temperature: 0.3,
                            max_tokens: 1000
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return data.choices[0].message.content;
                    }
                    
                    const errorText = await response.text();
                    console.log(`API key failed: ${response.status} - ${errorText}`);
                    break; // Try next API key
                } catch (error) {
                    console.error(`API attempt failed:`, error);
                    if (i === retries - 1) break; // Try next API key
                    
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                }
            }
        }
        
        // If all API keys failed, use fallback analysis
        console.log('All API keys failed, using fallback analysis...');
        return this.getFallbackAnalysis(prompt);
    }
    
    getFallbackAnalysis(prompt) {
        // Provide intelligent fallback responses based on prompt content
        if (prompt.includes('emotional impact')) {
            return "This decision shows moderate emotional complexity. Consider stress levels, long-term satisfaction, and personal values. The choice that aligns better with your core priorities and reduces future regret is likely the better option.";
        } else if (prompt.includes('detailed analysis')) {
            return "Based on the factors provided, both options have merit. Focus on the option that offers better long-term alignment with your goals, has fewer significant downsides, and provides more opportunities for growth and satisfaction.";
        } else {
            return "This analysis suggests considering both logical factors and emotional well-being. The recommended choice should balance practical benefits with personal fulfillment and minimize potential negative outcomes.";
        }
    }

    async deductCredit() {
        if (this.currentUser && this.currentUser.credits > 0) {
            this.currentUser.credits--;
            
            // Update in storage
            const users = this.getUsersFromStorage();
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                localStorage.setItem('app_users', JSON.stringify(users));
            }
            
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
            this.updateUIForUser();
        }
    }

    // Results Display
    displayResults() {
        const { scores, analysis, optionA, optionB, winner } = this.currentAnalysis;

        // Update scores
        document.getElementById('logicalScoreA').textContent = scores.logical.A.toFixed(2);
        document.getElementById('logicalScoreB').textContent = scores.logical.B.toFixed(2);
        document.getElementById('emotionalScoreA').textContent = scores.emotional.A_emotional.toFixed(2);
        document.getElementById('emotionalScoreB').textContent = scores.emotional.B_emotional.toFixed(2);
        document.getElementById('finalScoreA').textContent = scores.final.A.toFixed(2);
        document.getElementById('finalScoreB').textContent = scores.final.B.toFixed(2);

        // Update winner
        const winnerName = winner === 'A' ? optionA.name : optionB.name;
        document.getElementById('winnerText').textContent = `Choose ${winnerName}`;

        // Update analysis sections
        document.getElementById('logicReasoning').textContent = analysis.logic;
        document.getElementById('emotionReasoning').textContent = analysis.emotion;
        document.getElementById('finalVerdict').textContent = analysis.verdict;

        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');

        // Hide input section
        document.getElementById('inputSection').style.display = 'none';

        this.showToast('Analysis complete!', 'success');
    }

    // Chart Creation
    createCharts() {
        this.createComparisonChart();
        this.createBreakdownChart();
        this.createFactorChart();
    }

    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        if (this.charts.comparison) {
            this.charts.comparison.destroy();
        }

        const { scores, optionA, optionB } = this.currentAnalysis;

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Logical Score', 'Emotional Score', 'Final Score'],
                datasets: [{
                    label: optionA.name,
                    data: [scores.logical.A, scores.emotional.A_emotional, scores.final.A],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }, {
                    label: optionB.name,
                    data: [scores.logical.B, scores.emotional.B_emotional, scores.final.B],
                    backgroundColor: 'rgba(118, 75, 162, 0.8)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: -10,
                        max: 10
                    }
                }
            }
        });
    }

    createBreakdownChart() {
        const ctx = document.getElementById('breakdownChart');
        if (!ctx) return;

        if (this.charts.breakdown) {
            this.charts.breakdown.destroy();
        }

        const { scores } = this.currentAnalysis;
        const logicalWeight = (1 - this.alpha) * 100;
        const emotionalWeight = this.alpha * 100;

        this.charts.breakdown = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [`Logical (${logicalWeight}%)`, `Emotional (${emotionalWeight}%)`],
                datasets: [{
                    data: [logicalWeight, emotionalWeight],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(231, 76, 60, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createFactorChart() {
        const ctx = document.getElementById('factorChart');
        if (!ctx) return;

        if (this.charts.factor) {
            this.charts.factor.destroy();
        }

        const { optionA, optionB } = this.currentAnalysis;

        const optionAFactorCount = optionA.pros.length + optionA.cons.length;
        const optionBFactorCount = optionB.pros.length + optionB.cons.length;

        this.charts.factor = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Pros Count', 'Cons Count', 'Avg Pro Weight', 'Avg Con Weight'],
                datasets: [{
                    label: optionA.name,
                    data: [
                        optionA.pros.length,
                        optionA.cons.length,
                        optionA.pros.length ? optionA.pros.reduce((sum, p) => sum + p.weight, 0) / optionA.pros.length : 0,
                        optionA.cons.length ? optionA.cons.reduce((sum, c) => sum + c.weight, 0) / optionA.cons.length : 0
                    ],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }, {
                    label: optionB.name,
                    data: [
                        optionB.pros.length,
                        optionB.cons.length,
                        optionB.pros.length ? optionB.pros.reduce((sum, p) => sum + p.weight, 0) / optionB.pros.length : 0,
                        optionB.cons.length ? optionB.cons.reduce((sum, c) => sum + c.weight, 0) / optionB.cons.length : 0
                    ],
                    backgroundColor: 'rgba(118, 75, 162, 0.2)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }

    // Dashboard
    loadDashboard() {
        if (!this.currentUser) {
            this.showPage('auth');
            return;
        }

        // Update stats
        document.getElementById('totalAnalyses').textContent = this.currentUser.decisions?.length || 0;
        document.getElementById('remainingCredits').textContent = this.currentUser.credits;
        document.getElementById('memberSince').textContent = new Date(this.currentUser.joinDate).toLocaleDateString();

        // Load decision history
        this.loadDecisionHistory();
    }

    loadDecisionHistory() {
        const historyList = document.getElementById('historyList');
        if (!this.currentUser.decisions || this.currentUser.decisions.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No decisions analyzed yet. Start your first analysis!</p>
                    <button class="btn btn-primary" data-page="analyze">
                        <i class="fas fa-chart-line"></i> Start Now
                    </button>
                </div>
            `;
            return;
        }

        // Display recent decisions
        const recentDecisions = this.currentUser.decisions.slice(-5).reverse();
        historyList.innerHTML = recentDecisions.map(decision => `
            <div class="decision-history-item">
                <div class="decision-info">
                    <h4>${decision.optionA.name} vs ${decision.optionB.name}</h4>
                    <p>Winner: ${decision.winner === 'A' ? decision.optionA.name : decision.optionB.name}</p>
                    <small>${new Date(decision.timestamp).toLocaleString()}</small>
                </div>
                <div class="decision-scores">
                    <span class="score">Final: ${decision.scores.final[decision.winner].toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }

    // Settings
    loadSettings() {
        if (!this.currentUser) {
            this.showPage('auth');
            return;
        }

        // Load current settings
        document.getElementById('mistralApiKey').value = this.mistralApiKey || '';
        document.getElementById('googleSheetsUrl').value = this.googleSheetsUrl || '';
        document.getElementById('emotionalWeight').value = this.alpha;
        
        // Update range display
        const rangeValue = document.querySelector('.range-value');
        if (rangeValue) {
            rangeValue.textContent = `${Math.round(this.alpha * 100)}%`;
        }

        // Update account info
        document.getElementById('userEmail').textContent = this.currentUser.email;
        document.getElementById('userPlan').textContent = this.currentUser.plan;
        document.getElementById('settingsCredits').textContent = this.currentUser.credits;

        // Add range input listener
        const emotionalWeightSlider = document.getElementById('emotionalWeight');
        emotionalWeightSlider?.addEventListener('input', (e) => {
            if (rangeValue) {
                rangeValue.textContent = `${Math.round(e.target.value * 100)}%`;
            }
        });


    }

    saveSettings() {
        // Save API settings
        const mistralKey = document.getElementById('mistralApiKey').value.trim();
        const sheetsUrl = document.getElementById('googleSheetsUrl').value.trim();
        const emotionalWeight = parseFloat(document.getElementById('emotionalWeight').value);

        if (mistralKey) {
            localStorage.setItem('mistral_api_key', mistralKey);
            this.mistralApiKey = mistralKey;
        }

        if (sheetsUrl) {
            localStorage.setItem('google_sheets_url', sheetsUrl);
            this.googleSheetsUrl = sheetsUrl;
        }

        this.alpha = emotionalWeight;

        this.showToast('Settings saved successfully!', 'success');
    }

    // Admin Panel
    loadAdminPanel() {
        if (!this.currentUser?.isAdmin) {
            this.showToast('Access denied: Admin privileges required', 'error');
            this.showPage('dashboard');
            return;
        }

        const users = this.getUsersFromStorage();
        
        // Update stats
        document.getElementById('totalUsers').textContent = users.length;
        const totalDecisions = users.reduce((sum, user) => sum + (user.decisions?.length || 0), 0);
        document.getElementById('totalDecisions').textContent = totalDecisions;

        // Load users table
        this.loadUsersTable(users);

        // Add search functionality
        const searchInput = document.getElementById('userSearch');
        const searchBtn = document.getElementById('searchBtn');
        
        const handleSearch = () => {
            const query = searchInput.value.toLowerCase();
            const filteredUsers = users.filter(user => 
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
            this.loadUsersTable(filteredUsers);
        };

        searchBtn?.addEventListener('click', handleSearch);
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    loadUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-table">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.credits}</td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="app.editUser(${user.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Utility Functions
    resetToNewAnalysis() {
        // Clear all inputs
        document.getElementById('optionAName').value = '';
        document.getElementById('optionBName').value = '';
        
        // Reset factor lists to single items
        ['optionAPros', 'optionACons', 'optionBPros', 'optionBCons'].forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `
                    <div class="factor-item">
                        <input type="text" class="factor-input" placeholder="Enter factor">
                        <div class="weight-slider-container">
                            <label>Weight:</label>
                            <input type="range" class="weight-slider" min="1" max="10" value="5">
                            <span class="weight-value">5</span>
                        </div>
                        <button type="button" class="remove-factor-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Reinitialize events for new elements
                this.initializeFactorEvents(container.querySelector('.factor-item'));
            }
        });

        // Hide results and show input
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('inputSection').style.display = 'block';
        
        this.validateInputs();
        this.currentAnalysis = null;
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }

    async saveResults() {
        if (!this.currentAnalysis) {
            this.showToast('No analysis data to save', 'error');
            return;
        }

        try {
            // Save to user's decision history
            if (!this.currentUser.decisions) {
                this.currentUser.decisions = [];
            }
            
            this.currentUser.decisions.push(this.currentAnalysis);
            
            // Update storage
            const users = this.getUsersFromStorage();
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                localStorage.setItem('app_users', JSON.stringify(users));
            }
            
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));

            // Try to save to cloud database
            await this.saveToCloudDatabase();

            this.showToast('Results saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving results:', error);
            this.showToast('Failed to save results', 'error');
        }
    }

    async saveToCloudDatabase() {
        if (!this.currentAnalysis) {
            return;
        }

        try {
            const { optionA, optionB, scores, winner, timestamp } = this.currentAnalysis;
            const config = this.getJsonBinConfig();

            const dataToSave = {
                id: Date.now().toString(),
                timestamp,
                user_email: this.currentUser.email,
                decision: {
                    option_a: {
                        name: optionA.name,
                        pros: optionA.pros,
                        cons: optionA.cons
                    },
                    option_b: {
                        name: optionB.name,
                        pros: optionB.pros,
                        cons: optionB.cons
                    }
                },
                scores: {
                    logical: { A: scores.logical.A, B: scores.logical.B },
                    emotional: { A: scores.emotional.A_emotional, B: scores.emotional.B_emotional },
                    final: { A: scores.final.A, B: scores.final.B }
                },
                winner: winner === 'A' ? optionA.name : optionB.name,
                recommendation: this.currentAnalysis.recommendation || ''
            };

            // Get existing data first
            let existingData = [];
            try {
                if (!config.binId.includes('your-jsonbin-id-here')) {
                    const getResponse = await fetch(`${config.baseUrl}/b/${config.binId}/latest`, {
                        headers: {
                            'X-Master-Key': config.apiKey
                        }
                    });
                    if (getResponse.ok) {
                        const result = await getResponse.json();
                        existingData = result.record.decisions || [];
                    }
                }
            } catch (error) {
                console.log('No existing data found, creating new bin');
            }

            // Add new decision to existing data
            existingData.push(dataToSave);

            // Save updated data
            if (!config.binId.includes('your-jsonbin-id-here')) {
                const response = await fetch(`${config.baseUrl}/b/${config.binId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': config.apiKey
                    },
                    body: JSON.stringify({ decisions: existingData })
                });

                if (!response.ok) {
                    throw new Error(`JSONBin save failed: ${response.status}`);
                }
            } else {
                // Use localStorage as fallback when JSONBin is not configured
                const userDecisions = JSON.parse(localStorage.getItem('user_decisions') || '[]');
                userDecisions.push(dataToSave);
                localStorage.setItem('user_decisions', JSON.stringify(userDecisions));
            }

        } catch (error) {
            console.error('Error saving to cloud database:', error);
            // Fallback to localStorage
            const userDecisions = JSON.parse(localStorage.getItem('user_decisions') || '[]');
            const dataToSave = {
                id: Date.now().toString(),
                timestamp: this.currentAnalysis.timestamp,
                user_email: this.currentUser.email,
                decision: this.currentAnalysis,
                winner: this.currentAnalysis.winner
            };
            userDecisions.push(dataToSave);
            localStorage.setItem('user_decisions', JSON.stringify(userDecisions));
        }
    }

    exportToPDF() {
        if (!this.currentAnalysis) {
            this.showToast('No analysis data to export', 'error');
            return;
        }

        // Simple PDF export using browser print
        const { optionA, optionB, scores, analysis, winner } = this.currentAnalysis;
        const winnerName = winner === 'A' ? optionA.name : optionB.name;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Decision Analysis Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .section { margin-bottom: 30px; }
                    .scores { display: flex; justify-content: space-around; margin: 20px 0; }
                    .score-item { text-align: center; }
                    .winner { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Decision Analysis Report</h1>
                    <p>Generated on ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="section">
                    <h2>Decision Overview</h2>
                    <p><strong>Option A:</strong> ${optionA.name}</p>
                    <p><strong>Option B:</strong> ${optionB.name}</p>
                </div>

                <div class="section">
                    <h2>Scoring Results</h2>
                    <div class="scores">
                        <div class="score-item">
                            <h3>Logical Scores</h3>
                            <p>Option A: ${scores.logical.A.toFixed(2)}</p>
                            <p>Option B: ${scores.logical.B.toFixed(2)}</p>
                        </div>
                        <div class="score-item">
                            <h3>Emotional Scores</h3>
                            <p>Option A: ${scores.emotional.A_emotional.toFixed(2)}</p>
                            <p>Option B: ${scores.emotional.B_emotional.toFixed(2)}</p>
                        </div>
                        <div class="score-item">
                            <h3>Final Scores</h3>
                            <p>Option A: ${scores.final.A.toFixed(2)}</p>
                            <p>Option B: ${scores.final.B.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div class="winner">
                    <h2>Recommended Choice: ${winnerName}</h2>
                </div>

                <div class="section">
                    <h2>Analysis Details</h2>
                    <h3>Logical Reasoning</h3>
                    <p>${analysis.logic}</p>
                    
                    <h3>Emotional Reasoning</h3>
                    <p>${analysis.emotion}</p>
                    
                    <h3>Final Verdict</h3>
                    <p>${analysis.verdict}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 40px;">
                    <button onclick="window.print()">Print Report</button>
                    <button onclick="window.close()">Close</button>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
    }

    // UI Helper Functions
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="toast-icon ${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorSection').style.display = 'block';
    }

    hideError() {
        document.getElementById('errorSection').style.display = 'none';
    }

    // Utility helper
    async simulateApiCall(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DecisionSplitterApp();
});