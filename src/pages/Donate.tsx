import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendEmailNotification } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Heart, ChevronDown, Loader2, Check, User, Mail, Phone, Globe, EyeOff } from "lucide-react";

const FieldWrapper = ({ icon: Icon, label, required, focused, hasVal, children }: {
  icon: any; label: string; required?: boolean; focused: boolean; hasVal: boolean; children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-1 mb-1.5">
      <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${focused ? "text-[#FFCE1B]" : hasVal ? "text-jorc-green" : "text-gray-400"}`} />
      <span className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${focused ? "text-jorc-green" : "text-gray-600"}`}>
        {label}
      </span>
      {required && <span className="text-red-400">*</span>}
      {/* (6) Real-time validation checkmark */}
      {required && hasVal && <Check className="w-3 h-3 text-green-500 ml-auto transition-all duration-300 animate-in zoom-in" />}
    </div>
    {children}
  </div>
);

const amountOptions = [
  { label: "₦50,000", value: 50000 },
  { label: "₦100,000", value: 100000 },
  { label: "₦150,000", value: 150000 },
  { label: "₦200,000", value: 200000 },
  { label: "₦250,000", value: 250000 },
  { label: "₦300,000", value: 300000 },
  { label: "₦350,000", value: 350000 },
  { label: "₦400,000", value: 400000 },
  { label: "₦450,000", value: 450000 },
  { label: "₦500,000", value: 500000 },
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  phone: "",
  amount: 50000,
  customAmount: "",
  useCustomAmount: false,
  anonymous: false,
};

const categories = [
  { label: "Training & Programs",          pct: 35, color: "#1A472A", desc: "Instructor stipends, learning materials" },
  { label: "Library & Digital Resources",  pct: 25, color: "#2D6A4F", desc: "Book acquisitions, e-library subscriptions" },
  { label: "Lab & Equipment Maintenance",  pct: 22, color: "#40916C", desc: "Workstation repairs, internet, electricity" },
  { label: "Operations & Administration",  pct: 18, color: "#52B788", desc: "Facility upkeep, utilities, governance" },
];

const Donate = () => {
  const { toast } = useToast();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [countUp, setCountUp] = useState(0);
  const [heartBeat, setHeartBeat] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [amountOpen, setAmountOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (showForm) setTimeout(() => setEntered(true), 50);
  }, [showForm]);

  const openForm = () => {
    setShowForm(true);
    setTimeout(() => document.getElementById("donate-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const donationAmount = form.useCustomAmount ? Number(form.customAmount) || 0 : form.amount;

  const impactMap = [
    { min: 0, label: "10 books for the library" },
    { min: 50000, label: "100 hours of lab access" },
    { min: 100000, label: "ICT training for 5 students" },
    { min: 200000, label: "A full reading club term" },
    { min: 350000, label: "Monthly internet + electricity" },
    { min: 500000, label: "Scholarship for 1 student" },
  ];
  const impactText = [...impactMap].reverse().find((i) => donationAmount >= i.min)?.label ?? "";

  const update = (field: string, value: string | boolean | number) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("donation_intents").insert({
        first_name: form.firstName, last_name: form.lastName, email: form.email,
        country: form.country || null, phone: form.phone || null,
        amount: form.useCustomAmount ? Number(form.customAmount) : form.amount,
        anonymous: form.anonymous,
      });
      if (error) console.warn("Supabase insert failed:", error.message);
    } catch (e) {
      console.warn("Supabase not configured, skipping database save");
    }
    setSubmitting(false);
    try {
      await sendEmailNotification("donate", {
        "First Name": form.firstName,
        "Last Name": form.lastName,
        "Email": form.email,
        "Country": form.country || "-",
        "Phone": form.phone || "-",
        "Amount": form.useCustomAmount ? form.customAmount : String(form.amount),
        "Anonymous": form.anonymous ? "Yes" : "No",
      });
    } catch (e) {
      console.warn("Email notify failed", e);
    }
    setSubmitted(true);
    toast({
      title: "Donation intent received!",
      description: `Thank you, ${form.firstName}. We'll send payment instructions to ${form.email}.`,
    });
    setForm({ ...initialForm });
    setTimeout(() => setSubmitted(false), 4000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[class*="reveal"]').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  /* count-up for donut centre */
  useEffect(() => {
    const el = document.getElementById("donut-section");
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          let val = 0;
          const step = () => {
            val += 2;
            if (val <= 100) {
              setCountUp(val);
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* continuous heart beat for bottom CTA */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartBeat((p) => !p);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal-left.is-visible { opacity: 1; transform: translateX(0); }
        .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal-right.is-visible { opacity: 1; transform: translateX(0); }
        .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal-scale.is-visible { opacity: 1; transform: scale(1); }
        @keyframes float-circle { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
        @keyframes float-circle-delayed { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.08)} }
        @keyframes gold-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,206,27,0.3)} 50%{box-shadow:0 0 20px 6px rgba(255,206,27,0.15)} }
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 15%{transform:scale(1.25)} 30%{transform:scale(1)} 45%{transform:scale(1.15)} 60%{transform:scale(1)} }
        @keyframes icon-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        .floating-circle { position:absolute; border-radius:50%; opacity:0.12; pointer-events:none; }
      `}</style>

      {/* ═══════ HERO ═══════ */}
      <section className="relative py-16 md:py-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: "#1A472A" }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&h=600&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.2,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, rgba(255,206,27,0.1), transparent 60%)",
            }}
          />
          {/* Floating circles */}
          <div className="floating-circle hidden md:block w-32 h-32 -top-6 -left-6 bg-jorc-green-light" style={{ animation: "float-circle 6s ease-in-out infinite" }} />
          <div className="floating-circle hidden md:block w-24 h-24 top-1/3 -right-4 bg-jorc-green-light" style={{ animation: "float-circle-delayed 8s ease-in-out infinite" }} />
          <div className="floating-circle hidden md:block w-40 h-40 bottom-0 left-1/4 bg-jorc-green" style={{ animation: "float-circle 7s ease-in-out infinite 1s" }} />
          <div className="floating-circle hidden md:block w-20 h-20 top-1/4 left-1/2 bg-[#FFCE1B]" style={{ animation: "float-circle-delayed 9s ease-in-out infinite 2s" }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-5">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase reveal" style={{ background: "rgba(255,206,27,0.15)", color: "#FFCE1B", border: "1px solid rgba(255,206,27,0.3)", transitionDelay: "0.05s", animation: "gold-pulse 3s ease-in-out infinite" }}>
            #SupportJORC
          </span>
          <h1
            className="font-black mb-6 leading-tight"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.5rem, 5vw, 3.25rem)",
              color: "#fff",
            }}
          >
            Empower a Mind. Build a Community.<br />
            <span style={{ color: "#FFCE1B" }}>Bridge the Digital Divide.</span>
          </h1>
          <p className="text-white/85 text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed reveal" style={{ transitionDelay: "0.15s" }}>
            Your support keeps our world-class computer laboratory, library, and community training
            programs 100% free for the students, youth, and creators who need them most.
          </p>
          <div className="reveal" style={{ transitionDelay: "0.25s" }}>
            <Button
              size="lg"
              className="font-bold text-base px-8 py-6 shadow-lg border-0 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,206,27,0.4)]"
              style={{
                background: "linear-gradient(135deg, #FFCE1B, #FFCE1B)",
                color: "#1a1a2e",
              }}
              onClick={openForm}
            >
              <Heart className="h-5 w-5 mr-2 transition-all duration-300 group-hover:translate-x-1" />
              <span className="transition-all duration-300 group-hover:translate-x-0.5">Give Today — Support #SupportJORC</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════ DONATION FORM ═══════ */}
      {showForm && (
      <section id="donate-form" className="py-12 md:py-20 relative overflow-hidden">
        {/* (8) Background shimmer */}
        <div className="absolute inset-0 bg-jorc-green-lighter" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(255,206,27,0.03) 0%, transparent 50%, rgba(26,71,42,0.04) 100%)",
          backgroundSize: "200% 200%",
          animation: entered ? "shimmer-slide 6s ease-in-out infinite" : "none",
        }} />
        <style>{`@keyframes shimmer-slide { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>

        <div className="max-w-2xl mx-auto px-5 relative z-10">
          <div className={`text-center mb-10 transition-all duration-700 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-3">
              Make a Donation
            </h2>
            <p className="text-muted-foreground text-sm">
              Every contribution keeps JORC free for the community
            </p>
          </div>

          {/* (2) Live amount preview card */}
          <div className={`transition-all duration-700 delay-75 mb-6 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="bg-white rounded-xl p-4 md:p-5 border border-jorc-green/10 shadow-sm flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Your Impact</p>
                <p className="text-lg md:text-xl font-bold text-jorc-green mt-0.5">
                  ₦{donationAmount.toLocaleString()}
                  {donationAmount > 0 && <span className="text-sm font-normal text-gray-500 ml-2">= {impactText}</span>}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFCE1B] to-[#FFCE1B]/70 flex items-center justify-center shrink-0 shadow-sm">
                <Heart className="w-5 h-5 text-[#1a1a2e]" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 md:p-8 shadow-soft border border-jorc-green-lighter space-y-5 relative">
            {/* (8) subtle shimmer inside form */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-jorc-green/20 to-transparent" />

            <button
              type="button"
              onClick={() => { setShowForm(false); setEntered(false); }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all"
              aria-label="Close donation form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {[
              {
                key: "name",
                content: (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FieldWrapper icon={User} label="First Name" required focused={focusedField === "firstName"} hasVal={!!form.firstName}>
                      <input
                        required value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
                        onFocus={() => setFocusedField("firstName")} onBlur={() => setFocusedField(null)}
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all duration-300 peer placeholder:text-gray-300"
                        style={{ borderColor: focusedField === "firstName" ? "#1A472A" : "#e5e7eb", boxShadow: focusedField === "firstName" ? "0 0 0 3px rgba(26,71,42,0.12)" : "none" }}
                      />
                    </FieldWrapper>
                    <FieldWrapper icon={User} label="Last Name" required focused={focusedField === "lastName"} hasVal={!!form.lastName}>
                      <input
                        required value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
                        onFocus={() => setFocusedField("lastName")} onBlur={() => setFocusedField(null)}
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all duration-300 peer placeholder:text-gray-300"
                        style={{ borderColor: focusedField === "lastName" ? "#1A472A" : "#e5e7eb", boxShadow: focusedField === "lastName" ? "0 0 0 3px rgba(26,71,42,0.12)" : "none" }}
                      />
                    </FieldWrapper>
                  </div>
                ),
              },
              {
                key: "email",
                content: (
                  <FieldWrapper icon={Mail} label="Email Address" required focused={focusedField === "email"} hasVal={!!form.email}>
                    <input
                      type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
                      onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all duration-300 peer placeholder:text-gray-300"
                      style={{ borderColor: focusedField === "email" ? "#1A472A" : "#e5e7eb", boxShadow: focusedField === "email" ? "0 0 0 3px rgba(26,71,42,0.12)" : "none" }}
                    />
                  </FieldWrapper>
                ),
              },
              {
                key: "location",
                content: (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FieldWrapper icon={Globe} label="Country" focused={focusedField === "country"} hasVal={!!form.country}>
                      <input
                        value={form.country} onChange={(e) => update("country", e.target.value)}
                        onFocus={() => setFocusedField("country")} onBlur={() => setFocusedField(null)}
                        placeholder="Nigeria"
                        className="w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all duration-300 peer placeholder:text-gray-300"
                        style={{ borderColor: focusedField === "country" ? "#1A472A" : "#e5e7eb", boxShadow: focusedField === "country" ? "0 0 0 3px rgba(26,71,42,0.12)" : "none" }}
                      />
                    </FieldWrapper>
                    <FieldWrapper icon={Phone} label="Phone Number" focused={focusedField === "phone"} hasVal={!!form.phone}>
                      <input
                        value={form.phone} onChange={(e) => update("phone", e.target.value)}
                        onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                        placeholder="+234 800 000 0000"
                        className="w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all duration-300 peer placeholder:text-gray-300"
                        style={{ borderColor: focusedField === "phone" ? "#1A472A" : "#e5e7eb", boxShadow: focusedField === "phone" ? "0 0 0 3px rgba(26,71,42,0.12)" : "none" }}
                      />
                    </FieldWrapper>
                  </div>
                ),
              },
              {
                key: "amount",
                content: (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Donation Amount</span>
                      <span className="text-red-400">*</span>
                    </div>
                    {/* (5) Smooth dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setAmountOpen(!amountOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all duration-300"
                        style={{ borderColor: amountOpen ? "#1A472A" : "#e5e7eb", boxShadow: amountOpen ? "0 0 0 3px rgba(26,71,42,0.12)" : "none" }}
                      >
                        <span className={form.useCustomAmount ? "text-gray-400" : "text-gray-800 font-medium"}>
                          {form.useCustomAmount ? "Other amount" : `₦${form.amount.toLocaleString()}`}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-300 ${amountOpen ? "rotate-180" : ""}`} />
                      </button>
                      {amountOpen && (
                        <div className="z-30 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg">
                          <div className="py-1">
                            {amountOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => { update("amount", opt.value); update("useCustomAmount", false); setAmountOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-jorc-green-lighter ${
                                  !form.useCustomAmount && form.amount === opt.value ? "bg-jorc-green-lighter font-semibold text-jorc-green" : "text-gray-700"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => { update("useCustomAmount", true); setAmountOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-jorc-green-lighter border-t border-gray-100 ${
                                form.useCustomAmount ? "bg-jorc-green-lighter font-semibold text-jorc-green" : "text-gray-700"
                              }`}
                            >
                              Other amount
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {form.useCustomAmount && (
                      <div className="mt-3 transition-all duration-300 animate-in slide-in-from-top-2">
                        <input
                          type="number" min={1} value={form.customAmount}
                          onChange={(e) => update("customAmount", e.target.value)}
                          onFocus={(e) => { setFocusedField("customAmount"); e.target.select(); }}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Enter amount in Naira"
                          className="w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all duration-300"
                          style={{ borderColor: focusedField === "customAmount" ? "#1A472A" : "#e5e7eb", boxShadow: focusedField === "customAmount" ? "0 0 0 3px rgba(26,71,42,0.12)" : "none" }}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "anonymous",
                content: (
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      form.anonymous ? "bg-jorc-green border-jorc-green scale-110" : "border-gray-300 group-hover:border-jorc-green/50"
                    }`}>
                      {form.anonymous && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </div>
                    <input type="checkbox" checked={form.anonymous} onChange={(e) => update("anonymous", e.target.checked)} className="sr-only" />
                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-gray-400 transition-all group-hover:text-jorc-green" />
                      Keep my donation anonymous
                    </span>
                  </label>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.key}
                className={`transition-all duration-600 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${0.08 + i * 0.06}s` }}
              >
                {item.content}
              </div>
            ))}

            {/* Submit */}
            <div className={`transition-all duration-700 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "0.5s" }}>
              <Button
                type="submit"
                disabled={submitting || submitted}
                className="w-full font-bold text-base py-6 shadow-lg border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,206,27,0.35)] disabled:opacity-60"
                style={{
                  background: submitted ? "linear-gradient(135deg, #1A472A, #2D6A4F)" : "linear-gradient(135deg, #FFCE1B, #FFCE1B)",
                  color: submitted ? "#fff" : "#1a1a2e",
                }}
              >
                {submitting ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Processing…</span>
                ) : submitted ? (
                  <span className="flex items-center gap-2"><Check className="h-5 w-5" /> Intent Received</span>
                ) : (
                  <span className="flex items-center gap-2"><Heart className="h-5 w-5" /> Complete Donation</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
      )}

      {/* ═══════ WHERE YOUR MONEY GOES + WHY SUPPORT (merged) ═══════ */}
      <section id="donut-section" className="py-12 md:py-20 bg-background reveal">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* LEFT — Where Your Money Goes */}
            <div>
              <div className="text-center md:text-left mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-3 reveal" style={{ transitionDelay: "0.1s" }}>
                  Where Your Money Goes
                </h2>
                <p className="text-sm text-muted-foreground reveal" style={{ transitionDelay: "0.15s" }}>
                  Every donation is reinvested directly into our community hub.
                </p>
              </div>
              <div className="flex flex-col items-center md:flex-row md:items-center gap-6">
                {/* Donut chart */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 reveal" style={{ transitionDelay: "0.2s" }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      const cx = 50, cy = 50, r = 38, circumference = 2 * Math.PI * r;
                      let offset = 0;
                      return categories.map((cat, i) => {
                        const segLen = (cat.pct / 100) * circumference;
                        const isHovered = hoveredIdx === i;
                        const seg = (
                          <circle
                            key={cat.label}
                            cx={cx} cy={cy} r={r}
                            fill="none" stroke={cat.color}
                            strokeWidth={isHovered ? "14" : "10"}
                            strokeDasharray={`${segLen} ${circumference - segLen}`}
                            strokeDashoffset={-offset}
                            className="transition-all duration-500"
                            style={{ opacity: hoveredIdx === null || isHovered ? 1 : 0.4 }}
                          />
                        );
                        offset += segLen;
                        return seg;
                      });
                    })()}
                    <circle cx="50" cy="50" r="28" fill="var(--background)" stroke="none" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <span className="text-xl md:text-2xl font-bold text-jorc-green transition-all duration-500">{countUp}%</span>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">of donations</div>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-2 w-full max-w-xs reveal" style={{ transitionDelay: "0.3s" }}>
                  {categories.map((cat, i) => (
                    <div
                      key={cat.label}
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-300 cursor-default ${
                        hoveredIdx === i ? "bg-jorc-green-lighter shadow-sm" : "hover:bg-jorc-green-lighter/50"
                      }`}
                      style={{ borderLeft: hoveredIdx === i ? `3px solid ${cat.color}` : "3px solid transparent" }}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-300" style={{ background: cat.color, transform: hoveredIdx === i ? "scale(1.3)" : "scale(1)" }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-jorc-green truncate">{cat.label}</span>
                          <span className="text-xs font-bold shrink-0" style={{ color: cat.color }}>{cat.pct}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{cat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Why Support JORC */}
            <div>
              <div className="text-center md:text-left mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-3 reveal" style={{ transitionDelay: "0.1s" }}>
                  Why Support JORC?
                </h2>
                <p className="text-sm text-muted-foreground reveal" style={{ transitionDelay: "0.15s" }}>
                  Your contribution keeps everything 100% free for the community.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-soft reveal reveal-scale group transition-all duration-500 hover:shadow-[0_0_30px_rgba(40,80,46,0.2)] hover:-translate-y-1" style={{ transitionDelay: "0.2s" }}>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Unlike traditional programs that charge heavy tuition fees, every class, book borrow, and
                  computer hour at <strong className="text-jorc-green">JORC is entirely free of charge</strong> for our local learners.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  To maintain this high-standard, high-availability space, we rely on the generosity of
                  supporters like you. By donating to JORC, you are directly investing in the digital
                  inclusion of Nigeria.
                </p>
                <div className="flex items-center gap-3 p-4 rounded-lg transition-all duration-300 hover:bg-[rgba(40,80,46,0.1)]" style={{ background: "rgba(40,80,46,0.06)" }}>
                  <Heart className="h-5 w-5 text-jorc-green flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ animation: "icon-pulse 2s ease-in-out infinite" }} />
                  <p className="text-xs font-semibold text-jorc-green">
                    100% of your donation is channeled directly into operations, hardware maintenance, and trainee support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST & TRANSPARENCY ═══════ */}
      <section className="py-12 md:py-20 bg-background reveal">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-4 reveal" style={{ transitionDelay: "0.1s" }}>
              Trust & Transparency
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Shield, title: "Secure Giving", desc: "All financial transactions are secured and encrypted using our payment processing partners." },
              { icon: FileText, title: "Governance", desc: "JORC operates under the strict guidelines of the Francisca and Jonah Otunla Foundation, adhering to international non-profit transparency and auditing standards." },
              { icon: Heart, title: "Annual Reports", desc: "Every year, we publish our operational audits, detailing workstation uptime, total library checkouts, and student graduation outcomes." },
            ].map((card, i) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-400 hover:-translate-y-1.5 hover:shadow-lg bg-white"
                style={{ transitionDelay: `${0.2 + i * 0.15}s` }}
              >
                {/* Accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-jorc-green-lighter transition-all duration-400 group-hover:bg-jorc-green" />
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-jorc-green-lighter flex items-center justify-center mx-auto mb-4 transition-all duration-400 group-hover:bg-jorc-green group-hover:scale-110">
                  <card.icon className="h-6 w-6 text-jorc-green transition-all duration-400 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-jorc-green mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BOTTOM ═══════ */}
      <section className="py-12 text-white reveal" style={{ background: "#1A472A" }}>
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4 reveal" style={{ transitionDelay: "0.1s" }}>Make a Difference Today</h3>
          <p className="text-base md:text-lg opacity-90 mb-6 reveal" style={{ transitionDelay: "0.2s" }}>
            Your contribution keeps the doors open and the screens on for learners who need it most.
          </p>
          <div className="reveal" style={{ transitionDelay: "0.3s" }}>
          <Button
            size="lg"
            className="font-bold text-base px-8 shadow-lg border-0 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,206,27,0.4)]"
            style={{
              background: "linear-gradient(135deg, #FFCE1B, #FFCE1B)",
              color: "#1a1a2e",
            }}
            onClick={openForm}
          >
            <Heart className="h-5 w-5 mr-2 transition-all duration-300 group-hover:translate-x-1" style={{ animation: heartBeat ? "heartbeat 1.2s ease-in-out infinite" : "none" }} />
            Give Today
          </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
