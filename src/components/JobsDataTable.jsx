import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobsDataCards = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);

    const API_URL = 'https://clevanoo.com/backend/public/api/all-jobs';

    const fetchJobs = async (page, size = perPage, searchTerm = search) => {
        setLoading(true);

        try {
            const response = await axios.get(API_URL, {
                params: {
                    page,
                    per_page: size,
                    search: searchTerm || undefined,
                },
            });
            setJobs(response.data.data);
            setTotalRows(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(1);
    }, []);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        fetchJobs(page);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        fetchJobs(page, newPerPage);
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        fetchJobs(1, perPage, val);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalRows / perPage);
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px' }}>
            <h2 className="text-dark" style={{ marginBottom: '20px' }}>
                Jobs
            </h2>

            <input
                type="text"
                placeholder="Search jobs..."
                className="form-control mb-4"
                value={search}
                onChange={handleSearchChange}
                style={{ maxWidth: 400 }}
            />

            {loading && <p>Loading jobs...</p>}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px',
                }}
            >
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                            borderRadius: '10px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '280px',
                        }}
                    >
                        <div>
                            <h3 className='text-dark' style={{ marginBottom: '10px' }}>{job.jobtitle}</h3>
                            <p style={{ color: '#555', marginBottom: '12px', minHeight: '60px' }}>
                                {job.description.length > 140
                                    ? job.description.substring(0, 140) + '...'
                                    : job.description}
                            </p>

                            <ul style={{ listStyle: 'none', paddingLeft: 0, color: '#333' }}>
                                <li>
                                    <strong>City:</strong> {job.city}
                                </li>
                                <li>
                                    <strong>State:</strong> {job.state}
                                </li>
                                <li>
                                    <strong>Duration:</strong> {job.duration}
                                </li>
                                <li>
                                    <strong>Bill Rate:</strong> DOE
                                </li>
                            </ul>
                        </div>

                        <button
                            style={{
                                marginTop: '15px',
                                backgroundColor: '#86d7ff',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff',
                                padding: '10px 15px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                            onClick={() => navigate(`/job/${job.id}`)}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#66c1ff')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#86d7ff')}
                        >
                            READ MORE
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            <div
                style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                }}
            >
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff',
                        color: currentPage === 1 ? '#999' : '#333',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                >
                    Previous
                </button>

                {/* Page Number Dropdown */}
                <select
                    value={currentPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                    }}
                >
                    {[...Array(totalPages)].map((_, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                            Page {idx + 1}
                        </option>
                    ))}
                </select>

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff',
                        color: currentPage === totalPages ? '#999' : '#333',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default JobsDataCards;
