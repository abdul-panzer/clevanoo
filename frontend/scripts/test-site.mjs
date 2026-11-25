import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const build = new URL('../../build/', import.meta.url);
const readBuild = (file) => readFileSync(new URL(file, build), 'utf8');
const page = (file, options) => new JSDOM(readBuild(file), options);

test('the generated homepage sends consistent metadata, category links, and current copy', () => {
  const { window } = page('index.html');
  try {
    const { document } = window;
    const meta = (name) => document.querySelector('meta[' + name + ']').content;
    assert.equal(document.querySelector('link[rel="canonical"]').href, 'https://clevanoo.com/');
    assert.equal(meta('name="author"'), 'Clevanoo LLC');
    assert.match(document.title, /Technology & Professional Staffing/);
    assert.equal(meta('property="og:title"'), document.title);
    assert.equal(meta('name="twitter:title"'), document.title);
    assert.equal(meta('property="og:description"'), meta('name="description"'));
    assert.equal(meta('property="og:image"'), 'https://clevanoo.com/assets/clevanoo-social.jpg');
    assert.equal(meta('name="twitter:image"'), meta('property="og:image"'));
    assert.ok(readFileSync(new URL('assets/clevanoo-social.jpg', build)).length > 0);
    assert.equal(JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@type'], 'Corporation');
    assert.deepEqual([...document.querySelectorAll('a[href^="/jobs?category="]')].map((a) => a.getAttribute('href')), [
      '/jobs?category=accounting-finance', '/jobs?category=technology', '/jobs?category=telecommunications', '/jobs?category=healthcare',
    ]);
    assert.match(document.querySelector('#testimonials .sub').textContent, /professionals who have worked with Clevanoo/);
    assert.match(document.querySelector('#specialities').textContent, /Cybersecurity Talent Solutions/);
    assert.doesNotMatch(document.body.textContent, /100%|250\+|Average Time-To-Hire|Tele-communications|Browse Jobs Categories/);
    assert.match(document.querySelector('footer').textContent, /Clevanoo LLC\. All rights reserved\./);
  } finally {
    window.close();
  }
});

test('the deployed jobs bundle reads the category link and combines it with search', async () => {
  const { window } = page('jobs.html', {
    url: 'https://clevanoo.com/jobs?category=technology',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  try {
    const { document } = window;
    const requests = [];
    window.matchMedia = () => ({ matches: true });
    window.fetch = async (path) => {
      requests.push(new URL(path, window.location.href).searchParams);
      return { ok: true, json: async () => ({ total: 1, last_page: 1, data: [{
        id: 1, jobtitle: 'Snowflake Architect', facts: { Location: 'Remote' }, description: 'Build data pipelines.',
      }] }) };
    };
    const bundle = document.querySelector('script[src^="/frontend-assets/inner."]').getAttribute('src').slice(1);
    window.eval(readBuild(bundle));
    await new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
    const category = document.getElementById('job-category');
    assert.equal(category.value, 'technology');
    assert.equal(requests[0].get('category'), 'technology');
    const search = document.getElementById('job-search');
    search.value = 'Snowflake';
    search.dispatchEvent(new window.Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 300));
    assert.equal(requests.at(-1).get('category'), 'technology');
    assert.equal(requests.at(-1).get('search'), 'Snowflake');
    const applyUrl = new URL(document.querySelector('#job-list .btn-primary').href);
    assert.equal(applyUrl.pathname + applyUrl.hash, '/job/1#apply');
    assert.equal(applyUrl.searchParams.get('from'), '/jobs?search=Snowflake&category=technology');
    assert.match(document.querySelector('#job-list dl').textContent, /LocationRemote/);
    assert.doesNotMatch(document.querySelector('#job-list').textContent, /Bill Rate|DOE/);
    category.value = '';
    category.dispatchEvent(new window.Event('change'));
    assert.equal(new URL(window.location.href).searchParams.has('category'), false);
    assert.equal(requests.at(-1).has('category'), false);
    await new Promise((resolve) => setTimeout(resolve, 0));
  } finally {
    window.close();
  }
});

test('paging stores URL history, keeps keyboard focus, and recovers from an API error', async () => {
  const { window } = page('jobs.html', {
    url: 'https://clevanoo.com/jobs', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  try {
    const { document } = window;
    let fail = false;
    window.matchMedia = () => ({ matches: true });
    window.fetch = async (path) => {
      if (fail) throw new Error('Test network failure');
      const page = Number(new URL(path, window.location.href).searchParams.get('page'));
      return { ok: true, json: async () => ({ total: 48, last_page: 8, data: Array.from({ length: 6 }, (_, index) => ({
        id: (page - 1) * 6 + index + 1, jobtitle: 'Role '+page+'-'+index, description: 'Test position',
      })) }) };
    };
    const bundle = document.querySelector('script[src^="/frontend-assets/inner."]').getAttribute('src').slice(1);
    const settle = () => new Promise((resolve) => setTimeout(resolve, 10));
    window.eval(readBuild(bundle));
    await settle();
    const next = document.getElementById('job-next');
    const prev = document.getElementById('job-prev');
    const select = document.getElementById('job-page');
    const status = document.getElementById('job-status');
    const retry = document.getElementById('job-retry');
    assert.equal(prev.disabled, true);
    next.focus();
    next.click();
    await settle();
    assert.equal(window.location.search, '?page=2');
    assert.equal(document.activeElement, next);
    prev.focus();
    prev.click();
    await settle();
    assert.equal(document.activeElement, status);
    assert.equal(prev.disabled, true);
    const navigateHistory = async (direction) => {
      const moved = new Promise((resolve) => window.addEventListener('popstate', resolve, { once: true }));
      window.history[direction]();
      await moved;
      await settle();
    };
    await navigateHistory('back');
    assert.equal(select.value, '2');
    await navigateHistory('forward');
    assert.equal(select.value, '1');
    select.focus();
    select.value = '7';
    select.dispatchEvent(new window.Event('change'));
    await settle();
    assert.equal(document.activeElement, select);
    next.focus();
    next.click();
    await settle();
    assert.equal(next.disabled, true);
    assert.equal(document.activeElement, status);
    fail = true;
    prev.focus();
    prev.click();
    await settle();
    assert.equal(retry.hidden, false);
    assert.match(status.textContent, /could not be loaded/);
    fail = false;
    retry.focus();
    retry.click();
    await settle();
    assert.equal(document.getElementById('job-list').children.length, 6);
    assert.equal(document.activeElement, status);
  } finally {
    window.close();
  }
});

test('application and sitemap output stay ready for deployment', () => {
  const { window } = page('job.html');
  try {
    const { document } = window;
    assert.equal(document.querySelector('#apply [name="visa_type"]'), null);
    assert.match(document.getElementById('apply-resume').getAttribute('aria-describedby'), /resume-privacy/);
    assert.match(document.getElementById('resume-privacy').textContent, /review your application/);
    assert.match(readBuild('sitemap.xml'), /<loc>https:\/\/clevanoo\.com\/faq<\/loc>\s*<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    assert.match(readBuild('robots.txt'), /Sitemap: https:\/\/clevanoo\.com\/jobs-sitemap\.xml/);
    const unsubscribe = page('unsubscribe-email.html');
    try {
      assert.deepEqual([...unsubscribe.window.document.querySelectorAll('form input[required]')].map((input) => input.name), ['email']);
    } finally {
      unsubscribe.window.close();
    }
  } finally {
    window.close();
  }
});
