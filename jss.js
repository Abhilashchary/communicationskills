
const startButton = document.getElementById('start-recording');
const stopButton = document.getElementById('stop-recording');
const transcribedTextElement = document.getElementById('transcribed-text');
const referenceTextElement = document.getElementById('reference-text');
const scoreElement = document.getElementById('score');
const compareTextButton = document.getElementById('compare-text');
const readTextButton = document.getElementById('read-text');
const scorePopup = document.getElementById('score-popup');
const popupScoreElement = document.getElementById('popup-score');

let recognition;

// Check for browser support
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        transcribedTextElement.textContent = transcript;

        stopButton.disabled = true;
        startButton.disabled = false;
        compareTextButton.disabled = false;

        // Automatically correct text using LanguageTool
        generateReferenceText(transcript).then(generatedText => {
            referenceTextElement.value = generatedText;
            referenceTextElement.disabled = false;
            readTextButton.disabled = false;  // Enable the "Read Corrected Text" button
        });
    };

    recognition.onerror = function(event) {
        console.error(event.error);
    };
} else {
    alert('Speech recognition not supported in this browser.');
}

startButton.onclick = function() {
    recognition.start();
    startButton.disabled = true;
    stopButton.disabled = false;
};

stopButton.onclick = function() {
    recognition.stop(); // Stop recording when stop button is clicked
    stopButton.disabled = true;
    startButton.disabled = false;
};

compareTextButton.onclick = function() {
    const transcribedText = transcribedTextElement.textContent.toLowerCase();
    const referenceText = referenceTextElement.value.toLowerCase();
    const score = compareTexts(transcribedText, referenceText);

    scoreElement.textContent = `Your accuracy is ${score.toFixed(2)}%`;

    // Read out the score
    const speech = new SpeechSynthesisUtterance(`Your accuracy is ${score.toFixed(2)} percent`);
    window.speechSynthesis.speak(speech);

    // Show score pop-up
    popupScoreElement.textContent = score.toFixed(2);
    scorePopup.style.display = 'block';

    // Hide popup after 3 seconds
    setTimeout(() => {
        scorePopup.style.display = 'none';
    }, 3000);
};

// Function to call LanguageTool API for text correction
async function generateReferenceText(originalText) {
    try {
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text: originalText,
                language: 'en-US' // Specify the language here
            })
        });

        const data = await response.json();
        const correctedText = applySuggestions(originalText, data.matches);
        return correctedText; // Return the corrected text
    } catch (error) {
        console.error('Error generating reference text:', error);
        return originalText; // Fallback to original text in case of error
    }
}

// Apply suggestions from LanguageTool to the original text
function applySuggestions(originalText, matches) {
    let correctedText = originalText;
    matches.forEach(match => {
        const suggestion = match.replacements[0]?.value;
        if (suggestion) {
            correctedText = correctedText.replace(match.context.text.substring(match.context.offset, match.context.offset + match.context.length), suggestion);
        }
    });
    return correctedText;
}

// Improved comparison function
function compareTexts(transcribed, reference) {
    const transcribedWords = transcribed.split(' ').filter(Boolean);
    const referenceWords = reference.split(' ').filter(Boolean);
    const matches = transcribedWords.filter(word => referenceWords.includes(word)).length;
    return (matches / Math.max(transcribedWords.length, referenceWords.length)) * 100;
}

// Function to read out the corrected reference text
readTextButton.onclick = function() {
    const correctedText = referenceTextElement.value;
    const speech = new SpeechSynthesisUtterance(correctedText);  // Create a speech synthesis object
    window.speechSynthesis.speak(speech);  // Use SpeechSynthesis API to speak the corrected text
};