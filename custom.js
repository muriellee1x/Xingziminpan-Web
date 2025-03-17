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
    // image.style.top = -Math.min(Math.floor(scrollTop / 6), imageTop) + "px";
    image.style.top = Math.min(-imageTop + Math.floor(scrollTop / 3), imageTop) + "px";
  }
}

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

// 将所有菜单相关的代码移到 DOMContentLoaded 事件中
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Content Loaded - executing includeHTML");
  includeHTML();

  // 汉堡菜单切换
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  console.log('Menu elements:', { menuBtn, mobileMenu }); // 调试日志

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function(e) {
      e.preventDefault(); // 阻止默认行为
      console.log('Menu button clicked'); // 调试日志
      
      // 检查菜单是否已经显示
      if (mobileMenu.classList.contains('translate-x-0') || !mobileMenu.classList.contains('hidden')) {
        // 如果菜单已显示，则立即关闭它（无动画）
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('-translate-x-full');
        mobileMenu.classList.add('hidden');
        mobileMenu.style.display = 'none'; // 显式设置 display 为 none
      } else {
        // 如果菜单未显示，则打开它
        mobileMenu.style.display = 'block'; // 显式设置 display 为 block
        requestAnimationFrame(() => {
          mobileMenu.classList.remove('hidden');
          // 强制重排
          mobileMenu.offsetHeight;
          
          requestAnimationFrame(() => {
            mobileMenu.classList.add('translate-x-0');
            mobileMenu.classList.remove('-translate-x-full');
          });
        });
      }
    });

    // 菜单链接点击处理也需要立即隐藏
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        console.log('Menu link clicked'); // 调试日志
        
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('-translate-x-full');
        mobileMenu.classList.add('hidden');
        mobileMenu.style.display = 'none'; // 显式设置 display 为 none
        adjustImageHeight();
        scrollBioImage();
      });
    });
  } else {
    console.error('Menu elements not found:', {
      menuBtn: !!menuBtn,
      mobileMenu: !!mobileMenu,
    });
  }
});
