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
  // log imageWrapperHeight, viewportHeight, imageTopOffset
  console.log(viewportHeight, imageWrapperHeight, viewportHeight, imageTopOffset);
  imageWrapper.style.height = imageWrapperHeight + 'px';
  if (viewportWidth > maxImageWidth) {
    image.style.width = "100%";
    image.style.top = -imageTop + "px";
  } else {
    image.style.width = maxImageWidth + "px";
    const left = Math.floor((maxImageWidth - viewportWidth) / 2);
    image.style.left = -left + "px";
    image.style.top = -imageTop + "px";
  }
}

function scrollBioImage() {
  const image = document.getElementById("bio-image");
  const imageWrapper = document.getElementById('bio-image-wrapper');
  if (imageWrapper.offsetHeight < maxImageHeight - imageTop) {
    const scrollTop = document.documentElement.scrollTop;
    // image.style.top = -Math.min(Math.floor(scrollTop / 6), imageTop) + "px";
    image.style.top = Math.min(-imageTop + Math.floor(scrollTop / 3), imageTop) + "px";
  }
}

// class ParallaxImage {
//   constructor(options = {}) {
//     this.imageId = options.imageId || 'bio-image';
//     this.wrapperId = options.wrapperId || 'bio-image-wrapper';
//     this.navId = options.navId || 'nav';
//     this.maxImageWidth = options.maxImageWidth || 1200;
//     this.maxImageHeight = options.maxImageHeight || 800;
//     this.imageTop = options.imageTop || 0;
//     this.parallaxSpeed = options.parallaxSpeed || 0.3;
//     this.aspectRatio = options.aspectRatio || 0.5625; // 16:9 = 9/16 = 0.5625
    
//     this.debouncedAdjust = this.debounce(this.adjustImageHeight.bind(this), 150);
//     this.ticking = false;
    
//     this.init();
//   }
  
//   adjustImageHeight() {
//     const viewportHeight = window.innerHeight;
//     const viewportWidth = window.innerWidth;
//     const imageTopOffset = this.nav.getBoundingClientRect().bottom;
    
//     this.wrapper.style.width = '100%';
    
//     // 计算容器高度：基于容器宽度和设定的宽高比
//     const wrapperWidth = this.wrapper.offsetWidth;
//     const calculatedHeight = Math.floor(wrapperWidth * this.aspectRatio);
    
//     // 设置容器高度，但不超过视口高度减去导航高度
//     const maxPossibleHeight = viewportHeight - imageTopOffset;
//     const finalHeight = Math.min(calculatedHeight, maxPossibleHeight);
    
//     this.wrapper.style.height = `${finalHeight}px`;
    
//     // 图片尺寸处理
//     this.image.style.width = '100%';
//     this.image.style.height = 'auto';
    
//     // 确保图片高度足够进行视差滚动
//     const minHeight = finalHeight + (this.imageTop * 2);
//     if (this.image.offsetHeight < minHeight) {
//       this.image.style.height = `${minHeight}px`;
//       this.image.style.width = 'auto';
//     }
    
//     this.updateImagePosition(window.scrollY);
//   }
  
//   scrollBioImage() {
//     const scrollTop = window.scrollY;
//     const wrapperRect = this.wrapper.getBoundingClientRect();
    
//     // 只在图片在视口内时更新位置
//     if (wrapperRect.top < window.innerHeight && wrapperRect.bottom > 0) {
//       this.updateImagePosition(scrollTop);
//     }
//   }
  
//   updateImagePosition(scrollTop) {
//     const wrapperRect = this.wrapper.getBoundingClientRect();
//     const wrapperTop = wrapperRect.top + window.scrollY;
    
//     // 计算视差位置
//     const relativeScroll = scrollTop - wrapperTop;
//     const parallaxOffset = relativeScroll * this.parallaxSpeed;
    
//     // 限制移动范围
//     const maxOffset = this.image.offsetHeight - this.wrapper.offsetHeight;
//     const boundedOffset = Math.max(0, Math.min(parallaxOffset, maxOffset));
    
//     this.image.style.top = `-${boundedOffset}px`;
//   }
  
//   debounce(func, wait) {
//     let timeout;
//     return function executedFunction(...args) {
//       const later = () => {
//         clearTimeout(timeout);
//         func(...args);
//       };
//       clearTimeout(timeout);
//       timeout = setTimeout(later, wait);
//     };
//   }
// }

// // 使用示例
// const parallax = new ParallaxImage({
//   maxImageWidth: 1200,
//   maxImageHeight: 800,
//   imageTop: 100,
//   parallaxSpeed: 0.3,
//   aspectRatio: 0.2 // 可以调整这个值来改变容器的宽高比
// });

function switchPage() {
  const currentHash = location.hash;
  const pageBio = document.getElementById("page-bio");
  const pageComp = document.getElementById("page-comp");
  const pageContact = document.getElementById("page-contact");
  
  // 所有作品页面的引用
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

  // 确保基本页面元素存在
  if (!pageBio || !pageComp || !pageContact) {
    setTimeout(switchPage, 100);
    return;
  }

  // 先隐藏所有页面
  pageBio.style.display = "none";
  pageComp.style.display = "none";
  pageContact.style.display = "none";
  Object.values(pages).forEach(page => {
    if (page) page.style.display = "none";
  });

  // 根据 hash 显示对应页面
  if (currentHash === "#compositions" || currentHash === "#choral-mixed" || 
      currentHash === "#choral-treble" || currentHash === "#instrumental") {
    pageComp.style.display = "grid";
  } else if (currentHash === "#contact") {
    pageContact.style.display = "grid";
  } else {
    // 检查是否是作品页面
    const pageId = currentHash.substring(1); // 移除 # 符号
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

// 确保在 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Content Loaded - executing includeHTML");
  includeHTML();
});

// 汉堡菜单切换
document.getElementById('menu-btn').addEventListener('click', function() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
  adjustImageHeight();
  scrollBioImage();
});

// 获取移动端菜单元素
const mobileMenu = document.getElementById('mobile-menu');
// 获取所有移动端菜单中的链接
const mobileMenuLinks = mobileMenu.querySelectorAll('a');

// 为每个链接添加点击事件监听器
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden'); // 点击后隐藏菜单
    console.log("mobile menu clicked");
    adjustImageHeight();
    scrollBioImage();
  });
});
