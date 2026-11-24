import { request } from './api.js';
import { initForm } from './forms.js';

const pageSize = 6;

function jobUrl(job) {
  return '/job/' + encodeURIComponent(job.id);
}

function showFacts(list, job) {
  list.replaceChildren();
  for (const [label, value] of [['City', job.city], ['State', job.state], ['Duration', job.duration], ['Bill Rate', 'DOE']]) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const detail = document.createElement('dd');
    term.textContent = label;
    detail.textContent = value || 'See job details';
    row.append(term, detail);
    list.append(row);
  }
}

function jobCard(template, job) {
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelector('h3').textContent = job.jobtitle;
  const description = job.description?.trim() || '';
  card.querySelector('.job-desc').textContent = description.length > 180 ? description.slice(0, 180) + '…' : description;
  showFacts(card.querySelector('dl'), job);
  const detail = card.querySelector('.btn-outline');
  const apply = card.querySelector('.btn-primary');
  detail.href = jobUrl(job);
  detail.setAttribute('aria-label', 'Read more about ' + job.jobtitle);
  apply.href = jobUrl(job) + '#apply';
  apply.setAttribute('aria-label', 'Apply for ' + job.jobtitle);
  return card;
}

function initJobList(list) {
  const template = document.getElementById('job-card');
  const search = document.getElementById('job-search');
  const prev = document.getElementById('job-prev');
  const next = document.getElementById('job-next');
  const select = document.getElementById('job-page');
  const status = document.getElementById('job-status');
  const retry = document.getElementById('job-retry');
  const pager = document.getElementById('job-pager');
  let page = 1;
  let requestedPage = 1;
  let timer;
  let controller;

  function startLoading() {
    controller?.abort();
    pager.hidden = true;
    retry.hidden = true;
    list.replaceChildren();
    list.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading jobs…';
  }

  async function load(targetPage) {
    requestedPage = targetPage;
    startLoading();
    const current = new AbortController();
    controller = current;
    const term = search.value.trim();
    const params = new URLSearchParams({ page: targetPage, per_page: pageSize });
    if (term) params.set('search', term);
    try {
      const payload = await request('/all-jobs?' + params, { signal: current.signal });
      if (current.signal.aborted) return;
      if (!Array.isArray(payload.data) || !Number.isInteger(payload.total) ||
          !Number.isInteger(payload.last_page) || payload.last_page < 1) {
        throw new Error('Unexpected job data');
      }
      if (targetPage > payload.last_page) {
        await load(payload.last_page);
        return;
      }
      page = targetPage;
      const { total, last_page: pages } = payload;
      list.replaceChildren(...payload.data.map((job) => jobCard(template, job)));
      status.textContent = total
        ? (total === 1 ? '1 job found' : total + ' jobs found')
        : (term ? 'No jobs match your search.' : 'There are no open roles right now.');
      const start = Math.max(1, Math.min(page - 3, pages - 7));
      const options = Array.from({ length: Math.min(pages, 8) }, (_, index) => {
        const number = start + index;
        return new Option('Page ' + number, number, false, number === page);
      });
      select.replaceChildren(...options);
      prev.disabled = page <= 1;
      next.disabled = page >= pages;
      pager.hidden = pages <= 1 || total === 0;
    } catch {
      if (current.signal.aborted) return;
      status.textContent = 'Current openings could not be loaded.';
      retry.hidden = false;
    } finally {
      if (controller === current && !current.signal.aborted) list.removeAttribute('aria-busy');
    }
  }

  search.addEventListener('input', () => {
    clearTimeout(timer);
    startLoading();
    timer = setTimeout(() => load(1), 250);
  });
  prev.addEventListener('click', () => load(page - 1));
  next.addEventListener('click', () => load(page + 1));
  select.addEventListener('change', () => load(Number(select.value)));
  retry.addEventListener('click', () => load(requestedPage));
  load(1);
}

async function initJobDetail(detail) {
  const status = document.getElementById('job-status');
  const id = location.pathname.match(/^\/job\/([1-9]\d*)\/?$/)?.[1];
  if (!id) {
    status.textContent = 'This job link is invalid.';
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
  document.getElementById('job-description').textContent = job.description || 'Contact Clevanoo for more information about this role.';
  showFacts(document.getElementById('job-facts'), job);
  status.hidden = true;
  detail.hidden = false;

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
  try {
    const payload = await request('/all-jobs?per_page=3');
    if (!Array.isArray(payload.data)) throw new Error('Unexpected job data');
    const template = document.getElementById('job-card');
    list.replaceChildren(...payload.data.map((job) => jobCard(template, job)));
    if (!payload.data.length) list.textContent = 'There are no open roles right now.';
  } catch {
    list.textContent = 'Current openings could not be loaded.';
  } finally {
    window.dispatchEvent(new Event('resize'));
  }
}
