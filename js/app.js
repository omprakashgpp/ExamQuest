/**
 * ExamQuest Global Application Controller
 * Handles Theme Toggling, Mobile Drawers, Global Shortcuts, and UI Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNavigation();
  initFullscreen();
  highlightActiveNav();
});

/**
 * Theme initialization and toggle
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');
  const savedTheme = themeParam || localStorage.getItem('examquest_theme') || 'light';
  
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('examquest_theme', newTheme);
    });
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('sun');
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon('moon');
  }
}

function updateThemeIcon(type) {
  const icon = document.querySelector('#themeToggleBtn i');
  if (icon) {
    if (type === 'sun') {
      icon.className = 'fa-solid fa-sun';
      icon.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'fa-regular fa-moon';
      icon.setAttribute('title', 'Switch to Dark Mode');
    }
  }
}

/**
 * Mobile Navigation & Sidebar Drawers
 */
function initMobileNavigation() {
  const mobileToggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('eqNavLinks');
  const sidebarLeft = document.getElementById('eqSidebarLeft');
  const sidebarBackdrop = document.getElementById('eqSidebarBackdrop');
  const mobileSidebarTrigger = document.getElementById('mobileSidebarTrigger');

  // Toggle Navbar Menu on Mobile
  if (mobileToggleBtn && navLinks) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('show-mobile');
    });
  }

  // Toggle Left Sidebar Drawer on Tablet/Mobile
  if (mobileSidebarTrigger && sidebarLeft && sidebarBackdrop) {
    mobileSidebarTrigger.addEventListener('click', () => {
      sidebarLeft.classList.add('show-drawer');
      sidebarBackdrop.classList.add('active');
    });
  }

  if (sidebarBackdrop && sidebarLeft) {
    sidebarBackdrop.addEventListener('click', () => {
      sidebarLeft.classList.remove('show-drawer');
      sidebarBackdrop.classList.remove('active');
    });
  }

  // Close menus on outside click
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('show-mobile') && !navLinks.contains(e.target) && e.target !== mobileToggleBtn) {
      navLinks.classList.remove('show-mobile');
    }
  });
}

/**
 * Fullscreen Mode Toggle
 */
function initFullscreen() {
  const fsBtn = document.getElementById('fullscreenToggleBtn');
  if (!fsBtn) return;

  fsBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
      fsBtn.innerHTML = '<i class="fa-solid fa-compress"></i> <span>Exit Full Screen</span>';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i> <span>Full Screen Exam</span>';
      }
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && fsBtn) {
      fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i> <span>Full Screen Exam</span>';
    }
  });
}

/**
 * Highlight Current Nav Item
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const navItems = document.querySelectorAll('.eq-nav-item');

  navItems.forEach(item => {
    const link = item.querySelector('.eq-nav-link');
    if (!link) return;
    const href = link.getAttribute('href').toLowerCase();

    if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html')))) {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    }
  });
}

/**
 * Modern Toast Notification Helper
 */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('eqToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'eqToastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      top: 85px;
      right: 25px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#d97706',
    info: '#5542f6'
  };

  toast.style.cssText = `
    background: ${bgColors[type] || bgColors.info};
    color: #ffffff;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
  `;
  
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info');
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

window.showToast = showToast;
