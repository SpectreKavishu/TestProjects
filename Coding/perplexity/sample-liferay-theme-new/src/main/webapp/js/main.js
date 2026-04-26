// Sample Liferay Theme JavaScript

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Sample Liferay Theme loaded successfully');

        // Initialize theme functionality
        initTheme();
    });

    function initTheme() {
        // Add smooth scrolling to navigation links
        addSmoothScrolling();

        // Initialize mobile menu if needed
        initMobileMenu();

        // Add any custom theme functionality here
        customThemeFunctions();
    }

    function addSmoothScrolling() {
        var links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                var target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    function initMobileMenu() {
        // Add mobile menu toggle functionality if needed
        var navigation = document.getElementById('navigation');

        if (navigation) {
            // Add responsive menu behavior
            var menuItems = navigation.querySelectorAll('li');

            menuItems.forEach(function(item) {
                var childMenu = item.querySelector('.child-menu');

                if (childMenu) {
                    item.addEventListener('click', function(e) {
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            childMenu.style.display = childMenu.style.display === 'block' ? 'none' : 'block';
                        }
                    });
                }
            });
        }
    }

    function customThemeFunctions() {
        // Add your custom JavaScript functionality here

        // Example: Add a class to body when page is scrolled
        window.addEventListener('scroll', function() {
            var body = document.body;

            if (window.scrollY > 100) {
                body.classList.add('scrolled');
            } else {
                body.classList.remove('scrolled');
            }
        });

        // Example: Log theme information
        if (typeof Liferay !== 'undefined' && Liferay.ThemeDisplay) {
            console.log('Theme Name: Sample Liferay Theme');
            console.log('Liferay Version: ' + Liferay.ThemeDisplay.getCompanyId());
        }
    }

})();