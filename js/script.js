// Constants
const NAVBAR_SCROLL_THRESHOLD = 40;

// Navbar Component
class Navbar {
    constructor(navbarSelector, collapseSelector, showBtnSelector, closeBtnSelector) {
        this.navbar = document.querySelector(navbarSelector);
        this.navbarCollapse = document.getElementById(collapseSelector);
        this.navbarShowBtn = document.getElementById(showBtnSelector);
        this.navbarCloseBtn = document.getElementById(closeBtnSelector);

        this.init();
    }

    init() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Show navbar
        this.navbarShowBtn.addEventListener('click', () => this.showNavbar());

        // Hide navbar
        this.navbarCloseBtn.addEventListener('click', () => this.hideNavbar());

        // Close navbar on outside click
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    handleScroll() {
        if (document.body.scrollTop > NAVBAR_SCROLL_THRESHOLD || document.documentElement.scrollTop > NAVBAR_SCROLL_THRESHOLD) {
            this.navbar.classList.add('navbar-cng');
        } else {
            this.navbar.classList.remove('navbar-cng');
        }
    }

    showNavbar() {
        this.navbarCollapse.classList.add('navbar-collapse-rmw');
    }

    hideNavbar() {
        this.navbarCollapse.classList.remove('navbar-collapse-rmw');
    }

    handleOutsideClick(e) {
        if (!this.navbarCollapse.contains(e.target) && e.target !== this.navbarShowBtn) {
            this.navbarCollapse.classList.remove('navbar-collapse-rmw');
        }
    }
}

// Initialize Navbar
const navbar = new Navbar('.navbar', 'navbar-collapse', 'navbar-show-btn', 'navbar-close-btn');

// Resize Event Manager
class ResizeManager {
    constructor() {
        this.resizeTimer;
        this.init();
    }

    init() {
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        document.body.classList.add("resize-animation-stopper");
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            document.body.classList.remove("resize-animation-stopper");
        }, 400);
    }
}

// Initialize Resize Manager
const resizeManager = new ResizeManager();

// Geolocation Component
class Geolocation {
    constructor(buttonSelector) {
        this.button = document.querySelector(buttonSelector);
        this.init();
    }

    init() {
        // Add event listener for button click to request geolocation
        this.button.addEventListener('click', () => this.requestGeolocation());

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser.");
        }
    }

    requestGeolocation() {
        // Request geolocation permission
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => this.handleGeolocationSuccess(position),
                (error) => this.handleGeolocationError(error)
            );
        }
    }

    handleGeolocationSuccess(position) {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    handleGeolocationError(error) {
        console.error("Error getting geolocation:", error);
    }
}

// Initialize Geolocation with button to trigger request
const geolocation = new Geolocation('#geolocation-btn');

// Notification Component
class NotificationManager {
    constructor() {
        if ('Notification' in window) {
            this.requestPermission();
        } else {
            console.error('Notifications are not supported by your browser.');
        }
    }

    requestPermission() {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                this.showNotification('Hello!', {
                    body: 'Welcome to our site!',
                    icon: 'assets/images/icon.webp',
                });
            } else {
                console.warn('Notification permission denied.');
            }
        }).catch(error => {
            console.error('Error requesting notification permission:', error);
        });
    }

    showNotification(title, options) {
        new Notification(title, options);
    }
}

// Initialize Notification Manager
const notificationManager = new NotificationManager();

// Service Worker Registration
class ServiceWorkerManager {
    constructor() {
        this.registerServiceWorker();
    }

    registerServiceWorker() {
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
    }
}

// Initialize Service Worker Manager
const serviceWorkerManager = new ServiceWorkerManager();
