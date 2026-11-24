// Shared header behaviour for every page: mobile menu and the Services dropdown.
// Mouse: opens on hover. Touch and keyboard: the Services button toggles it.
// Escape closes and returns focus; clicking outside closes; Arrow keys move through items.
export function initNav() {
  const doc = document;
  const header = doc.querySelector('.site-header');
  if (!header) return () => {};
  const toggle = header.querySelector('.nav-toggle');
  const nav = doc.getElementById('site-nav');
  const parent = header.querySelector('.nav-parent');
  const sub = doc.getElementById('sub-services');
  const group = parent && parent.closest('.has-sub');
  const mobile = window.matchMedia('(max-width: 980px)');
  const off = [];
  const on = (t, type, fn, o) => { t.addEventListener(type, fn, o); off.push(() => t.removeEventListener(type, fn, o)); };
  const items = () => Array.from(sub.querySelectorAll('a'));
  let closeTimer = 0;
  let openedByHover = false;

  const isOpen = () => parent.getAttribute('aria-expanded') === 'true';
  function setSub(open, focus) {
    clearTimeout(closeTimer);
    openedByHover = false;
    parent.setAttribute('aria-expanded', String(open));
    group.classList.toggle('is-open', open);
    if (open && focus === 'first') items()[0].focus();
    if (open && focus === 'last') items()[items().length - 1].focus();
  }
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header.classList.toggle('menu-open', open);
    if (!open) setSub(false);
  }

  if (parent && sub) {
    on(parent, 'click', () => setSub(openedByHover || !isOpen()));
    on(parent, 'keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSub(true, 'first'); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSub(true, 'last'); }
    });
    on(sub, 'keydown', (e) => {
      const list = items(), i = list.indexOf(doc.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
    });
    // hover only for a real mouse, so a tap does not open-then-close the menu
    on(group, 'pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || mobile.matches) return;
      clearTimeout(closeTimer);
      if (!isOpen()) {
        setSub(true);
        openedByHover = true;
      }
    });
    on(group, 'pointerleave', (e) => {
      if (e.pointerType === 'mouse' && !mobile.matches) { clearTimeout(closeTimer); closeTimer = setTimeout(() => setSub(false), 180); }
    });
    on(group, 'focusout', (e) => { if (!mobile.matches && !group.contains(e.relatedTarget)) setSub(false); });
  }

  on(doc, 'keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (parent && isOpen()) { setSub(false); parent.focus(); return; }
    if (nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  on(doc, 'pointerdown', (e) => {
    if (group && isOpen() && !group.contains(e.target)) setSub(false);
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });
  if (toggle) on(toggle, 'click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((a) => on(a, 'click', () => setMenu(false)));
  const onChange = () => { setMenu(false); setSub(false); };
  if (mobile.addEventListener) { mobile.addEventListener('change', onChange); off.push(() => mobile.removeEventListener('change', onChange)); }

  // a services subpage keeps its accordion open in the mobile menu
  if (parent && parent.dataset.active === 'true') group.classList.add('has-current');

  return () => { clearTimeout(closeTimer); off.forEach((f) => f()); };
}
