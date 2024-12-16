let navbarDiv = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        navbarDiv.classList.add('navbar-cng');
    } else {
        navbarDiv.classList.remove('navbar-cng');
    }
});

const navbarCollapseDiv = document.getElementById('navbar-collapse');
const navbarShowBtn = document.getElementById('navbar-show-btn');
const navbarCloseBtn = document.getElementById('navbar-close-btn');

// Show navbar
navbarShowBtn.addEventListener('click', () => {
    navbarCollapseDiv.classList.add('navbar-collapse-rmw');
});

// Hide sidebar
navbarCloseBtn.addEventListener('click', () => {
    navbarCollapseDiv.classList.remove('navbar-collapse-rmw');
});

document.addEventListener('click', (e) => {
    if (e.target.id != "navbar-collapse" && e.target.id != "navbar-show-btn" && e.target.parentElement.id != "navbar-show-btn") {
        navbarCollapseDiv.classList.remove('navbar-collapse-rmw');
    }
});

// Stop transition and animation during window resizing
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
    }, 400);
});

// Geolocation functionality
if (navigator.geolocation) {
    // Request current position
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            // Example: Add geolocation-based logic for the navbar
            if (latitude && longitude) {
                navbarDiv.setAttribute('data-location', `Lat: ${latitude}, Lng: ${longitude}`);
            }
        },
        (error) => {
            console.error("Error getting geolocation:", error);
        }
    );
} else {
    console.error("Geolocation is not supported by your browser.");
}

// Push notifications
if ('Notification' in window) {
    // Request notification permission
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            // Function to show notification
            const showNotification = (title, options) => {
                new Notification(title, options);
            };

            // Example notification
            showNotification('Hello!', {
                body: 'Welcome to our site!',
                icon: 'images/icon.png', // Replace with actual icon path
            });
        } else {
            console.warn('Notification permission denied.');
        }
    }).catch(error => {
        console.error('Error requesting notification permission:', error);
    });
} else {
    console.error('Notifications are not supported by your browser.');
}

// Registering Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
