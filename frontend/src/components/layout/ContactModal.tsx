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
      title="Contact Engineering Team"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs sm:text-sm text-[#EAF1F8]">
        {successResult ? (
          /* Honest Success State */
          <div className="p-4 bg-[#0D1630] rounded-xl border border-[#91AC67]/40 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 size={36} className="text-[#91AC67] mx-auto" />
            <h3 className="font-serif font-bold text-base text-[#EAF1F8]">
              Message Recorded Locally
            </h3>
            <p className="text-xs text-[#9FB0C9] leading-relaxed max-w-sm mx-auto">
              Your inquiry has been stored directly into <code className="text-[#76C0EC]">backend/app/history/messages.json</code>.
              Note: This is a standalone local demo server, so no automated email dispatch is sent to external mailboxes.
            </p>

            <div className="p-2.5 bg-[#141E3D] rounded-lg border border-[#425B9A]/30 flex items-center justify-between max-w-xs mx-auto">
              <span className="font-mono text-xs font-bold text-[#76C0EC]">
                {successResult.reference_id}
              </span>
              <CopyButton textToCopy={successResult.reference_id} label="Copy ID" />
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleResetForm}
                className="px-4 py-2 rounded-lg bg-[#1D2A52] hover:bg-[#425B9A]/40 text-[#EAF1F8] text-xs font-semibold"
              >
                Send another message
              </button>
              <button
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit} className="space-y-3">
            {serverError && (
              <div className="p-3 rounded-lg bg-[#D9534F]/20 border border-[#D9534F]/40 text-xs text-[#D9534F] flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <div>
              <label htmlFor="name-input" className="block text-xs font-medium text-[#9FB0C9] mb-1">
                Your Name <span className="text-[#D9534F]">*</span>
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className={`w-full px-3 py-2 rounded-lg bg-[#0D1630] border text-xs text-[#EAF1F8] focus:outline-none ${
                  fieldErrors.name ? 'border-[#D9534F]' : 'border-[#425B9A]/40 focus:border-[#76C0EC]'
                }`}
              />
              {fieldErrors.name && (
                <span className="text-[11px] text-[#D9534F] mt-0.5 block">{fieldErrors.name}</span>
              )}
            </div>

            <div>
              <label htmlFor="email-input" className="block text-xs font-medium text-[#9FB0C9] mb-1">
                Email Address <span className="text-[#D9534F]">*</span>
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ramesh@example.org"
                className={`w-full px-3 py-2 rounded-lg bg-[#0D1630] border text-xs text-[#EAF1F8] focus:outline-none ${
                  fieldErrors.email ? 'border-[#D9534F]' : 'border-[#425B9A]/40 focus:border-[#76C0EC]'
                }`}
              />
              {fieldErrors.email && (
                <span className="text-[11px] text-[#D9534F] mt-0.5 block">{fieldErrors.email}</span>
              )}
            </div>

            <div>
              <label htmlFor="topic-select" className="block text-xs font-medium text-[#9FB0C9] mb-1">
                Topic
              </label>
              <select
                id="topic-select"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0D1630] border border-[#425B9A]/40 text-xs text-[#EAF1F8] focus:border-[#76C0EC] focus:outline-none"
              >
                <option value="Question">Question</option>
                <option value="Feedback">Feedback</option>
                <option value="Report a bug">Report a bug</option>
                <option value="Collaboration">Collaboration</option>
              </select>
            </div>

            <div>
              <label htmlFor="message-input" className="block text-xs font-medium text-[#9FB0C9] mb-1">
                Message <span className="text-[#D9534F]">*</span>
              </label>
              <textarea
                id="message-input"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share your inquiry, observation, or bug report..."
                className={`w-full px-3 py-2 rounded-lg bg-[#0D1630] border text-xs text-[#EAF1F8] focus:outline-none ${
                  fieldErrors.message ? 'border-[#D9534F]' : 'border-[#425B9A]/40 focus:border-[#76C0EC]'
                }`}
              />
              {fieldErrors.message && (
                <span className="text-[11px] text-[#D9534F] mt-0.5 block">{fieldErrors.message}</span>
              )}
            </div>

            {/* UTM source preview if present */}
            {Object.keys(utmParams).length > 0 && (
              <div className="text-[10px] text-[#9FB0C9] font-mono">
                Attaching session source: {JSON.stringify(utmParams)}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#425B9A]/30">
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-[#9FB0C9] hover:text-[#EAF1F8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send size={13} />
                <span>{submitting ? 'Submitting...' : 'Send message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
