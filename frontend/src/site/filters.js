// Filter chips (Zendesk capabilities, Zendesk case studies). Items carry data-cat.
export function initFilters() {
  document.querySelectorAll('.chip-row').forEach((row) => {
    const section = row.closest('section');
    const list = section && section.querySelector('[data-filter-list]');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('[data-cat]'));
    const status = section.querySelector('[role="status"]');
    row.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]'); if (!btn) return;
      row.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const f = btn.dataset.filter;
      let n = 0;
      items.forEach((it) => { const show = f === 'all' || it.dataset.cat === f; it.hidden = !show; if (show) n++; });
      if (status) status.textContent = `Showing ${n} of ${items.length}`;
      window.dispatchEvent(new Event('resize'));
    });
  });
}
