import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const JOB_DETAIL_URL = 'https://clevanoo.com/backend/public/api/jobs';
const RESUME_STORAGE_URL = 'https://clevanoo.com/backend/storage/app/public';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [formStatus, setFormStatus] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    visaType: '',
    state: '',
    resume: null,
    message: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchJob = async () => {
      setLoadingJob(true);
      try {
        const response = await axios.get(`${JOB_DETAIL_URL}/${id}`);
        setJob(response.data);
      } catch (error) {
        alert('Job not found!');
        navigate('/jobs');
      } finally {
        setLoadingJob(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName.trim()) tempErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) tempErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) tempErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phone.trim()))
      tempErrors.phone = 'Phone number is invalid';
    if (!formData.resume) tempErrors.resume = 'Resume file is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openModal = () => {
    setFormStatus('');
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormStatus('');
    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.firstName);
    formDataToSend.append('last_name', formData.lastName);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('position_applied_for', job.jobtitle);
    formDataToSend.append('resume', formData.resume);

    if (formData.visaType.trim()) formDataToSend.append('visa_type', formData.visaType.trim());
    if (formData.state.trim()) formDataToSend.append('state', formData.state.trim());
    if (formData.message.trim()) formDataToSend.append('message', formData.message.trim());

    try {
      const response = await axios.post(
        'https://clevanoo.com/backend/public/api/save-candidates',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const resumeUrl = `${RESUME_STORAGE_URL}/${response.data.resume_path}`;

      const emailPayload = {
        message: `A new candidate has applied for ${job.jobtitle}.\n\nResume Link: ${resumeUrl}`,
      };

      await emailjs.send(
        'service_n7jxnhk',
        'template_bfll5t7',
        emailPayload,
        '6EHvX32o3dXV9nT81'
      );

      setFormStatus('Candidate submitted and email sent!');
      closeModal();
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        visaType: '',
        state: '',
        resume: null,
        message: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        if (error.response.status === 422) {
          const validationErrors = error.response.data.details;
          const formattedErrors = {};
          for (let key in validationErrors) {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            formattedErrors[camelKey] = validationErrors[key][0];
          }
          setErrors(formattedErrors);
          setFormStatus('Validation failed. Please fix the errors.');
        } else {
          setFormStatus(error.response.data.error || 'Server error occurred.');
        }
      } else {
        setFormStatus('Network error. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (!job) return null;

  return (
    <section className="pb-5 mt-4 text-white position-relative" style={{ padding: '20px', minHeight: '100vh' }}>
      <div className="container position-relative pt-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="jobs-page container">
              <h1 className="text-dark" style={{ textAlign: 'center', marginTop: '20px' }}>Apply for {job.jobtitle}</h1>
            </div>

            <div className="row mb-5">
              <div className="col-md-8 offset-md-2">
                <ul className="list-group mb-4">
                  <li className="list-group-item"><strong>Location:</strong> {job.city} - {job.state}</li>
                  <li className="list-group-item"><strong>Duration:</strong> {job.duration}</li>
                  <li className="list-group-item"><strong>Bill Rate:</strong> DOE</li>
                </ul>
                <div className="mb-4">
                  <h3 className="text-dark">{job.jobtitle}</h3>
                  <p className="text-dark">{job.description}</p>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={openModal}>APPLY</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div
              className="modal show d-block"
              tabIndex="-1"
              aria-labelledby="applyModalLabel"
              aria-modal="true"
              role="dialog"
              onClick={closeModal}
            >
              <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="applyModalLabel">Apply for {job.jobtitle}</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First Name*</label>
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name*</label>
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone*</label>
                        <input
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="visaType" className="form-label">Visa Type</label>
                        <select
                          className="form-control"
                          id="visaType"
                          name="visaType"
                          value={formData.visaType}
                          onChange={handleChange}
                          placeholder="Optional">
                          <option value="">Select Visa Type</option>
                          <option value="H1">H1</option>
                          <option value="GC">GC</option>
                          <option value="EAD_GC">EAD GC</option>
                          <option value="TN_Visa">TN Visa</option>
                          <option value="EAD_OPT">EAD OPT</option>
                          <option value="US_Citizen">US Citizen</option>
                          <option value="Canada_Citizen">Canada Citizen</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <select 
                        type="text"
                          className="form-control"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Optional">
                          <option value="">Select State</option>
                          <option value="Alabama">Alabama</option>
                          <option value="Alaska">Alaska</option>
                          <option value="Arizona">Arizona</option>
                          <option value="Arkansas">Arkansas</option>
                          <option value="California">California</option>
                          <option value="Colorado">Colorado</option>
                          <option value="Connecticut">Connecticut</option>
                          <option value="Delaware">Delaware</option>
                          <option value="District_of_Columbia">District of Columbia</option>
                          <option value="Florida">Florida</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Hawaii">Hawaii</option>
                          <option value="Idaho">Idaho</option>
                          <option value="Illinois">Illinois</option>
                          <option value="Indiana">Indiana</option>
                          <option value="Iowa">Iowa</option>
                          <option value="Kansas">Kansas</option>
                          <option value="Kentucky">Kentucky</option>
                          <option value="Louisiana">Louisiana</option>
                          <option value="Maine">Maine</option>
                          <option value="Maryland">Maryland</option>
                          <option value="Massachusetts">Massachusetts</option>
                          <option value="Michigan">Michigan</option>
                          <option value="Minnesota">Minnesota</option>
                          <option value="Mississippi">Mississippi</option>
                          <option value="Missouri">Missouri</option>
                          <option value="Montana">Montana</option>
                          <option value="Nebraska">Nebraska</option>
                          <option value="Nevada">Nevada</option>
                          <option value="New_Hampshire">New Hampshire</option>
                          <option value="New_Jersey">New Jersey</option>
                          <option value="New_Mexico">New Mexico</option>
                          <option value="New_York">New York</option>
                          <option value="North_Carolina">North Carolina</option>
                          <option value="North_Dakota">North Dakota</option>
                          <option value="Ohio">Ohio</option>
                          <option value="Oklahoma">Oklahoma</option>
                          <option value="Oregon">Oregon</option>
                          <option value="Pennsylvania">Pennsylvania</option>
                          <option value="Rhode_Island">Rhode Island</option>
                          <option value="South_Carolina">South Carolina</option>
                          <option value="South_Dakota">South Dakota</option>
                          <option value="Tennessee">Tennessee</option>
                          <option value="Texas">Texas</option>
                          <option value="Utah">Utah</option>
                          <option value="Vermont">Vermont</option>
                          <option value="Virginia">Virginia</option>
                          <option value="Washington">Washington</option>
                          <option value="West_Virginia">West Virginia</option>
                          <option value="Wisconsin">Wisconsin</option>
                          <option value="Wyoming">Wyoming</option>
                          <option value="Canada">Canada</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="resume" className="form-label">Resume (PDF, DOC)*</label>
                        <input
                          type="file"
                          className={`form-control ${errors.resume ? 'is-invalid' : ''}`}
                          id="resume"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleChange}
                          required
                        />
                        {errors.resume && <div className="invalid-feedback">{errors.resume}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="message" className="form-label">Additional Message</label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Optional"
                        />
                      </div>

                      {formStatus && (
                        <div className={`mb-3 ${formStatus.includes('error') || formStatus.includes('failed') ? 'text-danger' : 'text-success'}`}>
                          {formStatus}
                        </div>
                      )}

                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default JobDetailPage;
