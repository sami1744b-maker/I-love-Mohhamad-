// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get latest sender name from URL (chain carries only one name)
const senderName = getUrlParameter('sender');

// Ensure proper display on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, senderName:', senderName);
    
    if (senderName) {
        // If there's a sender name in URL, show the result directly
        console.log('Showing result for sender:', senderName);
        showResult(senderName);
    } else {
        // Ensure form is visible when no sender parameter
        console.log('No sender parameter, showing form');
        document.getElementById('formContainer').style.display = 'block';
        document.getElementById('resultContainer').style.display = 'none';
    }
});

// Handle form submission
document.getElementById('nameForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userName = document.getElementById('userName').value.trim();
    
    if (userName) {
        // Create shareable URL
        const shareUrl = `${window.location.origin}${window.location.pathname}?sender=${encodeURIComponent(userName)}`;
        
        // Update URL without page reload
        window.history.pushState({}, '', shareUrl);
        
        // Show result
        showResult(userName);
    }
});

// Handle recipient name form submission (new sender replaces previous)
document.getElementById('recipientNameForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newSender = document.getElementById('recipientName').value.trim();
    
    if (newSender) {
        // Create URL carrying only the latest sender
        const shareUrl = `${window.location.origin}${window.location.pathname}?sender=${encodeURIComponent(newSender)}`;
        
        // Update URL without page reload
        window.history.pushState({}, '', shareUrl);
        
        // Update the display to show only latest sender
        showResult(newSender);
        
        // Keep recipient form visible to allow continuous chain
        document.getElementById('recipientForm').style.display = 'block';
        document.getElementById('recipientName').value = '';
    }
});

function showResult(sender) {
    // Hide form
    document.getElementById('formContainer').style.display = 'none';
    
    // Show result
    document.getElementById('resultContainer').style.display = 'block';
    
    // Always show only the current sender's name
    document.getElementById('senderMessage').textContent = `${sender} ने मुहम्मद साहब पर दरूद भेजा है`;
    
    // Scroll to result
    document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    // Clear URL parameters
    window.history.pushState({}, '', window.location.pathname);
    
    // Hide result
    document.getElementById('resultContainer').style.display = 'none';
    
    // Show form
    document.getElementById('formContainer').style.display = 'block';
    
    // Show recipient form again
    document.getElementById('recipientForm').style.display = 'block';
    
    // Clear inputs
    document.getElementById('userName').value = '';
    document.getElementById('recipientName').value = '';
    
    // Scroll to form
    document.getElementById('formContainer').scrollIntoView({ behavior: 'smooth' });
}

function copyLink() {
    const currentUrl = window.location.href;
    
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = currentUrl;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        // Copy the text
        document.execCommand('copy');
        
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'लिंक कॉपी हो गया!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#3498db';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert('लिंक कॉपी करने में समस्या आई। कृपया मैन्युअल रूप से कॉपी करें।');
    }
    
    // Remove the temporary textarea
    document.body.removeChild(textarea);
}

function shareWhatsApp() {
    const currentUrl = window.location.href;
    const currentSender = getUrlParameter('sender');
    const message = currentSender ? 
        `${currentSender} ने मुहम्मद साहब पर दरूद भेजा है। आप भी दरूद भेजें: ${currentUrl}` :
        `मुहम्मद साहब पर दरूद भेजें: ${currentUrl}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function openAllSocialApps() {
    const currentUrl = window.location.href;
    const currentSender = getUrlParameter('sender');
    const message = currentSender ? 
        `${currentSender} ने मुहम्मद साहब पर दरूद भेजा है। आप भी दरूद भेजें: ${currentUrl}` :
        `मुहम्मद साहब पर दरूद भेजें: ${currentUrl}`;
    
    // Try to open native share dialog first
    if (navigator.share) {
        navigator.share({
            title: 'मुहम्मद साहब पर दरूद भेजें',
            text: message,
            url: currentUrl
        }).catch(err => {
            console.log('Error sharing:', err);
            // Fallback to opening multiple apps
            openMultipleApps(message, currentUrl);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        openMultipleApps(message, currentUrl);
    }
}

function openMultipleApps(message, currentUrl) {
    // Open WhatsApp
    setTimeout(() => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }, 100);
    
    // Open Facebook
    setTimeout(() => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(facebookUrl, '_blank');
    }, 200);
    
    // Open Twitter
    setTimeout(() => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(twitterUrl, '_blank');
    }, 300);
    
    // Open Telegram
    setTimeout(() => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
    }, 400);
    
    // Copy to clipboard
    setTimeout(() => {
        copyLink();
    }, 500);
    
    alert('सभी सोशल मीडिया ऐप्स खुल गए हैं! आप जहाँ चाहें शेयर कर सकते हैं।');
}

// Initialize Google AdSense
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AdSense ads
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log('AdSense not loaded:', e);
    }
    
    // Add hover effect to the love image
    const loveImage = document.querySelector('.love-image');
    if (loveImage) {
        loveImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        loveImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Add focus effect to input
    const userNameInput = document.getElementById('userName');
    userNameInput.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    userNameInput.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit form
    if (e.key === 'Enter' && document.getElementById('formContainer').style.display !== 'none') {
        document.getElementById('nameForm').dispatchEvent(new Event('submit'));
    }
    
    // Escape key to reset form
    if (e.key === 'Escape' && document.getElementById('resultContainer').style.display !== 'none') {
        resetForm();
    }
});
