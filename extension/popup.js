document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const togglePassword = document.getElementById('togglePassword');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const errorMsgDiv = document.getElementById('errorMsg');
    
    // Results elements
    const scoreValue = document.getElementById('scoreValue');
    const strengthBar = document.getElementById('strengthBar');
    const breachAlert = document.getElementById('breachAlert');
    const breachText = document.getElementById('breachText');
    const crackTime = document.getElementById('crackTime');
    const feedback = document.getElementById('feedback');

    // Toggle Password Visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Analyze Button Click
    analyzeBtn.addEventListener('click', async () => {
        const password = passwordInput.value;
        if (!password) return;

        // Reset UI
        errorMsgDiv.classList.add('hidden');
        resultsDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        analyzeBtn.disabled = true;

        try {
            const response = await fetch('http://127.0.0.1:5000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            displayResults(data);

        } catch (error) {
            console.error('Error:', error);
            errorMsgDiv.textContent = 'Backend offline. Please start the Python server.';
            errorMsgDiv.classList.remove('hidden');
        } finally {
            loadingDiv.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });

    function displayResults(data) {
        resultsDiv.classList.remove('hidden');
        
        // 1. Score (0-4)
        scoreValue.textContent = `${data.score}/4`;
        
        // Update Strength Meter Color and Width
        let width = '0%';
        let color = 'red';
        
        switch(data.score) {
            case 0: width = '10%'; color = '#ef4444'; break; // Red
            case 1: width = '25%'; color = '#ef4444'; break; // Red
            case 2: width = '50%'; color = '#f59e0b'; break; // Orange
            case 3: width = '75%'; color = '#84cc16'; break; // Light Green
            case 4: width = '100%'; color = '#10b981'; break; // Green
        }
        
        strengthBar.style.width = width;
        strengthBar.style.backgroundColor = color;

        // 2. Breach Alert
        if (data.breach_count > 0) {
            breachAlert.classList.remove('hidden');
            breachText.textContent = `EXPOSED in ${data.breach_count.toLocaleString()} data breaches`;
        } else {
            breachAlert.classList.add('hidden');
        }

        // 3. Details
        crackTime.textContent = data.crack_time_display;
        
        // Format feedback
        let feedbackText = '';
        if (data.feedback.warning) {
            feedbackText += `Warning: ${data.feedback.warning}\n`;
        }
        if (data.feedback.suggestions && data.feedback.suggestions.length > 0) {
            feedbackText += `Suggestions: ${data.feedback.suggestions.join(' ')}`;
        }
        if (!feedbackText) {
            feedbackText = 'Good password!';
        }
        feedback.textContent = feedbackText.trim();
    }
});
