import { X, Mail, Send, CheckCircle, RefreshCcw, User, FileText, ArrowRight, BookOpen } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('General Feedback');
  const [message, setMessage] = useState<string>('');

  // Error States
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>('');
  const [priorSubmissionsCount, setPriorSubmissionsCount] = useState<number>(0);

  // Load prior submissions list counting for user feedback metrics
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('quizmaster_submissions');
        if (stored) {
          const list: FeedbackSubmission[] = JSON.parse(stored);
          setPriorSubmissionsCount(list.length);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  // Validation
  const validateForm = () => {
    const tempErrors: { name?: string; email?: string; message?: string } = {};
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = 'Please enter your name.';
      isValid = false;
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'Please enter your email.';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!message.trim()) {
      tempErrors.message = 'Please write a message description.';
      isValid = false;
    } else if (message.trim().length < 10) {
      tempErrors.message = 'Feedback message must be at least 10 characters.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate network server latencies for fine realism
    setTimeout(() => {
      const generatedTicket = `QM-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedTicket);

      const newSubmission: FeedbackSubmission = {
        id: generatedTicket,
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
        date: new Date().toLocaleString(),
      };

      try {
        const stored = localStorage.getItem('quizmaster_submissions');
        const list: FeedbackSubmission[] = stored ? JSON.parse(stored) : [];
        list.push(newSubmission);
        localStorage.setItem('quizmaster_submissions', JSON.stringify(list));
      } catch (e) {
        console.error('Failed to log submission:', e);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setSubject('General Feedback');
    setMessage('');
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4" id="contact-modal-container">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />

      {/* Modal Dialog container */}
      <div className="bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-scale-up flex flex-col max-h-[85vh]">
        {/* Top brand header bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="p-6 border-b border-slate-100 dark:border-[#1d2442]/60 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-[#0a0d1b]/40">
          <div className="flex items-center gap-3 select-none">
            <div className="h-9 w-9 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-sans font-black text-slate-900 dark:text-white text-base">Contact Center</h3>
              <p className="text-[9.5px] font-mono uppercase tracking-wider text-slate-405 dark:text-slate-550 leading-none mt-0.5">
                Submit system reports & feature proposals
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1c234a] rounded-lg text-slate-404 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
            id="close-contact-btn"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-6 animate-scale-up" id="contact-success-panel">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-14 h-14 mx-auto flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Transmission Recorded
                </span>
                <h4 className="font-sans font-extrabold text-slate-905 dark:text-white text-base">
                  Feedback Successfully Transmitted!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thank you for your feedback! Your transmission has been queued in local browser database cache.
                </p>
              </div>

              {/* Support ticket read-out values container */}
              <div className="p-4 bg-slate-50 dark:bg-[#0a0d1b] border border-slate-200 dark:border-[#1d2442] rounded-2xl max-w-sm mx-auto text-left font-mono space-y-1.5 shadow-xs">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">TICKET_ID:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold">{ticketId}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">SENDER:</span>
                  <span className="text-slate-705 dark:text-slate-350 font-sans font-semibold">{name}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">CATEGORY:</span>
                  <span className="text-slate-705 dark:text-slate-350 font-sans font-semibold">{subject}</span>
                </div>
                <div className="border-t border-slate-201 dark:border-[#1d2442]/50 my-1 pt-1 text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                  "{message}"
                </div>
              </div>

              <div className="flex gap-3.5 justify-center max-w-sm mx-auto pt-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 py-2.5 border border-slate-205 dark:border-[#1d2442] hover:border-slate-405 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-transparent rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Submit Another</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  <span>Close Window</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans" id="contact-feedback-form">
              {/* Prior Submissions Indicator Banner */}
              {priorSubmissionsCount > 0 ? (
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-sans font-bold text-slate-550 dark:text-slate-300">
                    System logs note <span className="text-blue-600 dark:text-blue-400">{priorSubmissionsCount} submissions</span> left on this account.
                  </span>
                </div>
              ) : null}

              {/* Name field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Verma"
                    className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0c0f1e] border rounded-xl text-sm font-medium transition-all outline-hidden focus:ring-1 focus:ring-blue-500 ${
                      errors.name 
                        ? 'border-rose-500 focus:border-rose-500 text-rose-600 dark:text-rose-450' 
                        : 'border-slate-200 dark:border-[#1a213e] focus:border-blue-500 text-slate-900 dark:text-white'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-rose-500 font-bold">{errors.name}</p>}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0c0f1e] border rounded-xl text-sm font-medium transition-all outline-hidden focus:ring-1 focus:ring-blue-500 ${
                      errors.email 
                        ? 'border-rose-500 focus:border-rose-500 text-rose-600 dark:text-rose-450' 
                        : 'border-slate-200 dark:border-[#1a213e] focus:border-blue-500 text-slate-900 dark:text-white'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-rose-500 font-bold">{errors.email}</p>}
              </div>

              {/* Subject Category dropdown Selector */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">
                  Incident Category / Subject
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0c0f1e] border border-slate-200 dark:border-[#1a213e] text-slate-900 dark:text-white rounded-xl text-sm font-medium transition-all outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 select-none appearance-none cursor-pointer"
                  >
                    <option value="General Feedback">General Feedback & Praise</option>
                    <option value="Question Correction">Report Question Correction</option>
                    <option value="Bug Report">Technical Bug Report</option>
                    <option value="Feature Proposed">Feature Proposal Request</option>
                  </select>
                </div>
              </div>

              {/* Message field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Message Body Detail</span>
                  {message.length > 0 && (
                    <span className={`font-mono text-[9px] ${message.length < 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {message.length} chars
                    </span>
                  )}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your request or comments here (minimum 10 characters)..."
                  rows={4}
                  className={`w-full p-3.5 bg-slate-50 dark:bg-[#0c0f1e] border rounded-xl text-sm font-medium transition-all outline-hidden focus:ring-1 focus:ring-blue-500 leading-relaxed resize-none ${
                    errors.message 
                      ? 'border-rose-500 focus:border-rose-500 text-rose-600 dark:text-rose-450' 
                      : 'border-slate-200 dark:border-[#1a213e] focus:border-blue-500 text-slate-900 dark:text-white'
                  }`}
                />
                {errors.message && <p className="text-[10px] text-rose-500 font-bold">{errors.message}</p>}
              </div>

              {/* Action Submit bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#1d2442]/60 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3.5 py-2 hover:bg-slate-150 text-slate-405 dark:text-slate-400 hover:text-slate-900 transition-colors rounded-xl text-xs font-bold leading-none cursor-pointer"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-500/50 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider leading-none"
                  id="submit-feedback-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
