// Performance Optimizations for Monastery360

// Critical rendering path optimization
(function() {
  'use strict';

  // Preload critical resources
  function preloadCriticalResources() {
    const preloadResources = [
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap', as: 'style' },
      { href: 'assets/css/modern.css', as: 'style' },
      { href: 'assets/css/chatbot.css', as: 'style' }
    ];

    preloadResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.as === 'style') {
        link.onload = function() {
          this.onload = null;
          this.rel = 'stylesheet';
        };
      }
      document.head.appendChild(link);
    });
  }

  // Lazy loading for images
  function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px 0px'
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  // Performance monitoring
  function performanceMonitoring() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
          
          console.log('🚀 Performance Metrics:');
          console.log(`📊 Page Load Time: ${loadTime.toFixed(2)}ms`);
          console.log(`⚡ DOM Content Loaded: ${domContentLoaded.toFixed(2)}ms`);
          
          // Send to analytics if available
          if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
              'name': 'page_load',
              'value': Math.round(loadTime)
            });
          }
        }, 0);
      });
    }
  }

  // Resource hints for external resources
  function addResourceHints() {
    const resourceHints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: '//images.unsplash.com' },
      { rel: 'dns-prefetch', href: '//cdn-icons-png.flaticon.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];

    resourceHints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
      document.head.appendChild(link);
    });
  }

  // Critical CSS inlining detection
  function handleCriticalCSS() {
    const criticalCSSLoaded = sessionStorage.getItem('criticalCSSLoaded');
    
    if (!criticalCSSLoaded) {
      // Mark that critical CSS has been loaded
      sessionStorage.setItem('criticalCSSLoaded', 'true');
    }
  }

  // Service Worker registration for caching
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('🔧 SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('❌ SW registration failed: ', registrationError);
          });
      });
    }
  }

  // Optimize images based on device capabilities
  function optimizeImages() {
    const isHighDensity = window.devicePixelRatio > 1;
    const isSlowConnection = navigator.connection && 
      (navigator.connection.effectiveType === 'slow-2g' || 
       navigator.connection.effectiveType === '2g');

    document.querySelectorAll('img[data-src-2x]').forEach(img => {
      if (isHighDensity && !isSlowConnection) {
        img.dataset.src = img.dataset.src2x;
      }
    });
  }

  // Debounce function for performance
  function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Memory usage monitoring
  function monitorMemoryUsage() {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = performance.memory;
        const used = (memory.usedJSHeapSize / 1048576).toFixed(2);
        const total = (memory.totalJSHeapSize / 1048576).toFixed(2);
        
        console.log(`💾 Memory Usage: ${used}MB / ${total}MB`);
        
        // Warn if memory usage is high
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
          console.warn('⚠️ High memory usage detected');
        }
      };

      // Check memory usage every 30 seconds
      setInterval(checkMemory, 30000);
    }
  }

  // Web Vitals tracking
  function trackWebVitals() {
    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            console.log(`⚡ First Input Delay: ${entry.processingStart - entry.startTime}ms`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`🖼️ Largest Contentful Paint: ${lastEntry.startTime}ms`);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  // Initialize all performance optimizations
  function init() {
    // Run immediately
    addResourceHints();
    handleCriticalCSS();
    optimizeImages();

    // Run when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setupLazyLoading();
        performanceMonitoring();
        trackWebVitals();
      });
    } else {
      setupLazyLoading();
      performanceMonitoring();
      trackWebVitals();
    }

    // Run when window loads
    window.addEventListener('load', () => {
      registerServiceWorker();
      monitorMemoryUsage();
    });
  }

  // Expose utilities globally
  window.MonasteryPerformance = {
    debounce,
    throttle,
    setupLazyLoading,
    optimizeImages
  };

  // Initialize
  init();
})();

// Additional lazy loading for monastery cards
function setupMonasteryCardLazyLoading() {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const img = card.querySelector('.monastery-image');
        
        if (img && img.style.backgroundImage.includes('data:image')) {
          const actualSrc = card.dataset.imageSrc;
          if (actualSrc) {
            img.style.backgroundImage = `url('${actualSrc}')`;
          }
        }
        
        cardObserver.unobserve(card);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '100px 0px'
  });

  document.querySelectorAll('.monastery-card[data-image-src]').forEach(card => {
    cardObserver.observe(card);
  });
}

// Initialize after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupMonasteryCardLazyLoading);
} else {
  setupMonasteryCardLazyLoading();
}