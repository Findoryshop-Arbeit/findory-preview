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

(() => {
  const menu = document.querySelector('.category-menu');
  if (!menu) return;
  const branches = [...menu.querySelectorAll('.category-branch')];
  const close = () => { menu.open = false; branches.forEach(b => { b.open = false; }); };
  branches.forEach(branch => branch.addEventListener('toggle', () => {
    if (branch.open) branches.forEach(other => { if (other !== branch) other.open = false; });
  }));
  document.addEventListener('click', event => { if (!menu.contains(event.target)) close(); });
  menu.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { close(); menu.querySelector('summary').focus(); }
  });
  const reveal = () => {
    let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.closest('.empty-category')) target.closest('.empty-category').open = true;
    const legacy = target?.matches('[data-canonical]') ? target : null;
    if (legacy && document.querySelector('[data-legacy-default]')) location.replace(legacy.href);
  };
  reveal(); addEventListener('hashchange', reveal);
})();
// Parent categories stay naturally mixed; only complete subcategories filter.
(() => {
  const rows = [...document.querySelectorAll('.family-row[data-category-group]')];
  const heading = document.querySelector('[data-selection-title]');
  const controls = document.querySelector('[data-category-filter-controls]');
  if (!rows.length || !heading || !controls) return;
  const original = heading.textContent;
  const apply = () => {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { hash = ''; }
    const target = document.getElementById(hash);
    const group = target?.dataset.categoryFilter;
    rows.forEach(row => { row.hidden = !!group && row.dataset.categoryGroup !== group; });
    heading.textContent = group ? target.dataset.categoryTitle : original;
    controls.hidden = !group;
    controls.querySelector('[role="status"]').textContent = group ? `${target.dataset.categoryCount} Produkte in dieser Auswahl` : '';
    if (group) heading.scrollIntoView({block:'start',behavior:'instant'});
    else if (target?.matches('.family-row')) target.scrollIntoView({block:'start',behavior:'instant'});
  };
  addEventListener('hashchange', apply);
  apply();
})();
