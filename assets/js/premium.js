(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-navigation');
  if (!button || !nav) return;
  const mobile = matchMedia('(max-width: 1040px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let menuAnimation;
  const setOpen = open => {
    if (menuAnimation) menuAnimation.cancel();
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    nav.inert = mobile.matches && !open;
    if (open && mobile.matches && !reduced.matches && nav.animate) {
      menuAnimation = nav.animate([
        {clipPath:'inset(0 0 85% 0 round 20px)',filter:'blur(3px)'},
        {clipPath:'inset(0 0 0 0 round 20px)',filter:'blur(0)'}
      ], {duration:220,easing:'cubic-bezier(.16,1,.3,1)'});
    }
  };
  setOpen(false);
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false); button.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
  reduced.addEventListener('change', () => { if (menuAnimation) menuAnimation.cancel(); });
})();
