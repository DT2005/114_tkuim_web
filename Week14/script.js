document.addEventListener('DOMContentLoaded', () => {

    /* --- GLOBAL SETTINGS --- */
    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);


    /* --- UI INTERACTIONS --- */

    // Close Banner
    const closeBannerBtn = document.getElementById('close-banner');
    const topBanner = document.getElementById('top-banner');

    if (closeBannerBtn && topBanner) {
        closeBannerBtn.addEventListener('click', () => {
            topBanner.style.display = 'none';
        });
    }

    // Sidebar Active State for '#' links only
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Only prevent default if it's a dummy link
            if (item.getAttribute('href') === '#') {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Tab Switching (Greeting area in Home)
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Category Tags (Templates Page)
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });


    /* --- PROFILE PAGE SETTINGS --- */

    // Theme Selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        // Set current value
        themeSelect.value = savedTheme;

        themeSelect.addEventListener('change', (e) => {
            const newTheme = e.target.value;

            if (newTheme === 'system') {
                // Remove override to let system pref take over (simplification: setting to light for now or removing attr)
                document.documentElement.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            } else {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            }
        });
    }

    // Language Selector (Mock)
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            if (lang === 'en-US') {
                alert('Changing language to English... (Demo only)');
                document.title = "Settings - Canva Clone";
                // In a real app, this would reload the page or fetch new resources
            } else {
                alert('切換語言至 繁體中文... (僅供演示)');
                document.title = "帳號設定 - Canva Clone";
            }
        });
    }

});
