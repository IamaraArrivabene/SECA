/**
 * SECA - Environmental and Climatic Studies System
 * Main JavaScript
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initDropdowns();
    initSmoothScroll();
    initLanguageSwitcher();
    initVideos();
    initAnimations();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Toggle aria-expanded attribute for accessibility
        const isExpanded = mainNav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Toggle menu icon (hamburger/close)
        menuToggle.innerHTML = isExpanded ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (
            mainNav.classList.contains('active') && 
            !mainNav.contains(event.target) && 
            !menuToggle.contains(event.target)
        ) {
            mainNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

/**
 * Dropdown menu functionality
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // For mobile: toggle dropdown menus on click
    if (window.innerWidth <= 768) {
        dropdowns.forEach(function(dropdown) {
            const link = dropdown.querySelector('.nav-link');
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close other dropdowns
                dropdowns.forEach(function(otherDropdown) {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
        });
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset based on header height
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mainNav = document.querySelector('.main-nav');
                const menuToggle = document.querySelector('.menu-toggle');
                
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                }
                
                // Update URL hash
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Language switcher functionality
 */
function initLanguageSwitcher() {
    const languageSwitcher = document.querySelector('.language-switcher');
    if (!languageSwitcher) return;
    
    const languageLinks = languageSwitcher.querySelectorAll('a');
    
    languageLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const lang = this.getAttribute('data-lang');
            
            // Store the selected language
            localStorage.setItem('seca-language', lang);
            
            // Get current path and replace language part
            const currentPath = window.location.pathname;
            let newPath;
            
            if (currentPath.includes('-en.') || currentPath.includes('-pt.')) {
                newPath = currentPath.replace(
                    /-([a-z]{2})\./i,
                    '-' + lang + '.'
                );
            } else {
                // Default to homepage if can't determine pattern
                newPath = lang === 'pt' ? '/home-pt.html' : '/home-en.html';
            }
            
            // Redirect to the new language version
            window.location.href = newPath;
        });
    });
    
    // Highlight current language
    const currentLang = localStorage.getItem('seca-language') || 'en';
    
    languageLinks.forEach(function(link) {
        if (link.getAttribute('data-lang') === currentLang) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Video functionality
 */
function initVideos() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(function(video) {
        // Add controls when video is clicked
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            
            // Toggle controls visibility
            if (video.hasAttribute('controls')) {
                video.removeAttribute('controls');
            } else {
                video.setAttribute('controls', true);
            }
        });
        
        // Handle autoplaying videos
        if (video.hasAttribute('autoplay')) {
            // Try to autoplay
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Autoplay started successfully
                }).catch(() => {
                    // Autoplay was prevented, show play button or poster
                    video.controls = true;
                    
                    // Create play overlay for better UX
                    const playOverlay = document.createElement('div');
                    playOverlay.classList.add('video-play-overlay');
                    playOverlay.innerHTML = '<i class="fas fa-play"></i>';
                    video.parentNode.insertBefore(playOverlay, video.nextSibling);
                    
                    playOverlay.addEventListener('click', function() {
                        video.play();
                        playOverlay.style.display = 'none';
                    });
                });
            }
        }
    });
}

/**
 * Animation on scroll
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate');
    
    if (animatedElements.length === 0) return;
    
    // Check if an element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to add animation classes
    function animateElements() {
        animatedElements.forEach(function(element) {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
            }
        });
    }
    
    // Run once on load
    animateElements();
    
    // Run on scroll
    window.addEventListener('scroll', animateElements);
}

/**
 * Check if element exists and execute callback
 * @param {string} selector - CSS selector
 * @param {Function} callback - Callback function
 */
function ifExists(selector, callback) {
    const element = document.querySelector(selector);
    if (element) callback(element);
}

/**
 * Helper function for handling AJAX requests
 * @param {string} url - The URL to send the request to
 * @param {Object} options - Request options
 * @returns {Promise} - Promise with response
 */
function fetchData(url, options = {}) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

/**
 * WordPress integration helpers
 */
const wordpressAPI = {
    // Base URL for WP REST API
    baseUrl: '/wp-json/wp/v2',
    
    // Get latest posts
    getPosts: function(options = {}) {
        const defaultOptions = {
            per_page: 3,
            _embed: true
        };
        
        const queryParams = new URLSearchParams({
            ...defaultOptions,
            ...options
        }).toString();
        
        return fetchData(`${this.baseUrl}/posts?${queryParams}`);
    },
    
    // Get a single post by ID
    getPost: function(id) {
        return fetchData(`${this.baseUrl}/posts/${id}?_embed=true`);
    }
};

// If this site is integrated with WordPress, initialize WP-specific features
if (typeof wp !== 'undefined') {
    // WordPress-specific initialization
    document.addEventListener('DOMContentLoaded', function() {
        // Example: Load latest blog posts
        ifExists('.latest-posts', function(postsContainer) {
            wordpressAPI.getPosts()
                .then(posts => {
                    const postsHTML = posts.map(post => `
                        <div class="card">
                            ${post._embedded && post._embedded['wp:featuredmedia'] ? 
                                `<img src="${post._embedded['wp:featuredmedia'][0].source_url}" 
                                     alt="${post.title.rendered}" class="card-img">` : ''}
                            <div class="card-body">
                                <h3 class="card-title">${post.title.rendered}</h3>
                                <div class="card-text">${post.excerpt.rendered}</div>
                                <a href="${post.link}" class="btn btn-primary">Read More</a>
                            </div>
                        </div>
                    `).join('');
                    
                    postsContainer.innerHTML = postsHTML;
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                    postsContainer.innerHTML = '<p>Failed to load latest posts. Please try again later.</p>';
                });
        });
    });
} 