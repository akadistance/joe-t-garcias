// Particle.js Configuration
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

// Cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.getAttribute('data-item-name');
        fetch('/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `item_name=${encodeURIComponent(itemName)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(`${itemName} added to cart!`);
                document.getElementById('cart-count').textContent = data.cart_count;
            }
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart.');
        });
    });
});

// Fetch initial cart count
fetch('/cart-count')
    .then(response => response.json())
    .then(data => {
        document.getElementById('cart-count').textContent = data.cart_count;
    })
    .catch(error => {
        console.error('Error fetching cart count:', error);
    });

// Handle "Your Items" link click
document.getElementById('your-items-link').addEventListener('click', (event) => {
    const cartCount = parseInt(document.getElementById('cart-count').textContent, 10);
    if (cartCount === 0) {
        event.preventDefault(); // Prevent navigation
        showEmptyCartPopup();
    }
});

function showEmptyCartPopup() {
    document.getElementById('empty-cart-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function hideEmptyCartPopup() {
    document.getElementById('empty-cart-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

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