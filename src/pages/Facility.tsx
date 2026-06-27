import { useEffect, useState, useRef, useCallback } from "react";
import { Monitor, Wifi, Zap, Shield, Users, Headphones, BookOpen, Search, Clock, Heart, Mic, Film, Building2, Mail, Phone, Calendar, CheckCircle2, ChevronRight, ChevronLeft, Plus, Minus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendEmailNotification } from "@/lib/notify";

const Facility = () => {
  const { toast } = useToast();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    orgName: "", contact: "", email: "", phone: "",
    purpose: "", participants: 1, date: "", timeSlot: "", info: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxImagesRef = useRef<string[]>([]);

  const openLightbox = useCallback((images: string[], index: number) => {
    lightboxImagesRef.current = images;
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prevImage = useCallback(() => setLightboxIndex(i => (i - 1 + lightboxImagesRef.current.length) % lightboxImagesRef.current.length), []);
  const nextImage = useCallback(() => setLightboxIndex(i => (i + 1) % lightboxImagesRef.current.length), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, prevImage, nextImage]);

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.orgName.trim()) newErrors.orgName = "Required";
      if (!formData.contact.trim()) newErrors.contact = "Required";
      if (!formData.email.trim()) newErrors.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
      if (!formData.phone.trim()) newErrors.phone = "Required";
    } else if (step === 2) {
      if (!formData.purpose) newErrors.purpose = "Select a purpose";
      if (!formData.date) newErrors.date = "Select a date";
      if (!formData.timeSlot) newErrors.timeSlot = "Select a time slot";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(formStep)) setFormStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => setFormStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("facility_bookings").insert({
        org_name: formData.orgName, contact_person: formData.contact, email: formData.email,
        phone: formData.phone, purpose: formData.purpose, participants: formData.participants,
        date: formData.date, time_slot: formData.timeSlot, additional_info: formData.info, source: "facility",
      });
      if (error) console.warn("Supabase insert failed:", error.message);
    } catch (e) {
      console.warn("Supabase not configured, skipping database save");
    }
    setSubmitting(false);
    try {
      await sendEmailNotification("facility", {
        "Organization": formData.orgName,
        "Contact Person": formData.contact,
        "Email": formData.email,
        "Phone": formData.phone,
        "Purpose": formData.purpose,
        "Participants": String(formData.participants),
        "Date": formData.date,
        "Time Slot": formData.timeSlot,
        "Additional Info": formData.info || "-",
      });
    } catch (e) {
      console.warn("Email notify failed", e);
    }
    setSubmitted(true);
    toast({ title: "Booking submitted!", description: "We'll contact you within 24 hours to confirm." });
  };

  const resetForm = () => {
    setFormData({ orgName: "", contact: "", email: "", phone: "", purpose: "", participants: 1, date: "", timeSlot: "", info: "" });
    setErrors({});
    setSubmitted(false);
    setFormStep(1);
    setShowBookingForm(false);
  };

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
    return () => observer.disconnect();
  }, []);

  const labFeatures = [
    { icon: Monitor, title: "20+ Desktop Computers", desc: "Latest Dell and HP workstations with modern software suites" },
    { icon: Users, title: "Digital Smart Screen", desc: "65-inch interactive display for presentations and collaborative learning" },
    { icon: Zap, title: "Reliable Power Supply", desc: "UPS backup and solar integration ensuring 99% uptime" },
    { icon: Wifi, title: "High-Speed Internet", desc: "Fiber optic connection with dedicated bandwidth" },
    { icon: Shield, title: "Software Licenses", desc: "Google Workspace & Microsoft Office for all workstations" },
    { icon: Headphones, title: "Professional Support", desc: "Certified instructors available during all sessions" },
  ];

  const libraryFeatures = [
    { icon: BookOpen, title: "2,000+ Books", desc: "Wide collection spanning academic texts, fiction, and reference materials" },
    { icon: Search, title: "Digital Archive", desc: "Online database access for research and academic journals" },
    { icon: Monitor, title: "Research Terminals", desc: "Internet-enabled computers dedicated to research and study" },
    { icon: Clock, title: "Quiet Study Spaces", desc: "Distraction-free zones for individual and group reading" },
    { icon: Heart, title: "Weekly Reading Program", desc: "Guided reading sessions for children and young adults" },
    { icon: Users, title: "Free Membership", desc: "Open to all community members at no cost" },
  ];

  const multimediaFeatures = [
    { icon: Users, title: "Seating Capacity", desc: "Comfortable seating for up to 100 people with flexible arrangement options" },
    { icon: Monitor, title: "Projector & Screen", desc: "HD projector with large screen for presentations and video playback" },
    { icon: Mic, title: "Sound System", desc: "Wireless microphones and speakers for clear audio during sessions" },
    { icon: Wifi, title: "High-Speed Internet", desc: "Dedicated fiber connection for virtual meetings and live streaming" },
    { icon: Zap, title: "Air Conditioning", desc: "Climate-controlled environment for comfortable gatherings" },
    { icon: Film, title: "Whiteboard & Flip Chart", desc: "Writing surfaces for brainstorming, note-taking, and visual aids" },
  ];

  const bookingPurposes = [
    "Team Meeting", "Seminar", "Workshop", "Conference Talk", "Group Discussion", "Presentation", "Training Session", "Other"
  ];

  const timeSlots = [
    "9:00 AM - 12:00 PM",
    "1:00 PM - 4:00 PM",
    "9:00 AM - 5:00 PM (Full Day)",
    "Other (specify in info)"
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
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer-bg { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); background-size: 200% 100%; animation: shimmer 3s infinite; }
        .card-glow:hover { box-shadow: 0 0 25px rgba(26, 71, 42, 0.25); }
      `}</style>

      {/* Hero Banner */}
      <section
        className="relative overflow-hidden min-h-[260px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 71, 42, 0.88), rgba(26, 71, 42, 0.65)), url(https://i.postimg.cc/Y2sXFJY1/20260423-083905.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-4 h-4 rounded-full bg-white/10 top-1/4 left-1/4 animate-pulse" style={{ animationDuration: "4s" }} />
          <div className="absolute w-3 h-3 rounded-full bg-white/10 bottom-1/4 right-1/3 animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />
          <div className="absolute w-5 h-5 rounded-full bg-white/10 top-1/3 right-1/4 animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "2s" }} />
          <div className="absolute w-2 h-2 rounded-full bg-white/10 bottom-1/3 left-1/3 animate-pulse" style={{ animationDuration: "6s", animationDelay: "0.5s" }} />
          <div className="absolute w-6 h-6 rounded-full bg-white/5 top-2/3 left-1/5 animate-pulse" style={{ animationDuration: "7s" }} />
        </div>
        <div className="absolute inset-0 shimmer-bg pointer-events-none" />
        <div className="text-center py-16 px-6 max-w-4xl relative z-10">
          <div className="reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="inline-flex items-center gap-2 mb-6 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-4 py-1.5 rounded-full text-sm font-medium">
              State-of-the-Art Facilities
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Our Facilities
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: "0.3s" }}>
            <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Three specialised spaces designed for learning, research, and creative production.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {/* ==================== ICT LABORATORY ==================== */}
          <section className="pt-16 pb-8" id="ict-lab">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              <div className="reveal-left">
                <div className="inline-block mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-jorc-green relative inline-block">
                    ICT Laboratory
                  </h2>
                </div>
                <p className="text-muted-foreground mt-6 leading-relaxed">
                  Our ICT lab is equipped with modern computers, high-speed internet, and professional 
                  software to provide hands-on digital skills training for students, professionals, and 
                  community members.
                </p>
              </div>
              <div className="reveal-right">
                <img src="https://i.postimg.cc/B6vgLgvN/20260423-084009.jpg" alt="ICT Laboratory" className="w-full h-64 object-cover rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500" />
              </div>
            </div>

            {/* Lab feature cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
              {labFeatures.map((f, i) => (
                <Card key={i} className="group relative overflow-hidden bg-jorc-green border-jorc-green text-white hover:shadow-lg hover:-translate-y-0.5 hover:bg-jorc-green-light card-glow transition-all duration-300 reveal cursor-pointer" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-white/80 rounded-r scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                  <div className="flex items-center gap-3 p-4">
                    <f.icon className="h-6 w-6 text-white flex-shrink-0 group-hover:scale-110 group-hover:text-amber-300 transition-all duration-300" />
                    <div>
                      <CardTitle className="text-white text-sm font-semibold">{f.title}</CardTitle>
                      <CardDescription className="text-white/70 text-xs mt-0.5">{f.desc}</CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Lab gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 reveal">
              {["https://i.postimg.cc/RFbTcH6v/20260423-084000.jpg", "https://i.postimg.cc/pTLMPZGt/20260303-155900.jpg", "https://i.postimg.cc/CxdgKRm9/IMG-20260313-161906.jpg", "https://i.postimg.cc/nhMJLX3x/IMG-20260313-161851.jpg"].map((img, i) => (
                <div key={i} onClick={() => openLightbox(["https://i.postimg.cc/RFbTcH6v/20260423-084000.jpg", "https://i.postimg.cc/pTLMPZGt/20260303-155900.jpg", "https://i.postimg.cc/CxdgKRm9/IMG-20260313-161906.jpg", "https://i.postimg.cc/nhMJLX3x/IMG-20260313-161851.jpg"], i)} className="relative rounded-xl overflow-hidden group hover:shadow-xl transition-shadow duration-500 cursor-pointer">
                  <img src={img} alt="" className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-jorc-green/0 group-hover:bg-jorc-green/50 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 scale-75 group-hover:scale-100 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-jorc-green/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                    ICT Laboratory
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-jorc-green-lighter my-8" />

          {/* ==================== STANDARD LIBRARY ==================== */}
          <section className="py-8" id="standard-library">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              <div className="reveal-left lg:order-2">
                <div className="inline-block mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-jorc-green relative inline-block mt-1">
                    Standard Library
                  </h2>
                </div>
                <p className="text-muted-foreground mt-6 leading-relaxed">
                  A quiet and well-resourced library offering digital and physical books, research 
                  terminals, and guided reading programs for all ages — free for every community member.
                </p>
              </div>
              <div className="reveal-right lg:order-1">
                <img src="https://i.postimg.cc/JnQfmK2g/20260423-083708.jpg" alt="Standard Library" className="w-full h-64 object-cover rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500" />
              </div>
            </div>

            {/* Library feature cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
              {libraryFeatures.map((f, i) => (
                <Card key={i} className="group relative overflow-hidden bg-jorc-green border-jorc-green text-white hover:shadow-lg hover:-translate-y-0.5 hover:bg-jorc-green-light card-glow transition-all duration-300 reveal cursor-pointer" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-white/80 rounded-r scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                  <div className="flex items-center gap-3 p-4">
                    <f.icon className="h-6 w-6 text-white flex-shrink-0 group-hover:scale-110 group-hover:text-amber-300 transition-all duration-300" />
                    <div>
                      <CardTitle className="text-white text-sm font-semibold">{f.title}</CardTitle>
                      <CardDescription className="text-white/70 text-xs mt-0.5">{f.desc}</CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Library gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 reveal">
              {["https://i.postimg.cc/q7gf08dm/20260423-083633.jpg", "https://i.postimg.cc/FKgy1Zsg/IMG-20260615-WA0013.jpg", "https://i.postimg.cc/J7jZs5rp/IMG-20260615-WA0015.jpg", "https://i.postimg.cc/Hxm5H1Tp/Whats-App-Image-2026-06-18-at-2-01-27-PM.jpg"].map((img, i) => (
                <div key={i} onClick={() => openLightbox(["https://i.postimg.cc/q7gf08dm/20260423-083633.jpg", "https://i.postimg.cc/FKgy1Zsg/IMG-20260615-WA0013.jpg", "https://i.postimg.cc/J7jZs5rp/IMG-20260615-WA0015.jpg", "https://i.postimg.cc/Hxm5H1Tp/Whats-App-Image-2026-06-18-at-2-01-27-PM.jpg"], i)} className="relative rounded-xl overflow-hidden group hover:shadow-xl transition-shadow duration-500 cursor-pointer">
                  <img src={img} alt="" className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-jorc-green/0 group-hover:bg-jorc-green/50 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 scale-75 group-hover:scale-100 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-jorc-green/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                    Standard Library
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-jorc-green-lighter my-8" />

          {/* ==================== MULTIMEDIA ROOM ==================== */}
          <section className="py-8" id="multimedia">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              <div className="reveal-left">
                <div className="inline-block mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-jorc-green relative inline-block mt-1">
                    Multimedia Room
                  </h2>
                </div>
                  <p className="text-muted-foreground mt-6 leading-relaxed">
                    A comfortable space for seminars, talks, and meetings — equipped with presentation 
                    technology and seating for productive gatherings.
                  </p>
              </div>
              <div className="reveal-right">
                <img src="https://i.postimg.cc/sD5NRTGg/20260423-084333.jpg" alt="Multimedia Room" className="w-full h-64 object-cover rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500" />
              </div>
            </div>

            {/* Multimedia feature cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
              {multimediaFeatures.map((f, i) => (
                <Card key={i} className="group relative overflow-hidden bg-jorc-green border-jorc-green text-white hover:shadow-lg hover:-translate-y-0.5 hover:bg-jorc-green-light card-glow transition-all duration-300 reveal cursor-pointer" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-white/80 rounded-r scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                  <div className="flex items-center gap-3 p-4">
                    <f.icon className="h-6 w-6 text-white flex-shrink-0 group-hover:scale-110 group-hover:text-amber-300 transition-all duration-300" />
                    <div>
                      <CardTitle className="text-white text-sm font-semibold">{f.title}</CardTitle>
                      <CardDescription className="text-white/70 text-xs mt-0.5">{f.desc}</CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Multimedia gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 reveal">
              {["https://i.postimg.cc/027BqVKj/20260423-084346.jpg", "https://i.postimg.cc/pLjsnFhd/20260102-162024.jpg", "https://placehold.co/600x400/1a472a/ffffff?text=Upload+Image+3", "https://placehold.co/600x400/1a472a/ffffff?text=Upload+Image+4"].map((img, i) => (
                <div key={i} onClick={() => openLightbox(["https://i.postimg.cc/027BqVKj/20260423-084346.jpg", "https://i.postimg.cc/pLjsnFhd/20260102-162024.jpg", "https://placehold.co/600x400/1a472a/ffffff?text=Upload+Image+3", "https://placehold.co/600x400/1a472a/ffffff?text=Upload+Image+4"], i)} className="relative rounded-xl overflow-hidden group hover:shadow-xl transition-shadow duration-500 cursor-pointer">
                  <img src={img} alt="" className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-jorc-green/0 group-hover:bg-jorc-green/50 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 scale-75 group-hover:scale-100 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-jorc-green/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                    Multimedia Room
                  </div>
                </div>
              ))}
            </div>

            {/* Booking trigger button */}
            <div className="text-center mb-6 reveal">
              {!showBookingForm ? (
                <Button
                  onClick={() => setShowBookingForm(true)}
                  className="px-6 md:px-8 py-5 md:py-6 text-base md:text-lg bg-jorc-green hover:bg-jorc-green-light text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book the Multimedia Room
                </Button>
              ) : (
                <Button
                  onClick={() => { setShowBookingForm(false); setSubmitted(false); setFormStep(1); }}
                  variant="outline"
                  className="px-6 py-5 text-base border-jorc-green text-jorc-green hover:bg-jorc-green hover:text-white rounded-xl transition-all duration-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1.5" />
                  Close Booking Form
                </Button>
              )}
            </div>

            {/* Booking Form — only for Multimedia Room */}
            {showBookingForm && (
              <div className="bg-gradient-to-br from-jorc-green-lighter via-white to-jorc-green-lighter rounded-2xl p-4 md:p-10 shadow-lg animate-in" style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
                <style>{`
                  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                  @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                  @keyframes checkBounce { 0% { transform: scale(0); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
                  .step-indicator { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 2rem; }
                  .step-dot { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; transition: all 0.3s; position: relative; z-index: 1; }
                  .step-dot.active { background: #1A472A; color: white; box-shadow: 0 0 0 4px rgba(26, 71, 42, 0.15); }
                  .step-dot.completed { background: #1A472A; color: white; }
                  .step-dot.pending { background: #e5e7eb; color: #9ca3af; }
                  .step-line { flex: 1; height: 2px; background: #e5e7eb; margin: 0 8px; transition: background 0.3s; }
                  .step-line.completed { background: #1A472A; }
                  .input-icon { position: relative; }
                  .input-icon svg.input-icon-left { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; transition: color 0.2s; }
                  .input-icon:focus-within svg.input-icon-left { color: #1A472A; }
                  .input-icon input { padding-left: 38px !important; }
                  .floating-label { position: absolute; left: 38px; top: 50%; transform: translateY(-50%); font-size: 0.875rem; color: #9ca3af; pointer-events: none; transition: all 0.2s; background: transparent; padding: 0 2px; }
                  .input-icon input:focus ~ .floating-label, .input-icon input:not(:placeholder-shown) ~ .floating-label { top: 0; transform: translateY(-50%); font-size: 0.7rem; color: #1A472A; background: white; }
                  .counter-btn { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #1A472A; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #1A472A; background: white; }
                  .counter-btn:hover { background: #1A472A; color: white; }
                  .counter-btn:active { transform: scale(0.9); }
                  .error-shake { animation: shake 0.4s ease-in-out; }
                  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
                `}</style>

                {/* Success State */}
                {submitted ? (
                  <div className="text-center py-10" style={{ animation: "scaleIn 0.5s ease-out" }}>
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-jorc-green mb-6" style={{ animation: "checkBounce 0.6s ease-out" }}>
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-jorc-green">Booking Submitted!</h3>
                    <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                      Thank you! We've received your booking request for the Multimedia Room. 
                      Our team will contact you within 24 hours to confirm your reservation.
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium text-jorc-green">Purpose:</span> {formData.purpose}</p>
                      <p><span className="font-medium text-jorc-green">Date:</span> {formData.date}</p>
                      <p><span className="font-medium text-jorc-green">Time:</span> {formData.timeSlot}</p>
                    </div>
                    <Button
                      onClick={resetForm}
                      className="mt-6 px-6 bg-jorc-green hover:bg-jorc-green-light text-white rounded-xl"
                    >
                      Book Another
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Step Indicator */}
                    <div className="step-indicator">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center" style={{ flex: step < 3 ? "1" : "0" }}>
                          <div className={`step-dot ${formStep === step ? "active" : formStep > step ? "completed" : "pending"}`}>
                            {formStep > step ? <CheckCircle2 className="h-4 w-4" /> : <span>{step}</span>}
                          </div>
                          {step < 3 && <div className={`step-line ${formStep > step ? "completed" : ""}`} />}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                      {/* Step 1: Contact Information */}
                      {formStep === 1 && (
                        <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-jorc-green">Contact Information</h3>
                            <p className="text-sm text-muted-foreground mt-1">Who should we contact about this booking?</p>
                          </div>
                          <div className="max-w-xl mx-auto space-y-4">
                            <div className="input-icon">
                              <Building2 className="input-icon-left h-4 w-4" />
                              <Input
                                id="orgName"
                                value={formData.orgName}
                                onChange={e => updateField("orgName", e.target.value)}
                                placeholder=" "
                                className={`pl-10 h-12 border ${errors.orgName ? "border-red-400 error-shake" : "border-jorc-green-lighter"} focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl transition-all`}
                              />
                              <label htmlFor="orgName" className="floating-label">Organization / Individual Name *</label>
                              {errors.orgName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.orgName}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="input-icon">
                                <Users className="input-icon-left h-4 w-4" />
                                <Input
                                  id="contact"
                                  value={formData.contact}
                                  onChange={e => updateField("contact", e.target.value)}
                                  placeholder=" "
                                  className={`pl-10 h-12 border ${errors.contact ? "border-red-400 error-shake" : "border-jorc-green-lighter"} focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl transition-all`}
                                />
                                <label htmlFor="contact" className="floating-label">Contact Person *</label>
                                {errors.contact && <p className="text-red-500 text-xs mt-1 ml-1">{errors.contact}</p>}
                              </div>
                              <div className="input-icon">
                                <Mail className="input-icon-left h-4 w-4" />
                                <Input
                                  id="mmEmail"
                                  type="email"
                                  value={formData.email}
                                  onChange={e => updateField("email", e.target.value)}
                                  placeholder=" "
                                  className={`pl-10 h-12 border ${errors.email ? "border-red-400 error-shake" : "border-jorc-green-lighter"} focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl transition-all`}
                                />
                                <label htmlFor="mmEmail" className="floating-label">Email *</label>
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                              </div>
                            </div>
                            <div className="input-icon">
                              <Phone className="input-icon-left h-4 w-4" />
                              <Input
                                id="mmPhone"
                                value={formData.phone}
                                onChange={e => updateField("phone", e.target.value)}
                                placeholder=" "
                                className={`pl-10 h-12 border ${errors.phone ? "border-red-400 error-shake" : "border-jorc-green-lighter"} focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl transition-all`}
                              />
                              <label htmlFor="mmPhone" className="floating-label">Phone Number *</label>
                              {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                            </div>
                          </div>
                          <div className="text-center mt-8">
                            <Button type="button" onClick={nextStep} className="px-10 h-12 bg-jorc-green hover:bg-jorc-green-light text-white rounded-xl">
                              Next Step <ChevronRight className="h-4 w-4 ml-1.5" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Booking Details */}
                      {formStep === 2 && (
                        <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-jorc-green">Booking Details</h3>
                            <p className="text-sm text-muted-foreground mt-1">Tell us about your event</p>
                          </div>
                          <div className="max-w-xl mx-auto space-y-4">
                            <div>
                              <Label htmlFor="mmPurpose" className="text-sm font-medium text-jorc-green mb-1.5 block">Purpose of Use *</Label>
                              <Select value={formData.purpose} onValueChange={v => updateField("purpose", v)}>
                                <SelectTrigger className={`h-12 border ${errors.purpose ? "border-red-400 error-shake" : "border-jorc-green-lighter"} focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl`}>
                                  <SelectValue placeholder="Select purpose" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bookingPurposes.map((p) => (
                                    <SelectItem key={p} value={p.toLowerCase().replace(/\s+/g, '-')}>{p}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.purpose && <p className="text-red-500 text-xs mt-1 ml-1">{errors.purpose}</p>}
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-jorc-green mb-1.5 block">Expected Participants</Label>
                              <div className="flex items-center gap-4">
                                <button type="button" className="counter-btn" onClick={() => updateField("participants", Math.max(1, formData.participants - 1))}>
                                  <Minus className="h-4 w-4" />
                                </button>
                                <Input
                                  type="number"
                                  value={formData.participants}
                                  onChange={e => {
                                    const val = parseInt(e.target.value) || 1;
                                    updateField("participants", Math.max(1, Math.min(100, val)));
                                  }}
                                  min={1} max={100}
                                  className="w-20 h-12 text-center text-lg font-bold text-jorc-green border-jorc-green-lighter focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl"
                                />
                                <button type="button" className="counter-btn" onClick={() => updateField("participants", Math.min(100, formData.participants + 1))}>
                                  <Plus className="h-4 w-4" />
                                </button>
                                <span className="text-sm text-muted-foreground ml-2">people (max 100)</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              <div className="input-icon">
                                <Calendar className="input-icon-left h-4 w-4" />
                                <Input
                                  id="mmDate"
                                  type="date"
                                  value={formData.date}
                                  onChange={e => updateField("date", e.target.value)}
                                  className={`pl-10 h-12 border ${errors.date ? "border-red-400 error-shake" : "border-jorc-green-lighter"} focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl transition-all`}
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date}</p>}
                              </div>
                              <div>
                                <Label htmlFor="mmTimeSlot" className="text-sm font-medium text-jorc-green mb-1.5 block">Time Slot *</Label>
                                <Select value={formData.timeSlot} onValueChange={v => updateField("timeSlot", v)}>
                                  <SelectTrigger className={`h-12 border ${errors.timeSlot ? "border-red-400 error-shake" : "border-jorc-green-lighter"} focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl`}>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map((slot) => (
                                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {errors.timeSlot && <p className="text-red-500 text-xs mt-1 ml-1">{errors.timeSlot}</p>}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center gap-4 mt-8">
                            <Button type="button" onClick={prevStep} variant="outline" className="px-6 h-12 border-jorc-green text-jorc-green rounded-xl">
                              <ChevronLeft className="h-4 w-4 mr-1.5" /> Back
                            </Button>
                            <Button type="button" onClick={nextStep} className="px-8 h-12 bg-jorc-green hover:bg-jorc-green-light text-white rounded-xl">
                              Next Step <ChevronRight className="h-4 w-4 ml-1.5" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Review & Submit */}
                      {formStep === 3 && (
                        <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-jorc-green">Additional Info & Submit</h3>
                            <p className="text-sm text-muted-foreground mt-1">Anything else we should know?</p>
                          </div>
                          <div className="max-w-xl mx-auto space-y-5">
                            <div>
                              <Label htmlFor="mmInfo" className="text-sm font-medium text-jorc-green mb-1.5 block">Additional Information</Label>
                              <Textarea
                                id="mmInfo"
                                value={formData.info}
                                onChange={e => updateField("info", e.target.value)}
                                placeholder="Meeting topic, special requirements, or setup requests…"
                                rows={4}
                                className="border-jorc-green-lighter focus:border-jorc-green focus:ring-1 focus:ring-jorc-green rounded-xl transition-all resize-none"
                              />
                            </div>

                            {/* Summary card */}
                            <div className="bg-white rounded-xl border border-jorc-green-lighter p-5 space-y-2 text-sm">
                              <p className="font-semibold text-jorc-green mb-2">Summary</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-muted-foreground">
                                <span>Organization:</span><span className="font-medium text-foreground">{formData.orgName}</span>
                                <span>Contact:</span><span className="font-medium text-foreground">{formData.contact}</span>
                                <span>Email:</span><span className="font-medium text-foreground">{formData.email}</span>
                                <span>Phone:</span><span className="font-medium text-foreground">{formData.phone}</span>
                                <span>Purpose:</span><span className="font-medium text-foreground capitalize">{formData.purpose.replace(/-/g, ' ')}</span>
                                <span>Participants:</span><span className="font-medium text-foreground">{formData.participants}</span>
                                <span>Date:</span><span className="font-medium text-foreground">{formData.date}</span>
                                <span>Time:</span><span className="font-medium text-foreground">{formData.timeSlot}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center gap-4 mt-8">
                            <Button type="button" onClick={prevStep} variant="outline" className="px-6 h-12 border-jorc-green text-jorc-green rounded-xl">
                              <ChevronLeft className="h-4 w-4 mr-1.5" /> Back
                            </Button>
                            <Button
                              type="submit"
                              disabled={submitting}
                              className="px-10 h-12 bg-jorc-green hover:bg-jorc-green-light text-white rounded-xl transition-all duration-300 min-w-[180px]"
                            >
                              {submitting ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Submitting...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  Submit Booking <FileText className="h-4 w-4" />
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {lightboxImagesRef.current.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}

          <img
            src={lightboxImagesRef.current[lightboxIndex]}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxImagesRef.current.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
              {lightboxIndex + 1} / {lightboxImagesRef.current.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Facility;