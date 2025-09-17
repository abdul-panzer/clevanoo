// JobsPage.jsx
import React from 'react';
import JobsDataTable from '../components/JobsDataTable';

const JobsPage = () => {
    return (
        <section className="pb-5 mt-4 text-white position-relative" style={{ padding: '20px', backgroundColor: '#e6f0f9', minHeight: '100vh' }}>
            <div className="container position-relative pt-5">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="jobs-page container">
                            <h1 className='text-dark' style={{ textAlign: 'center', marginTop: '20px' }}>Current Job Openings</h1>
                            <JobsDataTable />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JobsPage;
