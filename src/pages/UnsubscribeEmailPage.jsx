import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
    const [formStatus, setFormStatus] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_8xhle0y",
                "template_pjgowmj",
                e.target,
                "6EHvX32o3dXV9nT81"
            )
            .then(() => {
                setFormStatus("We have received your request and you will be removed from our database within 24 hours.");
                e.target.reset();
            })
            .catch((error) => {
                console.error("EmailJS error:", error);
                setFormStatus("Failed to send message. Please try again later.");
            });
    };

    return (
        <section className="py-5 mt-5">
            <div className="container">
                <h2 className="text-center mb-4">Unsubscribe Email</h2>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        {formStatus && (
                            <div className="mt-3 alert alert-info">{formStatus}</div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    className="form-control"
                                    required
                                />
                            </div>
                            <button className="btn btn-primary w-100" type="submit">
                                Unsubscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;