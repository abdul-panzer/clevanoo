import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = 'https://clevanoo.com/backend/public/api/all-jobs';
const API_CREATE_URL = 'https://clevanoo.com/backend/public/api/create-job';
const API_UPDATE_URL = 'https://clevanoo.com/backend/public/api/update-job';
const JOB_DELETE_URL = 'https://clevanoo.com/backend/public/api/delete-job';

const JobUploadPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        jobtitle: '',
        city: '',
        state: '',
        duration: '',
        bill_rate: '',
        description: '',
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const jobsPerPage = 20;

    // Fetch jobs with pagination and search
    const fetchJobs = async (page = 1, searchTerm = '') => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                params: {
                    page,
                    per_page: jobsPerPage,
                    search: searchTerm.trim()
                }
            });
            // Assuming API returns { data: [...jobs], total: 100, current_page: 1 }
            setJobs(response.data.data);
            setTotalJobs(response.data.total);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    // On page or search change, fetch data
    useEffect(() => {
        fetchJobs(currentPage, search);
    }, [currentPage, search]);

    const totalPages = Math.ceil(totalJobs / jobsPerPage);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset page to 1 when search changes
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleEditJob = (job) => {
        setSelectedJob(job);
        setFormData({
            jobtitle: job.jobtitle,
            city: job.city,
            state: job.state,
            duration: job.duration,
            bill_rate: job.bill_rate,
            description: job.description,
        });
        setShowModal(true);
    };

    const handleAddJob = () => {
        setSelectedJob(null);
        setFormData({
            jobtitle: '',
            city: '',
            state: '',
            duration: '',
            bill_rate: '',
            description: '',
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveJob = async (e) => {
        e.preventDefault();
        try {
            if (selectedJob) {
                await axios.put(`${API_UPDATE_URL}/${selectedJob.id}`, formData);
            } else {
                await axios.post(API_CREATE_URL, formData);
            }
            fetchJobs(currentPage, search);
            setShowModal(false);
        } catch (error) {
            console.error("Error saving job:", error);
            alert("Failed to save job, please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await axios.delete(`${JOB_DELETE_URL}/${id}`);
            alert("Job deleted successfully");
            // Refresh jobs - if deleting last item on page, go to prev page if needed
            if (jobs.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchJobs(currentPage, search);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete the job. Please try again.");
        }
    };

    return (
        <section className="py-5 mt-5">
            <div className="container">
                <h2 className="text-center mb-4">Jobs List</h2>

                <button className="btn btn-success mb-4" onClick={handleAddJob}>
                    Add New Job
                </button>

                {/* Search Input */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="form-control"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                {loading ? (
                    <p>Loading jobs...</p>
                ) : (
                    <>
                        {/* Jobs Table */}
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Duration</th>
                                        <th>Bill Rate</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.length > 0 ? (
                                        jobs.map((job) => (
                                            <tr key={job.id}>
                                                <td>{job.jobtitle}</td>
                                                <td>{job.city}</td>
                                                <td>{job.state}</td>
                                                <td>{job.duration}</td>
                                                <td>DOE</td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning me-2"
                                                        onClick={() => handleEditJob(job)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleDelete(job.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                No jobs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav>
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li
                                            key={i + 1}
                                            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                )}

                {/* Modal for Add/Edit Job */}
                {showModal && (
                    <div className="modal show" style={{ display: "block" }}>
                        <div className="modal-dialog" style={{ zIndex: 9999 }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedJob ? "Edit Job" : "Add New Job"}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSaveJob}>
                                        <div className="mb-3">
                                            <label className="form-label">Job Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="jobtitle"
                                                value={formData.jobtitle}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">State</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Duration</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Bill Rate</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="bill_rate"
                                                value={formData.bill_rate}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                rows="3"
                                                value={formData.description}
                                                onChange={handleFormChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            {selectedJob ? "Update Job" : "Add Job"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show"></div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default JobUploadPage;
