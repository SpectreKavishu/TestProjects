/**
 * Simple Liferay Theme - Main JavaScript
 * Custom JavaScript functionality for the theme
 */

(function() {
    'use strict';

    // Theme initialization
    var SimpleTheme = {

        /**
         * Initialize theme functionality
         */
        init: function() {
            this.setupNavigation();
            this.setupPortlets();
            this.setupFormEnhancements();
            console.log('Simple Liferay Theme initialized');
        },

        /**
         * Setup navigation functionality
         */
        setupNavigation: function() {
            // Mobile menu toggle
            var navToggle = document.querySelector('.navbar-toggle');
            var navCollapse = document.querySelector('.navbar-collapse');

            if (navToggle && navCollapse) {
                navToggle.addEventListener('click', function() {
                    navCollapse.classList.toggle('show');
                });
            }

            // Smooth scrolling for anchor links
            var anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    var target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        },

        /**
         * Setup portlet enhancements
         */
        setupPortlets: function() {
            // Add loading states to portlets
            var portlets = document.querySelectorAll('.portlet');
            portlets.forEach(function(portlet) {
                var forms = portlet.querySelectorAll('form');
                forms.forEach(function(form) {
                    form.addEventListener('submit', function() {
                        var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                        if (submitBtn) {
                            submitBtn.disabled = true;
                            submitBtn.innerHTML += ' <span class="spinner-custom"></span>';
                        }
                    });
                });
            });
        },

        /**
         * Setup form enhancements
         */
        setupFormEnhancements: function() {
            // Add focus classes to form groups
            var formControls = document.querySelectorAll('.form-control');
            formControls.forEach(function(control) {
                control.addEventListener('focus', function() {
                    var formGroup = this.closest('.form-group');
                    if (formGroup) {
                        formGroup.classList.add('focused');
                    }
                });

                control.addEventListener('blur', function() {
                    var formGroup = this.closest('.form-group');
                    if (formGroup) {
                        formGroup.classList.remove('focused');
                    }
                });
            });

            // Form validation feedback
            var requiredFields = document.querySelectorAll('[required]');
            requiredFields.forEach(function(field) {
                field.addEventListener('invalid', function() {
                    this.classList.add('is-invalid');
                });

                field.addEventListener('input', function() {
                    if (this.validity.valid) {
                        this.classList.remove('is-invalid');
                        this.classList.add('is-valid');
                    }
                });
            });
        },

        /**
         * Utility function to show notifications
         */
        showNotification: function(message, type) {
            type = type || 'info';

            var notification = document.createElement('div');
            notification.className = 'alert alert-' + type + ' alert-dismissible fade show';
            notification.innerHTML = message + 
                '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';

            // Insert at top of content area
            var content = document.querySelector('#content');
            if (content) {
                content.insertBefore(notification, content.firstChild);

                // Auto-dismiss after 5 seconds
                setTimeout(function() {
                    notification.classList.add('fade');
                    setTimeout(function() {
                        notification.remove();
                    }, 300);
                }, 5000);
            }
        }
    };

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            SimpleTheme.init();
        });
    } else {
        SimpleTheme.init();
    }

    // Make SimpleTheme available globally
    window.SimpleTheme = SimpleTheme;

    // Liferay portlet ready event
    if (window.Liferay && Liferay.Portlet) {
        Liferay.Portlet.ready(function(portletId, node) {
            console.log('Portlet ready:', portletId);
            // Re-initialize theme features for new portlet
            SimpleTheme.setupFormEnhancements();
        });
    }

})();