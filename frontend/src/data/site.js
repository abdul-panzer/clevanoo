export const SITE_ORIGIN = 'https://clevanoo.com';
export const SHARE_IMAGE = SITE_ORIGIN + '/assets/clevanoo-social.jpg';

export const CORPORATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Corporation',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: 'Clevanoo LLC',
  alternateName: 'Clevanoo',
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/assets/clevanoo-logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-949-570-4008',
    contactType: 'sales',
    areaServed: 'US',
    availableLanguage: 'en',
  },
  sameAs: [
    'https://www.facebook.com/clevanoollc',
    'https://www.instagram.com/clevanoollc/',
    'https://www.linkedin.com/company/clevanoo-llc',
  ],
};

export const PAGES = {
  home: { path: '/', file: 'index.html', title: 'Clevanoo – Technology & Professional Staffing', description: 'Hire talent or find your next role in technology, engineering, manufacturing, accounting and finance, or healthcare with Clevanoo.' },
  about: { path: '/about', file: 'about.html', title: 'About – Clevanoo LLC', description: 'Meet Clevanoo and learn how we approach IT staffing and recruitment.' },
  services: { path: '/services', file: 'services.html', title: 'Our Services – Clevanoo LLC', group: 'services', description: 'Explore direct hire, contract staffing, talent matching, and workforce consulting.' },
  zendesk: { path: '/zendesk', file: 'zendesk.html', title: 'Zendesk – Clevanoo LLC', group: 'services', description: 'Enterprise Zendesk implementation, consulting, integrations, and managed services.' },
  'case-studies': { path: '/case-studies', file: 'zendesk-case-studies.html', title: 'Zendesk Case Studies – Clevanoo LLC', group: 'services', description: 'Explore 28 Zendesk projects across automation, analytics, integrations, and customer support.' },
  industries: { path: '/industries', file: 'industries.html', title: 'Industries – Clevanoo LLC', description: 'Explore Clevanoo’s staffing solutions across technology, healthcare, finance, and other industries.' },
  specialities: { path: '/speciality', file: 'specialities.html', title: 'Specialities – Clevanoo LLC', description: 'Find technical talent across AI, data, cloud, cybersecurity, and other specialities.' },
  jobs: { path: '/jobs', file: 'jobs.html', title: 'Jobs – Clevanoo LLC', description: 'Search current openings, read job descriptions, and apply to Clevanoo opportunities.' },
  contact: { path: '/contact', file: 'contact.html', title: 'Contact – Clevanoo LLC', description: 'Get in touch with Clevanoo about hiring, consulting, or your next role.' },
  faq: { path: '/faq', file: 'faq.html', title: 'Frequently Asked Questions – Clevanoo LLC', description: 'Find answers about staffing, applying for a job, Zendesk consulting, and email preferences.' },
  'unsubscribe-email': { path: '/unsubscribe-email', file: 'unsubscribe-email.html', title: 'Unsubscribe – Clevanoo LLC', noindex: true },
  job: { file: 'job.html', title: 'Job Details – Clevanoo LLC', noindex: true },
  'job-upload': { path: '/jobUpload', file: 'job-upload.html', title: 'Jobs List – Clevanoo LLC', noindex: true },
  'not-found': { file: '404.html', title: 'Page Not Found – Clevanoo LLC', noindex: true },
};
