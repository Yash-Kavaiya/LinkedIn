// Fetch the form and reel display elements
const form = document.getElementById('form');
const reelDisplay = document.getElementById('reel-display');
const displayQuestion = document.getElementById('display-question');
const optionButtons = [
    document.getElementById('option1-btn'),
    document.getElementById('option2-btn'),
    document.getElementById('option3-btn'),
    document.getElementById('option4-btn')
];
const explanationArea = document.getElementById('explanation-area');

// Optional Sound Effect
const revealSound = document.getElementById('reveal-sound');

// Recording elements
const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const downloadLink = document.getElementById('download-link');

let capturer;

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form data
    const question = document.getElementById('question').value.trim();
    const options = [
        document.getElementById('option1').value.trim(),
        document.getElementById('option2').value.trim(),
        document.getElementById('option3').value.trim(),
        document.getElementById('option4').value.trim()
    ];
    const correctAnswerValue = document.getElementById('correct-answer').value;
    const explanation = document.getElementById('explanation').value.trim();

    // Validate correct answer selection
    if (correctAnswerValue === "") {
        alert("Please select the correct answer.");
        return;
    }

    const correctAnswerIndex = parseInt(correctAnswerValue) - 1;

    // Hide the form and show the reel display
    document.getElementById('question-form').style.display = 'none';
    reelDisplay.style.display = 'block';

    // Clear previous content
    displayQuestion.innerText = '';
    optionButtons.forEach((btn) => {
        btn.innerText = '';
        btn.classList.remove('correct-answer');
    });
    explanationArea.innerText = '';

    // Typing effect for the question
    typeWriter(question, displayQuestion, 50, () => {
        // After the question is typed out, type the options one by one
        let optionIndex = 0;

        function typeNextOption() {
            if (optionIndex < options.length) {
                typeWriter(options[optionIndex], optionButtons[optionIndex], 50, () => {
                    optionIndex++;
                    typeNextOption();
                });
            } else {
                // Reveal the correct answer after 5 seconds
                setTimeout(() => {
                    optionButtons[correctAnswerIndex].classList.add('correct-answer');

                    // Play sound effect (if any)
                    revealSound.play();

                    // Display the explanation if provided
                    if (explanation !== '') {
                        typeWriter('Explanation: ' + explanation, explanationArea, 50);
                    }
                }, 5000);
            }
        }

        typeNextOption();
    });
});

// Typing effect function
function typeWriter(text, element, delay = 50, callback) {
    let i = 0;
    element.innerText = '';
    const timer = setInterval(() => {
        element.innerText += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            if (callback) callback();
        }
    }, delay);
}

// Recording functionality using CCapture.js
startRecordingButton.addEventListener('click', () => {
    // Initialize CCapture
    capturer = new CCapture({
        format: 'webm',
        framerate: 60,
        verbose: true
    });

    capturer.start();

    // Disable start button and enable stop button
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;

    // Start the rendering loop
    animate();
});

stopRecordingButton.addEventListener('click', () => {
    capturer.stop();
    capturer.save();

    // Enable start button and disable stop button
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
});

// Animation loop for recording
function animate() {
    requestAnimationFrame(animate);
    capturer.capture(document.getElementById('reel-display'));
}
