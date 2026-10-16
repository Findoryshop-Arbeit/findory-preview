(() => {
  const form = document.querySelector('form[role="search"]');
  if (!form) return;
  const input = form.querySelector('input');
  const panel = document.querySelector('#suchergebnisse');
  const list = panel.querySelector('[data-search-list]');
  const status = panel.querySelector('[data-search-status]');
  const normalize = value => value.toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let index;
  const run = async () => {
    const q = input.value.trim();
    panel.hidden = false;
    list.replaceChildren();
    const url = new URL(location.href);
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!q) { status.textContent = 'Gib einen Begriff ein, zum Beispiel Gewürze, Kabel oder Familie.'; input.focus(); return; }
    status.textContent = 'Suche läuft …';
    form.querySelector('button').disabled = true;
    try {
      if (!index) {
        const response = await fetch('/findory-preview/search-index.json');
        if (!response.ok) throw new Error('search');
        index = await response.json();
      }
      const terms = normalize(q).split(/\s+/).filter(Boolean);
      const matches = index.filter(item => terms.every(term => normalize(item.title + ' ' + item.text).includes(term)));
      status.textContent = matches.length ? `${matches.length} Treffer für „${q}“` : `Zu „${q}“ gibt es noch keinen Treffer. Versuche Küche, Ordnung, Kabel oder Familie.`;
      for (const item of matches) {
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;
        list.append(a);
      }
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && panel.animate) panel.animate([{clipPath:'inset(0 0 100% 0)',filter:'blur(3px)'},{clipPath:'inset(0)',filter:'blur(0)'}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});
    } catch { status.textContent = 'Die Suche konnte nicht geladen werden. Versuche es erneut oder öffne eines der Themen darunter.'; }
    finally { form.querySelector('button').disabled = false; }
  };
  const close = () => { panel.hidden = true; input.value = ''; const u = new URL(location.href); u.searchParams.delete('q'); history.replaceState(null,'',u); input.focus(); };
  form.addEventListener('submit', event => { event.preventDefault(); run(); });
  panel.querySelector('[data-clear-search]').addEventListener('click', close);
  input.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  const q = new URLSearchParams(location.search).get('q');
  if (q) { input.value = q.slice(0,100); run(); }
})();
