import { request } from './api.js';

export function initForm(form, send, { busy, success, failure }) {
  const button = form.querySelector('[type="submit"]');
  const status = form.querySelector('[role="status"]');
  const showStatus = (message, kind) => {
    status.textContent = message;
    status.dataset.kind = kind;
    status.hidden = false;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;

    const data = new FormData(form);
    for (const [key, value] of data) {
      if (typeof value === 'string') data.set(key, value.trim());
    }
    const blank = Array.from(form.elements).find((input) => input.required && !data.get(input.name));
    if (blank) {
      showStatus('Complete all required fields.', 'warn');
      blank.focus();
      return;
    }
    const resume = data.get('resume');
    if (resume && (resume.size > 2 * 1024 * 1024 || !/\.(pdf|docx?)$/i.test(resume.name))) {
      showStatus('Upload a PDF, DOC, or DOCX file up to 2 MB.', 'warn');
      form.elements.resume.focus();
      return;
    }

    button.disabled = true;
    let saved = false;
    showStatus(busy, 'info');
    try {
      const result = await send(data);
      form.reset();
      showStatus(result.notification_sent === false
        ? 'Your application was saved. Please contact info@clevanoo.com if you need to follow up.'
        : success, 'ok');
      saved = Boolean(resume);
    } catch (error) {
      saved = Boolean(resume && error.data?.resume_path);
      if (saved) form.reset();
      const errors = error.data?.details ?? error.data?.errors;
      const validation = errors && Object.values(errors).flat().find((message) => typeof message === 'string');
      showStatus(saved ? 'Your application was saved. The notification email could not be sent.' : validation || failure, saved ? 'ok' : 'warn');
    } finally {
      button.disabled = saved;
    }
  });
}

export function initEmailForm() {
  const form = document.querySelector('[data-email-type]');
  if (!form) return;
  const type = form.dataset.emailType;
  initForm(form, (data) => {
    data.set('type', type);
    return request('/website-email', { method: 'POST', body: new URLSearchParams(data) });
  }, {
    busy: 'Sending…',
    success: type === 'unsubscribe'
      ? 'We received your unsubscribe request.'
      : 'Thank you. Your message has been sent.',
    failure: 'Your request could not be sent. Please try again or email info@clevanoo.com.',
  });
}
