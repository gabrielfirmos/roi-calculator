(function() {
    // Store widget states
    const widgetStates = new Map();

    // Handle messages from the widget iframe
    window.addEventListener('message', function(e) {
        const widgets = document.querySelectorAll('[data-roi-calculator]');
        
        widgets.forEach(widget => {
            // Handle resize events
            if (e.data.type === 'resize') {
                widget.style.height = `${e.data.height + 20}px`; // Add small buffer
            }
            
            // Handle tab changes
            if (e.data.type === 'tabChange') {
                const widgetId = widget.getAttribute('data-roi-calculator');
                widgetStates.set(widgetId, {
                    ...widgetStates.get(widgetId),
                    currentTab: e.data.tab
                });
                
                // Trigger custom event for parent page
                const event = new CustomEvent('roiCalculatorTabChange', {
                    detail: {
                        widgetId,
                        tab: e.data.tab
                    }
                });
                window.dispatchEvent(event);
            }
        });
    });

    // Initialize widgets
    function initWidgets() {
        const widgets = document.querySelectorAll('[data-roi-calculator]');
        
        widgets.forEach(widget => {
            // Generate unique ID if not provided
            if (!widget.getAttribute('data-roi-calculator')) {
                widget.setAttribute('data-roi-calculator', 'roi-calc-' + Math.random().toString(36).substr(2, 9));
            }
            
            // Set initial widget state
            const widgetId = widget.getAttribute('data-roi-calculator');
            widgetStates.set(widgetId, {
                currentTab: 'time',
                initialized: true
            });
            
            // Set widget attributes
            widget.setAttribute('scrolling', 'no');
            widget.style.width = '100%';
            widget.style.border = 'none';
            widget.style.overflow = 'hidden';
            widget.style.minHeight = '800px';
            widget.style.maxWidth = '100%';
            widget.style.backgroundColor = 'transparent';
            widget.style.margin = '0';
            widget.style.padding = '0';
            widget.style.borderRadius = '0';
            // Add loading state
            widget.style.opacity = '0';
            widget.style.transition = 'opacity 0.3s ease-in-out';
            
            // Remove loading state when content is loaded
            widget.addEventListener('load', function() {
                widget.style.opacity = '1';
            });
        });
    }

    // Public API for external control of the widget
    window.ROICalculator = {
        // Get current state of a specific widget
        getState: function(widgetId) {
            return widgetStates.get(widgetId);
        },
        
        // Manually trigger resize
        refresh: function() {
            const widgets = document.querySelectorAll('[data-roi-calculator]');
            widgets.forEach(widget => {
                if (widget.contentWindow) {
                    widget.contentWindow.postMessage({ type: 'refresh' }, '*');
                }
            });
        },

        // Switch tab programmatically
        setTab: function(widgetId, tab) {
            const widget = document.querySelector(`[data-roi-calculator="${widgetId}"]`);
            if (widget && widget.contentWindow) {
                widget.contentWindow.postMessage({ 
                    type: 'setTab', 
                    tab: tab 
                }, '*');
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidgets);
    } else {
        initWidgets();
    }
})();   