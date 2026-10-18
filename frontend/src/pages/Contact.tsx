import React, { useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../state/appStore';
import { CopyButton } from '../components/ui/CopyButton';
import { Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import type { ContactMessageResponse } from '../api/types';

export const Contact: React.FC = () => {
  const { utmParams } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Feedback');
  const [message, setMessage] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<ContactMessageResponse | null>(null);

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
      setServerError(err.message || 'Failed to submit message to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setTopic('Feedback');
    setMessage('');
    setFieldErrors({});
    setServerError(null);
    setSuccessResult(null);
  };

  return (
    <main id="main-content" className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-[#EAF7F5]">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#6FBEB2]/30">
        <div className="flex items-center gap-2 text-[#A5E9DD]">
          <MessageSquare size={24} />
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#EAF7F5]">
            Contact Engineering Team
          </h1>
        </div>
        <p className="text-sm text-[#A5E9DD]">
          Have questions regarding the mathematical engine or feedback on the educational simulator?
        </p>
      </div>

      {successResult ? (
        /* Success Card */
        <div className="p-6 bg-[#0F2226] rounded-xl border border-[#6FBEB2]/50 text-center space-y-4 shadow-xl animate-fadeIn">
          <CheckCircle2 size={42} className="text-[#A5E9DD] mx-auto" />
          <h2 className="text-xl font-serif font-bold text-[#EAF7F5]">
            Message Recorded on Demo Server
          </h2>
          <p className="text-xs sm:text-sm text-[#A5E9DD] max-w-md mx-auto leading-relaxed">
            Your inquiry has been stored locally in <code className="text-[#FDF4AF]">backend/app/history/messages.json</code>.
            As this is an offline demonstration environment, external emails are not dispatched.
          </p>

          <div className="p-3 bg-[#081416] rounded-lg border border-[#6FBEB2]/40 flex items-center justify-between max-w-xs mx-auto">
            <span className="font-mono text-xs font-bold text-[#FDF4AF]">
              {successResult.reference_id}
            </span>
            <CopyButton textToCopy={successResult.reference_id} label="Copy ID" />
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold shadow-sm transition-colors border border-[#6FBEB2]"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <form onSubmit={handleSubmit} className="p-6 bg-[#0F2226] border border-[#6FBEB2]/30 rounded-xl space-y-4 shadow-xl text-xs sm:text-sm">
          {serverError && (
            <div className="p-3 rounded-lg bg-[#FF5C5C]/20 border border-[#FF5C5C]/40 text-xs text-[#FF5C5C] flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div>
            <label htmlFor="name-page" className="block text-xs font-medium text-[#A5E9DD] mb-1">
              Your Name <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              id="name-page"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ananya Rao"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-[#081416] border text-xs sm:text-sm text-[#EAF7F5] focus:outline-none ${
                fieldErrors.name ? 'border-[#FF5C5C]' : 'border-[#6FBEB2]/40 focus:border-[#A5E9DD]'
              }`}
            />
            {fieldErrors.name && (
              <span className="text-xs text-[#FF5C5C] mt-1 block">{fieldErrors.name}</span>
            )}
          </div>

          <div>
            <label htmlFor="email-page" className="block text-xs font-medium text-[#A5E9DD] mb-1">
              Email Address <span className="text-[#FF5C5C]">*</span>
            </label>
            <input
              id="email-page"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ananya@example.org"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-[#081416] border text-xs sm:text-sm text-[#EAF7F5] focus:outline-none ${
                fieldErrors.email ? 'border-[#FF5C5C]' : 'border-[#6FBEB2]/40 focus:border-[#A5E9DD]'
              }`}
            />
            {fieldErrors.email && (
              <span className="text-xs text-[#FF5C5C] mt-1 block">{fieldErrors.email}</span>
            )}
          </div>

          <div>
            <label htmlFor="topic-page" className="block text-xs font-medium text-[#A5E9DD] mb-1">
              Topic
            </label>
            <select
              id="topic-page"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#081416] border border-[#6FBEB2]/40 text-xs sm:text-sm text-[#EAF7F5] focus:border-[#A5E9DD] focus:outline-none"
            >
              <option value="Question">Question</option>
              <option value="Feedback">Feedback</option>
              <option value="Report a bug">Report a bug</option>
              <option value="Collaboration">Collaboration</option>
            </select>
          </div>

          <div>
            <label htmlFor="message-page" className="block text-xs font-medium text-[#A5E9DD] mb-1">
              Message <span className="text-[#FF5C5C]">*</span>
            </label>
            <textarea
              id="message-page"
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Provide context regarding your suggestion, bug report, or research inquiry..."
              className={`w-full px-3.5 py-2.5 rounded-lg bg-[#081416] border text-xs sm:text-sm text-[#EAF7F5] focus:outline-none ${
                fieldErrors.message ? 'border-[#FF5C5C]' : 'border-[#6FBEB2]/40 focus:border-[#A5E9DD]'
              }`}
            />
            {fieldErrors.message && (
              <span className="text-xs text-[#FF5C5C] mt-1 block">{fieldErrors.message}</span>
            )}
          </div>

          {/* Captured UTM notice */}
          {Object.keys(utmParams).length > 0 && (
            <div className="p-2.5 rounded bg-[#081416] border border-[#6FBEB2]/30 text-[11px] font-mono text-[#A5E9DD]">
              Session tracking parameters will be attached to message log: {JSON.stringify(utmParams)}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md border border-[#6FBEB2]"
            >
              <Send size={14} />
              <span>{submitting ? 'Submitting...' : 'Submit Message'}</span>
            </button>
          </div>
        </form>
      )}
    </main>
  );
};
