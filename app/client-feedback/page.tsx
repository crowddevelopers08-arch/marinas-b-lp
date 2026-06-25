"use client";
import Image from "next/image";
import React, { useState } from 'react'

const fields = [
  {
    id: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '10-digit mobile number',
  },
] as const;

const ClientFeedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    suggestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          concern: `Client feedback: ${formData.suggestions.trim()}`,
          formName: "Marina Client Feedback",
          source: "Marina's Clinic Client Feedback Page",
          pageUrl: window.location.href,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Feedback submitted successfully!' });
        setFormData({ name: '', phone: '', suggestions: '' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to submit feedback' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--vk-lime-soft)] text-[var(--vk-green-dark)]">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="w-full overflow-hidden rounded-tl-[36px] rounded-br-[36px] border border-[var(--vk-green)]/10 bg-white/95 p-5 shadow-[0_24px_70px_rgba(18,110,110,0.16)] backdrop-blur sm:p-8">

            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <Image src="/Marina-logo.png" alt="Marina's Clinic" width={160} height={60} className="h-12 w-auto" priority />
            </div>

            <div className="mb-9 text-center sm:mb-5">
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[var(--vk-pink)]" />
              <h4 className="font-serif mb-4 text-3xl font-black text-[var(--vk-green-dark)] sm:text-5xl">
                Help Us Improve
              </h4>
              <p className="mx-auto mb-4 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
                Tell us what did not meet your expectations. Our team will review your feedback and follow up where needed.
              </p>
            </div>

            {message.text && (
              <div className={`mb-5 border px-4 py-3 text-center text-sm font-medium ${
                message.type === 'success'
                  ? 'border-[var(--vk-green)]/20 bg-[var(--vk-lime-soft)] text-[var(--vk-green-dark)]'
                  : 'border-[var(--vk-pink)]/30 bg-[var(--vk-pink)]/8 text-[var(--vk-pink-dark)]'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="mb-2 block text-sm font-semibold text-[var(--vk-green-dark)]">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    required
                    maxLength={field.id === 'phone' ? 10 : undefined}
                    pattern={field.id === 'phone' ? '\\d{10}' : undefined}
                    disabled={isSubmitting}
                    className="w-full rounded-tl-[14px] rounded-br-[14px] border border-[var(--vk-green)]/20 bg-[var(--vk-lime-soft)] px-4 py-3 text-sm text-[var(--vk-green-dark)] outline-none transition placeholder:text-gray-400 focus:border-[var(--vk-green)] focus:ring-4 focus:ring-[var(--vk-green)]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="suggestions" className="mb-2 block text-sm font-semibold text-[var(--vk-green-dark)]">
                  Your Suggestions
                </label>
                <textarea
                  id="suggestions"
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleChange}
                  required
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-tl-[14px] rounded-br-[14px] border border-[var(--vk-green)]/20 bg-[var(--vk-lime-soft)] px-4 py-3 text-sm text-[var(--vk-green-dark)] outline-none transition placeholder:text-gray-400 focus:border-[var(--vk-green)] focus:ring-4 focus:ring-[var(--vk-green)]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Share your valuable suggestions and feedback..."
                />
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-full border-2 border-[var(--vk-pink)] bg-[var(--vk-pink)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(18,110,110,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--vk-pink-dark)] disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-full border-2 border-[var(--vk-green)] bg-transparent px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--vk-green)] transition hover:bg-[var(--vk-green)] hover:text-white disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400"
                >
                  Back to Home
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientFeedback
