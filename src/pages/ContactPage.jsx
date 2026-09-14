import React, { useState } from "react";
import sendWebsiteEmail from "../services/websiteEmail";

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      await sendWebsiteEmail({
        type: "contact",
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      });

      setFormStatus("Message sent successfully!");
      form.reset();
    } catch (error) {
      console.error("Laravel email error:", error);
      setFormStatus(error.response?.data?.error || "Failed to send message. Please try again later.");
    }
  };

  return (
    <section className="py-5 mt-5">
      <div className="container">
        <h2 className="text-center mb-4">Get in Touch</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input name="name" className="form-control" required />
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
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows={4}
                  required
                />
              </div>
              <button className="btn btn-primary w-100" type="submit">
                Send Message
              </button>
            </form>
            {formStatus && (
              <div className="mt-3 alert alert-info">{formStatus}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
