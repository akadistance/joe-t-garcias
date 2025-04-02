// static/js/payment.js

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

// Support functions
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

// Payment functions
let currentItemName = null;

function updateQuantity(itemName, change) {
    const cartItem = window.cart.find(item => item.name === itemName);
    if (!cartItem) return;

    cartItem.quantity += change;
    if (cartItem.quantity <= 0) {
        removeItem(itemName);
        return;
    }

    const cartItemElement = document.querySelector(`.cart-item[data-name="${itemName}"]`);
    cartItemElement.querySelector('.quantity-value').textContent = cartItem.quantity;
    cartItemElement.querySelector('.cart-item-price').textContent = `$${parseFloat(cartItem.price * cartItem.quantity).toFixed(2)}`;

    updateTotals();
}

function updateTotals() {
    window.subtotal = window.cart.reduce((sum, item) => {
        let itemPrice = item.price;
        if (item.customizations && item.customizations['extra-meat']) {
            itemPrice += 2.00; // Extra meat adds $2.00
        }
        return sum + itemPrice * item.quantity;
    }, 0);

    window.total = window.subtotal + window.tip;
    document.getElementById('subtotal').textContent = `$${window.subtotal.toFixed(2)}`;
    document.getElementById('total-cost').textContent = `$${window.total.toFixed(2)}`;
}

function orderMore() {
    window.location.href = '/';
}

function setTip(percentage) {
    const tipOptions = document.querySelectorAll('.tip-option');
    tipOptions.forEach(option => option.classList.remove('active'));
    const selectedOption = document.querySelector(`.tip-option[data-tip="${percentage}"]`);
    selectedOption.classList.add('active');

    if (percentage === 'custom') {
        document.getElementById('custom-tip').style.display = 'block';
        setCustomTip();
    } else {
        document.getElementById('custom-tip').style.display = 'none';
        window.tip = (window.subtotal * (percentage / 100));
        document.getElementById('tip-amount').textContent = `$${window.tip.toFixed(2)}`;
        window.total = window.subtotal + window.tip;
        document.getElementById('total-cost').textContent = `$${window.total.toFixed(2)}`;
    }
}

function setCustomTip() {
    const customTipInput = document.getElementById('custom-tip-input');
    const percentage = parseFloat(customTipInput.value) || 0;
    window.tip = (window.subtotal * (percentage / 100));
    document.getElementById('tip-amount').textContent = `$${window.tip.toFixed(2)}`;
    window.total = window.subtotal + window.tip;
    document.getElementById('total-cost').textContent = `$${window.total.toFixed(2)}`;
}

function toggleReceiptInput() {
    const receiptMethod = document.querySelector('input[name="receipt-method"]:checked').value;
    document.getElementById('email-input').style.display = receiptMethod === 'email' ? 'block' : 'none';
    document.getElementById('phone-input').style.display = receiptMethod === 'text' ? 'block' : 'none';
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) value = value.substring(0, 10);
    if (value.length > 6) {
        input.value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    } else if (value.length > 3) {
        input.value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    } else if (value.length > 0) {
        input.value = `(${value}`;
    } else {
        input.value = '';
    }
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += value[i];
    }
    input.value = formatted;
}

function restrictToLetters(input) {
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length > 2) {
        input.value = `${value.substring(0, 2)}/${value.substring(2)}`;
    } else {
        input.value = value;
    }
}

function validateAndPay() {
    const receiptMethod = document.querySelector('input[name="receipt-method"]:checked')?.value;
    let receiptContact = null;

    if (receiptMethod === 'email') {
        receiptContact = document.getElementById('receipt-email').value;
        if (!receiptContact || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiptContact)) {
            alert('Please enter a valid email address.');
            return;
        }
    } else if (receiptMethod === 'text') {
        receiptContact = document.getElementById('receipt-phone').value;
        if (!receiptContact || !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(receiptContact)) {
            alert('Please enter a valid phone number.');
            return;
        }
    }

    window.receiptMethod = receiptMethod;
    window.receiptContact = receiptContact;
    showTapScreen();
}

function showTapScreen() {
    document.getElementById('tap-screen').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function hideTapScreen() {
    document.getElementById('tap-screen').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function showCardDetails() {
    hideTapScreen();
    document.getElementById('card-details-popup').style.display = 'block';
}

function hideCardDetails() {
    document.getElementById('card-details-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

let isProcessing = false;

function showPaymentProcessing() {
    if (isProcessing) return;
    isProcessing = true;

    document.getElementById('payment-processing-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('payment-loader').style.display = 'block';
    document.getElementById('payment-success').style.display = 'none';
    document.getElementById('receipt-sent-message').style.display = 'none';

    setTimeout(() => {
        document.getElementById('payment-loader').style.display = 'none';
        document.getElementById('payment-success').style.display = 'block';

        if (window.receiptMethod && window.receiptMethod !== 'none' && window.receiptContact) {
            const receiptMessage = window.receiptMethod === 'email' 
                ? `Receipt sent to ${window.receiptContact}` 
                : `Receipt texted to ${window.receiptContact}`;
            document.getElementById('receipt-sent-message').textContent = receiptMessage;
            document.getElementById('receipt-sent-message').style.display = 'block';
        }

        setTimeout(() => {
            hidePaymentProcessing();
        }, 3000);
    }, 2000);
}

function hidePaymentProcessing() {
    document.getElementById('payment-processing-popup').style.display = 'none';
    showTrackOrderPrompt();
    isProcessing = false;
}

function showTrackOrderPrompt() {
    document.getElementById('track-order-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function hideTrackOrderPrompt() {
    document.getElementById('track-order-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function trackOrder(track) {
    hideTrackOrderPrompt();
    if (track) {
        window.location.href = '/track-order';
    } else {
        showOrderThankYou();
    }
}

function submitCardDetails(event) {
    event.preventDefault();
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardName = document.getElementById('card-name').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;

    if (cardNumber.length !== 16) {
        alert('Please enter a valid 16-digit card number.');
        return;
    }
    if (!cardName.trim()) {
        alert('Please enter the name on the card.');
        return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        alert('Please enter a valid expiration date (MM/YY).');
        return;
    }
    if (cardCvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV.');
        return;
    }

    hideCardDetails();
    showPaymentProcessing();
}

function editItem(itemName) {
    currentItemName = itemName;
    document.getElementById('edit-item-name').textContent = itemName;
    
    // Load existing customizations
    const cartItem = window.cart.find(item => item.name === itemName);
    if (cartItem.customizations) {
        document.getElementById('no-vegetables').checked = cartItem.customizations['no-vegetables'] || false;
        document.getElementById('no-meat').checked = cartItem.customizations['no-meat'] || false;
        document.getElementById('extra-vegetables').checked = cartItem.customizations['extra-vegetables'] || false;
        document.getElementById('extra-meat').checked = cartItem.customizations['extra-meat'] || false;
        document.getElementById('spice-level').value = cartItem.customizations['spice-level'] || 'mild';
    } else {
        document.getElementById('no-vegetables').checked = false;
        document.getElementById('no-meat').checked = false;
        document.getElementById('extra-vegetables').checked = false;
        document.getElementById('extra-meat').checked = false;
        document.getElementById('spice-level').value = 'mild';
    }

    document.getElementById('edit-order-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function updateCustomizations() {
    const cartItem = window.cart.find(item => item.name === currentItemName);
    if (!cartItem) return;

    cartItem.customizations = {
        'no-vegetables': document.getElementById('no-vegetables').checked,
        'no-meat': document.getElementById('no-meat').checked,
        'extra-vegetables': document.getElementById('extra-vegetables').checked,
        'extra-meat': document.getElementById('extra-meat').checked,
        'spice-level': document.getElementById('spice-level').value
    };

    updateTotals();
}

function saveCustomizations() {
    updateCustomizations();
    hideEditOrder();
}

function removeItem() {
    fetch('/remove-from-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `item_name=${encodeURIComponent(currentItemName)}`
    })
    .then(response => response.json())
    .then(data => {
        window.cart = data.cart;
        window.subtotal = data.subtotal;
        window.total = window.subtotal + window.tip;

        // Update UI
        document.getElementById('subtotal').textContent = `$${window.subtotal.toFixed(2)}`;
        document.getElementById('total-cost').textContent = `$${window.total.toFixed(2)}`;

        // Remove the item from the DOM
        const cartItemElement = document.querySelector(`.cart-item[data-name="${currentItemName}"]`);
        if (cartItemElement) {
            cartItemElement.remove();
        }

        // If cart is empty, redirect to menu
        if (window.cart.length === 0) {
            window.location.href = '/';
        }

        hideEditOrder();
    })
    .catch(error => {
        console.error('Error removing item:', error);
        alert('Failed to remove item.');
    });
}

function hideEditOrder() {
    document.getElementById('edit-order-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    currentItemName = null;
}

const tapIcon = document.querySelector('#tap-screen img');
tapIcon.addEventListener('click', () => {
    if (!isProcessing) {
        hideTapScreen();
        showPaymentProcessing();
    }
});

// Note: This function isn’t called anywhere in the provided code but is referenced in trackOrder(false)
// Adding it here for completeness, assuming it’s meant to show the order thank you popup
function showOrderThankYou() {
    document.getElementById('order-thank-you-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    setTimeout(() => {
        document.getElementById('order-thank-you-popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }, 2000);
}