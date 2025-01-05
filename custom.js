const maxImageWidth = 1440;
const maxImageHeight = 960;
const imageTop = 180;

function adjustImageHeight() {
  const image = document.getElementById("bio-image");
  const imageWrapper = document.getElementById('bio-image-wrapper');
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const imageTopOffset = document.getElementById('nav').getBoundingClientRect().bottom + document.documentElement.scrollTop;
  imageWrapper.style.width = "100%";
  const imageWrapperHeight = viewportHeight - imageTopOffset;
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
