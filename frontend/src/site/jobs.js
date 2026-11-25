import { request } from './api.js';
import { initForm } from './forms.js';

const pageSize = 6;

function jobUrl(job, from) {
  const url = '/job/' + encodeURIComponent(job.id);
  return from && from !== '/jobs' ? url + '?from=' + encodeURIComponent(from) : url;
}

function showFacts(list, job) {
  list.replaceChildren();
  const city = job.city?.trim();
  const state = job.state?.trim();
  const location = city?.toLowerCase() === state?.toLowerCase() ? city : [city, state].filter(Boolean).join(', ');
  for (const [label, value] of Object.entries(job.facts || { Location: location, Duration: job.duration })) {
    if (!value) continue;
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const detail = document.createElement('dd');
    term.textContent = label;
    detail.textContent = value;
    row.append(term, detail);
    list.append(row);
  }
}

function jobCard(template, job, from) {
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelector('h3').textContent = job.jobtitle;
  const description = job.description?.trim() || '';
  card.querySelector('.job-desc').textContent = description.length > 180 ? description.slice(0, 180) + '…' : description;
  showFacts(card.querySelector('dl'), job);
  const detail = card.querySelector('.btn-outline');
  const apply = card.querySelector('.btn-primary');
  detail.href = jobUrl(job, from);
  detail.setAttribute('aria-label', 'Read more about ' + job.jobtitle);
  apply.href = jobUrl(job, from) + '#apply';
  apply.setAttribute('aria-label', 'Apply for ' + job.jobtitle);
  return card;
}

function initJobList(list) {
  const template = document.getElementById('job-card');
  const search = document.getElementById('job-search');
  const category = document.getElementById('job-category');
  const prev = document.getElementById('job-prev');
  const next = document.getElementById('job-next');
  const select = document.getElementById('job-page');
  const status = document.getElementById('job-status');
  const retry = document.getElementById('job-retry');
  const pager = document.getElementById('job-pager');
  document.getElementById('job-server-pager')?.setAttribute('hidden', '');
  let page = 1;
  let requestedPage = 1;
  let timer;
  let controller;
  const readUrl = () => {
    const params = new URLSearchParams(location.search);
    search.value = (params.get('search') || '').trim().slice(0, 255);
    category.value = params.get('category') || '';
    if (category.selectedIndex < 0) category.selectedIndex = 0;
    const number = params.get('page') || '1';
    return /^[1-9]\d*$/.test(number) ? Math.min(8, Number(number)) : 1;
  };

  function listingUrl(targetPage) {
    const params = new URLSearchParams();
    if (search.value.trim()) params.set('search', search.value.trim());
    if (category.value) params.set('category', category.value);
    if (targetPage > 1) params.set('page', targetPage);
    const query = params.toString();
    return '/jobs' + (query ? '?' + query : '');
  }

  function writeUrl(targetPage, mode) {
    const url = listingUrl(targetPage);
    if (location.pathname + location.search !== url) history[mode + 'State'](null, '', url);
    return url;
  }

  function moveFocusIfUnavailable(origin) {
    if (origin && document.activeElement === origin && (origin.disabled || origin.hidden || origin.closest('[hidden]'))) {
      status.focus();
    }
  }

  async function load(targetPage, mode = 'replace', origin = null) {
    requestedPage = targetPage;
    const from = writeUrl(targetPage, mode);
    controller?.abort();
    if (origin !== retry) retry.hidden = true;
    list.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading jobs…';
    const current = new AbortController();
    controller = current;
    const term = search.value.trim();
    const params = new URLSearchParams({ page: targetPage, per_page: pageSize });
    if (term) params.set('search', term);
    if (category.value) params.set('category', category.value);
    try {
      const payload = await request('/all-jobs?' + params, { signal: current.signal });
      if (current.signal.aborted) return;
      if (!Array.isArray(payload.data) || !Number.isInteger(payload.total) ||
          !Number.isInteger(payload.last_page) || payload.last_page < 1) {
        throw new Error('Unexpected job data');
      }
      if (targetPage > payload.last_page) {
        await load(payload.last_page, 'replace', origin);
        return;
      }
      page = targetPage;
      const { total, last_page: pages } = payload;
      list.replaceChildren(...payload.data.map((job) => jobCard(template, job, from)));
      status.textContent = total
        ? (total === 1 ? '1 job found' : total + ' jobs found')
        : (term || category.value ? 'No jobs match these filters.' : 'There are no open roles right now.');
      const options = Array.from({ length: Math.min(pages, 8) }, (_, index) => {
        const number = index + 1;
        return new Option('Page ' + number, number, false, number === page);
      });
      select.replaceChildren(...options);
      if (document.activeElement === origin &&
          ((origin === prev && page === 1) || (origin === next && page === pages) || (pager.contains(origin) && pages <= 1) || origin === retry)) {
        status.focus();
      }
      prev.disabled = page <= 1;
      next.disabled = page >= pages;
      pager.hidden = pages <= 1 || total === 0;
      retry.hidden = true;
    } catch {
      if (current.signal.aborted) return;
      if (origin && document.activeElement === origin && pager.contains(origin)) status.focus();
      pager.hidden = true;
      list.replaceChildren();
      status.textContent = 'Current openings could not be loaded.';
      retry.hidden = false;
    } finally {
      moveFocusIfUnavailable(origin);
      if (controller === current && !current.signal.aborted) list.removeAttribute('aria-busy');
    }
  }

  search.addEventListener('input', () => {
    clearTimeout(timer);
    controller?.abort();
    timer = setTimeout(() => load(1, 'push', search), 250);
  });
  category.addEventListener('change', () => {
    clearTimeout(timer);
    load(1, 'push', category);
  });
  document.getElementById('job-filters').addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimeout(timer);
    load(1, 'push', document.activeElement);
  });
  prev.addEventListener('click', () => { clearTimeout(timer); load(page - 1, 'push', prev); });
  next.addEventListener('click', () => { clearTimeout(timer); load(page + 1, 'push', next); });
  select.addEventListener('change', () => { clearTimeout(timer); load(Number(select.value), 'push', select); });
  retry.addEventListener('click', () => load(requestedPage, 'replace', retry));
  const restore = () => { clearTimeout(timer); load(readUrl()); };
  addEventListener('popstate', restore);
  addEventListener('pageshow', (event) => { if (event.persisted) restore(); });
  restore();
}

async function initJobDetail(detail) {
  const status = document.getElementById('job-status');
  const id = location.pathname.match(/^\/job\/([1-9]\d*)\/?$/)?.[1];
  if (!id) {
    status.textContent = 'This job link is invalid.';
    return;
  }
  if (detail.dataset.jobId === id) {
    initJobApplication(id);
    return;
  }
  let job;
  try {
    job = await request('/jobs/' + id);
    if (typeof job.jobtitle !== 'string' || !job.jobtitle.trim()) throw new Error('Unexpected job data');
  } catch (error) {
    status.textContent = error.status === 404
      ? 'This role is no longer available.'
      : 'The job could not be loaded. Please refresh to try again.';
    return;
  }
  document.title = job.jobtitle + ' – Clevanoo LLC';
  document.getElementById('job-title').textContent = job.jobtitle;
  const description = document.getElementById('job-description');
  for (const [heading, value] of Object.entries(job.sections || { Overview: job.description })) {
    if (!value) continue;
    if (heading !== 'Overview') {
      const title = document.createElement('h3');
      title.className = 'h-card';
      title.textContent = heading;
      description.append(title);
    }
    const text = document.createElement('p');
    text.textContent = value;
    description.append(text);
  }
  if (!description.children.length) {
    const text = document.createElement('p');
    text.textContent = 'Contact Clevanoo for more information about this role.';
    description.append(text);
  }
  showFacts(document.getElementById('job-facts'), job);
  status.hidden = true;
  detail.hidden = false;

  initJobApplication(id);
}

function initJobApplication(id) {
  const form = document.getElementById('apply');
  initForm(form, (data) => {
    data.set('job_id', id);
    return request('/save-candidates', { method: 'POST', body: data });
  }, {
    busy: 'Submitting your application…',
    success: 'Thank you. Your application has been submitted.',
    failure: 'Your application could not be submitted. Please try again or contact info@clevanoo.com.',
  });
  if (location.hash === '#apply') form.scrollIntoView();
}

export function initJobs() {
  const list = document.getElementById('job-list');
  const detail = document.getElementById('job-detail');
  if (list) initJobList(list);
  if (detail) initJobDetail(detail);
}

export async function initLatestJobs(list) {
  if (!list) return;
  list.textContent = 'Loading jobs…';
  try {
    const payload = await request('/all-jobs');
    if (!Array.isArray(payload.data)) throw new Error('Unexpected job data');
    const template = document.getElementById('job-card');
    list.replaceChildren(...payload.data.slice(0, 3).map((job) => jobCard(template, job)));
    if (!payload.data.length) list.textContent = 'There are no open roles right now.';
  } catch {
    list.textContent = 'Current openings could not be loaded.';
  } finally {
    window.dispatchEvent(new Event('resize'));
  }
}
