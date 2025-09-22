import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const API_URL = 'https://clevanoo.com/backend/public/api/all-jobs';
  const navigate = useNavigate();

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []); 

  const fetchJobs = async () => {
    setLoading(true);

    try {
      const response = await axios.get(API_URL, {
        params: {
          page: 1, 
          per_page: 6,
        },
      });
      setJobs(response.data.data);  
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  // Function to truncate description to 300 characters
  const truncateDescription = (description) => {
    if (description && description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  };

  return (
    <section className="pb-5 text-white position-relative" style={{ backgroundColor: '#2c3e50' }}>
      <div
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: 'url("/assets/images/latest-job-lisiting.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)',
          zIndex: 0,
        }}
      ></div>

      <div className="container position-relative pt-5" style={{ zIndex: 1 }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="col-lg-6 mb-5" data-aos="fade-right">
              <h2 className="display-5 fw-bold mb-4">New & Random Jobs</h2>
              <p className="lead mb-4">
                Discover the latest and most exciting job opportunities available in the market.
              </p>
              <a href="/jobs" className="btn btn-light btn-lg px-4 rounded-0">More Jobs</a>
            </div>
          </div>

          <div className="col-lg-12" data-aos="fade-left">
            <h2 className="display-5 fw-bold mb-4 text-center">Latest Job Listing</h2>
            <div className="row">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                jobs.map((job, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="m-2">
                      <div className="card border-0 shadow h-100">
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                          <h6 className="mb-1 fw-bold text-dark d-flex flex-row">{job.jobtitle}</h6>
                          <p className="text-muted">Location: {`${job.city}, ${job.state}`}</p>
                          <p className="text-muted">Duration: {job.duration}</p>
                          <p className="text-muted">Rate: DOE</p>
                          <p className="card-text text-muted mb-3">{truncateDescription(job.description)}</p>
                          <button
                            className="btn btn-primary btn-sm rounded-0"
                            onClick={() => handleJobClick(job.id)} 
                          >
                            READ MORE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewJobs;
