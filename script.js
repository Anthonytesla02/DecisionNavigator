// DecisionSplitter - AI-Powered Decision Making Tool
// Pure JavaScript implementation for static site deployment

class DecisionSplitter {
    constructor() {
        this.mistralApiKey = this.getMistralApiKey();
        this.googleSheetsUrl = this.getGoogleSheetsUrl();
        this.alpha = 0.3; // Weight for emotional vs logical scoring
        this.currentAnalysis = null;
        
        this.initializeEventListeners();
        this.validateInputs();
    }

    // Get API key from environment or use fallback
    getMistralApiKey() {
        // Check for environment variable first, then use fallback
        return window.ENV?.MISTRAL_API_KEY || 
               localStorage.getItem('mistral_api_key') || 
               'your-mistral-api-key-here';
    }

    // Get Google Sheets URL from environment or use fallback
    getGoogleSheetsUrl() {
        return window.ENV?.GOOGLE_SHEETS_URL || 
               localStorage.getItem('google_sheets_url') || 
               null;
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Main analyze button
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeDecision();
        });

        // New analysis button
        document.getElementById('newAnalysisBtn').addEventListener('click', () => {
            this.resetToNewAnalysis();
        });

        // Save results button
        document.getElementById('saveResultsBtn').addEventListener('click', () => {
            this.saveToGoogleSheets();
        });

        // Retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.hideError();
            this.analyzeDecision();
        });

        // Input validation
        const inputs = ['optionAName', 'optionAPros', 'optionACons', 'optionBName', 'optionBPros', 'optionBCons'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.validateInputs();
            });
        });
    }

    // Validate inputs and enable/disable analyze button
    validateInputs() {
        const optionAName = document.getElementById('optionAName').value.trim();
        const optionAPros = document.getElementById('optionAPros').value.trim();
        const optionACons = document.getElementById('optionACons').value.trim();
        const optionBName = document.getElementById('optionBName').value.trim();
        const optionBPros = document.getElementById('optionBPros').value.trim();
        const optionBCons = document.getElementById('optionBCons').value.trim();

        const isValid = optionAName && (optionAPros || optionACons) && 
                       optionBName && (optionBPros || optionBCons);

        document.getElementById('analyzeBtn').disabled = !isValid;
    }

    // Parse pros/cons text and extract weights
    parseProsCons(text) {
        if (!text.trim()) return [];
        
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        return lines.map(line => {
            // Check for weight syntax: "Item | weight"
            const weightMatch = line.match(/^(.+?)\s*\|\s*(\d+)$/);
            if (weightMatch) {
                const item = weightMatch[1].trim();
                const weight = Math.min(Math.max(parseInt(weightMatch[2]), 1), 10); // Clamp 1-10
                return { item, weight };
            } else {
                return { item: line, weight: 5 }; // Default weight
            }
        });
    }

    // Calculate logical score for an option
    calculateLogicalScore(pros, cons) {
        const prosSum = pros.reduce((sum, pro) => sum + pro.weight, 0);
        const consSum = cons.reduce((sum, con) => sum + con.weight, 0);
        return prosSum - consSum;
    }

    // Normalize scores to a -10 to +10 range
    normalizeScore(score, maxPossible) {
        if (maxPossible === 0) return 0;
        return (score / maxPossible) * 10;
    }

    // Call Mistral API with retry logic
    async callMistralAPI(prompt, retries = 3) {
        const url = 'https://api.mistral.ai/v1/chat/completions';
        
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.mistralApiKey}`
                    },
                    body: JSON.stringify({
                        model: 'mistral-small-latest',
                        messages: [
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 1000
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API request failed: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                return data.choices[0].message.content;
            } catch (error) {
                console.error(`Mistral API attempt ${i + 1} failed:`, error);
                if (i === retries - 1) throw error;
                
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }

    // Get emotional scores from Mistral AI
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
            
            // Extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Mistral API');
            }
            
            const scores = JSON.parse(jsonMatch[0]);
            
            // Validate scores
            if (typeof scores.A_emotional !== 'number' || typeof scores.B_emotional !== 'number') {
                throw new Error('Invalid emotional scores format');
            }
            
            // Clamp scores to valid range
            scores.A_emotional = Math.min(Math.max(scores.A_emotional, -10), 10);
            scores.B_emotional = Math.min(Math.max(scores.B_emotional, -10), 10);
            
            return scores;
        } catch (error) {
            console.error('Error getting emotional scores:', error);
            // Return neutral scores as fallback
            return { A_emotional: 0, B_emotional: 0 };
        }
    }

    // Get detailed analysis from Mistral AI
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
            
            // Parse the structured response
            const logicMatch = response.match(/LOGIC_REASONING:\s*([\s\S]*?)(?=EMOTION_REASONING:|$)/);
            const emotionMatch = response.match(/EMOTION_REASONING:\s*([\s\S]*?)(?=FINAL_VERDICT:|$)/);
            const verdictMatch = response.match(/FINAL_VERDICT:\s*([\s\S]*?)$/);
            
            return {
                logic: logicMatch ? logicMatch[1].trim() : 'Logical analysis considers the weighted pros and cons for each option.',
                emotion: emotionMatch ? emotionMatch[1].trim() : 'Emotional analysis evaluates psychological impact and satisfaction potential.',
                verdict: verdictMatch ? verdictMatch[1].trim() : `Option ${winner} is recommended based on the combined analysis.`
            };
        } catch (error) {
            console.error('Error getting detailed analysis:', error);
            // Return fallback analysis
            return {
                logic: `Based on logical scoring, Option ${winner} has a stronger rational foundation considering the weighted pros and cons.`,
                emotion: `From an emotional perspective, Option ${winner} appears to offer better psychological outcomes and satisfaction potential.`,
                verdict: `Option ${winner} is recommended as it scores higher in the composite analysis that balances logical reasoning (70%) with emotional intelligence (30%).`
            };
        }
    }

    // Main analysis function
    async analyzeDecision() {
        try {
            this.showLoading();
            this.hideError();

            // Get input data
            const optionAData = {
                name: document.getElementById('optionAName').value.trim(),
                pros: this.parseProsCons(document.getElementById('optionAPros').value),
                cons: this.parseProsCons(document.getElementById('optionACons').value)
            };

            const optionBData = {
                name: document.getElementById('optionBName').value.trim(),
                pros: this.parseProsCons(document.getElementById('optionBPros').value),
                cons: this.parseProsCons(document.getElementById('optionBCons').value)
            };

            // Calculate logical scores
            const logicalScoreA = this.calculateLogicalScore(optionAData.pros, optionAData.cons);
            const logicalScoreB = this.calculateLogicalScore(optionBData.pros, optionBData.cons);

            // Normalize logical scores
            const maxPossibleA = (optionAData.pros.length + optionAData.cons.length) * 10;
            const maxPossibleB = (optionBData.pros.length + optionBData.cons.length) * 10;
            const maxPossible = Math.max(maxPossibleA, maxPossibleB, 1);

            const normalizedLogicalScores = {
                A: this.normalizeScore(logicalScoreA, maxPossible),
                B: this.normalizeScore(logicalScoreB, maxPossible)
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

            // Store current analysis for saving
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

            // Display results
            this.displayResults();
            this.hideLoading();

        } catch (error) {
            console.error('Analysis failed:', error);
            this.hideLoading();
            this.showError(`Analysis failed: ${error.message}. Please check your API configuration and try again.`);
        }
    }

    // Display analysis results
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

        // Show results section with animation
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');

        // Hide input section
        document.getElementById('inputSection').style.display = 'none';

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Show loading state
    showLoading() {
        document.getElementById('analyzeBtn').style.display = 'none';
        document.getElementById('loadingSpinner').style.display = 'block';
    }

    // Hide loading state
    hideLoading() {
        document.getElementById('analyzeBtn').style.display = 'inline-block';
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    // Show error message
    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorSection').style.display = 'block';
        document.getElementById('errorSection').scrollIntoView({ behavior: 'smooth' });
    }

    // Hide error message
    hideError() {
        document.getElementById('errorSection').style.display = 'none';
    }

    // Reset to new analysis
    resetToNewAnalysis() {
        // Clear all inputs
        document.getElementById('optionAName').value = '';
        document.getElementById('optionAPros').value = '';
        document.getElementById('optionACons').value = '';
        document.getElementById('optionBName').value = '';
        document.getElementById('optionBPros').value = '';
        document.getElementById('optionBCons').value = '';

        // Hide results and show input
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('inputSection').style.display = 'block';
        
        // Reset validation
        this.validateInputs();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Clear current analysis
        this.currentAnalysis = null;
    }

    // Save results to Google Sheets
    async saveToGoogleSheets() {
        if (!this.currentAnalysis) {
            alert('No analysis data to save.');
            return;
        }

        if (!this.googleSheetsUrl) {
            // Show instruction for setting up Google Sheets
            const setupInstructions = `To save results to Google Sheets, you need to:

1. Create a Google Sheet
2. Set up a Google Apps Script web app or use a service like SheetDB
3. Set the GOOGLE_SHEETS_URL environment variable or save it to localStorage

Example setup:
localStorage.setItem('google_sheets_url', 'YOUR_SHEETS_API_URL');

Would you like to set the URL now?`;

            if (confirm(setupInstructions)) {
                const url = prompt('Enter your Google Sheets API URL:');
                if (url) {
                    localStorage.setItem('google_sheets_url', url);
                    this.googleSheetsUrl = url;
                    this.saveToGoogleSheets(); // Retry saving
                }
            }
            return;
        }

        try {
            const saveButton = document.getElementById('saveResultsBtn');
            const originalText = saveButton.innerHTML;
            saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveButton.disabled = true;

            const { optionA, optionB, scores, winner, timestamp } = this.currentAnalysis;

            const dataToSave = {
                timestamp: timestamp,
                option_a_name: optionA.name,
                option_a_pros: optionA.pros.map(p => `${p.item} | ${p.weight}`).join('; '),
                option_a_cons: optionA.cons.map(c => `${c.item} | ${c.weight}`).join('; '),
                option_b_name: optionB.name,
                option_b_pros: optionB.pros.map(p => `${p.item} | ${p.weight}`).join('; '),
                option_b_cons: optionB.cons.map(c => `${c.item} | ${c.weight}`).join('; '),
                logical_score_a: scores.logical.A.toFixed(2),
                logical_score_b: scores.logical.B.toFixed(2),
                emotional_score_a: scores.emotional.A_emotional.toFixed(2),
                emotional_score_b: scores.emotional.B_emotional.toFixed(2),
                final_score_a: scores.final.A.toFixed(2),
                final_score_b: scores.final.B.toFixed(2),
                winner: winner,
                winner_name: winner === 'A' ? optionA.name : optionB.name
            };

            const response = await fetch(this.googleSheetsUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave)
            });

            if (!response.ok) {
                throw new Error(`Failed to save to Google Sheets: ${response.status}`);
            }

            // Success feedback
            saveButton.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveButton.style.background = '#28a745';
            
            setTimeout(() => {
                saveButton.innerHTML = originalText;
                saveButton.style.background = '';
                saveButton.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('Error saving to Google Sheets:', error);
            alert(`Failed to save to Google Sheets: ${error.message}`);
            
            const saveButton = document.getElementById('saveResultsBtn');
            saveButton.innerHTML = '<i class="fas fa-save"></i> Save to Google Sheets';
            saveButton.disabled = false;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.decisionSplitter = new DecisionSplitter();
});

// Utility function to set API keys (for development/testing)
window.setMistralApiKey = function(apiKey) {
    localStorage.setItem('mistral_api_key', apiKey);
    location.reload();
};

window.setGoogleSheetsUrl = function(url) {
    localStorage.setItem('google_sheets_url', url);
    location.reload();
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DecisionSplitter;
}
