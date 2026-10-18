import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { CopyButton } from '../ui/CopyButton';
import { api } from '../../api/client';
import { useApp } from '../../state/appStore';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ContactMessageResponse } from '../../api/types';

export const ContactModal: React.FC = () => {
  const { contactModalOpen, setContactModalOpen, utmParams } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Feedback');
  const [message, setMessage] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<ContactMessageResponse | null>(null);

  if (!contactModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Please provide your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Please provide a valid email address.';
    if (message.trim().length < 5) errs.message = 'Message must be at least 5 characters long.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await api.submitContact({
        name,
        email,
        topic,
        message,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
      });
      setSuccessResult(res);
    } catch (err: any) {
      setServerError(err.message || 'Failed to connect to backend server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setTopic('Feedback');
    setMessage('');
    setFieldErrors({});
    setServerError(null);
    setSuccessResult(null);
  };

  return (
    <Modal
      isOpen={contactModalOpen}
      onClose={() => setContactModalOpen(false)}
      title="Contact Advisory & Engineering"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs sm:text-sm text-[#F8F3EF]">
        {successResult ? (
          /* Honest Success State */
          <div className="p-5 bg-[#1C3C53] rounded-2xl border border-[#F5E6BB]/50 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 size={36} className="text-[#F5E6BB] mx-auto" />
            <h3 className="font-heading font-bold text-base text-[#F8F3EF]">
              Inquiry Stored on Demo Server
            </h3>
            <p className="text-xs text-[#F8F3EF] leading-relaxed max-w-sm mx-auto">
              Your inquiry has been stored directly into <code className="text-[#08C4E1] font-mono">backend/app/history/messages.json</code>.
              Note: This is a standalone local demo server, so external mail dispatch is not configured.
            </p>

            <div className="p-2.5 bg-[#446882] rounded-xl border border-[#08C4E1]/30 flex items-center justify-between max-w-xs mx-auto">
              <span className="font-mono text-xs font-bold text-[#08C4E1]">
                {successResult.reference_id}
              </span>
              <CopyButton textToCopy={successResult.reference_id} label="Copy ID" />
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleResetForm}
                className="px-4 py-2 rounded-xl bg-[#1C3C53] hover:bg-[#446882] text-[#F8F3EF] text-xs font-semibold border border-[#08C4E1]/25 transition-colors"
              >
                Send another message
              </button>
              <button
                onClick={() => setContactModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] text-xs font-heading font-bold shadow-md shadow-[#08C4E1]/25"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit} className="space-y-3">
            {serverError && (
              <div className="p-3 rounded-lg bg-[#F5E6BB]/20 border border-[#F5E6BB]/40 text-xs text-[#F5E6BB] flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <div>
              <label htmlFor="name-input" className="block text-xs font-medium text-[#F8F3EF] mb-1">
                Your Name <span className="text-[#F5E6BB]">*</span>
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className={`w-full px-3 py-2 rounded-xl bg-[#1C3C53] border text-xs text-[#F8F3EF] focus:outline-none ${
                  fieldErrors.name ? 'border-[#F5E6BB]' : 'border-[#08C4E1]/25 focus:border-[#08C4E1]'
                }`}
              />
              {fieldErrors.name && (
                <span className="text-[11px] text-[#F5E6BB] mt-0.5 block">{fieldErrors.name}</span>
              )}
            </div>

            <div>
              <label htmlFor="email-input" className="block text-xs font-medium text-[#F8F3EF] mb-1">
                Email Address <span className="text-[#F5E6BB]">*</span>
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ramesh@example.org"
                className={`w-full px-3 py-2 rounded-xl bg-[#1C3C53] border text-xs text-[#F8F3EF] focus:outline-none ${
                  fieldErrors.email ? 'border-[#F5E6BB]' : 'border-[#08C4E1]/25 focus:border-[#08C4E1]'
                }`}
              />
              {fieldErrors.email && (
                <span className="text-[11px] text-[#F5E6BB] mt-0.5 block">{fieldErrors.email}</span>
              )}
            </div>

            <div>
              <label htmlFor="topic-select" className="block text-xs font-medium text-[#F8F3EF] mb-1">
                Topic
              </label>
              <select
                id="topic-select"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1C3C53] border border-[#08C4E1]/25 text-xs text-[#F8F3EF] focus:border-[#08C4E1] focus:outline-none"
              >
                <option value="Question">Technical Question</option>
                <option value="Feedback">UI / Architecture Feedback</option>
                <option value="Report a bug">Report a Bug</option>
                <option value="Collaboration">Collaboration / Academic Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="message-input" className="block text-xs font-medium text-[#F8F3EF] mb-1">
                Message <span className="text-[#F5E6BB]">*</span>
              </label>
              <textarea
                id="message-input"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share your inquiry, observation, or bug report..."
                className={`w-full px-3 py-2 rounded-xl bg-[#1C3C53] border text-xs text-[#F8F3EF] focus:outline-none ${
                  fieldErrors.message ? 'border-[#F5E6BB]' : 'border-[#08C4E1]/25 focus:border-[#08C4E1]'
                }`}
              />
              {fieldErrors.message && (
                <span className="text-[11px] text-[#F5E6BB] mt-0.5 block">{fieldErrors.message}</span>
              )}
            </div>

            {/* UTM source preview if present */}
            {Object.keys(utmParams).length > 0 && (
              <div className="text-[10px] text-[#F8F3EF] font-mono">
                Attaching session source: {JSON.stringify(utmParams)}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#08C4E1]/20">
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#F8F3EF] hover:text-[#F8F3EF] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] text-xs font-heading font-bold flex items-center gap-1.5 transition-transform hover:scale-105 disabled:opacity-50 shadow-md shadow-[#08C4E1]/25"
              >
                <Send size={13} />
                <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
