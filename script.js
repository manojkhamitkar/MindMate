// Enhanced MindMate JavaScript - Real-time & Dynamic Features

// Real-time Event System
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

// Global event system
const eventBus = new EventEmitter();

// Enhanced Animation Controller
class AnimationController {
    static fadeIn(element, duration = 300) {
        return new Promise(resolve => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                setTimeout(resolve, duration);
            });
        });
    }
    
    static pulse(element, duration = 500) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
    
    static bounce(element) {
        element.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
    
    static shake(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    static createRipple(element, event) {
        const ripple = document.createElement('div');
        ripple.classList.add('btn-ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Real-time Mood Analyzer
class MoodAnalyzer {
    static analyzeMoodPattern(entries) {
        if (entries.length < 2) return null;
        
        const recent = entries.slice(0, 7);
        const trend = this.calculateTrend(recent);
        const volatility = this.calculateVolatility(recent);
        const dominantFactors = this.getDominantFactors(recent);
        
        return {
            trend,
            volatility,
            dominantFactors,
            recommendation: this.generateRecommendation(trend, volatility, dominantFactors)
        };
    }
    
    static calculateTrend(entries) {
        if (entries.length < 2) return 'stable';
        
        const slopes = [];
        for (let i = 1; i < entries.length; i++) {
            slopes.push(entries[i].mood - entries[i-1].mood);
        }
        
        const avgSlope = slopes.reduce((a, b) => a + b, 0) / slopes.length;
        
        if (avgSlope > 0.3) return 'improving';
        if (avgSlope < -0.3) return 'declining';
        return 'stable';
    }
    
    static calculateVolatility(entries) {
        if (entries.length < 2) return 'low';
        
        const changes = [];
        for (let i = 1; i < entries.length; i++) {
            changes.push(Math.abs(entries[i].mood - entries[i-1].mood));
        }
        
        const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
        
        if (avgChange > 1.5) return 'high';
        if (avgChange > 0.8) return 'medium';
        return 'low';
    }
    
    static getDominantFactors(entries) {
        const factorCount = {};
        entries.forEach(entry => {
            if (entry.factors) {
                entry.factors.forEach(factor => {
                    factorCount[factor] = (factorCount[factor] || 0) + 1;
                });
            }
        });
        
        return Object.entries(factorCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([factor]) => factor);
    }
    
    static generateRecommendation(trend, volatility, factors) {
        const recommendations = {
            improving: {
                low: "🌟 You're on a great track! Keep up the positive momentum and consistency.",
                medium: "📈 Good progress! Try to maintain regular self-care routines for stability.",
                high: "⚡ Positive trend with some ups and downs. Focus on building consistent habits."
            },
            declining: {
                low: "🌱 Slight dip detected. Consider gentle self-care activities and reflection.",
                medium: "💙 Mood declining. Try breathing exercises, reach out to someone, or engage in wellness activities.",
                high: "🆘 Concerning pattern detected. Consider professional support if this continues. You're not alone."
            },
            stable: {
                low: "✨ Steady and stable - excellent emotional regulation! Keep up the great work.",
                medium: "🎯 Generally stable with normal variation. You're managing well.",
                high: "🎢 Stable average but high volatility. Work on consistency with mood tracking and self-care."
            }
        };
        
        return recommendations[trend][volatility];
    }
}

// Enhanced Data Management with Real-time Features
class MindMateData {
    constructor() {
        this.loadData();
        this.setupRealTimeUpdates();
        this.setupAutoSave();
        this.sessionStartTime = Date.now();
    }
    
    loadData() {
        this.moodEntries = JSON.parse(localStorage.getItem('mindmate_moods') || '[]');
        this.reflections = JSON.parse(localStorage.getItem('mindmate_reflections') || '[]');
        this.settings = JSON.parse(localStorage.getItem('mindmate_settings') || '{}');
        this.lastSync = Date.now();
    }
    
    setupRealTimeUpdates() {
        // Listen for real-time events
        eventBus.on('moodChanged', (data) => {
            this.handleMoodChange(data);
        });
        
        eventBus.on('reflectionAdded', (data) => {
            this.handleReflectionAdded(data);
        });
        
        eventBus.on('dataSync', () => {
            this.syncData();
        });
    }
    
    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            if (Date.now() - this.lastSync > 30000) {
                this.syncData();
            }
        }, 30000);
        
        // Update session time every second
        setInterval(() => {
            this.updateSessionTime();
        }, 1000);
    }
    
    updateSessionTime() {
        const sessionTime = Date.now() - this.sessionStartTime;
        const minutes = Math.floor(sessionTime / 60000);
        const seconds = Math.floor((sessionTime % 60000) / 1000);
        const sessionElement = document.getElementById('sessionTime');
        if (sessionElement) {
            sessionElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    handleMoodChange(data) {
        this.updateMoodVisualization(data);
        this.updateInsightEngine();
        this.triggerRecommendations(data);
        this.updateStatusBar();
    }
    
    handleReflectionAdded(data) {
        this.updateReflectionDisplay();
        this.analyzeReflectionSentiment(data);
        this.updateStatusBar();
    }
    
    syncData() {
        this.lastSync = Date.now();
        const lastSavedElement = document.getElementById('lastSaved');
        if (lastSavedElement) {
            lastSavedElement.textContent = `Saved ${new Date().toLocaleTimeString()}`;
        }
        eventBus.emit('dataSynced', { timestamp: this.lastSync });
    }
    
    updateStatusBar() {
        const statusBar = document.getElementById('statusBar');
        const dataCount = document.getElementById('dataCount');
        
        if (dataCount) {
            const totalEntries = this.moodEntries.length + this.reflections.length;
            dataCount.textContent = `${totalEntries} entries`;
            AnimationController.pulse(dataCount);
        }
        
        if (statusBar && (this.moodEntries.length > 0 || this.reflections.length > 0)) {
            statusBar.classList.add('active');
        }
    }
    
    saveMoodEntry(entry) {
        entry.id = Date.now();
        entry.timestamp = new Date().toISOString();
        this.moodEntries.unshift(entry);
        
        // Real-time save with animation
        this.animatedSave('mindmate_moods', this.moodEntries);
        
        // Emit events for real-time updates
        eventBus.emit('moodChanged', entry);
        eventBus.emit('dataUpdated', { type: 'mood', entry });
        
        this.updateDashboard();
        this.updateInsights();
        
        return true;
    }
    
    saveReflection(reflection) {
        reflection.id = Date.now();
        reflection.timestamp = new Date().toISOString();
        this.reflections.unshift(reflection);
        
        // Real-time save with animation
        this.animatedSave('mindmate_reflections', this.reflections);
        
        // Emit events for real-time updates
        eventBus.emit('reflectionAdded', reflection);
        eventBus.emit('dataUpdated', { type: 'reflection', reflection });
        
        this.updateInsights();
        
        return true;
    }
    
    animatedSave(key, data) {
        const saveIndicator = this.createSaveIndicator();
        
        try {
            localStorage.setItem(key, JSON.stringify(data));
            saveIndicator.success();
            return true;
        } catch (error) {
            saveIndicator.error();
            throw error;
        }
    }
    
    createSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        indicator.innerHTML = '💾 Saving...';
        document.body.appendChild(indicator);
        
        // Animate in
        setTimeout(() => {
            indicator.style.transform = 'translateX(0)';
        }, 100);
        
        return {
            success: () => {
                indicator.innerHTML = '✅ Saved!';
                indicator.className = 'save-indicator success';
                setTimeout(() => {
                    indicator.style.transform = 'translateX(100%)';
                    setTimeout(() => indicator.remove(), 300);
                }, 2000);
            },
            error: () => {
                indicator.innerHTML = '❌ Save failed';
                indicator.className = 'save-indicator error';
                setTimeout(() => {
                    indicator.style.transform = 'translateX(100%)';
                    setTimeout(() => indicator.remove(), 300);
                }, 3000);
            }
        };
    }
    
    updateMoodVisualization(entry) {
        const moodChart = document.getElementById('moodChart');
        if (moodChart && window.moodChart) {
            this.animateChartUpdate(entry);
        }
    }
    
    animateChartUpdate(entry) {
        const chart = window.moodChart;
        const newData = this.getMoodTrend();
        
        // Animate chart update
        chart.data.labels = newData.map(d => d.date);
        chart.data.datasets[0].data = newData.map(d => d.mood);
        
        chart.update('active');
        
        // Pulse the chart container
        const container = chart.canvas.parentElement;
        AnimationController.pulse(container);
        
        // Update trend indicator
        this.updateTrendIndicator();
    }
    
    updateTrendIndicator() {
        const trendIndicator = document.getElementById('trendIndicator');
        if (trendIndicator && this.moodEntries.length > 1) {
            const analysis = MoodAnalyzer.analyzeMoodPattern(this.moodEntries);
            if (analysis) {
                const icons = {
                    improving: '📈',
                    declining: '📉',
                    stable: '➡️'
                };
                trendIndicator.innerHTML = `${icons[analysis.trend]} ${analysis.trend.charAt(0).toUpperCase() + analysis.trend.slice(1)}`;
                trendIndicator.style.color = analysis.trend === 'improving' ? '#27ae60' : 
                                           analysis.trend === 'declining' ? '#e74c3c' : '#667eea';
            }
        }
    }
    
    updateInsightEngine() {
        const analysis = MoodAnalyzer.analyzeMoodPattern(this.moodEntries);
        if (analysis) {
            this.displayDynamicInsight(analysis);
            this.updatePatternsList(analysis);
        }
    }
    
    displayDynamicInsight(analysis) {
        const insightElement = document.getElementById('dailyInsight');
        if (insightElement) {
            // Animate insight change
            insightElement.style.transition = 'opacity 0.3s ease';
            insightElement.style.opacity = '0';
            
            setTimeout(() => {
                insightElement.textContent = analysis.recommendation;
                insightElement.style.opacity = '1';
            }, 300);
        }
    }
    
    updatePatternsList(analysis) {
        const patternsList = document.getElementById('patternsList');
        if (patternsList && this.moodEntries.length > 2) {
            const patterns = this.generatePatterns(analysis);
            patternsList.innerHTML = patterns.map(pattern => `
                <div class="pattern-item ${pattern.type}">
                    <i class="${pattern.icon}"></i>
                    <span>${pattern.text}</span>
                </div>
            `).join('');
        }
    }
    
    generatePatterns(analysis) {
        const patterns = [];
        
        if (analysis.trend === 'improving') {
            patterns.push({
                type: 'positive',
                icon: 'fas fa-arrow-up',
                text: 'Your mood has been improving over time! Keep up the great work.'
            });
        } else if (analysis.trend === 'declining') {
            patterns.push({
                type: 'warning',
                icon: 'fas fa-arrow-down',
                text: 'Recent mood trend shows some decline. Consider extra self-care.'
            });
        }
        
        if (analysis.volatility === 'high') {
            patterns.push({
                type: 'neutral',
                icon: 'fas fa-chart-line',
                text: 'Your mood shows high variability. Regular tracking helps identify triggers.'
            });
        }
        
        if (analysis.dominantFactors.length > 0) {
            patterns.push({
                type: 'info',
                icon: 'fas fa-lightbulb',
                text: `${analysis.dominantFactors[0]} appears to influence your mood frequently.`
            });
        }
        
        return patterns;
    }
    
    triggerRecommendations(entry) {
        if (entry.mood <= 2) {
            this.showEmergencySupport();
        } else if (entry.mood <= 3) {
            this.suggestWellnessActivity();
        } else if (entry.mood >= 4) {
            this.celebratePositiveMood();
        }
    }
    
    showEmergencySupport() {
        const supportMessage = {
            title: 'We notice you might be having a tough time 💙',
            message: 'Remember: You\'re not alone. Consider reaching out to a friend, family member, or mental health professional. Your wellbeing matters.',
            actions: ['Start breathing exercise', 'View positive reflections', 'Emergency resources']
        };
        
        this.createDynamicPopup(supportMessage, 'support');
    }
    
    suggestWellnessActivity() {
        const activities = [
            'Take 5 deep breaths 🌬️',
            'Write down 3 things you\'re grateful for ✨',
            'Go for a short mindful walk 🚶‍♀️',
            'Listen to calming music 🎵',
            'Do a quick meditation 🧘‍♀️',
            'Call someone you care about 📞',
            'Take a warm shower or bath 🛁'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        showNotification(`💡 Suggestion: ${randomActivity}`, 'info', 4000);
    }
    
    celebratePositiveMood() {
        const celebrations = [
            'Amazing! Keep spreading those good vibes! ✨',
            'You\'re radiating positivity today! 🌟',
            'Great energy! Your happiness is contagious! 😊',
            'Fantastic mood! You\'re doing great! 🎉',
            'Love this positive energy! Keep it up! 💫'
        ];
        
        const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        showNotification(randomCelebration, 'success', 3000);
    }
    
    createDynamicPopup(content, type) {
        const popup = document.createElement('div');
        popup.className = `dynamic-popup ${type}`;
        popup.innerHTML = `
            <div class="popup-content">
                <h3>${content.title}</h3>
                <p>${content.message}</p>
                <div class="popup-actions">
                    ${content.actions.map(action => `<button class="popup-action">${action}</button>`).join('')}
                </div>
                <button class="popup-close">×</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        AnimationController.fadeIn(popup);
        
        // Auto-remove after 15 seconds
        setTimeout(() => {
            popup.remove();
        }, 15000);
        
        // Close button
        popup.querySelector('.popup-close').addEventListener('click', () => {
            popup.remove();
        });
        
        // Action buttons
        popup.querySelectorAll('.popup-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.textContent;
                if (action.includes('breathing')) {
                    document.getElementById('breathingModal').style.display = 'block';
                }
                popup.remove();
            });
        });
    }
    
    getMoodTrend() {
        return this.moodEntries.slice(0, 7).reverse().map(entry => ({
            date: new Date(entry.timestamp).toLocaleDateString(),
            mood: entry.mood
        }));
    }
    
    getAverageMood() {
        if (this.moodEntries.length === 0) return 0;
        const sum = this.moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
        return (sum / this.moodEntries.length).toFixed(1);
    }
    
    updateDashboard() {
        this.updateMoodChart();
        this.updateDailyInsight();
        this.updateStatusBar();
        this.updateMoodStreak();
    }
    
    updateMoodStreak() {
        const streakElement = document.getElementById('moodStreak');
        if (streakElement) {
            const streak = this.calculateMoodStreak();
            streakElement.innerHTML = `<span>🔥 Day ${streak} streak!</span>`;
            if (streak > 1) {
                AnimationController.bounce(streakElement);
            }
        }
    }
    
    calculateMoodStreak() {
        let streak = 0;
        const today = new Date().toDateString();
        
        for (let i = 0; i < this.moodEntries.length; i++) {
            const entryDate = new Date(this.moodEntries[i].timestamp).toDateString();
            const daysAgo = Math.floor((Date.now() - new Date(this.moodEntries[i].timestamp)) / (1000 * 60 * 60 * 24));
            
            if (daysAgo === streak) {
                streak++;
            } else {
                break;
            }
        }
        
        return Math.max(streak, 1);
    }
    
    updateMoodChart() {
        const ctx = document.getElementById('moodChart');
        if (!ctx) {
            console.log('Chart canvas not found');
            return;
        }
        
        const trendData = this.getMoodTrend();
        
        // Add default data if no entries exist
        if (trendData.length === 0) {
            trendData.push(
                { date: 'Start', mood: 3 },
                { date: 'Today', mood: 3 }
            );
        }
        
        // Destroy existing chart
        if (window.moodChart && typeof window.moodChart.destroy === 'function') {
            window.moodChart.destroy();
        }
        
        try {
            window.moodChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: trendData.map(d => d.date),
                    datasets: [{
                        label: 'Mood Level',
                        data: trendData.map(d => d.mood),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#5a67d8',
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 1,
                            max: 5,
                            grid: {
                                color: 'rgba(102, 126, 234, 0.1)'
                            },
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    const moods = {'1': '😞', '2': '😟', '3': '😐', '4': '🙂', '5': '😊'};
                                    return moods[value] || value;
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(102, 126, 234, 0.1)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(102, 126, 234, 0.9)',
                            borderColor: '#667eea',
                            borderWidth: 1,
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            cornerRadius: 10,
                            callbacks: {
                                label: function(context) {
                                    const moodNames = {'1': 'Very Low', '2': 'Low', '3': 'Neutral', '4': 'Good', '5': 'Very Good'};
                                    return `Mood: ${moodNames[context.parsed.y]} (${context.parsed.y}/5)`;
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
            console.log('Chart created successfully');
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }
    
    updateDailyInsight() {
        const insights = [
            "Your mental health journey is unique and valuable. Every step counts! 🌟",
            "Remember: It's okay to have difficult days. What matters is how you care for yourself. 💙",
            "Your feelings are valid. Acknowledge them without judgment and be kind to yourself. 🤗",
            "Progress isn't always linear. Celebrate the small victories along your wellness journey. 🎉",
            "You have the strength to handle whatever today brings. Trust in your resilience. 💪",
            "Taking time for reflection shows great self-awareness and courage. 🧘‍♀️",
            "Each mood entry is a gift to your future self. You're building valuable insights! 📊"
        ];
        
        const todayInsight = insights[new Date().getDay() % insights.length];
        const insightElement = document.getElementById('dailyInsight');
        if (insightElement && this.moodEntries.length === 0) {
            insightElement.textContent = todayInsight;
        }
    }
    
    updateInsights() {
        // Update weekly summary
        const avgMoodElement = document.getElementById('averageMood');
        const moodEntriesElement = document.getElementById('moodEntries');
        const reflectionCountElement = document.getElementById('reflectionCount');
        const reflectionCountBadge = document.getElementById('reflectionCountBadge');
        
        if (avgMoodElement) {
            avgMoodElement.textContent = `${this.getAverageMood()}/5`;
            AnimationController.pulse(avgMoodElement);
        }
        
        if (moodEntriesElement) {
            moodEntriesElement.textContent = this.moodEntries.length;
            AnimationController.pulse(moodEntriesElement);
        }
        
        if (reflectionCountElement) {
            reflectionCountElement.textContent = this.reflections.length;
            AnimationController.pulse(reflectionCountElement);
        }
        
        if (reflectionCountBadge) {
            reflectionCountBadge.textContent = this.reflections.length;
        }
        
        // Update reflection history
        this.updateReflectionHistory();
        
        // Update recommendations
        this.updateRecommendations();
    }
    
    updateReflectionHistory() {
        const historyContainer = document.getElementById('reflectionHistory');
        if (!historyContainer) return;
        
        if (this.reflections.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>No reflections yet. Start your first reflection above!</p>
                </div>
            `;
            return;
        }
        
        historyContainer.innerHTML = '';
        
        this.reflections.slice(0, 5).forEach(reflection => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'reflection-entry';
            entryDiv.innerHTML = `
                <div class="date">${new Date(reflection.timestamp).toLocaleDateString()}</div>
                <div class="prompt">${reflection.prompt}</div>
                <div class="response">${reflection.response}</div>
            `;
            historyContainer.appendChild(entryDiv);
            AnimationController.fadeIn(entryDiv, 200);
        });
    }
    
    updateRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        if (!recommendationsList) return;
        
        if (this.moodEntries.length === 0) {
            recommendationsList.innerHTML = `
                <div class="recommendation-item">
                    <i class="fas fa-star"></i>
                    <div>
                        <strong>Welcome to MindMate!</strong>
                        <p>Start by tracking your mood daily to unlock personalized insights and recommendations.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        const recommendations = this.generatePersonalizedRecommendations();
        recommendationsList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <i class="${rec.icon}"></i>
                <div>
                    <strong>${rec.title}</strong>
                    <p>${rec.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    generatePersonalizedRecommendations() {
        const recommendations = [];
        const analysis = MoodAnalyzer.analyzeMoodPattern(this.moodEntries);
        
        if (analysis) {
            if (analysis.trend === 'declining') {
                recommendations.push({
                    icon: 'fas fa-heart',
                    title: 'Extra Self-Care',
                    description: 'Your recent mood trend suggests focusing on self-care activities that bring you joy and comfort.'
                });
            }
            
            if (analysis.volatility === 'high') {
                recommendations.push({
                    icon: 'fas fa-balance-scale',
                    title: 'Stability Focus',
                    description: 'Try establishing regular routines for sleep, exercise, and relaxation to help stabilize your mood.'
                });
            }
            
            if (analysis.dominantFactors.includes('work')) {
                recommendations.push({
                    icon: 'fas fa-briefcase',
                    title: 'Work-Life Balance',
                    description: 'Work seems to impact your mood frequently. Consider stress management techniques or talking to someone about work stress.'
                });
            }
        }
        
        // Add general recommendations
        recommendations.push({
            icon: 'fas fa-sun',
            title: 'Morning Routine',
            description: 'Start your day with 5 minutes of mindfulness or gratitude practice to set a positive tone.'
        });
        
        return recommendations.slice(0, 3);
    }
    
    // Add missing methods
    updateReflectionDisplay() {
        this.updateReflectionHistory();
    }
    
    analyzeReflectionSentiment(data) {
        // Simple sentiment analysis based on word count and positive keywords
        const positiveWords = ['good', 'great', 'happy', 'grateful', 'thankful', 'excited', 'love', 'amazing'];
        const words = data.response.toLowerCase().split(' ');
        const positiveCount = words.filter(word => positiveWords.includes(word)).length;
        const sentiment = positiveCount > words.length * 0.1 ? 'positive' : 'neutral';
        
        if (sentiment === 'positive') {
            showNotification('Your reflection shows positive energy! ✨', 'success');
        }
    }
}

// Reflection prompts database
const reflectionPrompts = [
    "What are three things you're grateful for today, no matter how small?",
    "Describe a moment today when you felt proud of yourself.",
    "What emotion did you experience most today, and what might have caused it?",
    "If you could give your past self one piece of advice, what would it be?",
    "What's one thing you learned about yourself this week?",
    "How did you show kindness to yourself or others today?",
    "What challenge are you currently facing, and what strength can help you through it?",
    "Describe a person who makes you feel supported and why.",
    "What's something you're looking forward to, and how does it make you feel?",
    "What would you tell a friend who was feeling the way you feel right now?",
    "When did you feel most like yourself today?",
    "What small act of self-care could you do right now?",
    "How has your perspective on something changed recently?",
    "What boundary do you need to set to protect your wellbeing?",
    "What brings you the most peace, and how can you access it more often?"
];

// Initialize data manager when DOM is ready
let dataManager;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize data manager after DOM is loaded
    dataManager = new MindMateData();
    
    // Initialize the app
    setTimeout(() => {
        dataManager.updateDashboard();
        dataManager.updateInsights();
    }, 100);
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const moodSlider = document.getElementById('moodSlider');
    const moodEmoji = document.getElementById('moodEmoji');
    const moodValue = document.getElementById('moodValue');
    const breathingModal = document.getElementById('breathingModal');
    const startBreathing = document.getElementById('startBreathing');
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingInstructions = document.getElementById('breathingInstructions');
    const tipsSection = document.getElementById('tipsSection');
    const reflectionHistory = document.getElementById('reflectionHistory');
    
    // Initialize dashboard
    dataManager.updateDashboard();
    dataManager.updateInsights();
    
    // Tab Navigation with enhanced animations
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const target = this.getAttribute('data-tab');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    setTimeout(() => {
                        content.classList.add('active');
                    }, 150);
                }
            });
            
            // Update specific tab content when switching
            if (target === 'insights') {
                setTimeout(() => {
                    dataManager.updateInsights();
                }, 200);
            }
        });
    });

    // Quick mood selection from dashboard with enhanced feedback
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            AnimationController.createRipple(this, e);
            
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            const mood = this.getAttribute('data-mood');
            const moodValue = parseInt(this.getAttribute('data-value'));
            
            // Auto-save quick mood entry
            const entry = {
                mood: moodValue,
                factors: [],
                notes: `Quick mood check: ${mood}`,
                quickEntry: true
            };
            
            dataManager.saveMoodEntry(entry);
            
            // Show enhanced feedback
            showNotification(`Mood saved! Thanks for checking in 💙`, 'success');
            
            // Bounce animation
            AnimationController.bounce(this);
        });
    });

    // Enhanced Mood Slider with real-time updates
    if (moodSlider) {
        moodSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            let emoji = '😐';
            
            switch(value) {
                case 1: emoji = '😞'; break;
                case 2: emoji = '😟'; break;
                case 3: emoji = '😐'; break;
                case 4: emoji = '🙂'; break;
                case 5: emoji = '😊'; break;
            }
            
            if (moodEmoji) {
                moodEmoji.textContent = emoji;
                AnimationController.pulse(moodEmoji);
            }
            
            if (moodValue) {
                moodValue.textContent = `${value}/5`;
            }
        });
    }

    // Enhanced Factor tag selection
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('selected');
            if (this.classList.contains('selected')) {
                AnimationController.bounce(this);
            }
        });
    });

    // Enhanced Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            AnimationController.createRipple(this, e);
            
            const actionItem = this.closest('.action-item');
            const action = actionItem.getAttribute('data-action');
            
            switch(action) {
                case 'breathing':
                    if (breathingModal) {
                        breathingModal.style.display = 'block';
                        // Reset breathing exercise state
                        resetBreathingExercise();
                    }
                    break;
                case 'walk':
                    startMindfulWalk();
                    break;
                case 'gratitude':
                    startGratitudePractice();
                    break;
            }
        });
    });

    // Enhanced Breathing Exercise
    if (startBreathing) {
        startBreathing.addEventListener('click', function(e) {
            AnimationController.createRipple(this, e);
            startBreathingExercise();
        });
    }

    function startBreathingExercise() {
        let breatheIn = true;
        let cycles = 0;
        const totalCycles = 5;
        
        breathingInstructions.textContent = 'Inhale slowly...';
        breathingCircle.classList.add('inhale');
        document.getElementById('breathText').textContent = 'Breathe In';
        
        const progressBar = document.querySelector('.progress-bar');
        const cycleCount = document.querySelector('.cycle-count');
        
        const interval = setInterval(() => {
            if (breatheIn) {
                breathingInstructions.textContent = 'Exhale slowly...';
                breathingCircle.classList.remove('inhale');
                breathingCircle.classList.add('exhale');
                document.getElementById('breathText').textContent = 'Breathe Out';
                breatheIn = false;
            } else {
                cycles++;
                breathingInstructions.textContent = 'Inhale slowly...';
                breathingCircle.classList.remove('exhale');
                breathingCircle.classList.add('inhale');
                document.getElementById('breathText').textContent = 'Breathe In';
                breatheIn = true;
                
                // Update progress
                if (progressBar) {
                    progressBar.style.width = `${(cycles / totalCycles) * 100}%`;
                }
                if (cycleCount) {
                    cycleCount.textContent = `Cycle ${cycles} of ${totalCycles}`;
                }
                
                if (cycles >= totalCycles) {
                    clearInterval(interval);
                    breathingInstructions.textContent = '🎉 Exercise complete! Well done!';
                    breathingCircle.classList.remove('inhale', 'exhale');
                    document.getElementById('breathText').textContent = 'Complete!';
                    
                    // Show completion message
                    setTimeout(() => {
                        showNotification('🧘‍♀️ Breathing exercise completed! You should feel more relaxed now.', 'success');
                        breathingModal.style.display = 'none';
                        
                        // Reset for next time
                        setTimeout(() => {
                            breathingInstructions.textContent = 'Take a comfortable position and click start when ready';
                            document.getElementById('breathText').textContent = 'Ready';
                            if (progressBar) progressBar.style.width = '0%';
                            if (cycleCount) cycleCount.textContent = 'Cycle 1 of 5';
                        }, 1000);
                    }, 2000);
                }
            }
        }, 4000); // 4 seconds per half-cycle
    }

    // Character counter for mood notes
    const moodNotes = document.getElementById('moodNotes');
    const charCount = document.getElementById('charCount');
    
    if (moodNotes && charCount) {
        moodNotes.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length > 450) {
                charCount.style.color = '#e74c3c';
            } else if (length > 400) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = '#999';
            }
        });
    }

    // Real-time word counter for reflections
    const reflectionText = document.getElementById('reflectionText');
    const wordCount = document.getElementById('wordCount');
    const readingTime = document.getElementById('readingTime');
    
    if (reflectionText && wordCount) {
        reflectionText.addEventListener('input', function() {
            const words = this.value.trim().split(/\s+/).filter(word => word.length > 0);
            const wordLength = words.length;
            const readTime = Math.max(1, Math.ceil(wordLength / 200)); // 200 words per minute
            
            wordCount.textContent = `${wordLength} words`;
            if (readingTime) {
                readingTime.textContent = `~${readTime} min read`;
            }
        });
    }

    // Enhanced Modal Controls
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (breathingModal) {
                breathingModal.style.display = 'none';
            }
        });
    }

    window.onclick = function(event) {
        if (event.target === breathingModal) {
            breathingModal.style.display = 'none';
        }
    }
    
    // Load initial reflection prompt
    generateNewPrompt();
    
    // Welcome message personalization
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        const hour = new Date().getHours();
        let greeting = 'How are you feeling right now?';
        
        if (hour < 12) {
            greeting = 'Good morning! How are you starting your day?';
        } else if (hour < 17) {
            greeting = 'Good afternoon! How is your day going?';
        } else {
            greeting = 'Good evening! How are you feeling tonight?';
        }
        
        welcomeMessage.textContent = greeting;
    }
});

// Global functions for HTML onclick events
function saveMoodEntry() {
    if (!dataManager) {
        showNotification('App is still loading, please wait...', 'warning');
        return;
    }
    
    const moodSliderEl = document.getElementById('moodSlider');
    const mood = moodSliderEl ? parseInt(moodSliderEl.value) : null;
    const selectedFactors = Array.from(document.querySelectorAll('.tag.selected')).map(tag => tag.getAttribute('data-factor'));
    const notesEl = document.getElementById('moodNotes');
    const notes = notesEl ? notesEl.value : '';
    
    if (!mood) {
        showNotification('Please select your mood level.', 'warning');
        return;
    }
    
    const entry = {
        mood: mood,
        factors: selectedFactors,
        notes: notes,
        quickEntry: false
    };
    
    dataManager.saveMoodEntry(entry);
    
    // Reset form with animations
    document.getElementById('moodSlider').value = 3;
    document.getElementById('moodEmoji').textContent = '😐';
    document.getElementById('moodValue').textContent = '3/5';
    document.querySelectorAll('.tag.selected').forEach(tag => {
        tag.classList.remove('selected');
    });
    document.getElementById('moodNotes').value = '';
    document.getElementById('charCount').textContent = '0';
    
    showNotification('Mood entry saved successfully! 💙', 'success');
    
    // Add ripple effect to submit button
    const submitBtn = document.querySelector('.submit-btn');
    AnimationController.bounce(submitBtn);
}

function saveReflection() {
    if (!dataManager) {
        showNotification('App is still loading, please wait...', 'warning');
        return;
    }
    
    const promptEl = document.getElementById('reflectionPrompt');
    const responseEl = document.getElementById('reflectionText');
    
    const prompt = promptEl ? promptEl.textContent : '';
    const response = responseEl ? responseEl.value : '';
    
    if (!response.trim()) {
        showNotification('Please write your reflection before saving.', 'warning');
        if (responseEl) {
            responseEl.focus();
            AnimationController.shake(responseEl);
        }
        return;
    }
    
    const reflection = {
        prompt: prompt,
        response: response.trim()
    };
    
    dataManager.saveReflection(reflection);
    
    // Clear the text area with animation
    const textArea = document.getElementById('reflectionText');
    textArea.style.transition = 'opacity 0.3s ease';
    textArea.style.opacity = '0.5';
    
    setTimeout(() => {
        textArea.value = '';
        textArea.style.opacity = '1';
        document.getElementById('wordCount').textContent = '0 words';
        document.getElementById('readingTime').textContent = '~0 min read';
    }, 300);
    
    showNotification('Reflection saved! Great job on taking time for self-reflection 📝', 'success');
    
    // Generate new prompt for next reflection
    setTimeout(() => {
        generateNewPrompt();
    }, 1000);
}

function generateNewPrompt() {
    const currentPrompt = document.getElementById('reflectionPrompt').textContent;
    let newPrompt;
    
    // Ensure we don't get the same prompt twice in a row
    do {
        newPrompt = reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
    } while (newPrompt === currentPrompt && reflectionPrompts.length > 1);
    
    const promptElement = document.getElementById('reflectionPrompt');
    if (promptElement) {
        promptElement.style.transition = 'opacity 0.3s ease';
        promptElement.style.opacity = '0';
        
        setTimeout(() => {
            promptElement.textContent = newPrompt;
            promptElement.style.opacity = '1';
        }, 300);
    }
}

function generatePersonalizedTip() {
    const tips = [
        "💡 Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.",
        "🌱 Set a small, achievable goal for today. Accomplishment boosts mood naturally!",
        "💝 Practice self-compassion: Talk to yourself like you would to a dear friend.",
        "🎵 Listen to music that matches your current mood, then gradually shift to more uplifting songs.",
        "📚 Read something that inspires you - even just a few pages can shift your perspective.",
        "☀️ Spend a few minutes in natural light or step outside if possible.",
        "💪 Do some gentle stretching or movement to release tension in your body.",
        "📱 Take a break from social media and focus on the present moment instead."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    const insightElement = document.getElementById('dailyInsight');
    if (insightElement) {
        insightElement.style.transition = 'opacity 0.3s ease';
        insightElement.style.opacity = '0';
        
        setTimeout(() => {
            insightElement.textContent = randomTip;
            insightElement.style.opacity = '1';
        }, 300);
    }
    
    showNotification('Here\'s a personalized tip for you! ✨', 'info');
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to save mood entry (when in mood tracker tab)
    if (e.ctrlKey && e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'mood-tracker') {
            saveMoodEntry();
        } else if (activeTab && activeTab.id === 'reflection') {
            saveReflection();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const breathingModal = document.getElementById('breathingModal');
        if (breathingModal.style.display === 'block') {
            breathingModal.style.display = 'none';
        }
        
        const dynamicPopups = document.querySelectorAll('.dynamic-popup');
        dynamicPopups.forEach(popup => popup.remove());
    }
});

    // Add some motivational messages based on usage (after dataManager is initialized)
    setInterval(() => {
        if (dataManager) {
            const totalEntries = dataManager.moodEntries.length + dataManager.reflections.length;
            
            if (totalEntries === 5) {
                showNotification('🎉 You\'re building a great habit! 5 entries completed!', 'success');
            } else if (totalEntries === 10) {
                showNotification('🌟 Amazing progress! 10 entries - you\'re really committed to your wellbeing!', 'success');
            } else if (totalEntries === 25) {
                showNotification('🏆 Incredible dedication! 25 entries - you\'re a wellness champion!', 'success');
            }
        }
    }, 30000); // Check every 30 seconds

// Console welcome message
console.log(`
🌟 Welcome to MindMate Enhanced! 🌟

Thanks for prioritizing your mental wellness. This app includes:
✨ Real-time mood tracking
🧘‍♀️ Guided reflection
📊 Smart insights & patterns
🎯 Personalized recommendations
🔒 Complete privacy (local storage only)

Your mental health matters. You've got this! 💙

Built with ❤️ for Round 2 submission
`);

// Wellness Action Functions
function resetBreathingExercise() {
    const breathingInstructions = document.getElementById('breathingInstructions');
    const breathText = document.getElementById('breathText');
    const progressBar = document.querySelector('.progress-bar');
    const cycleCount = document.querySelector('.cycle-count');
    const breathingCircle = document.getElementById('breathingCircle');
    
    if (breathingInstructions) {
        breathingInstructions.textContent = 'Take a comfortable position and click start when ready';
    }
    if (breathText) {
        breathText.textContent = 'Ready';
    }
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    if (cycleCount) {
        cycleCount.textContent = 'Cycle 1 of 5';
    }
    if (breathingCircle) {
        breathingCircle.classList.remove('inhale', 'exhale');
    }
}

function startMindfulWalk() {
    const walkModal = createWellnessModal('mindful-walk', {
        title: '🚶‍♀️ Mindful Walking Guide',
        content: `
            <div class="wellness-guide">
                <h3>🌟 5-Minute Mindful Walk</h3>
                <div class="walk-steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <strong>Prepare (30 seconds)</strong>
                            <p>Stand still and take 3 deep breaths. Set an intention for your walk.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <strong>Mindful Steps (2 minutes)</strong>
                            <p>Walk slowly, feeling each step. Notice how your feet touch the ground.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <strong>Sensory Awareness (2 minutes)</strong>
                            <p>Notice 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <strong>Gratitude Return (30 seconds)</strong>
                            <p>Before finishing, think of one thing you're grateful for from this walk.</p>
                        </div>
                    </div>
                </div>
                <div class="walk-timer">
                    <button id="startWalkTimer" class="timer-btn">Start 5-Minute Timer</button>
                    <div id="walkTimerDisplay" class="timer-display">5:00</div>
                </div>
            </div>
        `
    });
    
    // Add timer functionality
    const startTimer = walkModal.querySelector('#startWalkTimer');
    const timerDisplay = walkModal.querySelector('#walkTimerDisplay');
    
    if (startTimer && timerDisplay) {
        startTimer.addEventListener('click', function() {
            startWalkingTimer(timerDisplay, startTimer);
        });
    }
}

function startGratitudePractice() {
    const gratitudeModal = createWellnessModal('gratitude-practice', {
        title: '❤️ Gratitude Practice',
        content: `
            <div class="wellness-guide">
                <h3>✨ 3-Minute Gratitude Exercise</h3>
                <div class="gratitude-prompts">
                    <div class="prompt-section">
                        <h4>💙 What am I grateful for today?</h4>
                        <textarea id="gratitude1" placeholder="Something small that made you smile..."></textarea>
                    </div>
                    <div class="prompt-section">
                        <h4>🌟 Who am I thankful for?</h4>
                        <textarea id="gratitude2" placeholder="A person who has positively impacted your life..."></textarea>
                    </div>
                    <div class="prompt-section">
                        <h4>🎯 What opportunity am I appreciating?</h4>
                        <textarea id="gratitude3" placeholder="A chance or experience you're grateful for..."></textarea>
                    </div>
                </div>
                <div class="gratitude-actions">
                    <button id="saveGratitude" class="save-gratitude-btn">💾 Save My Gratitude</button>
                    <button id="shareGratitude" class="share-gratitude-btn">📱 Generate Affirmation</button>
                </div>
                <div id="gratitudeAffirmation" class="affirmation-display"></div>
            </div>
        `
    });
    
    // Add gratitude functionality
    const saveBtn = gratitudeModal.querySelector('#saveGratitude');
    const shareBtn = gratitudeModal.querySelector('#shareGratitude');
    const affirmationDiv = gratitudeModal.querySelector('#gratitudeAffirmation');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveGratitudeEntries(gratitudeModal);
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            generateGratitudeAffirmation(gratitudeModal, affirmationDiv);
        });
    }
}

function createWellnessModal(id, options) {
    // Remove existing modal if any
    const existingModal = document.getElementById(id);
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'wellness-modal';
    modal.innerHTML = `
        <div class="wellness-modal-content">
            <span class="wellness-close">&times;</span>
            <h2>${options.title}</h2>
            ${options.content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    modal.style.cssText = `
        display: block;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
    `;
    
    const content = modal.querySelector('.wellness-modal-content');
    content.style.cssText = `
        background: white;
        margin: 3% auto;
        padding: 30px;
        border-radius: 20px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        position: relative;
        animation: slideIn 0.3s ease;
    `;
    
    // Close functionality
    const closeBtn = modal.querySelector('.wellness-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: #999;
        transition: color 0.3s ease;
    `;
    
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    return modal;
}

function startWalkingTimer(display, button) {
    let timeLeft = 300; // 5 minutes in seconds
    button.textContent = 'Walking...';
    button.disabled = true;
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            display.textContent = 'Complete!';
            button.textContent = 'Walk Completed ✅';
            showNotification('🎉 Mindful walk completed! How do you feel?', 'success');
            
            // Auto-close modal after 3 seconds
            setTimeout(() => {
                const modal = button.closest('.wellness-modal');
                if (modal) modal.remove();
            }, 3000);
        }
        
        timeLeft--;
    }, 1000);
}

function saveGratitudeEntries(modal) {
    const gratitude1 = modal.querySelector('#gratitude1').value;
    const gratitude2 = modal.querySelector('#gratitude2').value;
    const gratitude3 = modal.querySelector('#gratitude3').value;
    
    if (!gratitude1 && !gratitude2 && !gratitude3) {
        showNotification('Please write at least one gratitude entry', 'warning');
        return;
    }
    
    const gratitudeEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        entries: {
            grateful_for: gratitude1,
            thankful_person: gratitude2,
            opportunity: gratitude3
        }
    };
    
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('mindmate_gratitude') || '[]');
    existing.unshift(gratitudeEntry);
    localStorage.setItem('mindmate_gratitude', JSON.stringify(existing));
    
    showNotification('💙 Gratitude saved! This positive energy will brighten your day', 'success');
    
    // Close modal after short delay
    setTimeout(() => modal.remove(), 2000);
}

function generateGratitudeAffirmation(modal, display) {
    const gratitude1 = modal.querySelector('#gratitude1').value;
    const gratitude2 = modal.querySelector('#gratitude2').value;
    const gratitude3 = modal.querySelector('#gratitude3').value;
    
    const affirmations = [
        "I am surrounded by abundance and love",
        "Every day brings new opportunities for joy",
        "I attract positive energy and meaningful connections",
        "My life is filled with moments worth celebrating",
        "I choose to focus on the good in every situation",
        "Gratitude transforms my perspective and opens my heart",
        "I am blessed with incredible people and experiences",
        "Today I acknowledge all the beauty around me"
    ];
    
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    
    display.style.cssText = `
        margin-top: 20px;
        padding: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-radius: 15px;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        line-height: 1.4;
        animation: fadeIn 0.5s ease;
    `;
    
    display.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
        <div>${randomAffirmation}</div>
        <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Your personal affirmation for today</div>
    `;
    
    showNotification('✨ Your affirmation is ready! Screenshot it to keep this positive energy with you', 'info', 4000);
}
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach(button => {
    button.addEventListener('click', function () {
      navButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const target = this.getAttribute('data-tab');

      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === target) {
          setTimeout(() => content.classList.add('active'), 150);
        }
      });
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const userSpan = document.getElementById("loggedInUserName");
  const userData = sessionStorage.getItem("mindmate_user");

  if (userData && userSpan) {
    try {
      const user = JSON.parse(userData);
      if (user.name) {
        userSpan.textContent = user.name;
      } else if (user.email) {
        userSpan.textContent = user.email.split("@")[0];
      }
    } catch (err) {
      console.error("Failed to parse user session:", err);
    }
  }
});
