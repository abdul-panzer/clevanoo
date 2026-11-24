// The remaining sections of the site, unchanged content. Kept as markup so the copy stays exactly as supplied.
export const SECTIONS_HTML = `<!-- STATISTICS -->
<section class="stats-section" aria-label="Key figures">
  <div class="wrap">
    <dl class="stats">
      <div class="stat reveal"><dt>Current Openings</dt><dd><a href="/jobs">Browse jobs</a></dd></div>
      <div class="stat reveal"><dt>Retention Rate</dt><dd>100%</dd></div>
      <div class="stat reveal"><dt>Average Time-To-Hire</dt><dd>14 Days</dd></div>
      <div class="stat reveal"><dt>Enterprise Partners</dt><dd>250+</dd></div>
    </dl>
  </div>
</section>

<!-- ABOUT + STORY -->
<section class="section about" id="about">
  <div class="wrap about-grid">
    <div class="reveal">
      <h2 class="h-line"><span class="dash"></span>About Clevanoo LLC</h2>
      <p class="muted">At Clevanoo LLC, we are a results-driven staffing and recruitment firm dedicated to connecting top-tier technology talent with forward-thinking companies across industries.</p>
      <p class="muted">Our mission is simple yet powerful: deliver the right talent, at the right time, with the right fit.</p>
      <a class="btn btn-primary" href="/about">More about us <svg class="ico-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg></a>
    </div>
    <aside class="story panel-brand reveal">
      <h2 class="h-line"><span class="dash"></span>Our Story</h2>
      <p>Founded by a team of seasoned professionals and experienced staffing experts, Clevanoo was built on a dual-perspective approach valuing technical expertise just as much as the human element.</p>
      <p>We understand that successful hiring is about more than just filling roles; it’s about building lasting partnerships that fuel innovation and growth.</p>
    </aside>
  </div>
</section>

<!-- DIFFERENT -->
<section class="section tint" id="different">
  <div class="wrap narrow center reveal">
    <h2>What Makes Us Different</h2>
    <p>Clevanoo was created with a clear vision: to revolutionize recruitment through a unique blend of human insight and artificial intelligence. By combining deep industry experience with smart sourcing technology, we streamline the hiring process—helping businesses hire the right people faster, without compromising on quality.</p>
    <p>We go beyond the resume. Our process involves understanding your company culture, technical requirements, and long-term business goals to ensure every candidate not only fits the role but also thrives in your environment.</p>
  </div>
</section>

<!-- APPROACH -->
<section class="section approach" id="approach">
  <div class="wrap">
    <h2 class="approach-title">Our Approach</h2>
    <div class="grid-4">
      <article class="approach-card">
        <div class="card-img"><img src="/assets/images/qt1.webp" alt="Technology professionals working in an open office" width="462" height="330" loading="lazy" decoding="async"></div>
        <h3>Personalized Staffing Solutions</h3>
        <p>Tailored to your specific technical needs and growth plans.</p>
        <a class="link-more" href="#services">Read More</a>
      </article>
      <article class="approach-card">
        <div class="card-img"><img src="/assets/images/qt2.webp" alt="Two colleagues reviewing work at a desk" width="462" height="330" loading="lazy" decoding="async"></div>
        <h3>Access to Top Tech Talent</h3>
        <p>From software engineers and cloud architects to data scientists and cybersecurity experts.</p>
        <a class="link-more" href="#specialities">Read More</a>
      </article>
      <article class="approach-card">
        <div class="card-img"><img src="/assets/images/qt3.webp" alt="Colleagues reviewing work on a laptop" width="462" height="330" loading="lazy" decoding="async"></div>
        <h3>Fast, Efficient Recruitment</h3>
        <p>Leveraging AI-driven sourcing and an extensive professional network.</p>
        <a class="link-more" href="#services">Read More</a>
      </article>
      <article class="approach-card">
        <div class="card-img"><img src="/assets/images/qt4.webp" alt="Colleagues smiling around a meeting table" width="462" height="330" loading="lazy" decoding="async"></div>
        <h3>Relationship-Focused Partnerships</h3>
        <p>We value relationships over transactions, ensuring trust, transparency, and long-term success.</p>
        <a class="link-more" href="#contact">Read More</a>
      </article>
    </div>
  </div>
</section>

<!-- MISSION -->
<section class="mission" id="mission">
  <div class="wrap narrow center reveal">
    <h2>Our Mission</h2>
    <p class="mission-text">To empower businesses with exceptional staffing solutions that combine speed, precision, and cultural alignment-helping companies innovate, scale, and succeed in today’s competitive digital landscape.</p>
  </div>
</section>

<!-- SERVICES -->
<section class="section soft" id="services">
  <div class="wrap">
    <h2 class="center reveal">Our Services</h2>
    <div class="grid-2">
      <article class="service service-feature panel-brand reveal">
        <span class="service-no">01</span>
        <div><h3>Staffing &amp; Talent Solutions</h3>
        <p>We provide contract, contract-to-hire, and direct placement services. Access pre-vetted candidates across software development, cloud, cybersecurity, DevOps, data science, and more.</p></div>
      </article>
      <article class="service reveal">
        <span class="service-no">02</span>
        <div><h3>AI-Powered Talent Matching</h3>
        <p>Our intelligent platform matches roles with precision, reducing time-to-hire and increasing retention. Enhanced candidate profiling ensures technical and cultural fit.</p></div>
      </article>
      <article class="service reveal">
        <span class="service-no">03</span>
        <div><h3>Workforce Consulting</h3>
        <p>Strategic staffing guidance to help scale your team effectively and efficiently. Market insights, salary benchmarks, and hiring strategies tailored to your business.</p></div>
      </article>
      <article class="service reveal">
        <span class="service-no">04</span>
        <div><h3>Support for Candidates</h3>
        <p>Resume reviews, interview prep, and coaching for tech professionals at every level. Exclusive access to top employers and exciting projects.</p></div>
      </article>
    </div>
  </div>
</section>

<!-- CATEGORIES -->
<section class="section gray" id="industries">
  <div class="wrap">
    <div class="center reveal">
      <h2>Browse Jobs Categories</h2>
      <p class="sub">Find your dream jobs. Carefully crafted after analyzing the needs of different industries.</p>
    </div>
    <div class="grid-4">
      <article class="card cat reveal">
        <span class="cat-bars" aria-hidden="true"><i></i><i></i></span>
        <span class="cat-ico"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="4" width="15" height="22" rx="2"/><path d="M9 9h7M9 14h2M14 14h2M9 18h2M14 18h2"/><circle cx="23" cy="22" r="5.5"/><path d="M23 19v6M21.2 23.6c.5.8 3.6.9 3.6-.6s-3.6-.8-3.6-2.2 2.8-1.4 3.5-.5"/></svg></span>
        <h3>Accounting / Finance</h3>
        <p>Find your dream job in accounting and finance sector with top companies.</p>
        <a class="btn btn-primary btn-block" href="/jobs">More Jobs <svg class="ico-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg></a>
      </article>
      <article class="card cat cat-feature panel-brand reveal">
        <span class="cat-bars" aria-hidden="true"><i></i><i></i></span>
        <span class="cat-ico"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="10" y="10" width="12" height="12" rx="2"/><path d="M14 4v6M18 4v6M14 22v6M18 22v6M4 14h6M4 18h6M22 14h6M22 18h6M14 19l2-6 2 6M14.7 17h2.6"/></svg></span>
        <h3>Technology</h3>
        <p>Explore exciting opportunities in the ever-evolving tech industry.</p>
        <a class="btn btn-light btn-block" href="/jobs">More Jobs <svg class="ico-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg></a>
      </article>
      <article class="card cat reveal">
        <span class="cat-bars" aria-hidden="true"><i></i><i></i></span>
        <span class="cat-ico"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="16" rx="2"/><path d="M11 27h10M16 22v5"/><circle cx="16" cy="12" r="2.5"/><path d="M11.5 19c.6-2.4 2.3-3.5 4.5-3.5s3.9 1.1 4.5 3.5"/></svg></span>
        <h3>Tele-communications</h3>
        <p>Connect with leading telecom companies and advance your career.</p>
        <a class="btn btn-primary btn-block" href="/jobs">More Jobs <svg class="ico-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg></a>
      </article>
      <article class="card cat reveal">
        <span class="cat-bars" aria-hidden="true"><i></i><i></i></span>
        <span class="cat-ico"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 26S5 19.5 5 12a6 6 0 0 1 11-3.3A6 6 0 0 1 27 12c0 7.5-11 14-11 14z"/><path d="M8 15h4l2-3.5 3 6.5 2-3h5"/></svg></span>
        <h3>Healthcare</h3>
        <p>Make a difference in healthcare with rewarding career opportunities.</p>
        <a class="btn btn-primary btn-block" href="/jobs">More Jobs <svg class="ico-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg></a>
      </article>
    </div>
  </div>
</section>

<!-- AI & CYBERSECURITY -->
<section class="section" id="specialities">
  <div class="wrap">
    <div class="center reveal">
      <h2>AI &amp; Cybersecurity Staffing</h2>
      <p class="sub">Elite talent solutions for artificial intelligence and cybersecurity professionals</p>
    </div>
    <div class="grid-2 spec-grid">
      <article class="spec spec-ai panel-brand reveal">
        <div class="spec-visual" aria-hidden="true">
          <svg viewBox="0 0 120 120" class="rotor" data-rotate="14">
            <g class="v-lines"><path d="M60 60 24 34M60 60l38-22M60 60 30 92M60 60l34 30M24 34l74 4M30 92l64-2M24 34l6 58M98 38l-4 52"/></g>
            <g class="v-nodes"><circle cx="24" cy="34" r="7"/><circle cx="98" cy="38" r="6"/><circle cx="30" cy="92" r="6"/><circle cx="94" cy="90" r="7"/></g>
            <circle class="v-hub" cx="60" cy="60" r="15"/><text x="60" y="65" text-anchor="middle" class="v-text">AI</text>
          </svg>
        </div>
        <p class="spec-eyebrow"><span class="dash"></span>AI Staffing Services</p>
        <p class="spec-kicker">Artificial Intelligence Talent Solutions</p>
        <h3>Drive Innovation with Top AI Talent</h3>
        <p class="spec-lede">Connect with elite AI professionals who transform your business through cutting-edge machine learning, deep learning, and automation technologies.</p>
        <h4>Core Expertise Areas</h4>
        <ul class="chips"><li>Machine Learning</li><li>Data Science</li><li>NLP</li><li>Computer Vision</li><li>Deep Learning</li><li>AI Research</li><li>Automation</li><li>Model Deployment</li></ul>
        <h4 class="why">Why Partner With Us</h4>
        <ul class="checks"><li>Pre-vetted AI experts</li><li>Rapid deployment</li><li>Flexible hiring models</li><li>Startup to enterprise scale</li><li>Cutting-edge tech focus</li></ul>
        <a class="btn btn-light btn-block" href="/contact">Hire AI Talent Today</a>
      </article>
      <article class="spec spec-sec reveal">
        <div class="spec-visual" aria-hidden="true">
          <svg viewBox="0 0 120 120" class="rotor" data-rotate="-10">
            <path class="v-shield" d="M60 14 96 28v28c0 24-15 40-36 50-21-10-36-26-36-50V28z"/>
            <path class="v-shield-in" d="M60 26 86 36v20c0 17-10 29-26 37-16-8-26-20-26-37V36z"/>
            <rect class="v-lock" x="49" y="56" width="22" height="17" rx="3"/><path class="v-lock-arc" d="M53 56v-5a7 7 0 0 1 14 0v5"/>
          </svg>
        </div>
        <p class="spec-eyebrow"><span class="dash"></span>Cybersecurity Staffing</p>
        <p class="spec-kicker">Artificial Intelligence Talent Solutions</p>
        <h3>Protect Your Business with Security Experts</h3>
        <p class="spec-lede">Build your security fortress with certified cybersecurity professionals who defend against evolving threats and ensure compliance.</p>
        <h4>Security Specializations</h4>
        <ul class="chips"><li>Network Security</li><li>Cloud Security</li><li>Threat Detection</li><li>Incident Response</li><li>Risk Management</li><li>Compliance</li><li>IAM</li><li>Security Architecture</li></ul>
        <h4 class="why">Why Choose Our Experts</h4>
        <ul class="checks"><li>Certified professionals</li><li>Urgent response capability</li><li>Compliance expertise</li><li>Proactive threat prevention</li><li>24/7 security support</li></ul>
        <a class="btn btn-primary btn-block" href="/contact">Hire Security Experts Now</a>
      </article>
    </div>
  </div>
</section>

<!-- LATEST JOBS -->
<section class="section soft" id="jobs">
  <div class="wrap">
    <h2 class="center reveal">Our Latest Jobs</h2>
    <div class="grid-3 job-grid" id="latest-jobs" aria-live="polite">Loading jobs…</div>
    <div class="mosaic">
      <figure class="tile reveal"><img src="/assets/images/2.webp" alt="" loading="lazy"></figure>
      <figure class="tile reveal"><img src="/assets/images/1.webp" alt="" loading="lazy"></figure>
      <figure class="tile reveal"><img src="/assets/images/4.webp" alt="" loading="lazy"></figure>
      <figure class="tile reveal"><img src="/assets/team.jpg" alt="Developers working together at their monitors" loading="lazy"></figure>
      <figure class="tile reveal"><img src="/assets/images/7.webp" alt="" loading="lazy"></figure>
      <figure class="tile reveal"><img src="/assets/images/3.webp" alt="" width="2169" height="525" loading="lazy"></figure>
      <figure class="tile reveal"><img src="/assets/images/5.webp" alt="" width="462" height="330" loading="lazy"></figure>
      <figure class="tile reveal"><img src="/assets/images/10.webp" alt="" loading="lazy"></figure>


      <div class="mosaic-stat reveal">
        <h3>Find your next role</h3>
        <p class="muted">Explore current openings and apply directly.</p>
        <a class="btn btn-primary btn-block" href="/jobs">Browse all jobs <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>

<!-- CAREER TIPS -->
<section class="section" id="tips">
  <div class="wrap">
    <div class="head-with-eyebrow reveal">
      <p class="side-eyebrow"><span class="dash"></span>Find Best Jobs</p>
      <div class="center">
        <h2>Quick Career Tips</h2>
        <p class="sub">Practical, high-yield guidance from our senior technical recruiting partners.</p>
      </div>
    </div>
    <div class="grid-4">
      <article class="tip reveal"><img src="/assets/images/qt1.webp" alt="" width="462" height="330" loading="lazy"><h3>Networking Strategies</h3><p>Start with former colleagues and people in the roles you’re interested in. Ask a specific question about their work and follow up after the conversation.</p></article>
      <article class="tip reveal"><img src="/assets/images/qt2.webp" alt="" width="462" height="330" loading="lazy"><h3>Resume Optimization</h3><p>Match the top third of your résumé to the role. Use specific examples to show what you did and how it helped your team or customers.</p></article>
      <article class="tip reveal"><img src="/assets/images/qt3.webp" alt="" width="462" height="330" loading="lazy"><h3>Interview Preparation</h3><p>Prepare a few examples of projects, tradeoffs, and mistakes. Explain the situation, what you did, and the outcome.</p></article>
      <article class="tip reveal"><img src="/assets/images/qt4.webp" alt="" width="462" height="330" loading="lazy"><h3>Skill Development</h3><p>Compare job descriptions for the roles you want. Pick a skill that comes up often and practice it on a small project you can explain in an interview.</p></article>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="section gray" id="testimonials">
  <div class="wrap">
    <div class="head-with-eyebrow reveal">
      <p class="side-eyebrow"><span class="dash"></span>Testimonials</p>
      <div class="center">
        <h2>Happy Candidates Say About Us</h2>
        <p class="sub">Find your dream jobs. Carefully crafted after analyzing the needs of different industries.</p>
      </div>
    </div>
    <div class="grid-3">
      <figure class="quote reveal"><span class="q-mark" aria-hidden="true">“</span><blockquote>Great place and people to work with!! My experience has always been great!</blockquote><figcaption><span class="avatar" aria-hidden="true">G</span><span><strong>G. P.</strong><small>SDET</small></span></figcaption></figure>
      <figure class="quote quote-feature panel-brand reveal"><span class="q-mark" aria-hidden="true">“</span><blockquote>Working with Clevanoo has been a positive experience. The team is knowledgeable, supportive, and quick in responding to queries. Their process is well organized and efficient.</blockquote><figcaption><span class="avatar" aria-hidden="true">S</span><span><strong>S. K.</strong><small>TA</small></span></figcaption></figure>
      <figure class="quote reveal"><span class="q-mark" aria-hidden="true">“</span><blockquote>They were always quick to contact me about open positions that were relevant to my skills, didn’t waste my time with irrelevant positions and found a good one that I accepted. Thanks!</blockquote><figcaption><span class="avatar" aria-hidden="true">R</span><span><strong>R. D. E.</strong><small>SQL</small></span></figcaption></figure>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta" id="contact">
  <div class="wrap narrow center reveal">
    <h2 class="cta-title">Let’s Build the Future, Together</h2>
    <p>Your team deserves the best — and so does your business. Partner with Clevanoo and experience the difference of a people-first, performance-driven staffing firm.</p>
    <a class="btn btn-primary" href="/contact">Talk to a recruiter</a>
  </div>
</section>`;
