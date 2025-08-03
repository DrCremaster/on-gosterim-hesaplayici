document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggleButton');

    // Başlangıç temasını kontrol et ve ayarla
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Koyu temada kaydırıcıyı doğru konuma getir
    if (currentTheme === 'dark') {
        if (themeToggleButton) {
            themeToggleButton.classList.add('dark-mode');
        }
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let newTheme = 'light';
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                newTheme = 'dark';
            }
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Butonun görselini güncelle
            themeToggleButton.classList.toggle('dark-mode');
        });
    }
});
