import { useState, useEffect, useRef } from "react";
import { Clock, Send, ChevronDown, CheckCircle2, Loader2, Calendar, MessageSquare, ArrowUp, Phone, Mail, MessageCircle, Globe, Smartphone, Radio, Headphones, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendEmailNotification } from "@/lib/notify";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [faqFeedback, setFaqFeedback] = useState<Record<number, "helpful" | "not-helpful" | undefined>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [successParticles, setSuccessParticles] = useState<{ id: number; x: number; delay: number; color: string; size: number; rotation: number }[]>([]);
  const [clickedReply, setClickedReply] = useState<number | null>(null);
  const [typingReply, setTypingReply] = useState<number | null>(null);
  const [rippleCard, setRippleCard] = useState<number | null>(null);
  const [feedbackBadge, setFeedbackBadge] = useState<number | null>(null);
  const particleIdRef = useRef(0);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const msgTextareaRef = useRef<HTMLTextAreaElement>(null);
  const messageMaxLength = 1000;

  const autoGrowTextarea = () => {
    const el = msgTextareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
    }
  };

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [booking, setBooking] = useState({ orgName: "", contact: "", email: "", phone: "", purpose: "", participants: 1, date: "", timeSlot: "", customTime: "", info: "" });
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const bookedDates = new Set<string>();
  const limitedDates = new Set<string>();
  for (let i = 10; i <= 20; i++) { const d = new Date(); d.setDate(d.getDate() + i); bookedDates.add(d.toISOString().slice(0, 10)); }
  for (let i = 3; i <= 28; i += 7) { const d = new Date(); d.setDate(d.getDate() + i); if (!bookedDates.has(d.toISOString().slice(0, 10))) limitedDates.add(d.toISOString().slice(0, 10)); }

  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calFirstDow = new Date(calYear, calMonth, 1).getDay();
  const calMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const updateBooking = (field: string, value: string | number) => {
    setBooking(prev => ({ ...prev, [field]: value }));
    if (bookingErrors[field]) setBookingErrors(prev => ({ ...prev, [field]: "" }));
  };

  const bookingPurposes = ["Team Meeting", "Seminar", "Workshop", "Conference Talk", "Group Discussion", "Presentation", "Training Session", "Other"];
  const bookingTimeSlots = ["9:00 AM - 11:00 AM", "11:00 AM - 1:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM", "Other (specify)"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('[class*="reveal"]').forEach((el) => observer.observe(el));

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    };
    window.addEventListener("scroll", handleScroll);

    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }

    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (!formData[field as keyof typeof formData].trim()) {
      setErrors(prev => ({ ...prev, [field]: "Required" }));
    }
  };

  const isFieldValid = (field: string) => {
    if (!touched[field]) return null;
    return !errors[field] && formData[field as keyof typeof formData].trim();
  };

  const getFieldBorder = (field: string) => {
    if (isFieldValid(field)) return "border-green-400";
    if (touched[field] && errors[field]) return "border-red-400 shake-input";
    return focusedField === field ? "border-jorc-green ring-2 ring-jorc-green/20" : "border-jorc-green-lighter";
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.subject) newErrors.subject = "Select a subject";
    if (!formData.message.trim()) newErrors.message = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBooking = () => {
    const newErrors: Record<string, string> = {};
    if (!booking.orgName.trim()) newErrors.orgName = "Required";
    if (!booking.contact.trim()) newErrors.contact = "Required";
    if (!booking.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) newErrors.email = "Invalid email";
    if (!booking.phone.trim()) newErrors.phone = "Required";
    if (!booking.purpose) newErrors.purpose = "Select a purpose";
    if (!booking.date) newErrors.date = "Select a date";
    if (!booking.timeSlot) newErrors.timeSlot = "Select a time slot";
    if (booking.timeSlot === "other" && !booking.customTime.trim()) newErrors.customTime = "Specify your time range";
    setBookingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBooking()) return;
    setBookingSubmitting(true);
    const { error } = await supabase.from("facility_bookings").insert({
      org_name: booking.orgName, contact_person: booking.contact, email: booking.email,
      phone: booking.phone, purpose: booking.purpose, participants: booking.participants,
      date: booking.date, time_slot: booking.timeSlot === "other" ? booking.customTime : booking.timeSlot,
      additional_info: booking.info, source: "contact",
    });
    setBookingSubmitting(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setBookingSubmitted(true);
    toast({ title: "Booking submitted!", description: "We'll contact you within 24 hours to confirm." });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        first_name: formData.firstName, last_name: formData.lastName, email: formData.email,
        phone: formData.phone || null, subject: formData.subject, message: formData.message,
      });
      if (error) console.warn("Supabase insert failed:", error.message);
    } catch (e) {
      console.warn("Supabase not configured, skipping database save");
    }
    setSubmitting(false);
    sendEmailNotification("contact", {
      "First Name": formData.firstName,
      "Last Name": formData.lastName,
      Email: formData.email,
      Phone: formData.phone || "-",
      Subject: formData.subject,
      Message: formData.message,
    });
    setSubmitted(true);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    const confettiColors = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#a855f7", "#ec4899"];
    const particles = Array.from({ length: 30 }, () => ({
      id: particleIdRef.current++,
      x: Math.random() * 100,
      delay: Math.random() * 0.6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: Math.random() * 6 + 3,
      rotation: Math.random() * 360,
    }));
    setSuccessParticles(particles);
    setTimeout(() => setSuccessParticles([]), 2500);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied!`, description: text });
    } catch { /* fallback */ }
  };

  const subjects = ["General Inquiry", "Program Enrollment", "Lab Booking", "Partnership Opportunity", "Technical Support", "Media Inquiry", "Other"];

  const faqs = [
    { q: "What are the operating hours?", a: "JORC is open Monday to Friday, from 8am to 5pm. We are closed on weekends and public holidays." },
    { q: "Is there a fee for using the facilities?", a: "Yes! All our services are completely free, including library access and ICT training. The multimedia room is also available at no cost for non-profit programs related to ICT. For profit initiatives or non-ICT related programs, kindly contact us to discuss the professional modalities." },
    { q: "How do I register for IT training?", a: "You can register in person at our reception, or call us at +234 916 126 9000." },
    { q: "Can the seminar room be rented for events?", a: "Yes! The multimedia seminar room is available for community events, workshops, and meetings. Please contact us for scheduling and availability." },
  ];

  return (
    <div>
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal-left.is-visible { opacity: 1; transform: translateX(0); }
        .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal-right.is-visible { opacity: 1; transform: translateX(0); }
        .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal-scale.is-visible { opacity: 1; transform: scale(1); }
        .card-glow:hover { box-shadow: 0 0 25px rgba(26, 71, 42, 0.25); }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes checkBounce { 0% { transform: scale(0); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        @keyframes fillBar { from { width: 0; } to { width: 100%; } }
        .shake-input { animation: shake 0.4s ease-in-out; }
        .form-input-ring { transition: border-color 0.2s, box-shadow 0.2s; }
        .char-counter { font-size: 0.75rem; color: #94a3b8; text-align: right; transition: color 0.2s; }
        .char-counter.near-limit { color: #f59e0b; }
        .char-counter.over-limit { color: #ef4444; }
        .animate-fadeSlideIn { animation: fadeSlideIn 0.35s ease-out both; }
        .border-pulse { animation: borderPulse 2.5s ease-in-out infinite; }
        .typing-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: currentColor; animation: typingDot 1s ease-in-out infinite; }
        .form-bg-pattern { background-image: radial-gradient(circle at 1px 1px, rgba(26,71,42,0.06) 1px, transparent 0); background-size: 20px 20px; }
        .ripple-btn { position: relative; overflow: hidden; }
        .input-icon { transition: color 0.2s; }
        .input-group:focus-within .input-icon { color: #1A472A; }
        .valid-check { opacity: 0; transform: scale(0); transition: all 0.2s ease-out; }
        .valid-check.show { opacity: 1; transform: scale(1); }
        .faq-content { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s ease-out; }
        .faq-content.open { grid-template-rows: 1fr; height: auto; }
        .faq-content > div { overflow: hidden; }
        .counter-btn { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #1A472A; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #1A472A; background: white; }
        .counter-btn:hover { background: #1A472A; color: white; }
        .counter-btn:active { transform: scale(0.9); }
        .submit-loading-bar { height: 3px; background: linear-gradient(90deg, #1A472A, #2D6B3E, #1A472A); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; border-radius: 0 0 12px 12px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 33% { transform: translateY(-15px) rotate(1deg); } 66% { transform: translateY(8px) rotate(-1deg); } }
        @keyframes floatDelayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes statusPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes confettiFall { 0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); } 100% { opacity: 0; transform: translateY(80px) rotate(360deg) scale(0); } }
        @keyframes cardFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes ringExpand { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes staggerFade { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); } 70% { box-shadow: 0 0 0 16px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        @keyframes waveMove { 0% { transform: translateX(-50%) translateY(0) scaleY(1); } 50% { transform: translateX(-30%) translateY(5px) scaleY(0.8); } 100% { transform: translateX(-50%) translateY(0) scaleY(1); } }
        @keyframes tooltipSlide { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes progressFill { from { stroke-dashoffset: 126; } to { stroke-dashoffset: var(--progress); } }
        @keyframes highlightPulse { 0%, 100% { background-color: rgba(26, 71, 42, 0.05); } 50% { background-color: rgba(26, 71, 42, 0.15); } }
        @keyframes btnPop { 0% { transform: scale(1); } 50% { transform: scale(0.92); } 100% { transform: scale(1); } }
        @keyframes typingDot { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
        @keyframes borderPulse { 0%, 100% { border-color: rgba(26,71,42,0.1); box-shadow: 0 0 0 0 rgba(26,71,42,0); } 50% { border-color: rgba(26,71,42,0.25); box-shadow: 0 0 16px -4px rgba(26,71,42,0.12); } }
        @keyframes floatCircle { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.05); } }
        @keyframes accentSlide { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes iconPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes rippleEffect { to { transform: scale(3); opacity: 0; } }
        @keyframes badgeFade { 0% { opacity: 0; transform: translateY(4px); } 20% { opacity: 1; transform: translateY(0); } 80% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-4px); } }
        @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-30px); opacity: 0; } }
        @keyframes slideInRight { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(30px); opacity: 0; } }
        @keyframes slideInLeft { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes bubbleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .stagger-item { animation: staggerFade 0.5s ease-out both; }
        .btn-pop { animation: btnPop 0.3s ease-out; }
        .accent-bar { transform: scaleX(0); transform-origin: left; }
        .group:hover .accent-bar { animation: accentSlide 0.35s ease-out forwards; }
        .group:hover .icon-animate { animation: iconPulse 0.8s ease-in-out infinite; }
        .ripple-overlay { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; }
        .ripple-overlay span { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.4); transform: scale(0); animation: rippleEffect 0.6s ease-out; }
        .feedback-badge { animation: badgeFade 1.5s ease-out forwards; }
        .icon-slide-out { animation: slideOutLeft 0.25s ease-out forwards; }
        .icon-slide-in { animation: slideInRight 0.25s ease-out forwards; }
        .icon-slide-out-right { animation: slideOutRight 0.25s ease-out forwards; }
        .icon-slide-in-left { animation: slideInLeft 0.25s ease-out forwards; }
        .bubble-in { animation: bubbleIn 0.35s ease-out both; }
        .typing-indicator span { animation: typingDot 1.4s ease-in-out infinite; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        .pulse-ring { animation: pulseRing 2s ease-out infinite; }
        .wave-bg { animation: waveMove 6s ease-in-out infinite; }
        .tooltip-in { animation: tooltipSlide 0.3s ease-out forwards; }
        .float-shape { animation: float 6s ease-in-out infinite; }
        .float-shape-2 { animation: floatDelayed 8s ease-in-out infinite; }
        .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        .gradient-text { background: linear-gradient(135deg, #1A472A, #2D6B3E, #1A472A); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradientShift 4s ease-in-out infinite; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; animation: statusPulse 2s ease-in-out infinite; }
        .status-dot.open { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
        .status-dot.closed { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
        .social-icon-wrap:hover .social-tooltip { opacity: 1; transform: translateY(0); }
        .social-tooltip { position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%) translateY(4px); opacity: 0; transition: all 0.2s; white-space: nowrap; font-size: 0.65rem; background: #1A472A; color: white; padding: 2px 8px; border-radius: 4px; pointer-events: none; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(26, 71, 42, 0.08); padding: 6px 16px; border-radius: 50px; font-size: 0.85rem; color: #1A472A; font-weight: 500; border: 1px solid rgba(26, 71, 42, 0.15); transition: all 0.3s; }
        .hero-badge:hover { background: #1A472A; color: white; border-color: #1A472A; }
        .stat-card { transition: all 0.3s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(26, 71, 42, 0.15); }
        .back-to-top { position: fixed; bottom: 30px; right: 30px; width: 44px; height: 44px; border-radius: 50%; background: #1A472A; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transform: scale(0); transition: all 0.3s; box-shadow: 0 4px 15px rgba(26, 71, 42, 0.3); z-index: 50; }
        .back-to-top.visible { opacity: 1; transform: scale(1); }
        .back-to-top:hover { transform: scale(1.1); background: #2D6B3E; }
        @media (max-width: 768px) { .back-to-top { bottom: 20px; right: 20px; width: 38px; height: 38px; } }
      `}</style>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Header */}
        <section className="text-center reveal relative overflow-hidden py-12 md:py-16 bg-jorc-green">
          {/* Shining glow ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-3xl pulse-glow" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 30%, transparent 70%)" }} />
          </div>
          {/* Decorative floating communication icons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <MessageSquare className="hidden md:block float-shape absolute top-8 left-[8%] h-9 w-9 text-white/60" strokeWidth={1.5} />
            <Send className="hidden md:block float-shape-2 absolute top-14 right-[10%] h-11 w-11 text-jorc-green-lighter/70" strokeWidth={1.5} />
            <Phone className="hidden md:block float-shape absolute bottom-14 left-[12%] h-8 w-8 text-white/50" strokeWidth={1.5} />
            <Mail className="hidden md:block float-shape-2 absolute top-4 right-[30%] h-7 w-7 text-white/60" strokeWidth={1.5} />
            <MessageCircle className="hidden md:block float-shape absolute bottom-28 right-[6%] h-10 w-10 text-jorc-green-lighter/60" strokeWidth={1.5} />
            <Globe className="hidden md:block float-shape absolute top-1/3 left-[3%] h-10 w-10 text-white/40" strokeWidth={1.5} />
            <Smartphone className="hidden md:block float-shape-2 absolute bottom-8 left-[35%] h-8 w-8 text-jorc-green-lighter/60" strokeWidth={1.5} />
            <Radio className="hidden md:block float-shape absolute top-1/2 right-[4%] h-9 w-9 text-white/45" strokeWidth={1.5} />
            <Headphones className="hidden md:block float-shape-2 absolute bottom-1/3 right-[22%] h-8 w-8 text-white/50" strokeWidth={1.5} />
            <div className="pulse-glow absolute top-1/2 left-1/3 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-6 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-4 py-1.5 rounded-full text-sm font-medium">
              We'd love to hear from you
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Let's Start a Conversation
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Have a question about our programs, want to book a facility, or need guidance 
              on your digital literacy journey? We're here to help every step of the way.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="reveal pt-16 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-jorc-green/10 blur-2xl pointer-events-none" style={{ animation: "floatCircle 7s ease-in-out infinite" }} />
          <div className="absolute -bottom-8 right-8 w-24 h-24 rounded-full bg-jorc-green/10 blur-xl pointer-events-none" style={{ animation: "floatCircle 9s ease-in-out infinite reverse 1s" }} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-12">
            {[
              { icon: <Phone className="h-5 w-5" />, label: "Call Us", value: "+234 916 126 9000", href: "tel:+2349161269000", copy: "+234 916 126 9000", copyLabel: "Phone", accent: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #34d399)" },
              { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, label: "WhatsApp", value: "+234 916 126 9000", href: "https://wa.me/2349161269000", accent: "#25D366", gradient: "linear-gradient(135deg, #25D366, #059669)" },
              { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, label: "Instagram", value: "@jonahotunlaresourcecentre", href: "https://www.instagram.com/jonahotunlaresourcecentre/", accent: "#E4405F", gradient: "linear-gradient(135deg, #ec4899, #a855f7)" },
              { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, label: "Facebook", value: "/Jonah-Otunla-Resource-Centre", href: "https://www.facebook.com/people/Jonah-Otunla-Resource-Centre/61587649062583/", accent: "#1877F2", gradient: "linear-gradient(135deg, #1877F2, #1d4ed8)" },
              { icon: <Mail className="h-5 w-5" />, label: "Email", value: "info@jorcenter.org", href: "mailto:info@jorcenter.org", copy: "info@jorcenter.org", copyLabel: "Email", accent: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #f97316)" },
              { icon: <MapPin className="h-5 w-5" />, label: "Address", value: "JORC Building, Saki Road, Irawo-Owode, Atisbo LGA, Oyo State, Nigeria", accent: "#14b8a6", gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)" },
            ].map((card, i) => (
              <div key={i} className="stagger-item relative bg-white border border-jorc-green-lighter rounded-xl overflow-hidden hover:shadow-lg hover:border-jorc-green/30 hover:-translate-y-1 transition-all duration-300 group text-center cursor-pointer" style={{ animationDelay: `${i * 0.08}s` }} onClick={() => {
                if (card.href) window.open(card.href, "_blank");
                else if (card.copy && card.copyLabel) { copyToClipboard(card.copy, card.copyLabel); setFeedbackBadge(i); setTimeout(() => setFeedbackBadge(null), 1500); }
                setRippleCard(i); setTimeout(() => setRippleCard(null), 600);
              }}>
                {/* Accent bar */}
                <div className="accent-bar absolute top-0 left-0 right-0 h-1" style={{ background: card.accent }} />
                {/* Ripple overlay */}
                <div className="ripple-overlay">{rippleCard === i && <span key={rippleCard} style={{ top: "50%", left: "50%", width: 20, height: 20, transform: "translate(-50%,-50%) scale(0)" }} />}</div>
                <div className="p-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all duration-300" style={{ background: card.gradient }}>
                    <div className="text-white icon-animate">{card.icon}</div>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-xs mb-1">{card.label}</h4>
                  {card.href ? (
                    <a href={card.href} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-jorc-green transition-colors" onClick={e => e.stopPropagation()}>{card.value}</a>
                  ) : (
                    <p className="text-xs text-muted-foreground">{card.value}</p>
                  )}
                </div>
                {/* Feedback badge */}
                {feedbackBadge === i && (
                  <div className="feedback-badge absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-jorc-green text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-lg z-10 whitespace-nowrap">
                    {card.copy ? "Copied!" : "Opening..."}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="reveal">
            {submitted ? (
              <div className="relative bg-jorc-green rounded-2xl p-10 text-center text-white overflow-hidden" style={{ animation: "scaleIn 0.5s ease-out" }}>
                {successParticles.map(p => (
                  <div key={p.id} className="absolute" style={{ left: `${p.x}%`, top: "-10%", animation: `confettiFall 1.2s ease-out ${p.delay}s forwards` }}>
                    <div style={{ width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, borderRadius: "2px", transform: `rotate(${p.rotation}deg)` }} />
                  </div>
                ))}
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6" style={{ animation: "checkBounce 0.6s ease-out" }}>
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                  <p className="text-white/80 max-w-md mx-auto">
                    Thank you for reaching out! We've received your message and will get back to you within 24 hours.
                  </p>
                  <Button onClick={() => { setSubmitted(false); setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" }); setErrors({}); setTouched({}); setShowMessageForm(false); }} className="mt-6 bg-white text-jorc-green hover:bg-white/90 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.97]">
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : !showMessageForm ? (
              <div className="relative text-center py-10 bg-jorc-green/[0.02] rounded-2xl border-2 border-jorc-green/10 border-dashed hover:border-jorc-green/30 transition-all duration-300 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-jorc-green/10 blur-xl pointer-events-none" style={{ animation: "floatCircle 6s ease-in-out infinite" }} />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-jorc-green/15 blur-lg pointer-events-none" style={{ animation: "floatCircle 8s ease-in-out infinite reverse" }} />
                <div className="bg-jorc-green/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-7 w-7 text-jorc-green" />
                </div>
                <h3 className="text-xl font-bold text-jorc-green mb-2">Send us a Message</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">Have a question or need assistance? We'd love to hear from you.</p>
                <Button onClick={() => { setShowMessageForm(true); }} className="px-8 py-6 text-lg bg-jorc-green hover:bg-jorc-green-light text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]">
                  <Send className="h-5 w-5 mr-2" />
                  Send a Message
                </Button>
              </div>
            ) : (
              <div id="send-message" className="relative bg-jorc-green/[0.02] rounded-2xl border-2 border-jorc-green/10 shadow-sm hover:shadow-lg hover:border-jorc-green/25 transition-all duration-300 overflow-hidden border-pulse form-bg-pattern">
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-jorc-green/10 blur-xl pointer-events-none" style={{ animation: "floatCircle 6s ease-in-out infinite" }} />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-jorc-green/15 blur-lg pointer-events-none" style={{ animation: "floatCircle 8s ease-in-out infinite reverse" }} />
                <div className="absolute top-1/3 right-8 w-12 h-12 rounded-full bg-jorc-green/10 blur-md pointer-events-none" style={{ animation: "floatCircle 7s ease-in-out infinite 1s" }} />
                <div className="absolute bottom-1/4 left-12 w-8 h-8 rounded-full bg-jorc-green/10 blur-sm pointer-events-none" style={{ animation: "floatCircle 9s ease-in-out infinite 2s" }} />
                <div className="p-4 md:p-6 pb-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-jorc-green/10 rounded-lg p-2">
                        <Send className="h-5 w-5 text-jorc-green" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-jorc-green">Send us a Message</h3>
                        <p className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                    <button onClick={() => setShowMessageForm(false)} className="flex-shrink-0 p-2 rounded-lg hover:bg-jorc-green/10 text-gray-400 hover:text-jorc-green transition-all duration-200" title="Close form">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
                <div className="px-6 pb-1">
                  <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    <span>Tap to fill —</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { subject: "program-enrollment", msg: "I'd like to enroll in a program. Can you provide details?" },
                      { subject: "general-inquiry", msg: "What are your operating hours and location?" },
                      { subject: "lab-booking", msg: "I'd like to book the ICT lab. What's the process?" },
                      { subject: "partnership-opportunity", msg: "I'm interested in partnering with JORC. Let's discuss." },
                    ].map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                          setTypingReply(i);
                          setFormData(prev => ({ ...prev, subject: q.subject, message: "" }));
                          typingTimerRef.current = setTimeout(() => {
                            setFormData(prev => ({ ...prev, subject: q.subject, message: q.msg }));
                            setTouched(prev => ({ ...prev, subject: true }));
                            setTypingReply(null);
                            setClickedReply(i);
                            setTimeout(() => setClickedReply(null), 400);
                            setTimeout(autoGrowTextarea, 50);
                          }, 600);
                        }}
                        className={`bubble-in flex items-start gap-2.5 text-[11px] md:text-xs bg-gray-100 hover:bg-jorc-green/15 text-gray-700 hover:text-jorc-green rounded-2xl rounded-bl-sm px-4 py-2.5 transition-all duration-200 active:scale-[0.97] text-left w-full ${typingReply === i ? "bg-jorc-green/10 text-jorc-green ring-1 ring-jorc-green/20" : clickedReply === i ? "bg-jorc-green/15 text-jorc-green ring-1 ring-jorc-green/30" : ""}`}
                        style={{ animationDelay: `${i * 0.08}s` }}
                      >
                        <svg className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-jorc-green/60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.88.54 3.63 1.48 5.12L2 22l5.12-1.48C8.37 21.46 10.12 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                        {typingReply === i ? (
                          <span className="flex items-center gap-1">
                            <span className="typing-dot" style={{ animationDelay: "0s" }} />
                            <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                            <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                          </span>
                        ) : (
                          <span>{q.msg.length > 50 ? q.msg.slice(0, 50) + "..." : q.msg}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {submitting && <div className="submit-loading-bar" />}
                <form className="p-4 md:p-6 pt-3 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4 animate-fadeSlideIn" style={{ animationDelay: "0.05s" }}>
                    <div className="input-group">
                      <Label htmlFor="firstName" className="text-sm font-medium text-jorc-green">First Name *</Label>
                      <div className="relative mt-1">
                        <svg className="input-icon absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <Input id="firstName" value={formData.firstName} onFocus={() => setFocusedField("firstName")} onBlur={() => { setFocusedField(null); handleBlur("firstName"); }} onChange={e => updateField("firstName", e.target.value)} placeholder="Enter your first name" className={`h-11 pl-9 form-input-ring rounded-xl ${getFieldBorder("firstName")}`} />
                        <svg className={`valid-check absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 ${isFieldValid("firstName") ? "show" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {touched.firstName && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="input-group">
                      <Label htmlFor="lastName" className="text-sm font-medium text-jorc-green">Last Name *</Label>
                      <div className="relative mt-1">
                        <svg className="input-icon absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <Input id="lastName" value={formData.lastName} onFocus={() => setFocusedField("lastName")} onBlur={() => { setFocusedField(null); handleBlur("lastName"); }} onChange={e => updateField("lastName", e.target.value)} placeholder="Enter your last name" className={`h-11 pl-9 form-input-ring rounded-xl ${getFieldBorder("lastName")}`} />
                        <svg className={`valid-check absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 ${isFieldValid("lastName") ? "show" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {touched.lastName && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 animate-fadeSlideIn" style={{ animationDelay: "0.12s" }}>
                    <div className="input-group">
                      <Label htmlFor="email" className="text-sm font-medium text-jorc-green">Email Address *</Label>
                      <div className="relative mt-1">
                        <svg className="input-icon absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <Input id="email" type="email" value={formData.email} onFocus={() => setFocusedField("email")} onBlur={() => { setFocusedField(null); handleBlur("email"); }} onChange={e => updateField("email", e.target.value)} placeholder="your.email@example.com" className={`h-11 pl-9 form-input-ring rounded-xl ${getFieldBorder("email")}`} />
                        <svg className={`valid-check absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 ${isFieldValid("email") ? "show" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="input-group">
                      <Label htmlFor="phone" className="text-sm font-medium text-jorc-green">Phone Number</Label>
                      <div className="relative mt-1">
                        <svg className="input-icon absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <Input id="phone" value={formData.phone} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} onChange={e => updateField("phone", e.target.value)} placeholder="+234 XXX XXX XXXX" className={`h-11 pl-9 form-input-ring rounded-xl ${focusedField === "phone" ? "border-jorc-green ring-2 ring-jorc-green/20" : "border-jorc-green-lighter"}`} />
                      </div>
                    </div>
                  </div>
                  <div className="input-group animate-fadeSlideIn" style={{ animationDelay: "0.19s" }}>
                    <Label htmlFor="subject" className="text-sm font-medium text-jorc-green">Subject *</Label>
                    <div className="relative mt-1">
                      <svg className="input-icon absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                      <Select value={formData.subject} onValueChange={v => { updateField("subject", v); setTouched(prev => ({ ...prev, subject: true })); }}>
                        <SelectTrigger className={`h-11 pl-9 form-input-ring rounded-xl ${errors.subject && touched.subject ? "border-red-400 shake-input" : focusedField === "subject" ? "border-jorc-green ring-2 ring-jorc-green/20" : "border-jorc-green-lighter"}`}>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject.toLowerCase().replace(/\s+/g, '-')}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <svg className={`valid-check absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 ${touched.subject && !errors.subject && formData.subject ? "show" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {touched.subject && errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>
                  <div className="input-group animate-fadeSlideIn" style={{ animationDelay: "0.26s" }}>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message" className="text-sm font-medium text-jorc-green">Message *</Label>
                      <span className={`char-counter ${formData.message.length > messageMaxLength ? "over-limit" : formData.message.length > messageMaxLength * 0.85 ? "near-limit" : ""}`}>
                        {formData.message.length}/{messageMaxLength}
                      </span>
                    </div>
                    <div className="relative mt-1">
                      <svg className="input-icon absolute left-3 top-4 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      <Textarea ref={msgTextareaRef} id="message" value={formData.message} onFocus={() => setFocusedField("message")} onBlur={() => { setFocusedField(null); handleBlur("message"); }} onChange={e => { if (e.target.value.length <= messageMaxLength) { updateField("message", e.target.value); setTimeout(autoGrowTextarea, 0); } }} placeholder="Please provide details about your inquiry..." rows={4} className={`pl-9 form-input-ring rounded-xl resize-none overflow-hidden min-h-[100px] ${getFieldBorder("message")}`} />
                    </div>
                    {touched.message && errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <Button type="submit" disabled={submitting || formData.message.length > messageMaxLength} className="ripple-btn bg-jorc-green hover:bg-jorc-green-light text-white rounded-xl h-11 min-w-[160px] transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.97] overflow-hidden">
                      <span className="relative flex items-center justify-center gap-2">
                        {submitting ? (
                          <>
                            <span className="icon-slide-out-right absolute"><Send className="h-4 w-4" /></span>
                            <span className="icon-slide-in-left"><Loader2 className="h-4 w-4 animate-spin" /></span>
                            <span className="ml-1">Sending...</span>
                          </>
                        ) : (
                          <>
                            <span className="icon-slide-in"><Send className="h-4 w-4" /></span>
                            <span>Send Message</span>
                          </>
                        )}
                      </span>
                    </Button>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      <svg className="inline h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      We respect your privacy
                    </p>
                  </div>
                </form>
              </div>
            )}

          {/* Book Our Facility */}
          <section id="book-facility" className="mt-16 reveal bg-jorc-green rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="wave-bg absolute -bottom-2 left-0 right-0 h-12 opacity-10" style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.08) 20px, rgba(255,255,255,0.08) 40px)" }} />
              <div className="float-shape absolute top-5 right-[10%] w-20 h-20 border border-white/10 rounded-full" />
              <div className="float-shape-2 absolute bottom-5 left-[5%] w-12 h-12 bg-white/5 rounded-full" />
            </div>
            <div className="text-center mb-8 relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white relative inline-block">
                <Calendar className="h-7 w-7 inline mr-2 -mt-1" />
                Book Our Facility
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full" />
              </h3>
              <p className="text-white/80 mt-3 max-w-2xl mx-auto">Reserve the Multimedia Room for your seminar, meeting, or group event</p>
            </div>

            {/* Facility Preview Card */}
            <div className="max-w-lg mx-auto mb-8 bg-white rounded-xl border border-jorc-green-lighter overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-jorc-green/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-7 w-7 text-jorc-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-jorc-green">Multimedia Seminar Room</h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Available
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Fully equipped for events & meetings</p>
                  </div>
                </div>
                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { icon: <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, label: "Projector" },
                    { icon: <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>, label: "AC" },
                    { icon: <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" /></svg>, label: "WiFi" },
                    { icon: <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>, label: "Sound System" },
                    { icon: <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>, label: "Seating" },
                  ].map((amenity, ai) => (
                    <div key={ai} className="group/amenity relative flex items-center gap-1.5 bg-jorc-green/5 hover:bg-jorc-green/10 text-jorc-green rounded-lg px-2.5 py-1.5 transition-all duration-200 cursor-default">
                      {amenity.icon}
                      <span className="text-[11px] font-medium">{amenity.label}</span>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover/amenity:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                        {amenity.label === "Projector" ? "HD Projector & Screen" :
                         amenity.label === "AC" ? "Air Conditioning" :
                         amenity.label === "WiFi" ? "High-speed WiFi" :
                         amenity.label === "Sound System" ? "Surround Sound System" :
                         "Comfortable seating for 100"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-jorc-green/5 rounded-lg p-2">
                    <span className="block font-semibold text-jorc-green">Capacity</span>
                    <span className="text-muted-foreground">Up to 100</span>
                  </div>
                  <div className="bg-jorc-green/5 rounded-lg p-2">
                    <span className="block font-semibold text-jorc-green">Duration</span>
                    <span className="text-muted-foreground">Full Day</span>
                  </div>
                  <div className="bg-jorc-green/5 rounded-lg p-2">
                    <span className="block font-semibold text-jorc-green">Cost</span>
                    <span className="text-muted-foreground">Affordable</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-6 group/close">
              {!showBookingForm ? (
                <Button onClick={() => setShowBookingForm(true)} className="px-8 py-6 text-lg bg-white hover:bg-white text-jorc-green rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]">
                  <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-300" />
                  Book the Multimedia Room
                </Button>
              ) : (
                <Button onClick={() => { setShowBookingForm(false); setBookingSubmitted(false); }} className="px-6 py-5 text-base bg-white/20 text-white border-2 border-white/60 hover:bg-white hover:text-jorc-green rounded-xl transition-all duration-300 shadow-lg">
                  <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Close Booking Form
                </Button>
              )}
            </div>

            {showBookingForm && (
            <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
            {bookingSubmitted ? (
              <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center text-white border border-white/20" style={{ animation: "scaleIn 0.5s ease-out" }}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6" style={{ animation: "checkBounce 0.6s ease-out" }}>
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Booking Submitted!</h3>
                <p className="text-white/80 max-w-md mx-auto">Thank you! We've received your booking request. Our team will contact you within 24 hours to confirm.</p>
                <Button onClick={() => { setBookingSubmitted(false); setBooking({ orgName: "", contact: "", email: "", phone: "", purpose: "", participants: 1, date: "", timeSlot: "", customTime: "", info: "" }); setBookingErrors({}); }} className="mt-6 bg-white text-jorc-green hover:bg-white/90 rounded-xl font-semibold">
                  Book Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="max-w-2xl mx-auto space-y-5 text-white">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="bOrg" className="text-white">Organization/Individual Name *</Label>
                    <Input id="bOrg" value={booking.orgName} onChange={e => updateBooking("orgName", e.target.value)} placeholder="Full name or organization" className={`h-11 border ${bookingErrors.orgName ? "border-red-400" : "border-white/50"} focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl transition-all bg-white text-jorc-green placeholder:text-gray-400`} />
                    {bookingErrors.orgName && <p className="text-red-300 text-xs mt-1">{bookingErrors.orgName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="bContact" className="text-white">Contact Person *</Label>
                    <Input id="bContact" value={booking.contact} onChange={e => updateBooking("contact", e.target.value)} placeholder="Full name" className={`h-11 border ${bookingErrors.contact ? "border-red-400" : "border-white/50"} focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl transition-all bg-white text-jorc-green placeholder:text-gray-400`} />
                    {bookingErrors.contact && <p className="text-red-300 text-xs mt-1">{bookingErrors.contact}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="bEmail" className="text-white">Email Address *</Label>
                    <Input id="bEmail" type="email" value={booking.email} onChange={e => updateBooking("email", e.target.value)} placeholder="your@email.com" className={`h-11 border ${bookingErrors.email ? "border-red-400" : "border-white/50"} focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl transition-all bg-white text-jorc-green placeholder:text-gray-400`} />
                    {bookingErrors.email && <p className="text-red-300 text-xs mt-1">{bookingErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="bPhone" className="text-white">Phone Number *</Label>
                    <Input id="bPhone" value={booking.phone} onChange={e => updateBooking("phone", e.target.value)} placeholder="+234 XXX XXX XXXX" className={`h-11 border ${bookingErrors.phone ? "border-red-400" : "border-white/50"} focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl transition-all bg-white text-jorc-green placeholder:text-gray-400`} />
                    {bookingErrors.phone && <p className="text-red-300 text-xs mt-1">{bookingErrors.phone}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="bPurpose" className="text-white">Purpose of Use *</Label>
                    <Select value={booking.purpose} onValueChange={v => updateBooking("purpose", v)}>
                      <SelectTrigger className={`h-11 border ${bookingErrors.purpose ? "border-red-400" : "border-white/50"} focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl bg-white text-jorc-green`}>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookingPurposes.map((p) => (
                          <SelectItem key={p} value={p.toLowerCase().replace(/\s+/g, '-')}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bookingErrors.purpose && <p className="text-red-300 text-xs mt-1">{bookingErrors.purpose}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block text-white">Expected Participants</Label>
                    <div className="flex items-center gap-3">
                      <button type="button" className="counter-btn text-white/80 hover:text-white" onClick={() => updateBooking("participants", Math.max(1, (booking.participants as number) - 1))}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      </button>
                      <Input type="number" value={booking.participants} onChange={e => { const val = parseInt(e.target.value) || 1; updateBooking("participants", Math.max(1, Math.min(100, val))); }} min={1} max={100} className="w-20 h-11 text-center text-lg font-bold text-jorc-green border-white/50 focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl bg-white" />
                      <button type="button" className="counter-btn text-white/80 hover:text-white" onClick={() => updateBooking("participants", Math.min(100, (booking.participants as number) + 1))}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      </button>
                      <span className="text-xs text-white/60">max 100</span>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Mini Calendar */}
                  <div>
                    <Label className="text-sm font-medium mb-2.5 block text-white">Preferred Date *</Label>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/20">
                        <button type="button" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else { setCalMonth(m => m - 1); } }} className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="text-sm font-semibold text-white">{calMonths[calMonth]} {calYear}</span>
                        <button type="button" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else { setCalMonth(m => m + 1); } }} className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-px bg-white/10">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, di) => (
                          <div key={di} className="bg-white/5 text-[10px] font-semibold text-white/60 text-center py-1.5">{d}</div>
                        ))}
                        {Array.from({ length: calFirstDow }).map((_, bi) => (
                          <div key={`blank-${bi}`} className="bg-transparent" />
                        ))}
                        {Array.from({ length: calDaysInMonth }).map((_, di) => {
                          const day = di + 1;
                          const dateObj = new Date(calYear, calMonth, day);
                          const dateStr = dateObj.toISOString().slice(0, 10);
                          const isPast = dateObj.toDateString() === today.toDateString() ? false : dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                          const isToday = dateStr === todayStr;
                          const isBooked = bookedDates.has(dateStr);
                          const isLimited = limitedDates.has(dateStr);
                          const isSelected = booking.date === dateStr;
                          const selectable = !isPast && !isBooked;
                          return (
                            <button
                              key={di}
                              type="button"
                              disabled={!selectable}
                              onClick={() => updateBooking("date", dateStr)}
                              className={`relative text-xs py-1.5 transition-all duration-150 ${!selectable ? "bg-white/5 text-white/20 cursor-not-allowed" : isSelected ? "bg-white text-jorc-green font-semibold" : isToday ? "bg-white/20 text-white font-semibold" : "bg-transparent text-white/80 hover:bg-white/10"} ${isLimited && selectable && !isSelected ? "ring-1 ring-amber-300 ring-inset" : ""}`}
                              title={!selectable ? (isPast ? "Past date" : "Fully booked") : isLimited ? "Limited availability" : "Available"}
                            >
                              {day}
                              {isLimited && selectable && !isSelected && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-white/60">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-white/20 border border-white/30" /> Today</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-white" /> Selected</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Limited</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-white/5 border border-white/20" /> Booked</span>
                    </div>
                    {bookingErrors.date && <p className="text-red-300 text-xs mt-1">{bookingErrors.date}</p>}
                  </div>

                  {/* Time Slot Chips */}
                  <div>
                    <Label className="text-sm font-medium mb-2.5 block text-white">Preferred Time Slot *</Label>
                    <div className="flex flex-col gap-2">
                      {bookingTimeSlots.map((slot, si) => {
                        const isOther = slot === "Other (specify)";
                        const slotValue = isOther ? "other" : slot;
                        const isFull = !booking.date || isOther ? false : Math.random() > 0.75;
                        const isSelected = booking.timeSlot === slotValue;
                        return (
                          <button
                            key={si}
                            type="button"
                            disabled={!booking.date || isFull}
                            onClick={() => updateBooking("timeSlot", slotValue)}
                            className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                              !booking.date
                                ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                                : isSelected
                                  ? "border-white bg-white/20 text-white font-medium shadow-sm"
                                  : isFull
                                    ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                                    : "border-white/30 bg-white/10 text-white/80 hover:border-white/50 hover:bg-white/20 hover:shadow-sm active:scale-[0.98]"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              !booking.date || isFull ? "border-white/20" :
                              isSelected ? "border-white bg-white" : "border-white/40"
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-jorc-green" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm font-medium block ${!booking.date || isFull ? "text-white/30" : ""}`}>{isOther ? "Other" : slot}</span>
                              {booking.date && !isFull && !isOther && <span className="text-[10px] text-green-300">Available</span>}
                              {isOther && <span className="text-[10px] text-white/50">Specify your own time</span>}
                              {isFull && <span className="text-[10px] text-red-300">Fully booked</span>}
                            </div>
                            {isSelected && (
                              <svg className="h-4 w-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {booking.timeSlot === "other" && (
                      <div className="mt-3 animate-fadeSlideIn">
                        <Label className="text-xs text-white/70 mb-1.5 block">Specify your preferred time range *</Label>
                        <Input value={booking.customTime} onChange={e => updateBooking("customTime", e.target.value)} placeholder="e.g. 7:00 AM - 9:00 AM" className={`h-10 border ${bookingErrors.customTime ? "border-red-400" : "border-white/50"} focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl bg-white text-jorc-green placeholder:text-gray-400`} />
                        {bookingErrors.customTime && <p className="text-red-300 text-xs mt-1">{bookingErrors.customTime}</p>}
                      </div>
                    )}
                    {bookingErrors.timeSlot && !booking.timeSlot && <p className="text-red-300 text-xs mt-1">{bookingErrors.timeSlot}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="bInfo" className="text-white">Additional Information</Label>
                  <Textarea id="bInfo" value={booking.info} onChange={e => updateBooking("info", e.target.value)} placeholder="Meeting topic, special requirements, or setup requests…" rows={3} className="border-white/50 focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl transition-all resize-none bg-white text-jorc-green placeholder:text-gray-400" />
                </div>
                <div className="text-center">
                  <Button type="submit" disabled={bookingSubmitting} className="px-8 h-11 bg-white text-jorc-green hover:bg-white/90 rounded-xl min-w-[180px] transition-all duration-300 shadow-lg hover:shadow-xl">
                    {bookingSubmitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Submit Booking</span>
                    )}
                  </Button>
                  <p className="text-sm text-white/60 mt-3">We'll contact you within 24 hours to confirm your booking</p>
                </div>
              </form>
              )}
              </div>
              )}
          </section>

        <section className="mt-16 reveal relative overflow-hidden">
          <div className="absolute top-10 left-[5%] w-20 h-20 rounded-full bg-jorc-green/10 blur-xl pointer-events-none" style={{ animation: "floatCircle 8s ease-in-out infinite 2s" }} />
          <div className="absolute bottom-10 right-[8%] w-16 h-16 rounded-full bg-jorc-green/10 blur-lg pointer-events-none" style={{ animation: "floatCircle 6s ease-in-out infinite reverse 0.5s" }} />
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-jorc-green relative inline-block">
              <MessageSquare className="h-6 w-6 inline mr-2 -mt-1" />
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mt-4">Quick answers to common questions about our center and services.</p>
          </div>

          {/* FAQ Search */}
          <div className="max-w-md mx-auto mb-8 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <Input value={faqSearch} onChange={e => setFaqSearch(e.target.value)} placeholder="Search FAQs..." className="h-11 pl-10 rounded-xl border-jorc-green-lighter focus:border-jorc-green focus:ring-2 focus:ring-jorc-green/20 transition-all" />
            {faqSearch && (
              <button onClick={() => setFaqSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-jorc-green transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {(() => {
              const filtered = faqs.filter(faq => faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || faq.a.toLowerCase().includes(faqSearch.toLowerCase()));
              const icons = [Clock, CheckCircle2, MessageSquare, Calendar];
              return filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No FAQs match your search.</p>
                  <button onClick={() => setFaqSearch("")} className="text-jorc-green hover:text-jorc-green-light text-sm mt-2">Clear search</button>
                </div>
              ) : (
                filtered.map((faq, fi) => {
                  const origIndex = faqs.indexOf(faq);
                  const Icon = icons[origIndex];
                  return (
                  <div key={origIndex} className={`stagger-item group bg-white border border-jorc-green-lighter rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 ${expandedFaq === origIndex ? "shadow-md border-jorc-green/30" : ""}`} style={{ animationDelay: `${fi * 0.06}s` }}>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === origIndex ? null : origIndex)}
                      className="w-full flex items-center justify-between p-5 text-left gap-3"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-jorc-green/10 flex items-center justify-center group-hover:bg-jorc-green/20 transition-colors duration-300">
                          <Icon className="h-4 w-4 text-jorc-green" />
                        </span>
                        <span className="font-medium text-jorc-green text-sm sm:text-base">{faq.q}</span>
                      </span>
                      <ChevronDown className={`h-5 w-5 text-jorc-green shrink-0 transition-all duration-300 ${expandedFaq === origIndex ? "rotate-180 text-jorc-green-light" : ""}`} />
                    </button>
                    <div className={`faq-content ${expandedFaq === origIndex ? "open" : ""}`}>
                      <div>
                        <div className="px-5 pb-3 text-muted-foreground text-sm leading-relaxed border-t border-jorc-green-lighter pt-4 ml-14">
                          {faq.a}
                        </div>
                        {/* Was this helpful? */}
                        <div className="px-5 pb-4 ml-14 flex items-center gap-3 border-t border-jorc-green-lighter pt-3">
                          <span className="text-xs text-muted-foreground">Was this helpful?</span>
                          <button onClick={() => setFaqFeedback(prev => ({ ...prev, [origIndex]: prev[origIndex] === "helpful" ? undefined : "helpful" }))} className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-200 ${faqFeedback[origIndex] === "helpful" ? "bg-jorc-green/10 text-jorc-green" : "text-muted-foreground hover:text-jorc-green hover:bg-jorc-green/5"}`}>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                            Yes
                          </button>
                          <button onClick={() => setFaqFeedback(prev => ({ ...prev, [origIndex]: prev[origIndex] === "not-helpful" ? undefined : "not-helpful" }))} className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-200 ${faqFeedback[origIndex] === "not-helpful" ? "bg-red-50 text-red-500" : "text-muted-foreground hover:text-red-500 hover:bg-red-50"}`}>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })
              );
            })()}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center reveal">
          <div className="bg-gradient-to-r from-jorc-green via-jorc-green to-jorc-green-light rounded-2xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="wave-bg absolute -bottom-2 left-0 right-0 h-12 opacity-20" style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)" }} />
              <div className="float-shape absolute top-5 right-[10%] w-20 h-20 border border-white/10 rounded-full" />
              <div className="float-shape-2 absolute bottom-5 left-[5%] w-12 h-12 bg-white/5 rounded-full" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Digital Journey?</h3>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Join hundreds of learners who have transformed their lives through our programs. 
                Take the first step today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/programs">
                  <Button variant="secondary" size="lg" className="rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.97]">
                    View Programs
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => document.getElementById("send-message")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="bg-transparent border-white text-white hover:bg-white hover:text-jorc-green rounded-xl font-semibold transition-all duration-300 active:scale-[0.97]">
                  Schedule a Visit
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Back to Top */}
      <div className={`back-to-top ${showBackToTop ? "visible" : ""}`} onClick={scrollToTop}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <circle cx="22" cy="22" r="18" fill="none" stroke="white" strokeWidth="3" strokeDasharray="113.1" strokeDashoffset={113.1 - scrollProgress * 113.1} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.1s ease-out" }} />
        </svg>
        <ArrowUp className="h-4 w-4 relative z-10" />
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/2349161269000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[84px] right-[30px] z-50 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 pulse-ring group"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 tooltip-in shadow-md">
          Chat with us
        </span>
      </a>
    </div>
    </div>
    </div>
  );
};

export default Contact;