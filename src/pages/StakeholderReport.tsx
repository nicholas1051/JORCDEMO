import { useEffect, useRef, useState } from "react";

const stakeholders = [
  { name: "Bakare Badrudeen", cohort: "CBT Preparedness", quote: "The questions were so carefully selected that I actually met some of them in the JAMB examination. It turned my anxiety into 200 marks." },
  { name: "Ojebisi Lydia Opeyemi", cohort: "CBT · Ofiki Grammar School", quote: "The training strategy, with emphasis on practical work and time-limited exams, taught me time management. I was really comfortable, hence scoring 212 points." },
  { name: "Jimoh Nasirudeen", cohort: "Teachers' ICT Training", quote: "I started with zero experience. By the end, I could generate lesson notes with Gemini, build spreadsheets, and create animated PowerPoint slides. A completely new teaching toolkit." },
  { name: "Bello Rhodiat Toyosi", cohort: "Teachers' ICT · LA Basic School", quote: "I came in uncertain about AI and left strongly confident. NotebookLM for lesson planning, animated slides, a complete digital portfolio. Digital tools will transform my classroom." },
  { name: "Aderogba Ramadan", cohort: "CBT · Muslim Community GS", quote: "I have managed to get 210 marks, and now I am fully prepared for any computer-based platform. Being part of this training made me feel more confident." },
  { name: "Abdulkareem Maryam Aderonke", cohort: "CBT · Ofiki Grammar School", quote: "I gained a lot of confidence in using the computer. Now I have enough confidence in using the computer-based assessment system. The training questions were also related to my academic study." },
];

const stats = [
  { target: 1001, label: "Community Members Registered", icon: "people" },
  { target: 6500, label: "Purposeful Facility Visits", icon: "home" },
  { target: 330, label: "ICT Trained Across All Cohorts", icon: "monitor" },
  { target: 134, label: "CBT Prepared · 91% Attendance", icon: "check" },
  { target: 1400, label: "Physical Library Books", icon: "book" },
  { target: 400, label: "Regular Library Users", icon: "users" },
  { target: 20, label: "Reading Club Pupils", icon: "book-open" },
  { target: 13, label: "Schools Reached via Outreach", icon: "school" },
];

const yearTwoPlans = [
  { title: "Licensed CBT Examination Centre", desc: "Eliminate travel burdens — a JAMB-standard centre, right here in ATISBO LGA.", icon: "monitor" },
  { title: "Advanced Digital Skills Pathways", desc: "Graphic design, digital marketing, AI for entrepreneurs, basic coding — turning literacy into economic opportunity.", icon: "activity" },
  { title: "Mobile Library & School Outreach", desc: "Travelling book collections, classroom reading sessions, and teacher resources for communities that can't reach the centre.", icon: "book" },
  { title: "Teachers' Capacity (Expanded)", desc: "Scale educator-focused training across ATISBO LGA — AI lesson planning, automated results, content creation.", icon: "users" },
  { title: "Reading Club Literacy Movement", desc: "Transition to a community-wide literacy movement with school-based volunteer facilitators and literacy champions.", icon: "book-open" },
  { title: "Community Recreation Centre", desc: "A playground, sports facilities and outdoor spaces — holistic human development beyond the keyboard.", icon: "check-circle" },
];

const reachBars = [
  { label: "Irawo-Owode", pct: 62.5, color: "bg-jorc-green" },
  { label: "Ofiki", pct: 15.4, color: "bg-green-400" },
  { label: "Ago-Are", pct: 9.1, color: "bg-green-300" },
  { label: "Irawo-Ile", pct: 7.7, color: "bg-green-200" },
  { label: "Others", pct: 5.3, color: "bg-gold" },
];

const cohortData = [
  { label: "Pilot", pct: 17, y: 119 },
  { label: "Cohort 1", pct: 70, y: 61 },
  { label: "Cohort 2", pct: 32, y: 92 },
];

const strandData = [
  { strand: "Pilot (8wk)", reach: "86 enrolled", outcome: "Shaped all cohorts" },
  { strand: "Cohort 1", reach: "30 enrolled", outcome: "70% retention" },
  { strand: "Cohort 2", reach: "75 enrolled", outcome: "100% AI ethics" },
  { strand: "Teachers' ICT", reach: "5 completed", outcome: "9/9 competencies↑" },
  { strand: "CBT Prep", reach: "134 attended", outcome: "100% anxiety↓" },
];

const cbtBars = [
  { label: "Reduced Exam Anxiety", pct: 100, color: "bg-green-300" },
  { label: "Rated Simulation Very Helpful", pct: 100, color: "bg-green-300" },
  { label: "Session Attendance Rate", pct: 91, color: "bg-gold" },
  { label: "Female Participants", pct: 67, color: "bg-white/60" },
];

const schoolsData = [
  { name: "Ofiki Grammar School", count: 38 },
  { name: "Irawo Muslim Grammar School", count: 27 },
  { name: "Muslim Community GS, Ofiki", count: 24 },
];

const libBarsData = [
  { id: "b1", h: 90, color: "#1B4332", label: "Students" },
  { id: "b2", h: 50, color: "#2d6a4f", label: "Corps" },
  { id: "b3", h: 28, color: "#2d6a4f", label: "Teachers" },
  { id: "b4", h: 18, color: "#FFD700", label: "Independent" },
];

const outreachItems = [
  { color: "bg-jorc-green", ic: "school", title: "School Sensitisation Visits", desc: "5 schools visited across Irawo-Owode — every institution lacked functional ICT labs and libraries. Immediate demand generated; CBT venue proposal initiated by Community Grammar School principal." },
  { color: "bg-gold", ic: "zap", title: "Oke-Ogun Tech Conference, Saki", desc: "6 JORC representatives attended. Student Osoko Nurudeen was awarded a full ICT scholarship — a direct outcome of JORC participation and a powerful signal that the centre is a gateway to opportunity." },
  { color: "bg-jorc-green", ic: "people", title: "Local Inspector of Education (LIE)", desc: "JORC initiated contact with the LIE office for official school data, positioning itself as an evidence-driven rural development actor." },
];

const teacherSnapshots = [
  { value: "9/9", sub: "Competencies Improved" },
  { value: "76/100", sub: "Final Project Score" },
  { value: "100%", sub: "Would Recommend" },
  { value: "100%", sub: "Would Return" },
];

const aboutData = [
  { label: "Members Registered", value: "1,001" },
  { label: "Facility Visits", value: "6,500+" },
  { label: "ICT Trained", value: "330+" },
  { label: "CBT Prepared", value: "134" },
  { label: "Library Books", value: "1,400+" },
  { label: "Female Participation", value: "56%+" },
];

const svgIcons = {
  people: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  monitor: "M2 3h20v14H2zM8 21h8M12 17v4",
  check: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  users: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  "book-open": "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  school: "M22 10v6M2 10l10-5 10 5M6 12v5h3v-3h6v3h3v-5",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  "check-circle": "M22 11.08V12a10 10 0 1 1-5.93-9.14M8 12l2.5 2.5L16 9",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};

const SvgIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={(svgIcons as any)[name] || svgIcons.check} />
  </svg>
);

const StakeholderReport = () => {
  const [scrollPct, setScrollPct] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [preloader, setPreloader] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Counters
  const [counts, setCounts] = useState<Record<number, number>>({});
  const countersRef = useRef<(HTMLDivElement | null)[]>([]);

  // Bar fills
  const [barWidths, setBarWidths] = useState<Record<number, number>>({});
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Gender donut
  const [donutVisible, setDonutVisible] = useState(false);
  const donutRef = useRef<HTMLDivElement>(null);

  // Library chart
  const [libChartVisible, setLibChartVisible] = useState(false);
  const libChartRef = useRef<HTMLDivElement>(null);

  // Cohort chart
  const [cohortVisible, setCohortVisible] = useState(false);
  const cohortChartRef = useRef<HTMLDivElement>(null);

  // Reach bars
  const [reachVisible, setReachVisible] = useState(false);
  const reachRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setPreloader(false), 800);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackToTop(scrollTop > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Counter observer
  useEffect(() => {
    const els = countersRef.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLDivElement;
            const idx = parseInt(el.dataset.idx || "0", 10);
            const target = stats[idx]?.target || 0;
            if (counts[idx] === undefined || counts[idx] === 0) {
              const duration = 1800;
              const step = target / (duration / 16);
              let current = 0;
              const tmr = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(tmr); }
                setCounts((prev) => ({ ...prev, [idx]: Math.floor(current) }));
              }, 16);
            }
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Bar fill observer
  useEffect(() => {
    const els = barRefs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLDivElement;
            const idx = parseInt(el.dataset.idx || "0", 10);
            setTimeout(() => setBarWidths((prev) => ({ ...prev, [idx]: 100 })), 200);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Gender donut observer
  useEffect(() => {
    if (!donutRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setDonutVisible(true); obs.unobserve(entry.target); }
      },
      { threshold: 0.4 }
    );
    obs.observe(donutRef.current);
    return () => obs.disconnect();
  }, []);

  // Lib chart observer
  useEffect(() => {
    if (!libChartRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setLibChartVisible(true); obs.unobserve(entry.target); }
      },
      { threshold: 0.4 }
    );
    obs.observe(libChartRef.current);
    return () => obs.disconnect();
  }, []);

  // Cohort chart observer
  useEffect(() => {
    if (!cohortChartRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setCohortVisible(true); obs.unobserve(entry.target); }
      },
      { threshold: 0.4 }
    );
    obs.observe(cohortChartRef.current);
    return () => obs.disconnect();
  }, []);

  // Reach bars observer
  useEffect(() => {
    if (!reachRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setReachVisible(true); obs.unobserve(entry.target); }
      },
      { threshold: 0.3 }
    );
    obs.observe(reachRef.current);
    return () => obs.disconnect();
  }, []);

  const circ = 2 * Math.PI * 70;
  const femaleOffset = donutVisible ? circ * (1 - 0.6) : circ;
  const maleOffset = donutVisible ? circ * (1 - 0.4) : circ;
  const maleRotate = donutVisible ? -90 + 360 * 0.6 : -90;

  const genderIcons: ("female" | "male")[] = [];
  for (let i = 0; i < 60; i++) genderIcons.push("female");
  for (let i = 0; i < 40; i++) genderIcons.push("male");

  return (
    <div ref={sectionRef} className="text-gray-800" style={{ fontFamily: "Montserrat,-apple-system,sans-serif", backgroundColor: "#F2EEE8" }}>
      <style>{`
        :root{--green:#1B4332;--green-mid:#2d6a4f;--green-light:#2d6a4f;--cream:#F2EEE8;--gold:#FFD700;--gold-light:#FFED4A;}
        h1,h2,h3,h4{font-family:'Playfair Display',Georgia,serif;letter-spacing:-0.01em;}
        .hero-bg{background:var(--green);position:relative;overflow:hidden;}
        .hero-bg::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.3) 100%);pointer-events:none;}
        .hero-pattern{background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.08) 1px,transparent 0);background-size:40px 40px;}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes mapPulse{0%,100%{r:5;opacity:1}50%{r:9;opacity:0.5}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        .animate-float{animation:float 6s ease-in-out infinite;}
        .animate-marquee{display:flex;width:fit-content;animation:marquee 35s linear infinite;}
        .gradient-text{background:linear-gradient(135deg,#fff,#2d6a4f,#f0faf0,#fff);background-size:300% 300%;animation:gradient-shift 4s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .reveal{opacity:0;transform:translateY(30px);transition:all 0.8s cubic-bezier(0.22,1,0.36,1);}
        .reveal.active{opacity:1;transform:translateY(0);}
        .reveal-left{opacity:0;transform:translateX(-30px);transition:all 0.8s cubic-bezier(0.22,1,0.36,1);}
        .reveal-left.active{opacity:1;transform:translateX(0);}
        .reveal-right{opacity:0;transform:translateX(30px);transition:all 0.8s cubic-bezier(0.22,1,0.36,1);}
        .reveal-right.active{opacity:1;transform:translateX(0);}
        .stagger-1{transition-delay:0.1s}.stagger-2{transition-delay:0.2s}.stagger-3{transition-delay:0.3s}
        .stagger-4{transition-delay:0.4s}.stagger-5{transition-delay:0.5s}.stagger-6{transition-delay:0.6s}
        .stat-card{position:relative;overflow:hidden;transition:transform 0.4s cubic-bezier(0.22,1,0.36,1),box-shadow 0.4s ease;border:1px solid rgba(27,67,50,0.06);}
        .stat-card:hover{transform:translateY(-8px);box-shadow:0 24px 48px rgba(27,67,50,0.12);}
        .stat-card::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:3px;background:linear-gradient(90deg,var(--green),var(--green-mid));border-radius:1rem 1rem 0 0;transition:width 0.6s cubic-bezier(0.22,1,0.36,1);}
        .stat-card.reveal.active::after{width:60%;}
        .stat-card::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transition:left 0.6s;z-index:1;pointer-events:none;}
        .stat-card:hover::before{left:100%;}
        .quote-card{border-left:4px solid var(--green);background:white;border-radius:1rem;padding:1.5rem 2rem;border:1px solid rgba(27,67,50,0.06);transition:transform 0.3s ease,box-shadow 0.3s ease;}
        .quote-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(27,67,50,0.08);}
        .bar-fill{width:0;transition:width 1.4s cubic-bezier(0.22,1,0.36,1);}
        .pill{display:inline-block;background:rgba(27,67,50,0.08);color:var(--green);font-size:0.7rem;padding:0.2rem 0.75rem;border-radius:9999px;font-weight:600;letter-spacing:0.02em;}
        .text-gold{color:#FFD700;}.bg-gold{background-color:#FFD700;}
        .sdg-badge{display:inline-flex;align-items:center;gap:0.4rem;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:0.5rem;padding:0.45rem 0.85rem;font-size:0.75rem;font-weight:600;color:white;backdrop-filter:blur(4px);transition:background 0.3s,transform 0.3s;}
        .sdg-badge:hover{background:rgba(255,255,255,0.18);transform:translateY(-1px);}
        .glass-nav{background:rgba(255,255,255,0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(27,67,50,0.08);}
        .btn-jorc{transition:all 0.3s cubic-bezier(0.22,1,0.36,1);position:relative;overflow:hidden;}
        .btn-jorc:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(27,67,50,0.2);}
        .btn-jorc:active{transform:translateY(0);}
        .btn-outline{transition:all 0.3s cubic-bezier(0.22,1,0.36,1);}
        .btn-outline:hover{transform:translateY(-2px);}
        .section-divider{height:1px;background:linear-gradient(90deg,transparent,var(--green-mid),transparent);opacity:0.15;margin:0 auto;max-width:80%;}
        .section-divider-gold{height:1px;background:linear-gradient(90deg,transparent,#FFD700,transparent);opacity:0.2;margin:0 auto;max-width:60%;}
        .noise-overlay{position:absolute;inset:0;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-size:256px 256px;pointer-events:none;}
        a:focus-visible,button:focus-visible{outline:2px solid var(--green);outline-offset:2px;border-radius:4px;}
        ::selection{background:var(--green);color:white;}
        @media(max-width:768px){.hide-mobile{display:none!important}}
      `}</style>

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 z-[9999] h-[3px] pointer-events-none" style={{ width: `${scrollPct}%`, background: "linear-gradient(90deg,#1B4332,#2d6a4f,#FFD700)", boxShadow: "0 0 8px rgba(27,67,50,0.3)" }} />

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-jorc-green text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#2d5a44] transition-all hover:scale-110 ${showBackToTop ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2.5"}`}
        style={{ transition: "all 0.3s ease" }}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="18 15 12 9 6 15" /></svg>
      </button>

      {/* Preloader */}
      <div className={`fixed inset-0 z-[150] bg-jorc-green flex items-center justify-center ${preloader ? "" : "opacity-0 invisible"}`} style={{ transition: "opacity 0.5s ease,visibility 0.5s ease" }}>
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin" />
            <div className="absolute inset-1 rounded-full overflow-hidden flex items-center justify-center">
              <img src="https://i.postimg.cc/brTF1zfC/Gemini-Generated-Image-nx1nhknx1nhknx1n.png" alt="JORC Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-white/70 text-xs tracking-widest uppercase animate-pulse">Loading Report…</p>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="hero-bg hero-pattern min-h-screen flex flex-col justify-center px-6 md:px-20 py-24 relative">
        <div className="noise-overlay" />
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="absolute w-96 h-96 rounded-full bg-green-400/5 -top-20 -right-20 pointer-events-none" />
        <div className="absolute w-64 h-64 rounded-full bg-yellow-400/5 bottom-20 right-1/3 animate-float pointer-events-none" style={{ animationDelay: "1s" }} />
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase mb-8" style={{ animation: "fadeInUp 0.6s ease both" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Year One · Annual Impact Report · 2025–2026
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div style={{ animation: "fadeInLeft 0.8s 0.1s ease both" }}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                <span className="block">The Need</span>
                <span className="block text-gold">Is Real.</span>
                <span className="block">The Model</span>
                <span className="block text-gold">Is Working.</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">Jonah Otunla Resource Center's inaugural year — how we equipped 1,001 community members with digital skills, literacy, and the confidence to compete.</p>
              <div className="flex flex-wrap gap-4">
                <a href="#executive-summary" className="btn-jorc bg-white text-jorc-green font-bold px-7 py-3 rounded-full hover:bg-green-50 shadow-lg text-sm inline-flex items-center gap-2">Read the Report <span className="text-lg leading-none">↓</span></a>
                <a href="https://forms.gle/r1DxaTNkvMaAS2g59" className="btn-outline border-2 border-white/40 text-white font-bold px-7 py-3 rounded-full hover:bg-white/10 hover:border-white/70 text-sm">Partner With Us</a>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center" style={{ animation: "fadeInRight 0.8s 0.3s ease both" }}>
              <svg viewBox="0 0 580 440" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
                <g transform="translate(0, 40)">
                  <rect x="200" y="180" width="190" height="170" rx="8" fill="#0d3322" stroke="#2d6a4f" strokeWidth="2" />
                  <rect x="220" y="200" width="36" height="30" rx="3" fill="#2d6a4f" opacity="0.4" />
                  <rect x="267" y="200" width="36" height="30" rx="3" fill="#2d6a4f" opacity="0.4" />
                  <rect x="314" y="200" width="36" height="30" rx="3" fill="#2d6a4f" opacity="0.4" />
                  <rect x="220" y="250" width="36" height="30" rx="3" fill="#FFD700" opacity="0.5" />
                  <rect x="267" y="250" width="36" height="30" rx="3" fill="#2d6a4f" opacity="0.4" />
                  <rect x="314" y="250" width="36" height="30" rx="3" fill="#2d6a4f" opacity="0.4" />
                  <rect x="250" y="295" width="90" height="55" rx="4" fill="#2d6a4f" opacity="0.3" />
                  <path d="M250 350 L250 310 Q295 290 340 310 L340 350" fill="#FFD700" opacity="0.3" />
                  <polygon points="182,182 295,118 408,182" fill="#1B4332" stroke="#2d6a4f" strokeWidth="2" />
                  <polygon points="262,182 295,145 328,182" fill="#FFD700" opacity="0.6" />
                  <rect x="220" y="155" width="150" height="26" rx="3" fill="#FFD700" opacity="0.85" />
                  <text x="295" y="173" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="9.5" fontWeight="700" fill="#0d2b1e">JORC · ATISBO LGA</text>
                  <rect x="110" y="350" width="360" height="10" rx="4" fill="#0d3322" opacity="0.5" />
                  <rect x="130" y="290" width="10" height="60" rx="3" fill="#1B4332" />
                  <circle cx="135" cy="272" r="28" fill="#2d6a4f" opacity="0.8" />
                  <circle cx="120" cy="288" r="18" fill="#1B4332" opacity="0.8" />
                  <circle cx="150" cy="285" r="20" fill="#2d6a4f" opacity="0.7" />
                  <rect x="440" y="290" width="10" height="60" rx="3" fill="#1B4332" />
                  <circle cx="445" cy="268" r="30" fill="#2d6a4f" opacity="0.8" />
                  <circle cx="430" cy="288" r="18" fill="#1B4332" opacity="0.7" />
                  <circle cx="160" cy="340" r="10" fill="#2d6a4f" opacity="0.9" />
                  <rect x="154" y="350" width="12" height="22" rx="4" fill="#2d6a4f" opacity="0.7" />
                  <circle cx="200" cy="335" r="10" fill="#FFD700" opacity="0.9" />
                  <rect x="194" y="345" width="12" height="27" rx="4" fill="#FFD700" opacity="0.7" />
                  <circle cx="420" cy="338" r="10" fill="#2d6a4f" opacity="0.9" />
                  <rect x="414" y="348" width="12" height="22" rx="4" fill="#2d6a4f" opacity="0.7" />
                  <circle cx="448" cy="333" r="10" fill="#FFD700" opacity="0.9" />
                  <rect x="442" y="343" width="12" height="27" rx="4" fill="#FFD700" opacity="0.7" />
                </g>
                <g style={{ animation: "float 5s ease-in-out infinite" }}>
                  <rect x="20" y="60" width="150" height="60" rx="12" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <text x="95" y="84" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="20" fontWeight="900" fill="white">1,001</text>
                  <text x="95" y="104" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="8" fill="rgba(255,255,255,0.7)" fontWeight="600">Members Registered</text>
                </g>
                <g style={{ animation: "float 5s 1.5s ease-in-out infinite" }}>
                  <rect x="405" y="30" width="155" height="60" rx="12" fill="rgba(255,215,0,0.12)" stroke="rgba(255,215,0,0.3)" strokeWidth="1.5" />
                  <text x="482" y="54" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="20" fontWeight="900" fill="#FFD700">330+</text>
                  <text x="482" y="74" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="8" fill="rgba(255,255,255,0.7)" fontWeight="600">ICT Trained</text>
                </g>
                <g style={{ animation: "float 5s 0.8s ease-in-out infinite" }}>
                  <rect x="400" y="180" width="160" height="60" rx="12" fill="rgba(45,106,79,0.2)" stroke="rgba(45,106,79,0.4)" strokeWidth="1.5" />
                  <text x="480" y="204" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="20" fontWeight="900" fill="#2d6a4f">100%</text>
                  <text x="480" y="224" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="8" fill="rgba(255,255,255,0.7)" fontWeight="600">Exam Anxiety ↓</text>
                </g>
                <g style={{ animation: "float 5s 2s ease-in-out infinite" }}>
                  <rect x="15" y="210" width="150" height="60" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                  <text x="90" y="234" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="20" fontWeight="900" fill="white">6,500+</text>
                  <text x="90" y="254" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="8" fill="rgba(255,255,255,0.7)" fontWeight="600">Facility Visits</text>
                </g>
                <path d="M280 95 Q295 82 310 95" stroke="#2d6a4f" strokeWidth="2.5" fill="none" opacity="0.7" />
                <path d="M268 82 Q295 68 322 82" stroke="#2d6a4f" strokeWidth="2.5" fill="none" opacity="0.5" />
                <circle cx="295" cy="102" r="4" fill="#2d6a4f" opacity="0.9" />
              </svg>
            </div>
          </div>
          <div className="mt-14 flex flex-wrap gap-3" style={{ animation: "fadeInUp 0.8s 0.6s ease both" }}>
            <span className="sdg-badge">SDG 4 · Quality Education</span>
            <span className="sdg-badge">SDG 5 · Gender Equality</span>
            <span className="sdg-badge">SDG 10 · Reduced Inequalities</span>
            <span className="sdg-badge">SDG 17 · Partnerships</span>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* Ticker Ribbon */}
      <div className="bg-jorc-green py-3 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-jorc-green to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-jorc-green to-transparent z-10" />
        <div className="animate-marquee whitespace-nowrap text-xs font-semibold tracking-widest uppercase">
          <span className="inline-block px-8 text-gold">✦ 1,001 Community Members Registered</span><span className="inline-block px-8 text-white/80">✦ 6,500+ Purposeful Visits</span><span className="inline-block px-8 text-gold">✦ 330+ Trained in Digital Skills</span><span className="inline-block px-8 text-white/80">✦ 134 CBT Prepared · 100% Anxiety Reduction</span><span className="inline-block px-8 text-gold">✦ 1,400+ Library Books</span><span className="inline-block px-8 text-white/80">✦ 56% Female Participation</span><span className="inline-block px-8 text-gold">✦ 13+ Schools Reached</span><span className="inline-block px-8 text-white/80">✦ 1 Student Won Full ICT Scholarship</span>
          <span className="inline-block px-8 text-gold">✦ 1,001 Community Members Registered</span><span className="inline-block px-8 text-white/80">✦ 6,500+ Purposeful Visits</span><span className="inline-block px-8 text-gold">✦ 330+ Trained in Digital Skills</span><span className="inline-block px-8 text-white/80">✦ 134 CBT Prepared · 100% Anxiety Reduction</span><span className="inline-block px-8 text-gold">✦ 1,400+ Library Books</span><span className="inline-block px-8 text-white/80">✦ 56% Female Participation</span><span className="inline-block px-8 text-gold">✦ 13+ Schools Reached</span><span className="inline-block px-8 text-white/80">✦ 1 Student Won Full ICT Scholarship</span>
        </div>
      </div>

      {/* Hero Photo */}
      <div className="px-6 md:px-12 lg:px-20 py-10 max-w-7xl mx-auto reveal">
        <img src="https://lh3.googleusercontent.com/d/1Gts7V6z3BT6CZNCE9fWfQWHGHppmcBgx" alt="JORC building aerial shot" className="rounded-3xl h-72 md:h-96 w-full object-cover shadow-lg" />
      </div>

      {/* ═══ EXECUTIVE SUMMARY ═══ */}
      <section id="executive-summary" className="px-6 md:px-12 lg:px-20 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <span className="pill mb-4 inline-block">Executive Summary</span>
          <h2 className="text-3xl md:text-5xl text-jorc-green font-bold mb-4">A Year That Proved the Model</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">In many rural communities across Nigeria, talent is abundant — but opportunity is not. JORC was established to change this reality.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-5 reveal-left">
            <p className="text-gray-700 leading-relaxed">Within one year, JORC registered <strong className="text-jorc-green">1,001 community members</strong>, recorded over <strong className="text-jorc-green">6,500 purposeful visits</strong>, built a library of more than <strong className="text-jorc-green">1,400 books</strong>, trained <strong className="text-jorc-green">330 beneficiaries in digital skills</strong>, and prepared <strong className="text-jorc-green">134 students</strong> for computer-based examinations.</p>
            <p className="text-gray-700 leading-relaxed">Through <strong>#DigitalAccessForAll</strong>, learners acquired practical ICT skills, explored AI tools, and developed competencies increasingly required in today's economy. Female participation remained above <strong>56%</strong>. Through <strong>#InclusiveLibraryAccess</strong>, the Reading Club served 20+ children and 3,200+ library visits were recorded.</p>
            <blockquote className="border-l-4 border-jorc-green pl-5 text-jorc-green font-semibold italic text-lg">"The need is real. The model is working. The opportunity to scale is now."</blockquote>
          </div>
          <div className="space-y-4 reveal-right stagger-2">
            <div className="bg-jorc-green rounded-2xl p-6 text-white">
              <div className="text-xs uppercase tracking-widest text-white/50 mb-3 font-semibold">Year One at a Glance</div>
              <ul className="space-y-2.5 text-sm">
                {aboutData.map((d, i) => (
                  <li key={i} className={`flex justify-between ${i < aboutData.length - 1 ? "border-b border-white/10 pb-2" : ""}`}>
                    <span className="text-white/70">{d.label}</span><strong>{d.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-sm">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Reporting Period</div>
              <div className="text-2xl font-bold text-jorc-green">2025 – 2026</div>
              <div className="text-gray-500 mt-1">ATISBO LGA, Oyo State, Nigeria</div>
              <div className="mt-3 text-gray-600">An initiative of the <span className="font-semibold text-jorc-green">Francisca &amp; Jonah Otunla Foundation</span></div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5 reveal">
          {[
            { src: "https://lh3.googleusercontent.com/d/1a_51De0qkSkMC6fhKyo5npcOrPGuIqFg", cap: "Learners in the ICT laboratory during a #DigitalAccessForAll session" },
            { src: "https://lh3.googleusercontent.com/d/1dUYKjQfKgzp21KSKnAw2StvaKXPe7F2S", cap: "The JORC Library — a trusted hub for over 400 regular users" },
            { src: "https://lh3.googleusercontent.com/d/151jV1ehCVyKTcetDTkoy4BiZH-3iFswf", cap: "Reading Club pupils in a structured phonics and vocabulary session" },
          ].map((img, i) => (
            <div key={i} className="space-y-2">
              <img src={img.src} alt="" className="rounded-2xl h-52 w-full object-cover shadow-md" />
              <p className="text-xs text-gray-500 text-center italic">{img.cap}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-3xl" />

      {/* ═══ IMPACT STATS ═══ */}
      <section id="impact" className="bg-jorc-green py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">Impact Indicators</span>
            <h2 className="text-3xl md:text-5xl text-white font-bold mb-3">Numbers That Tell the Story</h2>
            <p className="text-white/60 max-w-xl mx-auto">Every figure below is a community member whose life changed because access arrived.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            {stats.map((s, i) => (
              <div key={i} className={`stat-card reveal stagger-${(i % 4) + 1} bg-white rounded-2xl p-6 text-center flex flex-col items-center min-h-[180px] justify-center`}>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                  <SvgIcon name={s.icon} className="w-[22px] h-[22px] text-jorc-green" />
                </div>
                <div ref={(el) => { countersRef.current[i] = el; }} data-idx={i} className="text-4xl font-black counter text-jorc-green">
                  {counts[i]?.toLocaleString() ?? "0"}
                </div>
                <p className="text-gray-500 text-xs mt-2 font-semibold leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Gender donut + Reach bars */}
          <div className="grid md:grid-cols-2 gap-6 reveal" ref={donutRef}>
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-6 text-center">Gender Distribution — All Programmes</div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg width="160" height="160" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#f0f0f0" strokeWidth="22" />
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#1B4332" strokeWidth="22"
                      strokeDasharray={circ.toFixed(1)} strokeDashoffset={femaleOffset.toFixed(1)}
                      strokeLinecap="round" transform="rotate(-90 90 90)"
                      style={{ transition: "stroke-dashoffset 1.5s ease" }} />
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#FFD700" strokeWidth="22"
                      strokeDasharray={circ.toFixed(1)} strokeDashoffset={maleOffset.toFixed(1)}
                      strokeLinecap="round" transform={`rotate(${maleRotate} 90 90)`}
                      style={{ transition: "stroke-dashoffset 1.5s ease 0.3s" }} />
                    <text x="90" y="84" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="28" fontWeight="700" fill="#1B4332">60%</text>
                    <text x="90" y="102" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="9" fill="#888">Female</text>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-10 gap-1.5 mb-3">
                    {genderIcons.map((g, i) => (
                      <div key={i} className="flex items-center justify-center">
                        {g === "female" ? (
                          <svg width="14" height="16" viewBox="0 0 20 24" fill="#1B4332">
                            <circle cx="10" cy="4.5" r="2.8" /><path d="M5 9L10 21L15 9Z" />
                            <path d="M5 9L2.5 15L3.5 15.5L6 9.5Z" /><path d="M15 9L17.5 15L16.5 15.5L14 9.5Z" />
                            <rect x="8" y="20" width="1.6" height="4" rx="0.8" /><rect x="10.4" y="20" width="1.6" height="4" rx="0.8" />
                          </svg>
                        ) : (
                          <svg width="14" height="16" viewBox="0 0 20 24" fill="#FFD700">
                            <circle cx="10" cy="4.5" r="2.8" /><path d="M4 8.5L16 8.5L14.5 17L5.5 17Z" />
                            <rect x="7" y="17" width="2.5" height="5" rx="0.8" /><rect x="10.5" y="17" width="2.5" height="5" rx="0.8" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-1.5"><svg width="14" height="16" viewBox="0 0 20 24" fill="#1B4332"><circle cx="10" cy="4.5" r="2.8" /><path d="M5 9L10 21L15 9Z" /><path d="M5 9L2.5 15L3.5 15.5L6 9.5Z" /><path d="M15 9L17.5 15L16.5 15.5L14 9.5Z" /><rect x="8" y="20" width="1.6" height="4" rx="0.8" /><rect x="10.4" y="20" width="1.6" height="4" rx="0.8" /></svg><span className="font-semibold text-jorc-green">60% Female</span></div>
                    <div className="flex items-center gap-1.5"><svg width="14" height="16" viewBox="0 0 20 24" fill="#FFD700"><circle cx="10" cy="4.5" r="2.8" /><path d="M4 8.5L16 8.5L14.5 17L5.5 17Z" /><rect x="7" y="17" width="2.5" height="5" rx="0.8" /><rect x="10.5" y="17" width="2.5" height="5" rx="0.8" /></svg><span className="font-semibold text-gray-500">40% Male</span></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center italic">Women and girls lead participation across every cohort</p>
            </div>

            <div className="bg-white rounded-2xl p-8" ref={reachRef}>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-6">Community Reach by Location</div>
              <div className="space-y-4">
                {reachBars.map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={`font-semibold ${i === 0 ? "text-jorc-green" : "text-gray-600"}`}>{bar.label}</span>
                      <span className={`font-bold ${i === 0 ? "text-jorc-green" : "text-gray-600"}`}>{bar.pct}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div ref={(el) => { barRefs.current[i] = el; }} data-idx={i}
                        className={`h-full ${bar.color} rounded-full ${reachVisible ? "bar-fill" : ""}`}
                        style={{ width: reachVisible ? `${bar.pct}%` : "0%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider-gold max-w-3xl" />

      {/* ═══ PROGRAMMES ═══ */}
      <section id="programmes" className="px-6 md:px-12 lg:px-20 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <span className="pill mb-4 inline-block">Flagship Programmes</span>
          <h2 className="text-3xl md:text-5xl text-jorc-green font-bold mb-3">Two Programmes. One Mission.</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Every intervention was evidence-driven, community-responsive, and 100% free for beneficiaries.</p>
        </div>

        {/* PROGRAMME 1 */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8 reveal">
            <div className="h-px flex-1 bg-jorc-green/20" />
            <span className="inline-flex items-center gap-2 bg-jorc-green text-white px-5 py-2 rounded-full text-sm font-bold">#DigitalAccessForAll</span>
            <div className="h-px flex-1 bg-jorc-green/20" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-10">
            <div className="reveal-left">
              <h3 className="text-2xl md:text-3xl text-jorc-green font-bold mb-4">Bridging the Digital Divide</h3>
              <p className="text-gray-600 leading-relaxed mb-5">330+ beneficiaries trained across five strands — from an 8-week proof-of-concept Pilot to a Teachers' Digital Skills Workshop and the groundbreaking CBT Preparedness Programme. The AI module was the highest engagement driver in every cohort.</p>

              {/* Cohort chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-5" ref={cohortChartRef}>
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">Cohort Retention Rate — Programme Evolution</div>
                <svg viewBox="0 0 340 160" className="w-full">
                  <line x1="50" y1="20" x2="50" y2="130" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="50" y1="130" x2="320" y2="130" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="50" y1="20" x2="320" y2="20" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="75" x2="320" y2="75" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
                  <text x="44" y="24" textAnchor="end" fontSize="8" fill="#aaa">100%</text>
                  <text x="44" y="79" textAnchor="end" fontSize="8" fill="#aaa">50%</text>
                  <text x="44" y="134" textAnchor="end" fontSize="8" fill="#aaa">0%</text>
                  <text x="105" y="148" textAnchor="middle" fontSize="8" fill="#888">Pilot</text>
                  <text x="185" y="148" textAnchor="middle" fontSize="8" fill="#888">Cohort 1</text>
                  <text x="265" y="148" textAnchor="middle" fontSize="8" fill="#888">Cohort 2</text>
                  <path d="M105,119 L185,61 L265,92 L265,130 L185,130 L105,130 Z" fill="rgba(27,67,50,0.07)" />
                  <polyline points={cohortData.map((d) => `${105 + cohortData.indexOf(d) * 80},${d.y}`).join(" ")}
                    fill="none" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="400" strokeDashoffset={cohortVisible ? "0" : "400"}
                    style={{ transition: "stroke-dashoffset 1.8s ease" }} />
                  {cohortData.map((d, i) => (
                    <g key={i}>
                      <circle cx={105 + i * 80} cy={d.y} r="6" fill="white" stroke="#1B4332" strokeWidth="2.5" />
                      <text x={105 + i * 80} y={d.y - 7} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1B4332">{d.pct}%</text>
                    </g>
                  ))}
                  <rect x="148" y="28" width="74" height="18" rx="4" fill="#1B4332" />
                  <text x="185" y="40" textAnchor="middle" fontSize="8" fontWeight="600" fill="white">↑ AI Revelation C1</text>
                </svg>
                <p className="text-xs text-gray-400 mt-1 italic text-center">Cohort 1's 70% retention — driven by the AI module breakthrough</p>
              </div>

              {/* Strand table */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="grid grid-cols-3 bg-jorc-green text-white text-xs font-semibold uppercase tracking-wider px-5 py-3">
                  <span>Strand</span><span className="text-center">Reach</span><span className="text-right">Key Outcome</span>
                </div>
                <div className="divide-y divide-gray-50 text-sm">
                  {strandData.map((row, i) => (
                    <div key={i} className="grid grid-cols-3 px-5 py-3 hover:bg-gray-50">
                      <span className="font-semibold text-jorc-green">{row.strand}</span>
                      <span className="text-center text-gray-500">{row.reach}</span>
                      <span className="text-right text-gray-500 text-xs">{row.outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5 reveal-right stagger-2">
              {/* CBT bars */}
              <div className="bg-jorc-green rounded-2xl p-6 text-white">
                <div className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-5">CBT Preparedness — Post-Interview Results</div>
                <div className="space-y-4 text-sm">
                  {cbtBars.map((bar, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-white/80">{bar.label}</span><strong>{bar.pct}%</strong>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div ref={(el) => { barRefs.current[reachBars.length + i] = el; }} data-idx={reachBars.length + i}
                          className={`h-full ${bar.color} bar-fill rounded-full`}
                          style={{ width: barWidths[reachBars.length + i] ? `${bar.pct}%` : "0%" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-xs mt-4 italic">Several participants later reported JAMB scores of 200–212.</p>
              </div>

              <div className="space-y-2">
                <img src="https://lh3.googleusercontent.com/d/18t1ECxI63NBoJmGm_L5rTQPkfF4Oa7eu" alt="CBT simulation" className="rounded-2xl h-52 w-full object-cover shadow-md" />
                <p className="text-xs text-gray-400 text-center italic">Students during CBT simulation — the first time many held a mouse</p>
              </div>

              {/* Top schools */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">Top Schools — CBT Participation</div>
                <div className="space-y-2 text-sm">
                  {schoolsData.map((s, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-700">{s.name}</span>
                      <span className="font-bold text-jorc-green bg-green-50 px-2.5 py-0.5 rounded-full text-xs">{s.count}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 italic">10+ other secondary schools</span>
                    <span className="font-bold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full text-xs">45+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teachers Training */}
          <div className="grid md:grid-cols-2 gap-6 reveal">
            <div className="space-y-2">
              <img src="https://lh3.googleusercontent.com/d/1LU-xDgC3Pb1dcDjqYSy6oYwSd8hhSfQ8" alt="Teachers ICT Training" className="rounded-2xl h-56 w-full object-cover shadow-md" />
              <p className="text-xs text-gray-400 text-center italic">5 teachers completed 3-day intensive ICT training in February 2026</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-5">Teachers' Training — Snapshot</div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {teacherSnapshots.map((t, i) => (
                  <div key={i} className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-3xl font-black text-jorc-green">{t.value}</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">{t.sub}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 italic text-center">Top skills: AI lesson planning (Gemini/NotebookLM) · Result automation (Google Sheets) · Animated slides (PowerPoint)</div>
            </div>
          </div>
        </div>

        {/* PROGRAMME 2 */}
        <div>
          <div className="flex items-center gap-3 mb-8 reveal">
            <div className="h-px flex-1 bg-jorc-green/20" />
            <span className="inline-flex items-center gap-2 bg-jorc-green text-white px-5 py-2 rounded-full text-sm font-bold">#InclusiveLibraryAccess</span>
            <div className="h-px flex-1 bg-jorc-green/20" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="reveal-left">
              <h3 className="text-2xl md:text-3xl text-jorc-green font-bold mb-4">From Borrowing Books to Building Futures</h3>
              <p className="text-gray-600 leading-relaxed mb-5">JORC Library grew into a platform for knowledge equity and human capital development. With 3,200+ visits, 400+ regular users, and a structured Reading Club — it became the community's primary knowledge hub.</p>
              {/* Library chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-5" ref={libChartRef}>
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">Library Visits by User Type (Illustrative)</div>
                <svg viewBox="0 0 320 160" className="w-full">
                  <line x1="40" y1="20" x2="40" y2="130" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="40" y1="130" x2="300" y2="130" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="40" y1="20" x2="300" y2="20" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
                  <line x1="40" y1="75" x2="300" y2="75" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
                  <text x="34" y="24" textAnchor="end" fontSize="7" fill="#bbb">1,600</text>
                  <text x="34" y="79" textAnchor="end" fontSize="7" fill="#bbb">800</text>
                  <text x="34" y="134" textAnchor="end" fontSize="7" fill="#bbb">0</text>
                  {libBarsData.map((b, i) => (
                    <g key={b.id}>
                      <rect x={65 + i * 65} y={libChartVisible ? 130 - b.h : 130} width="38" height={libChartVisible ? b.h : 0} rx="4" fill={b.color}
                        style={{ transition: "height 1.2s ease,y 1.2s ease", transitionDelay: `${i * 0.2}s", transformOrigin: "${65 + i * 65}px 130px`, transformOrigin: `65px 130px` }} />
                      <text x={84 + i * 65} y="148" textAnchor="middle" fontSize="7" fill="#888">{b.label}</text>
                    </g>
                  ))}
                </svg>
                <p className="text-xs text-gray-400 mt-1 italic text-center">Illustrative breakdown — data from JORC Library Daily Register</p>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "School excursions — Easy to Understand NPS & Ansar-Ud-Deen NPS hosted",
                  "Movie Day — Queen of Katwe, 36 participants (72% of target audience)",
                  "Oke-Ogun Tech Conference — JORC student won full ICT scholarship",
                  "One-on-one mentorship on reading psychology & career readiness",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-jorc-green/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5 reveal-right stagger-2">
              {/* Reading Club SVG */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">Reading Club — 3-Tier Phonics Model</div>
                <svg viewBox="0 0 380 200" className="w-full">
                  <rect x="20" y="115" width="100" height="65" rx="10" fill="#1B4332" />
                  <rect x="140" y="75" width="100" height="105" rx="10" fill="#2d6a4f" />
                  <rect x="260" y="35" width="100" height="145" rx="10" fill="#2d6a4f" />
                  <text x="70" y="138" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="8" fontWeight="700" fill="white">TIER 1</text>
                  <text x="70" y="152" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.85)">Listening &</text>
                  <text x="70" y="164" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.85)">Picture ID</text>
                  <text x="190" y="98" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="8" fontWeight="700" fill="white">TIER 2</text>
                  <text x="190" y="112" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.85)">Reading &</text>
                  <text x="190" y="124" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.85)">Word Spelling</text>
                  <text x="310" y="58" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="8" fontWeight="700" fill="white">TIER 3</text>
                  <text x="310" y="72" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.85)">Independent</text>
                  <text x="310" y="84" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.85)">Reading</text>
                  <path d="M200 20 L210 5 L220 20" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                  <line x1="210" y1="5" x2="210" y2="35" stroke="#FFD700" strokeWidth="2" />
                  <text x="240" y="20" fontFamily="Montserrat,sans-serif" fontSize="7" fill="#FFD700" fontWeight="700">PROGRESS</text>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <img src="https://lh3.googleusercontent.com/d/1dPXiJLBIA_GVfTSuBeJ8mtL_V98xGTSK" alt="Reading Club" className="rounded-2xl h-36 w-full object-cover shadow-md" />
                  <p className="text-xs text-gray-400 text-center italic">Reading Club session</p>
                </div>
                <div className="space-y-1">
                  <img src="https://lh3.googleusercontent.com/d/1a2VOmNevFfwIr8wD6hrPcO6g6VIpvc7p" alt="School excursion" className="rounded-2xl h-36 w-full object-cover shadow-md" />
                  <p className="text-xs text-gray-400 text-center italic">Pupils on school excursion</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-jorc-green rounded-xl p-4 text-white"><div className="text-2xl font-black">3,200+</div><div className="text-xs text-white/60 mt-1">Library Visits</div></div>
                <div className="bg-jorc-green/10 rounded-xl p-4"><div className="text-2xl font-black text-jorc-green">400+</div><div className="text-xs text-gray-500 mt-1">Regular Users</div></div>
                <div className="bg-gold rounded-xl p-4"><div className="text-2xl font-black text-white">1,400+</div><div className="text-xs text-white/80 mt-1">Books</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl" />

      {/* ═══ OUTREACH MAP ═══ */}
      <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="pill mb-4 inline-block">Community Reach</span>
            <h2 className="text-3xl md:text-4xl text-jorc-green font-bold mb-3">Reaching Across ATISBO</h2>
            <p className="text-gray-500 max-w-xl mx-auto">JORC's impact radiates from Irawo-Owode across the Oke-Ogun region — from school visits to the Oke-Ogun Tech Conference in Saki.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="reveal-left flex justify-center">
              <svg viewBox="0 0 360 320" className="w-full max-w-sm">
                <ellipse cx="180" cy="160" rx="155" ry="130" fill="#e8f5ee" stroke="#c3ddd0" strokeWidth="1.5" />
                <ellipse cx="175" cy="155" rx="100" ry="80" fill="#d0ecdb" stroke="#a8cebd" strokeWidth="1" />
                <path d="M80 200 Q140 170 175 155 Q210 140 270 120" stroke="#c3ddd0" strokeWidth="2.5" fill="none" strokeDasharray="6 3" />
                <path d="M175 155 Q175 200 175 240" stroke="#c3ddd0" strokeWidth="2" fill="none" strokeDasharray="5 3" />
                <circle cx="175" cy="155" r="18" fill="rgba(27,67,50,0.12)" style={{ animation: "mapPulse 2s ease-in-out infinite" }} />
                <circle cx="175" cy="155" r="10" fill="#1B4332" />
                <circle cx="175" cy="155" r="4" fill="white" />
                <circle cx="240" cy="130" r="7" fill="#2d6a4f" />
                <circle cx="240" cy="130" r="3" fill="white" />
                <circle cx="210" cy="200" r="6" fill="#2d6a4f" />
                <circle cx="210" cy="200" r="2.5" fill="white" />
                <circle cx="130" cy="140" r="6" fill="#2d6a4f" />
                <circle cx="130" cy="140" r="2.5" fill="white" />
                <circle cx="285" cy="100" r="7" fill="#FFD700" />
                <circle cx="285" cy="100" r="3" fill="white" />
                <circle cx="155" cy="215" r="5" fill="#b7d4c1" />
                <line x1="175" y1="155" x2="240" y2="130" stroke="#1B4332" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
                <line x1="175" y1="155" x2="210" y2="200" stroke="#1B4332" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
                <line x1="175" y1="155" x2="130" y2="140" stroke="#1B4332" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
                <line x1="175" y1="155" x2="285" y2="100" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
                <text x="175" y="142" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="8" fontWeight="700" fill="#1B4332">Irawo-Owode</text>
                <text x="175" y="132" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="6.5" fill="#1B4332" opacity="0.7">JORC HQ</text>
                <text x="255" y="127" textAnchor="start" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="#2d6a4f" fontWeight="600">Ofiki</text>
                <text x="217" y="200" textAnchor="start" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="#2d6a4f">Ago-Are</text>
                <text x="100" y="138" textAnchor="end" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="#2d6a4f">Irawo-Ile</text>
                <text x="290" y="97" textAnchor="start" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="#FFD700" fontWeight="700">Saki ✦</text>
                <rect x="20" y="270" width="320" height="38" rx="8" fill="rgba(27,67,50,0.05)" stroke="rgba(27,67,50,0.08)" strokeWidth="1" />
                <circle cx="38" cy="289" r="5" fill="#1B4332" />
                <text x="48" y="293" fontFamily="Montserrat,sans-serif" fontSize="7" fill="#555">JORC HQ</text>
                <circle cx="108" cy="289" r="4" fill="#2d6a4f" />
                <text x="118" y="293" fontFamily="Montserrat,sans-serif" fontSize="7" fill="#555">Partner community</text>
                <circle cx="218" cy="289" r="4" fill="#FFD700" />
                <text x="228" y="293" fontFamily="Montserrat,sans-serif" fontSize="7" fill="#555">Conference / outreach</text>
                <text x="180" y="18" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="12" fontWeight="700" fill="#1B4332">ATISBO LGA · Oyo State</text>
              </svg>
            </div>
            <div className="space-y-4 reveal-right">
              {outreachItems.map((item, i) => (
                <div key={i} className="bg-jorc-green/5 border border-jorc-green/15 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center shrink-0`}>
                      <SvgIcon name={item.ic} className="w-[14px] h-[14px] text-white" />
                    </div>
                    <div className="font-bold text-jorc-green text-sm">{item.title}</div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider-gold max-w-3xl" />

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="px-6 md:px-12 lg:px-20 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <span className="pill mb-4 inline-block">Voices of Impact</span>
          <h2 className="text-3xl md:text-5xl text-jorc-green font-bold mb-3">What Beneficiaries Say</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Every number in this report belongs to a real person. Here are some of their words.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stakeholders.map((s, i) => (
            <div key={i} className={`quote-card reveal stagger-${(i % 3) + 1}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="#1B4332"><circle cx="20" cy="14" r="8" /><path d="M4 40C4 26 36 26 36 40Z" /></svg>
                </div>
                <div>
                  <div className="font-bold text-jorc-green text-sm">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.cohort}</div>
                </div>
              </div>
              <div className="text-gold text-3xl leading-none mb-2">"</div>
              <p className="text-gray-700 text-sm leading-relaxed">{s.quote}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-5 reveal">
          {[
            { src: "https://lh3.googleusercontent.com/d/1mB-WkWoqDLRsKY1xbLlBqUMapgmVfklh", cap: "Movie Day sensitisation programme" },
            { src: "https://lh3.googleusercontent.com/d/1riR9W_DsDeIwfJQniThpkTvmIH9TfPR5", cap: "Oke-Ogun Tech Conference — student wins scholarship" },
            { src: "https://lh3.googleusercontent.com/d/1j8wfmDNryjunssQD_-99JoUOpK2YDQCH", cap: "Community & institutional outreach engagements" },
          ].map((img, i) => (
            <div key={i} className="space-y-2">
              <img src={img.src} alt="" className="rounded-2xl h-48 w-full object-cover shadow-md" />
              <p className="text-xs text-gray-400 text-center italic">{img.cap}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-3xl" />

      {/* ═══ PILLARS ═══ */}
      <section className="bg-white px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="pill mb-4 inline-block">Strategic Architecture</span>
            <h2 className="text-3xl md:text-4xl text-jorc-green font-bold mb-3">Five Pillars, One Mission</h2>
          </div>
          <div className="flex justify-center mb-10 reveal">
            <svg viewBox="0 0 600 200" className="w-full max-w-3xl">
              <polygon points="300,20 20,80 580,80" fill="none" stroke="#1B4332" strokeWidth="2" strokeLinejoin="round" />
              <rect x="20" y="170" width="560" height="12" rx="4" fill="#1B4332" opacity="0.9" />
              {[
                { label1: "LIBRARY", label2: "ACCESS" },
                { label1: "TECH &", label2: "INNOVATION" },
                { label1: "TRAINING &", label2: "CAPACITY" },
                { label1: "NETWORK &", label2: "MENTORSHIP" },
                { label1: "WORKSHOPS", label2: "& TALKS" },
              ].map((p, i) => (
                <g key={i}>
                  <rect x={55 + i * 109} y="80" width="72" height="90" rx="3" fill={i % 2 === 0 ? "#1B4332" : "#2d6a4f"} />
                  <text x={91 + i * 109} y="120" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="7.5" fontWeight="700" fill="white">{p.label1}</text>
                  <text x={91 + i * 109} y="131" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.7)">{p.label2}</text>
                  <text x={91 + i * 109} y="96" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="13" fill="rgba(201,168,76,0.9)">{i + 1}</text>
                </g>
              ))}
              <text x="300" y="60" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="11" fontWeight="700" fill="#1B4332">ONE MISSION · FIVE ENTRY POINTS</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ═══ YEAR TWO ═══ */}
      <section id="future" className="bg-jorc-green py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14 reveal">
            <span className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">Looking Ahead</span>
            <h2 className="text-3xl md:text-5xl text-white font-bold mb-3">Year Two: Expanding the Footprint</h2>
            <p className="text-white/60 max-w-xl mx-auto">The demand far exceeds current capacity. Here is what Year Two looks like with your partnership.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {yearTwoPlans.map((plan, i) => (
              <div key={i} className={`bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-6 text-white hover:bg-white/15 transition-all reveal stagger-${(i % 6) + 1}`}>
                <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center mb-4">
                  <SvgIcon name={plan.icon} className="w-[18px] h-[18px] text-gold" />
                </div>
                <h4 className="font-bold text-base mb-2">{plan.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{plan.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 reveal">
            <div className="bg-white rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="text-gold font-bold text-xs uppercase tracking-widest mb-3">Stakeholder Reports</div>
                <h3 className="text-2xl text-jorc-green font-bold mb-4">Year One in Review</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">Read the full stakeholder report detailing our impact across ICT training, library access, reading club, and community outreach across ATISBO LGA.</p>
                <a href="#" className="btn-jorc bg-jorc-green text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#2d5a44] shadow-lg text-sm inline-flex items-center gap-2">Download Report <span>↓</span></a>
              </div>
              <div className="mt-6 flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https://jorc.org" alt="QR Code" className="w-[70px] h-[70px] rounded-lg bg-white p-1 shadow-sm" />
                <div>
                  <p className="text-sm text-jorc-green font-bold">Scan to Access</p>
                  <p className="text-xs text-gray-400">View full report &amp; digital resources on your mobile device</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 flex flex-col justify-center">
              <div className="text-gold font-bold text-xs uppercase tracking-widest mb-3">Join Us</div>
              <h3 className="text-2xl text-jorc-green font-bold mb-4">The Opportunity to Scale is Now</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">If your mission intersects with education, technology, youth empowerment, or rural development — we invite you to walk with us.</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://forms.gle/r1DxaTNkvMaAS2g59" className="btn-jorc bg-jorc-green text-white font-bold px-6 py-3 rounded-full hover:bg-[#2d5a44] shadow-lg text-sm inline-flex items-center gap-2">Partner With JORC <span>→</span></a>
                <a href="mailto:jorctraining@gmail.com" className="btn-outline border-2 border-jorc-green text-jorc-green font-bold px-6 py-3 rounded-full hover:bg-green-50 text-sm">Email Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StakeholderReport;
