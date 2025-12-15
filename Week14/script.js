document.addEventListener('DOMContentLoaded', () => {

    /* --- GLOBAL SETTINGS --- */
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    /* --- COMPONENT RENDERING --- */
    renderComponents();

    /* --- UI INTERACTIONS --- */
    initializeEventListeners();

});

function renderComponents() {
    const appContainer = document.querySelector('.app-container');
    const mainContent = document.querySelector('.main-content');

    // Return if not a dashboard page (e.g. editor.html might not have these)
    if (!appContainer || !mainContent) return;

    // 1. Render Sidebar
    const sidebarHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <button class="icon-btn menu-btn">
                    <span class="material-icons-outlined">menu</span>
                </button>
                <div class="logo">Canva</div>
            </div>
            
            <div class="create-btn-container">
                <a href="editor.html" class="btn btn-primary btn-create" style="text-decoration: none; justify-content: center;">
                    <span class="material-icons-outlined">add</span>
                    <span>建立設計</span>
                </a>
            </div>

            <nav class="sidebar-nav">
                <ul>
                    <li>
                        <a href="home.html" class="nav-item" data-page="home.html">
                            <span class="material-icons-outlined">home</span>
                            <span>首頁</span>
                        </a>
                    </li>
                    <li>
                        <a href="projects.html" class="nav-item" data-page="projects.html">
                            <span class="material-icons-outlined">folder</span>
                            <span>專案</span>
                        </a>
                    </li>
                    <li>
                        <a href="templates.html" class="nav-item" data-page="templates.html">
                            <span class="material-icons-outlined">grid_view</span>
                            <span>範本</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-item">
                            <span class="material-icons-outlined">stars</span>
                            <span>品牌</span>
                            <span class="pro-badge">PRO</span>
                        </a>
                    </li>
                    <li>
                        <a href="apps.html" class="nav-item" data-page="apps.html">
                            <span class="material-icons-outlined">apps</span>
                            <span>應用程式</span>
                        </a>
                    </li>
                </ul>
            </nav>
            
            <div class="sidebar-footer">
                 <nav class="sidebar-nav">
                    <ul>
                         <li>
                            <a href="#" class="nav-item">
                                <span class="material-icons-outlined">group_add</span>
                                <span>邀請成員</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="nav-item">
                                <span class="material-icons-outlined">delete</span>
                                <span>垃圾桶</span>
                            </a>
                        </li>
                    </ul>
                 </nav>
            </div>
        </aside>
    `;

    // Inject Sidebar at the start of app-container
    // Check if sidebar already exists (to prevent dupes if run multiple times)
    if (!document.querySelector('.sidebar')) {
        appContainer.insertAdjacentHTML('afterbegin', sidebarHTML);
    }

    // 2. Render Top Header
    const headerHTML = `
        <header class="top-header">
             <div class="header-right">
                <button class="icon-btn" title="設定"><span class="material-icons-outlined">settings</span></button>
                <button class="icon-btn" title="通知"><span class="material-icons-outlined">notifications</span></button>
                <button class="btn btn-outline glow-btn">
                    <span class="material-icons-outlined">workspace_premium</span>
                    升級方案
                </button>
                <a href="profile.html" class="user-avatar" title="帳號設定" style="text-decoration: none;">U</a>
            </div>
        </header>
    `;

    // Inject Header at the start of main-content
    if (!document.querySelector('.top-header')) {
        mainContent.insertAdjacentHTML('afterbegin', headerHTML);
    }

    // 3. Set Active Navigation State
    setActiveNavItem();
}

function setActiveNavItem() {
    // Get current filename (e.g., "index.html", "projects.html")
    let path = window.location.pathname.split('/').pop();

    // Default to index.html or home.html
    if (!path || path === '') path = 'index.html';

    // Special case: index.html maps to Home
    if (path === 'index.html') path = 'home.html';

    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        // Check if data-page matches current path
        if (item.getAttribute('data-page') === path) {
            item.classList.add('active');
        }
    });
}

function initializeEventListeners() {

    // 1. Close Banner (only if exists)
    const closeBannerBtn = document.getElementById('close-banner');
    const topBanner = document.getElementById('top-banner');
    if (closeBannerBtn && topBanner) {
        closeBannerBtn.addEventListener('click', () => {
            topBanner.style.display = 'none';
        });
    }

    // 2. Sidebar Menu Toggle (we just rendered it, so we can select it now)
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            // In a real app this might toggle a 'collapsed' class
            // For now, we'll just log or do a simple width toggle if css supports it
            console.log('Menu Toggled');
        });
    }

    // 3. Tab Switching (Home Greeting Tabs)
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 4. Category Tags (Templates Page)
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });

    // 5. Theme Selector (Profile Page)
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        // Set current value
        const currentTheme = localStorage.getItem('theme') || 'light';
        themeSelect.value = currentTheme;

        themeSelect.addEventListener('change', (e) => {
            const newTheme = e.target.value;

            if (newTheme === 'system') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            } else {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            }
        });
    }

    // 6. Language Selector (Profile Page)
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            if (lang === 'en-US') {
                alert('Changing language to English... (Demo only)');
            } else {
                alert('切換語言至 繁體中文... (僅供演示)');
            }
        });
    }

    // 7. Prevent default on # links
    const links = document.querySelectorAll('a[href="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => e.preventDefault());
    });
}
