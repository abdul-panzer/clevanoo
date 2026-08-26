import React from "react";
import { Link } from "react-router-dom";

const SpecialityPage = () => {
  const specialities = [
    {
      icon: "fas fa-brain",
      title: "AI / Machine Learning Engineer",
      description: "Designs, trains, and optimizes machine learning models, transforming data into intelligent systems that drive automation, prediction, and scalable business impact.",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Deep Learning"]
    },
    {
      icon: "fas fa-cogs",
      title: "MLOps Engineer",
      description: "Builds robust pipelines for deploying, monitoring, and maintaining ML models in production, ensuring reliability, version control, scalability, and continuous improvement.",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["Docker", "Kubernetes", "CI/CD", "Model Deployment", "Monitoring"]
    },
    {
      icon: "fas fa-database",
      title: "AI Data Engineer",
      description: "Architects and manages high-quality data pipelines, enabling efficient ingestion, transformation, and availability of data required for advanced AI and analytics workloads.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["Apache Spark", "Data Warehousing", "ETL", "Big Data", "SQL"]
    },
    {
      icon: "fas fa-robot",
      title: "LLM Application Engineer",
      description: "Develops production-grade applications powered by large language models, integrating APIs, retrieval systems, and orchestration layers to deliver reliable, real-world AI solutions.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["OpenAI APIs", "LangChain", "Vector Databases", "NLP", "Fine-tuning"]
    },
    {
      icon: "fas fa-comments",
      title: "Prompt Engineer (Enterprise / Production-level)",
      description: "Designs, tests, and optimizes structured prompts and workflows to ensure consistent, accurate, and controllable LLM behavior in enterprise and mission-critical environments.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["Prompt Design", "AI Ethics", "System Integration", "Performance Optimization", "Testing"]
    },
    {
      icon: "fas fa-shield-alt",
      title: "AI Security Engineer",
      description: "Protects AI systems against threats by securing models, data, and pipelines, addressing risks such as prompt injection, data leakage, and adversarial attacks.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["Adversarial ML", "Model Security", "Privacy Protection", "Risk Assessment", "Compliance"]
    },
    {
      icon: "fas fa-balance-scale",
      title: "AI Governance & Compliance Specialist",
      description: "Ensures AI systems meet regulatory, ethical, and organizational standards through policy design, risk assessment, documentation, and ongoing compliance monitoring.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["AI Ethics", "Regulatory Compliance", "Risk Management", "Policy Development", "Auditing"]
    },
    {
      icon: "fas fa-chart-line",
      title: "AI Product Manager",
      description: "Leads AI initiatives from vision to delivery, aligning technical capabilities with business goals, user needs, and measurable outcomes across product lifecycle.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["Product Strategy", "Market Research", "Agile", "Stakeholder Management", "Data Analysis"]
    },
    {
      icon: "fas fa-cloud",
      title: "Cloud AI Infrastructure Engineer",
      description: "Designs and operates scalable cloud environments optimized for AI workloads, ensuring performance, cost efficiency, security, and seamless deployment across platforms.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["AWS/Azure/GCP", "GPU Computing", "Distributed Systems", "Auto-scaling", "Cost Optimization"]
    },
    {
      icon: "fas fa-lock",
      title: "Cybersecurity Consultant",
      description: "Advises organizations on securing digital and AI-driven systems, assessing vulnerabilities, designing defenses, and aligning security strategies with evolving threat landscapes.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      skills: ["Security Assessment", "Penetration Testing", "Incident Response", "Security Architecture", "Compliance"]
    },
    {
      icon: "fas fa-gavel",
      title: "Legal Professionals",
      description: "Connects organizations with qualified legal talent, including attorneys, associates, paralegals, and legal support professionals for law firms and corporate legal teams.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      skills: ["Attorneys", "Legal Associates", "Paralegals", "Legal Research", "Contract Review"]
    }
  ];

  return (
    <div className="container py-5 mt-5 speciality-page">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-4">Our Specialities</h1>
        <p className="lead">
          We bring together specialized talent across high-demand fields, including AI, cloud, cybersecurity, and legal staffing.
          Our expertise spans the full AI lifecycle-from data engineering and machine learning to LLM applications, MLOps, governance, and security-while also supporting law firms and corporate legal teams with attorneys, associates, paralegals, and legal support professionals. Guided by a passion for excellence, we help organizations find reliable, skilled professionals aligned with real business outcomes.
        </p>
      </div>
      
      <div className="row g-4">
        {specialities.map((speciality, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-6 col-xl-4" data-aos="fade-up" data-aos-delay={index * 50}>
            <div className="card h-100 border-0 shadow-sm overflow-hidden">
              <div className="position-relative">
                <img 
                  src={speciality.image} 
                  className="card-img-top" 
                  alt={speciality.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="bg-white rounded-circle p-3 shadow-lg">
                    <i className={`${speciality.icon} fa-2x text-primary`}></i>
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                <h4 className="card-title fw-bold mb-3">{speciality.title}</h4>
                <p className="card-text text-muted mb-3">{speciality.description}</p>
                <div className="mb-3">
                  <h6 className="fw-bold text-primary">Key Skills:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {speciality.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="badge bg-light text-dark">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* <div className="card-footer bg-transparent border-0 p-3">
                <button className="btn btn-outline-primary w-100">
                  <i className="fas fa-search me-2"></i>
                  Find Jobs in This Role
                </button>
              </div> */}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-5 p-5 bg-light rounded-3">
        <h3 className="mb-4">Ready to Advance Your Career?</h3>
        <p className="lead mb-4">
          Join thousands of professionals who have found their dream jobs through our platform.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/jobs" className="btn btn-primary btn-lg px-4">
            <i className="fas fa-search me-2"></i>
            Browse All Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialityPage;
