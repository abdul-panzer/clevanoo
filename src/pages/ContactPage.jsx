import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_n7jxnhk",
        "template_bfll5t7",
        e.target,
        "6EHvX32o3dXV9nT81"
      )
      .then(() => {
        setFormStatus("Message sent successfully!");
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