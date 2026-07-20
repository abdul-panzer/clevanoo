import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CaseStudiesPage.css";

const sharedEnterpriseStudy = {
  challenge:
    "Improve operational efficiency, reduce manual effort, and provide a better customer and agent experience.",
  solution:
    "Designed and implemented an enterprise-grade Zendesk solution using automation, integrations, AI, APIs and custom workflows tailored to business requirements.",
  technologies:
    "Zendesk, APIs, Workato, AI, JavaScript, REST APIs, Explore, integrations.",
  impact:
    "Reduced manual work, improved SLA compliance, increased agent productivity and improved customer satisfaction.",
};

const appImpactStudy = {
  challenge:
    "Agents and administrators relied on multiple disconnected systems, repetitive manual tasks and fragmented information.",
  technologies:
    "Zendesk Apps Framework (ZAF), JavaScript, HTML/CSS, REST APIs, AI services, Workato, enterprise integrations.",
  impact:
    "Reduced context switching, improved productivity, faster resolution times, higher first-contact resolution and scalable enterprise support operations.",
};

const caseStudies = [
  {
    id: 1,
    category: "AI & Routing",
    title: "AI-Powered Email Classification & Intelligent Routing",
    icon: "fa-solid fa-brain",
    ...sharedEnterpriseStudy,
  },
  {
    id: 2,
    category: "Omnichannel",
    title: "Skill-Based Omnichannel Routing",
    icon: "fa-solid fa-route",
    ...sharedEnterpriseStudy,
  },
  {
    id: 3,
    category: "Automation",
    title: "Automated Pending Ticket Follow-up Workflow",
    icon: "fa-solid fa-clock-rotate-left",
    ...sharedEnterpriseStudy,
  },
  {
    id: 4,
    category: "Analytics",
    title: "Executive Zendesk Explore Dashboards",
    icon: "fa-solid fa-chart-line",
    ...sharedEnterpriseStudy,
  },
  {
    id: 5,
    category: "Apps",
    title: "HTML Signature Management App",
    icon: "fa-solid fa-signature",
    ...sharedEnterpriseStudy,
  },
  {
    id: 6,
    category: "Integrations",
    title: "Sunshine Conversations & Maven Integration",
    icon: "fa-solid fa-comments",
    ...sharedEnterpriseStudy,
  },
  {
    id: 7,
    category: "Automation",
    title: "Intelligent 'Thank You' Ticket Resolution",
    icon: "fa-solid fa-circle-check",
    ...sharedEnterpriseStudy,
  },
  {
    id: 8,
    category: "Integrations",
    title: "Salesforce CRM Integration",
    icon: "fa-brands fa-salesforce",
    ...sharedEnterpriseStudy,
  },
  {
    id: 9,
    category: "Integrations",
    title: "Jira Engineering Integration",
    icon: "fa-brands fa-jira",
    ...sharedEnterpriseStudy,
  },
  {
    id: 10,
    category: "Quality",
    title: "Maestro QA Integration",
    icon: "fa-solid fa-shield-halved",
    ...sharedEnterpriseStudy,
  },
  {
    id: 11,
    category: "Experience",
    title: "Qualtrics Integration",
    icon: "fa-solid fa-square-poll-vertical",
    ...sharedEnterpriseStudy,
  },
  {
    id: 12,
    category: "Analytics",
    title: "Enterprise Reporting using Databricks",
    icon: "fa-solid fa-database",
    ...sharedEnterpriseStudy,
  },
  {
    id: 13,
    category: "CCaaS",
    title: "Zoom Contact Center (CCaaS) Implementation",
    icon: "fa-solid fa-headset",
    ...sharedEnterpriseStudy,
  },
  {
    id: 14,
    category: "Integrations",
    title: "Workforce Management Integration",
    icon: "fa-solid fa-people-arrows",
    ...sharedEnterpriseStudy,
  },
  {
    id: 15,
    category: "AI & Routing",
    title: "AI Voice Assistant",
    icon: "fa-solid fa-microphone-lines",
    ...sharedEnterpriseStudy,
  },
  {
    id: 16,
    category: "Automation",
    title: "Enterprise Workato Automation",
    icon: "fa-solid fa-gears",
    ...sharedEnterpriseStudy,
  },
  {
    id: 17,
    category: "Apps",
    title: "Customer 360 Sidebar Application",
    icon: "fa-solid fa-id-card-clip",
    ...appImpactStudy,
    solution:
      "Built a ZAF sidebar app that automatically retrieves ticket context and queries Salesforce, subscription systems, asset databases, licensing systems and internal APIs to display a complete customer profile inside Zendesk.",
  },
  {
    id: 18,
    category: "AI & Routing",
    title: "AI Agent Copilot Sidebar",
    icon: "fa-solid fa-user-astronaut",
    ...appImpactStudy,
    solution:
      "Developed an AI assistant embedded inside Zendesk capable of conversation summarization, suggested replies, knowledge recommendations, macro suggestions, sentiment analysis and next-best-action guidance.",
  },
  {
    id: 19,
    category: "Apps",
    title: "Internal Knowledge Search App",
    icon: "fa-solid fa-magnifying-glass",
    ...appImpactStudy,
    solution:
      "Created a sidebar application that searches Zendesk Guide, Confluence, SharePoint and internal documentation simultaneously, reducing knowledge search time.",
  },
  {
    id: 20,
    category: "Apps",
    title: "Enterprise Customer Timeline App",
    icon: "fa-solid fa-timeline",
    ...appImpactStudy,
    solution:
      "Designed a unified customer timeline showing tickets, calls, chats, CRM activities, engineering escalations and product history in chronological order.",
  },
  {
    id: 21,
    category: "AI & Routing",
    title: "AI Ticket Investigation Assistant",
    icon: "fa-solid fa-magnifying-glass-chart",
    ...appImpactStudy,
    solution:
      "Built an assistant that automatically gathers diagnostics, previous incidents, product versions and probable root causes before agents begin troubleshooting.",
  },
  {
    id: 22,
    category: "AI & Routing",
    title: "Smart Macro Recommendation Engine",
    icon: "fa-solid fa-wand-magic-sparkles",
    ...appImpactStudy,
    solution:
      "Recommended macros dynamically using ticket category, language, customer tier, AI intent detection and historical resolutions.",
  },
  {
    id: 23,
    category: "AI & Routing",
    title: "Custom AI Chatbot Platform",
    icon: "fa-solid fa-robot",
    ...appImpactStudy,
    solution:
      "Built enterprise AI chatbots supporting authentication, knowledge search, ticket creation, live-agent handoff and omnichannel deployment.",
  },
  {
    id: 24,
    category: "Apps",
    title: "Multi-System Data Aggregation App",
    icon: "fa-solid fa-diagram-project",
    ...appImpactStudy,
    solution:
      "Created a single sidebar app that aggregates customer information from Salesforce, Jira, Maestro QA, Qualtrics, Databricks, billing systems and internal databases.",
  },
  {
    id: 25,
    category: "AI & Routing",
    title: "AI Translation Assistant",
    icon: "fa-solid fa-language",
    ...appImpactStudy,
    solution:
      "Implemented real-time multilingual translation for tickets, replies and internal notes with automatic language detection.",
  },
  {
    id: 26,
    category: "CCaaS",
    title: "Voice AI Console",
    icon: "fa-solid fa-phone-volume",
    ...appImpactStudy,
    solution:
      "Developed an agent console integrated with Zoom Contact Center displaying customer history, AI summaries, CRM data and recommended actions during live calls.",
  },
  {
    id: 27,
    category: "Apps",
    title: "Admin Productivity Toolkit",
    icon: "fa-solid fa-screwdriver-wrench",
    ...appImpactStudy,
    solution:
      "Created utilities for trigger validation, duplicate detection, bulk administration, configuration comparison and governance checks.",
  },
  {
    id: 28,
    category: "Analytics",
    title: "AI Reporting Assistant",
    icon: "fa-solid fa-chart-simple",
    ...appImpactStudy,
    solution:
      "Developed a natural-language reporting assistant capable of generating Zendesk Explore reports and dashboards from user questions.",
  },
];

const outcomes = [
  "Reduced manual work",
  "Improved SLA compliance",
  "Increased agent productivity",
  "Faster resolution times",
  "Higher first-contact resolution",
  "Scalable enterprise support operations",
];

const CaseStudiesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(caseStudies.map((study) => study.category)),
  ];

  const filteredCaseStudies =
    activeCategory === "All"
      ? caseStudies
      : caseStudies.filter((study) => study.category === activeCategory);

  return (
    <main className="case-studies-page">
      <section
        className="case-studies-hero"
        style={{ "--case-studies-hero-image": "url('/assets/images/zendesk-image-1.png')" }}
      >
        <div className="case-studies-hero-overlay"></div>
        <div className="container position-relative">
          <div className="row align-items-center min-vh-75 g-5">
            <div className="col-lg-7">
              <span className="case-studies-eyebrow" data-aos="fade-up">
                Enterprise Project Evidence
              </span>
              <h1
                className="case-studies-hero-title"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                28 Zendesk case studies across AI, automation, integrations
                and custom applications.
              </h1>
              <p
                className="case-studies-hero-description"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                A comprehensive portfolio of enterprise Zendesk
                implementations, AI solutions, custom applications,
                integrations, reporting, automation and CCaaS projects.
              </p>
              <div
                className="case-studies-hero-actions"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <a href="#case-study-grid" className="case-studies-primary-button">
                  View Case Studies
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
                <Link to="/contact" className="case-studies-secondary-button">
                  Discuss Your Project
                </Link>
              </div>
            </div>

            <div
              className="col-lg-5"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="case-studies-hero-board">
                <div className="case-studies-board-header">
                  <span>Case Study Index</span>
                  <strong>Zendesk Delivery Portfolio</strong>
                </div>

                <div className="case-studies-board-grid">
                  {[
                    ["28", "Projects"],
                    ["8", "Categories"],
                    ["AI", "Enabled"],
                    ["CX", "Focused"],
                  ].map(([value, label]) => (
                    <div className="case-studies-board-stat" key={label}>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="case-studies-board-list">
                  {[
                    "AI-powered routing and ticket intelligence",
                    "Enterprise CRM, QA and data integrations",
                    "Custom ZAF sidebar apps and admin tooling",
                    "Explore dashboards and executive reporting",
                  ].map((item) => (
                    <div className="case-studies-board-item" key={item}>
                      <i className="fa-solid fa-check"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="case-studies-summary section-padding">
        <div className="container">
          <div className="row g-4">
            {[
              ["28", "Representative Projects"],
              ["8", "Solution Categories"],
              ["360", "Customer Context"],
              ["AI", "Automation Ready"],
            ].map(([value, label], index) => (
              <div
                className="col-sm-6 col-lg-3"
                key={label}
                data-aos="fade-up"
                data-aos-delay={index * 75}
              >
                <div className="case-studies-stat">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-studies-outcomes section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5" data-aos="fade-right">
              <span className="case-studies-section-label">
                Business Outcomes
              </span>
              <h2 className="case-studies-section-title">
                Practical improvements for support operations
              </h2>
              <p className="case-studies-section-description">
                These engagements focus on measurable customer service
                improvements: fewer manual steps, cleaner routing, stronger
                reporting, better customer context, and faster agent decisions.
              </p>
            </div>
            <div className="col-lg-7" data-aos="fade-left">
              <div className="case-studies-outcome-grid">
                {outcomes.map((outcome) => (
                  <div className="case-studies-outcome-item" key={outcome}>
                    <i className="fa-solid fa-check"></i>
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="case-studies-list section-padding" id="case-study-grid">
        <div className="container">
          <div className="case-studies-section-heading text-center">
            <span className="case-studies-section-label">
              Case Study Portfolio
            </span>
            <h2 className="case-studies-section-title">
              Zendesk solutions designed for enterprise complexity
            </h2>
            <p className="case-studies-section-description">
              Filter the work by focus area to explore how Clevanoo approaches
              automation, integrations, reporting, AI and custom Zendesk app
              development.
            </p>
          </div>

          <div className="case-studies-filter-buttons">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`case-studies-filter-button ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {filteredCaseStudies.map((study, index) => (
              <div
                className="col-lg-6"
                key={study.id}
                data-aos="fade-up"
                data-aos-delay={(index % 6) * 60}
              >
                <article className="case-study-card">
                  <div className="case-study-card-header">
                    <div className="case-study-icon">
                      <i className={study.icon}></i>
                    </div>
                    <div>
                      <span>{study.category}</span>
                      <h3>
                        Case Study {study.id}: {study.title}
                      </h3>
                    </div>
                  </div>

                  <div className="case-study-section">
                    <h4>Business Challenge</h4>
                    <p>{study.challenge}</p>
                  </div>

                  <div className="case-study-section">
                    <h4>Solution</h4>
                    <p>{study.solution}</p>
                  </div>

                  <div className="case-study-tech">
                    <i className="fa-solid fa-code"></i>
                    <span>{study.technologies}</span>
                  </div>

                  <div className="case-study-impact">
                    <h4>Business Impact</h4>
                    <p>{study.impact}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-studies-cta">
        <div className="container">
          <div className="case-studies-cta-content" data-aos="zoom-in">
            <span>Partner With Clevanoo</span>
            <h2>
              Ready to design a Zendesk solution around your real support
              workflows?
            </h2>
            <p>
              We can help you assess the current environment, identify
              automation opportunities, build integrations, and create the
              reporting layer your teams need.
            </p>
            <Link to="/contact" className="case-studies-cta-button">
              Start a Conversation
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CaseStudiesPage;
