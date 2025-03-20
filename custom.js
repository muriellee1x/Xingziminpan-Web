// This file is kept for backward compatibility but functionality has been migrated to vue-app.js
// If you're using the Vue.js implementation, this file isn't necessary anymore.

// Legacy redirect for older browsers or when JavaScript is disabled
if (typeof Vue === 'undefined') {
  console.warn('Vue.js not detected. Using legacy compatibility mode.');
  
  const maxImageWidth = 1440;
  const maxImageHeight = 960;
  const imageTop = 180;

  function adjustImageHeight() {
    const image = document.getElementById("bio-image");
    const imageWrapper = document.getElementById('bio-image-wrapper');
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
  }

  function scrollBioImage() {
    const image = document.getElementById("bio-image");
    const imageWrapper = document.getElementById('bio-image-wrapper');
    if (imageWrapper.offsetHeight < maxImageHeight - imageTop) {
      const scrollTop = document.documentElement.scrollTop;
      image.style.top = Math.min(-imageTop + Math.floor(scrollTop / 3), imageTop) + "px";
    }
  }

  function switchPage() {
    const currentHash = location.hash;
    const pageBio = document.getElementById("page-bio");
    const pageComp = document.getElementById("page-comp");
    const pageContact = document.getElementById("page-contact");
    
    // Stop all media players
    const mediaIframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="soundcloud.com"]');
    mediaIframes.forEach(iframe => {
      const src = iframe.src;
      iframe.src = src; // Reload iframe to stop playback
    });
    
    // Get all composition page references
    const pages = {
      dandelion: document.getElementById("detail-dandelion"),
      tiantai: document.getElementById("detail-tiantai"),
      poem: document.getElementById("detail-poem"),
      temple: document.getElementById("detail-temple"),
      eternal: document.getElementById("detail-eternal"),
      clouds: document.getElementById("detail-clouds"),
      path: document.getElementById("detail-path"),
      rumeng: document.getElementById("detail-rumeng"),
      bird: document.getElementById("detail-bird"),
      tasuo: document.getElementById("detail-tasuo"),
      mailied: document.getElementById("detail-mailied"),
      kaidan: document.getElementById("detail-kaidan"),
      paintings: document.getElementById("detail-paintings"),
      whinnings: document.getElementById("detail-whinnings")
    };

    // Make sure base pages exist
    if (!pageBio || !pageComp || !pageContact) {
      setTimeout(switchPage, 100);
      return;
    }

    // Hide all pages first
    pageBio.style.display = "none";
    pageComp.style.display = "none";
    pageContact.style.display = "none";
    Object.values(pages).forEach(page => {
      if (page) page.style.display = "none";
    });

    // Show the appropriate page based on hash
    if (currentHash === "#compositions" || currentHash === "#choral-mixed" || 
        currentHash === "#choral-treble" || currentHash === "#instrumental") {
      pageComp.style.display = "grid";
    } else if (currentHash === "#contact") {
      pageContact.style.display = "grid";
    } else {
      // Check if it's a composition page
      const pageId = currentHash.substring(1); // Remove # symbol
      if (pages[pageId]) {
        pages[pageId].style.display = "grid";
      } else {
        pageBio.style.display = "grid";
      }
    }
    adjustImageHeight();
    scrollBioImage();
  }

  function init() {
    adjustImageHeight();
    switchPage();
  }

  window.addEventListener('resize', adjustImageHeight);
  window.addEventListener('load', init);
  window.addEventListener('scroll', scrollBioImage);
  window.addEventListener("hashchange", switchPage);

  // Simple HTML include function for legacy compatibility
  function includeHTML() {
    const elements = document.getElementsByTagName("*");
    
    for (let element of elements) {
      const file = element.getAttribute("w3-include-html");
      if (file) {
        console.log("Attempting to load:", file);
        fetch(file)
          .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then(data => {
            console.log("Successfully loaded file:", file);
            element.innerHTML = data;
            element.removeAttribute("w3-include-html");
            switchPage();
          })
          .catch(error => {
            console.error(`Error loading ${file}:`, error);
            element.innerHTML = `Error loading page: ${file}`;
          });
      }
    }
  }

  // Initialize the page when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - executing includeHTML in compatibility mode");
    includeHTML();

    // Menu toggle functionality for mobile
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (mobileMenu.classList.contains('translate-x-0') || !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.remove('translate-x-0');
          mobileMenu.classList.add('-translate-x-full');
          mobileMenu.classList.add('hidden');
          mobileMenu.style.display = 'none';
        } else {
          mobileMenu.style.display = 'block';
          requestAnimationFrame(() => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.offsetHeight; // Force reflow
            
            requestAnimationFrame(() => {
              mobileMenu.classList.add('translate-x-0');
              mobileMenu.classList.remove('-translate-x-full');
            });
          });
        }
      });

      // Close menu when links are clicked
      const mobileMenuLinks = mobileMenu.querySelectorAll('a');
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('translate-x-0');
          mobileMenu.classList.add('-translate-x-full');
          mobileMenu.classList.add('hidden');
          mobileMenu.style.display = 'none';
          adjustImageHeight();
          scrollBioImage();
        });
      });
    } else {
      console.error('Menu elements not found in compatibility mode');
    }
  });
} else {
  console.log('Vue.js detected. Using modern SPA implementation.');
}
