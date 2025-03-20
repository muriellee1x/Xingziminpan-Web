// Cache object to store fetched composition content
const compositionCache = {};

// Helper function to detect browser capabilities
const browserFeatures = {
  historyAPI: typeof window.history.pushState !== 'undefined',
  localStorage: (function() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch(e) {
      return false;
    }
  })()
};

// List of known composition IDs to distinguish from anchor links
const knownCompositionIds = [
  'dandelion', 'tiantai', 'poem', 'temple', 'eternal', 'clouds', 'path',
  'rumeng', 'bird', 'tasuo', 'mailied', 'kaidan', 'paintings', 'whinnings'
];

// List of main pages
const mainPageIds = ['compositions', 'contact', 'bio'];

// Main Vue instance
const app = new Vue({
  el: '#app',
  data: {
    currentPage: 'bio',        // Current active page
    loading: false,            // Loading state
    mobileMenuOpen: false,     // Mobile menu state
    compositionId: null,       // Current composition ID
    compositionContent: '',    // Current composition HTML content
    
    // Cache for composition content
    cache: compositionCache
  },
  computed: {
    // Dynamic class for mobile menu
    mobileMenuClass() {
      return {
        'hidden': !this.mobileMenuOpen,
        'translate-x-0': this.mobileMenuOpen,
        '-translate-x-full': !this.mobileMenuOpen
      };
    }
  },
  methods: {
    // Handle links with # to determine if it's a page change or just an anchor
    handleHashLink(event) {
      // Get the href attribute
      const link = event.currentTarget;
      const href = link.getAttribute('href');
      
      // If no href or it doesn't start with #, let the browser handle it
      if (!href || !href.startsWith('#')) return;
      
      // Get the hash without the # symbol
      const hash = href.substring(1);
      
      // Check if the hash corresponds to a main page
      if (mainPageIds.includes(hash)) {
        event.preventDefault();
        this.navigateTo(hash);
        return;
      }
      
      // Check if the hash is a composition ID
      if (knownCompositionIds.includes(hash)) {
        event.preventDefault();
        this.loadComposition(hash);
        return;
      }
      
      // Check if it's a section in the compositions page
      if (hash.startsWith('choral-') || hash === 'instrumental') {
        event.preventDefault();
        this.navigateTo('compositions');
        this.$nextTick(() => {
          this.scrollToSection(hash);
        });
        return;
      }
      
      // It's a regular anchor link within the current page, let it behave normally
      // But we need to prevent the default behavior if we're not on the right page
      if (hash === 'bio-text-box' && this.currentPage !== 'bio') {
        event.preventDefault();
        this.navigateTo('bio');
        this.$nextTick(() => {
          this.scrollToAnchor(hash);
        });
        return;
      }
      
      // For other anchor links, let the browser handle them naturally
    },
    
    // Navigate to a page
    navigateTo(page) {
      // Set page in history and URL
      const hash = page === 'bio' ? '' : page;
      
      if (browserFeatures.historyAPI) {
        window.history.pushState({ page }, document.title, hash ? `#${hash}` : window.location.pathname);
      } else {
        // Fallback for older browsers
        window.location.hash = hash || '';
      }
      
      // Update current page
      this.currentPage = page;
      
      // Close mobile menu if open
      this.closeMobileMenu();
      
      // Run layout adjustments
      this.$nextTick(() => {
        this.adjustLayout();
      });
      
      // Scroll to top
      window.scrollTo(0, 0);
    },
    
    // Scroll to an anchor element
    scrollToAnchor(anchorId) {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    
    // Toggle mobile menu
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    
    // Close mobile menu
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },
    
    // Load composition details
    async loadComposition(id) {
      // Update URL and history
      if (browserFeatures.historyAPI) {
        window.history.pushState({ page: 'composition-detail', id }, document.title, `#${id}`);
      } else {
        // Fallback for older browsers
        window.location.hash = id;
      }
      
      // Set current composition ID
      this.compositionId = id;
      
      // Show loading state
      this.loading = true;
      this.currentPage = 'composition-detail';
      
      try {
        // Check if content is already cached in memory
        if (this.cache[id]) {
          this.compositionContent = this.cache[id];
          this.loading = false;
          return;
        }
        
        // Try to get from localStorage if available
        if (browserFeatures.localStorage) {
          const cachedContent = localStorage.getItem(`composition_${id}`);
          if (cachedContent) {
            this.compositionContent = cachedContent;
            this.cache[id] = cachedContent;
            this.loading = false;
            return;
          }
        }
        
        // Fetch composition content
        const response = await fetch(`compositions/${id}.html`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get content as text
        const content = await response.text();
        
        // Store in memory cache
        this.cache[id] = content;
        
        // Store in localStorage if available
        if (browserFeatures.localStorage) {
          try {
            localStorage.setItem(`composition_${id}`, content);
          } catch (e) {
            console.warn('LocalStorage quota exceeded, continuing without caching');
          }
        }
        
        // Update content
        this.compositionContent = content;
      } catch (error) {
        console.error(`Error loading composition ${id}:`, error);
        this.compositionContent = `<div class="grid md:grid-cols-4 grid-cols-6 gap-4 pt-24 pb-24 bg-amber-50/75">
          <div class="md:col-start-2 col-start-2 md:col-span-2 col-span-4 text-left">
            <div class="tracking-wide font-['Cormorant_Garamond'] font-bold text-2xl text-yellow-900 pb-8">
              Error Loading Content
            </div>
            <div class="text-red-600">
              Sorry, we couldn't load the requested content. Please try again later.
            </div>
            <div class="mt-8">
              <a href="#compositions" @click.prevent="navigateTo('compositions')" class="text-yellow-900 hover:underline">
                ← Back to Compositions
              </a>
            </div>
          </div>
        </div>`;
      } finally {
        // Hide loading state
        this.loading = false;
        
        // Adjust layout
        this.$nextTick(() => {
          this.adjustLayout();
          
          // Add click handlers to any back buttons in the composition content
          const backButtons = document.querySelectorAll('.back-to-compositions');
          backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
              e.preventDefault();
              this.navigateTo('compositions');
            });
          });
          
          // Stop any media players if navigating away
          this.stopMediaPlayers();
        });
      }
    },
    
    // Adjust layout (bio image, etc.)
    adjustLayout() {
      if (this.currentPage === 'bio') {
        this.adjustImageHeight();
        this.scrollBioImage();
      }
    },
    
    // Handle image load event
    onImageLoad() {
      this.adjustImageHeight();
      this.scrollBioImage();
    },
    
    // Adjust bio image height (from custom.js)
    adjustImageHeight() {
      const image = document.getElementById("bio-image");
      const imageWrapper = document.getElementById('bio-image-wrapper');
      
      if (!image || !imageWrapper) return;
      
      const maxImageWidth = 1440;
      const maxImageHeight = 960;
      const imageTop = 180;
      
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const imageTopOffset = imageWrapper.getBoundingClientRect().top + document.documentElement.scrollTop;
      
      imageWrapper.style.width = "100%";
      const imageWrapperHeight = viewportHeight - imageTopOffset;

      imageWrapper.style.height = imageWrapperHeight + 'px';
      
      if (viewportWidth > maxImageWidth) {
        image.style.width = "100%";
        image.style.top = -imageTop + "px";
      } else {
        image.style.width = maxImageWidth + "px";
        const delta = maxImageWidth - viewportWidth;
        const left = Math.floor(delta * 0.6);
        image.style.left = -left + "px";
        image.style.top = -imageTop + "px";
      }
    },
    
    // Scroll bio image (from custom.js)
    scrollBioImage() {
      const image = document.getElementById("bio-image");
      const imageWrapper = document.getElementById('bio-image-wrapper');
      
      if (!image || !imageWrapper) return;
      
      const maxImageHeight = 960;
      const imageTop = 180;
      
      if (imageWrapper.offsetHeight < maxImageHeight - imageTop) {
        const scrollTop = document.documentElement.scrollTop;
        image.style.top = Math.min(-imageTop + Math.floor(scrollTop / 3), imageTop) + "px";
      }
    },
    
    // Scroll to a section on the compositions page
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    },
    
    // Stop all media players
    stopMediaPlayers() {
      const mediaIframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="soundcloud.com"]');
      mediaIframes.forEach(iframe => {
        const src = iframe.src;
        iframe.src = src; // Reload iframe to stop playback
      });
    },
    
    // Preload a composition (for hover preloading)
    preloadComposition(id) {
      // Only preload if not already in cache and it's a known composition
      if (!this.cache[id] && !this.loading && knownCompositionIds.includes(id)) {
        // Check localStorage first if available
        if (browserFeatures.localStorage) {
          const cachedContent = localStorage.getItem(`composition_${id}`);
          if (cachedContent) {
            this.cache[id] = cachedContent;
            return;
          }
        }
        
        // Otherwise fetch it
        fetch(`compositions/${id}.html`)
          .then(response => {
            if (response.ok) {
              return response.text();
            }
            return null;
          })
          .then(content => {
            if (content) {
              this.cache[id] = content;
              
              // Store in localStorage if available
              if (browserFeatures.localStorage) {
                try {
                  localStorage.setItem(`composition_${id}`, content);
                } catch (e) {
                  console.warn('LocalStorage quota exceeded, continuing without caching');
                }
              }
            }
          })
          .catch(error => {
            console.error(`Error preloading composition ${id}:`, error);
          });
      }
    },
    
    // Clear cache (useful for development)
    clearCache() {
      this.cache = {};
      
      if (browserFeatures.localStorage) {
        // Remove all composition cache entries from localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('composition_')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      console.log('Cache cleared');
    }
  },
  
  // On Vue mount
  mounted() {
    // Initial page routing based on URL hash
    const hash = window.location.hash.substring(1);
    
    if (hash) {
      // Check if hash is a main page or composition
      if (mainPageIds.includes(hash)) {
        this.currentPage = hash;
      } else if (hash.startsWith('choral-') || hash === 'instrumental') {
        // If it's a section hash, navigate to compositions page
        this.currentPage = 'compositions';
        // Scroll to section after render
        this.$nextTick(() => {
          this.scrollToSection(hash);
        });
      } else if (knownCompositionIds.includes(hash)) {
        // If it's a known composition, load it
        this.loadComposition(hash);
      } else if (hash === 'bio-text-box') {
        // If it's the bio text box anchor, stay on bio page and scroll there
        this.currentPage = 'bio';
        this.$nextTick(() => {
          this.scrollToAnchor(hash);
        });
      } else {
        // Default to bio for unknown hashes
        this.currentPage = 'bio';
      }
    } else {
      // Default to bio page
      this.currentPage = 'bio';
    }
    
    // Set up event listeners
    window.addEventListener('resize', this.adjustLayout);
    window.addEventListener('scroll', this.scrollBioImage);
    
    // Handle browser navigation (back/forward)
    if (browserFeatures.historyAPI) {
      window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
          if (event.state.page === 'composition-detail' && event.state.id) {
            this.loadComposition(event.state.id);
          } else {
            this.currentPage = event.state.page;
          }
        } else {
          // Default to bio if no state (or handle based on current URL)
          const hash = window.location.hash.substring(1);
          if (hash) {
            if (mainPageIds.includes(hash)) {
              this.currentPage = hash;
            } else if (hash.startsWith('choral-') || hash === 'instrumental') {
              this.currentPage = 'compositions';
              this.$nextTick(() => {
                this.scrollToSection(hash);
              });
            } else if (knownCompositionIds.includes(hash)) {
              this.loadComposition(hash);
            } else if (hash === 'bio-text-box') {
              this.currentPage = 'bio';
              this.$nextTick(() => {
                this.scrollToAnchor(hash);
              });
            } else {
              this.currentPage = 'bio';
            }
          } else {
            this.currentPage = 'bio';
          }
        }
        
        this.$nextTick(() => {
          this.adjustLayout();
        });
      });
    } else {
      // Fallback for older browsers
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
          if (mainPageIds.includes(hash)) {
            this.currentPage = hash;
          } else if (hash.startsWith('choral-') || hash === 'instrumental') {
            this.currentPage = 'compositions';
            this.$nextTick(() => {
              this.scrollToSection(hash);
            });
          } else if (knownCompositionIds.includes(hash)) {
            this.loadComposition(hash);
          } else if (hash === 'bio-text-box') {
            this.currentPage = 'bio';
            this.$nextTick(() => {
              this.scrollToAnchor(hash);
            });
          } else {
            this.currentPage = 'bio';
          }
        } else {
          this.currentPage = 'bio';
        }
        
        this.$nextTick(() => {
          this.adjustLayout();
        });
      });
    }
    
    // Add event listeners to all hash links
    this.$nextTick(() => {
      // Get all hash links
      const hashLinks = document.querySelectorAll('a[href^="#"]');
      
      // Add click handlers to process them through our routing system
      hashLinks.forEach(link => {
        link.addEventListener('click', this.handleHashLink);
        
        // Also add hover listener for preloading compositions
        const href = link.getAttribute('href');
        if (href && href.length > 1) {
          const id = href.substring(1); // Remove the # symbol
          if (knownCompositionIds.includes(id)) {
            link.addEventListener('mouseenter', () => {
              this.preloadComposition(id);
            });
          }
        }
      });
      
      // For links added later (like in composition content)
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) { // Element node
                const newLinks = node.querySelectorAll('a[href^="#"]');
                newLinks.forEach(link => {
                  link.addEventListener('click', this.handleHashLink);
                  
                  // Also add hover listener for preloading compositions
                  const href = link.getAttribute('href');
                  if (href && href.length > 1) {
                    const id = href.substring(1); // Remove the # symbol
                    if (knownCompositionIds.includes(id)) {
                      link.addEventListener('mouseenter', () => {
                        this.preloadComposition(id);
                      });
                    }
                  }
                });
              }
            });
          }
        });
      });
      
      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
    
    // Add CSS for transitions and animations
    const style = document.createElement('style');
    style.innerHTML = `
      .fade-in {
        animation: fadeIn 0.4s ease-in-out;
      }
      @keyframes fadeIn {
        from { 
          opacity: 0;
          transform: translateY(10px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Loading spinner */
      .loading-spinner {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 3px solid rgba(136, 77, 24, 0.2);
        border-radius: 50%;
        border-top-color: rgba(136, 77, 24, 0.8);
        animation: spin 1s ease-in-out infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* Mobile menu transitions */
      #mobile-menu {
        transition: transform 0.3s ease-in-out;
      }
      
      /* Hover effects for composition links */
      .font-['Crimson_Pro'] {
        transition: color 0.2s ease;
      }
      .font-['Crimson_Pro']:hover {
        color: rgb(136, 77, 24);
      }
    `;
    document.head.appendChild(style);
    
    // Update loading spinner style
    const loadingDiv = document.querySelector('#app > div[v-if="loading"]');
    if (loadingDiv) {
      loadingDiv.innerHTML = `
        <div class="flex flex-col items-center justify-center">
          <div class="loading-spinner mb-4"></div>
          <div class="text-yellow-900 text-xl">Loading...</div>
        </div>
      `;
    }
    
    // Initial layout adjustment
    this.adjustLayout();
    
    // Expose cache clearing function for development
    window.clearSiteCache = this.clearCache;
  }
}); 