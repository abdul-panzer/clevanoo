const base = document.querySelector('meta[name="clevanoo-api"]').content.replace(/\/+$/, '');

export async function request(path, options = {}) {
  const response = await fetch(base + path, {
    ...options,
    headers: { Accept: 'application/json' },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || typeof data !== 'object') {
    throw Object.assign(new Error('Request failed'), { status: response.status, data });
  }
  return data;
}
