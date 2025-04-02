// Particle.js Configuration - Adds a decorative particle background effect
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

// Array of steps for tracking progress - Defines the stages of the order
const steps = [
    { id: 'step-1', label: 'Order Received' },
    { id: 'step-2', label: 'Preparing Your Order' },
    { id: 'step-3', label: 'Ready' }
];

// Current step tracker - Keeps track of which step is active
let currentStep = 0;

// Progress bar element - Visual indicator of progress
const progressBar = document.getElementById('progress-bar');

// Width of step icons - Used for positioning calculations
const iconWidth = 30;

// Initialize progress bar positioning - Sets up the starting point and total distance
function initializeProgressBar() {
    const tracker = document.querySelector('.progress-tracker');
    const firstStep = document.getElementById('step-1');
    const lastStep = document.getElementById('step-3'); // Changed to step-3

    const trackerRect = tracker.getBoundingClientRect();
    const firstStepRect = firstStep.getBoundingClientRect();
    const lastStepRect = lastStep.getBoundingClientRect();

    const firstStepCenter = firstStepRect.left + (firstStepRect.width / 2) - trackerRect.left;
    const lastStepCenter = lastStepRect.left + (lastStepRect.width / 2) - trackerRect.left;

    const totalDistance = lastStepCenter - firstStepCenter;

    progressBar.style.left = `${firstStepCenter}px`;
    document.querySelector('.progress-tracker').style.setProperty('--background-left', `${firstStepCenter}px`);

    return { firstStepCenter, totalDistance };
}

// Update progress display - Moves the progress bar and highlights steps
function updateProgress() {
    if (currentStep < steps.length) {
        // Clear active state from all steps
        steps.forEach(step => {
            const stepElement = document.getElementById(step.id);
            if (stepElement) {
                stepElement.classList.remove('active');
            }
        });

        // Activate current step
        const stepElement = document.getElementById(steps[currentStep].id);
        if (!stepElement) {
            console.error(`Step element with ID ${steps[currentStep].id} not found!`);
            return;
        }
        stepElement.classList.add('active');

        // Mark previous steps as completed
        for (let i = 0; i < currentStep; i++) {
            const prevStepElement = document.getElementById(steps[i].id);
            if (prevStepElement) {
                prevStepElement.classList.add('completed');
            }
        }

        // Calculate and set progress bar width
        const { firstStepCenter, totalDistance } = initializeProgressBar();
        const progressPercentage = (currentStep / (steps.length - 1)) * 100;
        const progressWidth = (progressPercentage / 100) * totalDistance;

        progressBar.style.width = `${progressWidth}px`;
        document.querySelector('.progress-tracker').style.setProperty('--background-width', `${progressWidth}px`);

        // Move to next step after delay
        currentStep++;
        if (currentStep < steps.length) {
            setTimeout(updateProgress, 5000); // 5-second delay between steps
        }
    }
}

// Start the progress simulation - Kicks off the tracking process
updateProgress();

// Support popup functions - Handle customer assistance features
function showCallForHelp() {
    document.getElementById('call-for-help-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}
function hideCallForHelp() {
    document.getElementById('call-for-help-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
function showFAQ() {
    document.getElementById('faq-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}
function hideFAQ() {
    document.getElementById('faq-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
function showFeedback() {
    document.getElementById('feedback-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}
function hideFeedback() {
    document.getElementById('feedback-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
function submitFeedback() {
    const feedbackText = document.getElementById('feedback-text').value;
    if (feedbackText.trim() === '') {
        alert('Please enter your feedback before submitting.');
        return;
    }
    hideFeedback();
    showThankYou();
}
function showThankYou() {
    document.getElementById('thank-you-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    setTimeout(hideThankYou, 2000);
}
function hideThankYou() {
    document.getElementById('thank-you-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('feedback-text').value = '';
}