document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll state
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navDesktop = document.querySelector('.nav-desktop');
  if (mobileToggle && navDesktop) {
    mobileToggle.addEventListener('click', () => {
      navDesktop.classList.toggle('mobile-open');
    });
  }

  // 3. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          navDesktop?.classList.remove('mobile-open');
          
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 20);
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 4. Live clock mock
  const timeElement = document.getElementById('telemetry-time-display');
  if (timeElement) {
    const updateTime = () => {
      const now = new Date();
      timeElement.textContent = now.toLocaleTimeString('pt-BR', { hour12: false }) + ' BRT';
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
});
