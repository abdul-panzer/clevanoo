import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PortfolioPage.css";

const portfolioServices = [
  {
    id: 1,
    category: "Implementation",
    icon: "fa-solid fa-layer-group",
    title: "Enterprise Zendesk Implementation",
    description:
      "Design and implementation of scalable Zendesk environments aligned with your customer journeys, support processes, governance requirements, and long-term business goals.",
    capabilities: [
      "Zendesk Suite configuration",
      "Support, Guide, Talk and Messaging",
      "Agent Workspace setup",
      "Multi-brand configuration",
      "Roles and permissions",
      "Ticket forms and custom fields",
      "SLA policies",
      "Triggers and automations",
      "Skills-based routing",
      "Administrator training",
    ],
  },
  {
    id: 2,
    category: "AI & Automation",
    icon: "fa-solid fa-brain",
    title: "AI-Powered Customer Support",
    description:
      "Practical AI solutions that reduce repetitive work, improve routing accuracy, assist agents, and deliver faster and more consistent customer support.",
    capabilities: [
      "AI readiness assessment",
      "Intent detection",
      "Ticket classification",
      "Sentiment analysis",
      "Intelligent routing",
      "Conversation summaries",
      "Suggested responses",
      "Knowledge recommendations",
      "Resolution automation",
      "Voice AI integration",
    ],
  },
  {
    id: 3,
    category: "Integrations",
    icon: "fa-solid fa-code-branch",
    title: "Enterprise Integrations",
    description:
      "Connect Zendesk with CRM, ERP, billing, collaboration, telephony, identity, and internal business systems to create a unified customer support ecosystem.",
    capabilities: [
      "Salesforce integration",
      "Microsoft Dynamics 365",
      "HubSpot CRM",
      "ERP and billing systems",
      "Microsoft Teams and Slack",
      "Jira and Azure DevOps",
      "REST API development",
      "Webhooks and middleware",
      "Data synchronization",
      "Authentication services",
    ],
  },
  {
    id: 4,
    category: "Development",
    icon: "fa-solid fa-laptop-code",
    title: "Custom Zendesk Development",
    description:
      "Custom Zendesk applications and workflow extensions designed around business-specific processes that cannot be handled through standard platform functionality.",
    capabilities: [
      "Zendesk sidebar applications",
      "Customer information panels",
      "Approval applications",
      "Agent productivity tools",
      "Internal knowledge widgets",
      "Administrative utilities",
      "Quality assurance tools",
      "Customer timeline views",
      "Internal portals",
      "Workflow orchestration",
    ],
  },
  {
    id: 5,
    category: "Analytics",
    icon: "fa-solid fa-chart-line",
    title: "Analytics and Reporting",
    description:
      "Transform Zendesk operational data into useful dashboards, performance indicators, executive insights, and continuous improvement opportunities.",
    capabilities: [
      "Zendesk Explore dashboards",
      "Executive CX reporting",
      "SLA and CSAT dashboards",
      "Agent performance reporting",
      "Queue health monitoring",
      "Ticket aging analysis",
      "AI performance dashboards",
      "Power BI integration",
      "Tableau integration",
      "Data warehouse integration",
    ],
  },
  {
    id: 6,
    category: "Managed Services",
    icon: "fa-solid fa-gears",
    title: "Managed Zendesk Services",
    description:
      "Ongoing Zendesk administration, governance, optimization, reporting, AI enhancement, and strategic support after implementation.",
    capabilities: [
      "Platform administration",
      "Continuous improvements",
      "Zendesk health checks",
      "Workflow optimization",
      "Automation enhancements",
      "AI use-case development",
      "Reporting improvements",
      "Administrator enablement",
      "Release management",
      "Platform governance",
    ],
  },
];

const representativeProjects = [
  {
    icon: "fa-solid fa-building",
    category: "Enterprise Transformation",
    title: "Unified Enterprise Support Platform",
    challenge:
      "A growing organization was operating multiple disconnected customer support systems across regions, resulting in duplicate processes, inconsistent service, and limited reporting visibility.",
    solution:
      "Designed a centralized Zendesk architecture supporting multiple brands, multilingual teams, omnichannel engagement, SLA management, intelligent routing, CRM integration, and executive reporting.",
    outcomes: [
      "Unified customer support operations",
      "Standardized support processes",
      "Improved reporting visibility",
      "Faster customer response times",
      "Increased operational efficiency",
    ],
  },
  {
    icon: "fa-solid fa-robot",
    category: "AI Modernization",
    title: "AI-Powered Ticket Management",
    challenge:
      "Support agents manually reviewed large volumes of incoming requests to determine category, language, urgency, priority, and ownership.",
    solution:
      "Implemented AI-powered classification, automatic tagging, intelligent routing, conversation summaries, suggested responses, and knowledge recommendations with human oversight.",
    outcomes: [
      "Reduced manual ticket triage",
      "Faster ticket assignment",
      "Improved routing accuracy",
      "Better SLA performance",
      "Increased agent productivity",
    ],
  },
  {
    icon: "fa-solid fa-comments",
    category: "Omnichannel",
    title: "Connected Customer Experience",
    challenge:
      "Customer conversations were distributed across email, chat, messaging, social channels, and voice systems, preventing agents from seeing complete customer history.",
    solution:
      "Implemented Zendesk Support, Messaging, Talk, and Guide within a unified Agent Workspace supported by automation, customer context, and centralized reporting.",
    outcomes: [
      "Consistent customer experiences",
      "Improved team collaboration",
      "Better operational visibility",
      "Increased first-contact resolution",
      "Improved customer satisfaction",
    ],
  },
  {
    icon: "fa-solid fa-chart-pie",
    category: "Operational Intelligence",
    title: "Executive Reporting and Analytics",
    challenge:
      "Leadership lacked meaningful visibility into SLA performance, customer satisfaction, ticket trends, productivity, service demand, and operational bottlenecks.",
    solution:
      "Designed executive dashboards using Zendesk Explore and business intelligence integrations to present customer support data as actionable operational insights.",
    outcomes: [
      "Improved executive visibility",
      "Better strategic planning",
      "Data-driven decision-making",
      "Improved operational governance",
      "Clear performance measurement",
    ],
  },
];

const deliverySteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understand business objectives, customer journeys, existing support processes, systems, challenges, and future requirements.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Create the Zendesk architecture, workflow model, routing strategy, security framework, integration plan, and reporting approach.",
  },
  {
    number: "03",
    title: "Configure",
    description:
      "Configure Zendesk forms, fields, roles, permissions, business rules, SLAs, automations, macros, views, and channels.",
  },
  {
    number: "04",
    title: "Integrate",
    description:
      "Connect Zendesk with CRM, collaboration, telephony, identity, billing, ERP, and other enterprise applications.",
  },
  {
    number: "05",
    title: "Validate",
    description:
      "Test configurations, permissions, workflows, automations, integrations, dashboards, and user acceptance scenarios.",
  },
  {
    number: "06",
    title: "Go Live",
    description:
      "Deploy the production environment with documentation, administrator enablement, agent training, and hypercare support.",
  },
  {
    number: "07",
    title: "Optimize",
    description:
      "Continuously improve automation, AI adoption, reporting, knowledge management, workflows, and customer experiences.",
  },
];

const businessBenefits = [
  {
    icon: "fa-solid fa-headset",
    title: "Unified Support",
    description:
      "Centralize email, messaging, chat, voice, social channels, and customer history in one platform.",
  },
  {
    icon: "fa-solid fa-bolt",
    title: "Faster Resolutions",
    description:
      "Improve response and resolution times through automation, routing, AI assistance, and connected data.",
  },
  {
    icon: "fa-solid fa-user-gear",
    title: "Agent Productivity",
    description:
      "Give support teams the information, tools, recommendations, and workflows required to work efficiently.",
  },
  {
    icon: "fa-solid fa-chart-column",
    title: "Operational Visibility",
    description:
      "Use dashboards and performance indicators to understand customer experience and support operations.",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Enterprise Governance",
    description:
      "Protect customer data through role-based access, SSO, audit controls, documentation, and governance.",
  },
  {
    icon: "fa-solid fa-arrow-up-right-dots",
    title: "Scalable Architecture",
    description:
      "Build a maintainable Zendesk environment capable of supporting growing teams, brands, regions, and channels.",
  },
];

const industries = [
  "Software & SaaS",
  "Financial Services",
  "Healthcare",
  "Retail & eCommerce",
  "Manufacturing",
  "Telecommunications",
  "Education",
  "Professional Services",
];

const engagementModels = [
  {
    icon: "fa-solid fa-compass-drafting",
    title: "Advisory and Strategy",
    description:
      "For organizations evaluating Zendesk, assessing an existing platform, or planning a customer experience transformation.",
    services: [
      "CX strategy workshops",
      "Platform assessments",
      "Roadmap planning",
      "Solution architecture",
      "Governance frameworks",
    ],
  },
  {
    icon: "fa-solid fa-rocket",
    title: "Implementation Services",
    description:
      "For organizations implementing Zendesk for the first time or modernizing an existing Zendesk environment.",
    services: [
      "End-to-end implementation",
      "Platform migration",
      "Enterprise integrations",
      "Workflow automation",
      "Testing and training",
      "Go-live support",
    ],
  },
  {
    icon: "fa-solid fa-screwdriver-wrench",
    title: "Optimization and Managed Services",
    description:
      "For organizations requiring ongoing platform support, enhancements, administration, governance, and optimization.",
    services: [
      "Platform administration",
      "Health checks",
      "AI enhancements",
      "Reporting improvements",
      "Release management",
      "Continuous improvement",
    ],
  },
];

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsPageLoaded(true);
      return;
    }

    const handleWindowLoad = () => {
      setIsPageLoaded(true);
    };

    window.addEventListener("load", handleWindowLoad, { once: true });

    return () => {
      window.removeEventListener("load", handleWindowLoad);
    };
  }, []);

  const categories = [
    "All",
    ...new Set(portfolioServices.map((service) => service.category)),
  ];

  const filteredServices =
    activeCategory === "All"
      ? portfolioServices
      : portfolioServices.filter(
          (service) => service.category === activeCategory
        );

  return (
    <main className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-overlay"></div>

        <div className="container position-relative">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-8">
              <span
                className="portfolio-eyebrow"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Enterprise Zendesk Consulting Portfolio
              </span>

              <h1
                className="portfolio-hero-title"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Modern Customer Support.
                <span> Intelligent Automation.</span>
                Exceptional Customer Experiences.
              </h1>

              <p
                className="portfolio-hero-description"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                We help organizations design, implement, integrate, automate,
                and continuously improve Zendesk environments that deliver
                measurable business value.
              </p>

              <div
                className="portfolio-hero-actions"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <a href="#portfolio-work" className="portfolio-primary-button">
                  Explore Our Capabilities
                  <i className="fa-solid fa-arrow-right"></i>
                </a>

                <Link to="/contact" className="portfolio-secondary-button">
                  Discuss Your Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="portfolio-hero-image-section">
        <div className="container">
          <img
            className="portfolio-hero-image"
            src="/assets/images/zendesk-image-1.png"
            alt="Zendesk consulting services"
            data-aos="fade-up"
          />
        </div>
      </section>

      {/* Portfolio Video */}
      <section className="portfolio-video-section section-padding">
        <div className="container">
          <div className="portfolio-section-heading text-center">
            <span className="portfolio-section-label">Zendesk Portfolio</span>

            <h2 className="portfolio-section-title">
              See the customer support experience in motion
            </h2>
          </div>

          <div className="portfolio-video-frame" data-aos="fade-up">
            {isPageLoaded && (
              <video
                className="portfolio-video"
                src="/assets/videos/zendesk-animated-portfolio.mp4"
                muted
                autoPlay
                playsInline
                loop
                preload="auto"
                aria-label="Zendesk animated portfolio"
              />
            )}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="portfolio-introduction section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-right">
              <span className="portfolio-section-label">
                Customer Experience Transformation
              </span>

              <h2 className="portfolio-section-title">
                Your customer support platform should do more than manage
                tickets.
              </h2>

              <p className="portfolio-section-description">
                Customer support has become a strategic business function that
                influences customer satisfaction, operational efficiency,
                loyalty, retention, and long-term growth.
              </p>

              <p className="portfolio-section-description">
                Our consulting-led approach combines customer experience
                strategy, solution architecture, Zendesk engineering,
                enterprise integrations, intelligent automation, analytics,
                and managed services.
              </p>

              <Link to="/contact" className="portfolio-text-link">
                Start your Zendesk transformation
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            <div className="col-lg-6" data-aos="fade-left">
              <div className="portfolio-intro-panel">
                <div className="portfolio-intro-panel-header">
                  <div className="portfolio-intro-icon">
                    <i className="fa-solid fa-circle-nodes"></i>
                  </div>

                  <div>
                    <span>Connected Support Ecosystem</span>
                    <h3>One platform. Every customer interaction.</h3>
                  </div>
                </div>

                <div className="portfolio-channel-grid">
                  {[
                    ["fa-solid fa-envelope", "Email"],
                    ["fa-solid fa-comment-dots", "Live Chat"],
                    ["fa-solid fa-phone", "Voice"],
                    ["fa-brands fa-whatsapp", "WhatsApp"],
                    ["fa-solid fa-message", "Messaging"],
                    ["fa-solid fa-book-open", "Knowledge"],
                  ].map(([icon, title]) => (
                    <div className="portfolio-channel-item" key={title}>
                      <i className={icon}></i>
                      <span>{title}</span>
                    </div>
                  ))}
                </div>

                <div className="portfolio-intro-result">
                  <i className="fa-solid fa-check"></i>
                  <p>
                    Unified conversations, connected customer data, intelligent
                    workflows, and actionable operational insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="portfolio-benefits section-padding">
        <div className="container">
          <div className="portfolio-section-heading text-center">
            <span className="portfolio-section-label">Business Benefits</span>

            <h2 className="portfolio-section-title">
              Build a smarter customer support operation
            </h2>

            <p className="portfolio-section-description">
              Create support environments that help teams respond faster, work
              more efficiently, and deliver consistent customer experiences.
            </p>
          </div>

          <div className="row g-4">
            {businessBenefits.map((benefit, index) => (
              <div
                className="col-md-6 col-lg-4"
                key={benefit.title}
                data-aos="fade-up"
                data-aos-delay={index * 75}
              >
                <article className="portfolio-benefit-card">
                  <div className="portfolio-benefit-icon">
                    <i className={benefit.icon}></i>
                  </div>

                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        className="portfolio-services section-padding"
        id="portfolio-work"
      >
        <div className="container">
          <div className="portfolio-section-heading text-center">
            <span className="portfolio-section-label">What We Deliver</span>

            <h2 className="portfolio-section-title">
              End-to-end Zendesk consulting capabilities
            </h2>

            <p className="portfolio-section-description">
              Support for every stage of your Zendesk journey, from strategy
              and implementation to AI, integrations, analytics, and managed
              services.
            </p>
          </div>

          <div className="portfolio-filter-buttons">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`portfolio-filter-button ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {filteredServices.map((service, index) => (
              <div
                className="col-lg-6"
                key={service.id}
                data-aos="fade-up"
                data-aos-delay={index * 75}
              >
                <article className="portfolio-service-card">
                  <div className="portfolio-service-card-top">
                    <div className="portfolio-service-icon">
                      <i className={service.icon}></i>
                    </div>

                    <span className="portfolio-service-category">
                      {service.category}
                    </span>
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <div className="portfolio-capability-list">
                    {service.capabilities.map((capability) => (
                      <div
                        className="portfolio-capability-item"
                        key={capability}
                      >
                        <i className="fa-solid fa-check"></i>
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Methodology */}
      <section className="portfolio-methodology section-padding">
        <div className="container">
          <div className="row align-items-end mb-5">
            <div className="col-lg-7">
              <span className="portfolio-section-label">
                Our Delivery Methodology
              </span>

              <h2 className="portfolio-section-title">
                A structured framework for successful transformation
              </h2>
            </div>

            <div className="col-lg-5">
              <p className="portfolio-section-description mb-0">
                Every engagement follows a practical delivery process designed
                to reduce implementation risk, accelerate adoption, and create
                long-term value.
              </p>
            </div>
          </div>

          <div className="portfolio-methodology-grid">
            {deliverySteps.map((step, index) => (
              <article
                className="portfolio-methodology-card"
                key={step.number}
                data-aos="fade-up"
                data-aos-delay={index * 60}
              >
                <span className="portfolio-methodology-number">
                  {step.number}
                </span>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Representative Work */}
      <section className="portfolio-projects section-padding">
        <div className="container">
          <div className="portfolio-section-heading text-center">
            <span className="portfolio-section-label">
              Representative Engagements
            </span>

            <h2 className="portfolio-section-title">
              Customer support transformation scenarios
            </h2>

            <p className="portfolio-section-description">
              These examples illustrate typical enterprise engagement
              scenarios and are not presented as client-specific case studies.
            </p>
          </div>

          <div className="row g-4">
            {representativeProjects.map((project, index) => (
              <div
                className="col-lg-6"
                key={project.title}
                data-aos="fade-up"
                data-aos-delay={index * 75}
              >
                <article className="portfolio-project-card">
                  <div className="portfolio-project-header">
                    <div className="portfolio-project-icon">
                      <i className={project.icon}></i>
                    </div>

                    <div>
                      <span>{project.category}</span>
                      <h3>{project.title}</h3>
                    </div>
                  </div>

                  <div className="portfolio-project-section">
                    <h4>Business Challenge</h4>
                    <p>{project.challenge}</p>
                  </div>

                  <div className="portfolio-project-section">
                    <h4>Our Solution</h4>
                    <p>{project.solution}</p>
                  </div>

                  <div className="portfolio-project-section">
                    <h4>Business Outcomes</h4>

                    <ul>
                      {project.outcomes.map((outcome) => (
                        <li key={outcome}>
                          <i className="fa-solid fa-check"></i>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="portfolio-engagements section-padding">
        <div className="container">
          <div className="portfolio-section-heading text-center">
            <span className="portfolio-section-label">
              Flexible Engagement Models
            </span>

            <h2 className="portfolio-section-title">
              The right expertise for every stage of your journey
            </h2>

            <p className="portfolio-section-description">
              Choose an engagement model aligned with your internal
              capabilities, business priorities, project complexity, and
              transformation timeline.
            </p>
          </div>

          <div className="row g-4">
            {engagementModels.map((model, index) => (
              <div
                className="col-lg-4"
                key={model.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <article className="portfolio-engagement-card">
                  <div className="portfolio-engagement-icon">
                    <i className={model.icon}></i>
                  </div>

                  <h3>{model.title}</h3>
                  <p>{model.description}</p>

                  <ul>
                    {model.services.map((service) => (
                      <li key={service}>
                        <i className="fa-solid fa-check"></i>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="portfolio-industries section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5" data-aos="fade-right">
              <span className="portfolio-section-label">
                Industry Solutions
              </span>

              <h2 className="portfolio-section-title">
                Zendesk solutions adapted to your industry
              </h2>

              <p className="portfolio-section-description">
                Every industry has different workflows, compliance
                requirements, communication models, and customer expectations.
                We adapt Zendesk to match those operational realities.
              </p>
            </div>

            <div className="col-lg-7" data-aos="fade-left">
              <div className="portfolio-industry-grid">
                {industries.map((industry) => (
                  <div className="portfolio-industry-item" key={industry}>
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>{industry}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="portfolio-difference section-padding">
        <div className="container">
          <div className="portfolio-section-heading text-center">
            <span className="portfolio-section-label">
              Why Organizations Choose Us
            </span>

            <h2 className="portfolio-section-title">
              Engineering-led. Business-focused. Customer-centric.
            </h2>
          </div>

          <div className="row g-4">
            {[
              {
                icon: "fa-solid fa-people-group",
                title: "Consulting Before Configuration",
                description:
                  "We begin by understanding customer journeys, business goals, operational challenges, and future growth plans.",
              },
              {
                icon: "fa-solid fa-wand-magic-sparkles",
                title: "Automation-First Thinking",
                description:
                  "Every workflow is evaluated for opportunities to reduce repetitive work while preserving governance and flexibility.",
              },
              {
                icon: "fa-solid fa-sitemap",
                title: "Enterprise Architecture",
                description:
                  "Our solutions prioritize scalability, maintainability, security, governance, and long-term platform performance.",
              },
              {
                icon: "fa-solid fa-microchip",
                title: "AI With Purpose",
                description:
                  "We implement AI where it produces practical improvements in customer experience and operational efficiency.",
              },
              {
                icon: "fa-solid fa-handshake",
                title: "Continuous Partnership",
                description:
                  "Our work continues through platform optimization, reporting improvements, governance, and strategic advisory.",
              },
              {
                icon: "fa-solid fa-graduation-cap",
                title: "Knowledge Transfer",
                description:
                  "We enable internal teams through documentation, administrator coaching, training, and operational readiness.",
              },
            ].map((item, index) => (
              <div
                className="col-md-6 col-lg-4"
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={index * 75}
              >
                <article className="portfolio-difference-card">
                  <i className={item.icon}></i>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="portfolio-cta">
        <div className="container">
          <div className="portfolio-cta-content" data-aos="zoom-in">
            <span>Partner With Clevanoo</span>

            <h2>
              Build an intelligent customer support ecosystem that grows with
              your business.
            </h2>

            <p>
              Whether you are implementing Zendesk, modernizing an existing
              environment, integrating enterprise systems, or introducing
              AI-powered customer service, our team can support every stage of
              the journey.
            </p>

            <Link to="/contact" className="portfolio-cta-button">
              Discuss Your Zendesk Project
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;
