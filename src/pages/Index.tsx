import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users, Globe, Monitor, Award, MessageCircle, DollarSign, Quote,
} from "lucide-react";

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */

const STATS = [
  { n: "500+", l: "Learners Trained" },
  { n: "15+", l: "Communities Served" },
  { n: "50+", l: "Workshops Conducted" },
  { n: "95%", l: "Success Rate" },
  { n: "20+", l: "Partner Schools" },
  { n: "1k+", l: "Lab Sessions" },
];

const WHY: { icon: React.ElementType; text: string }[] = [
  { icon: Users, text: "Community-focused training programs" },
  { icon: DollarSign, text: "Affordable and accessible education" },
  { icon: Monitor, text: "Modern ICT laboratory facility" },
  { icon: Award, text: "Experienced instructors" },
  { icon: Globe, text: "Global industry relevance" },
  { icon: MessageCircle, text: "Continuous support and mentorship" },
];

const HOME_PROGRAMS = [
  {
    icon: "🌐",
    title: "Digital Access for ALL",
    desc: "Bridging the digital divide by providing access to technology, internet, and digital resources for underserved communities.",
    img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=400&fit=crop",
  },
  {
    icon: "⚡",
    title: "C.B.T Training",
    desc: "Specialized computer-based test training to prepare candidates for WAEC, JAMB, and other CBT examinations.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
  },
  {
    icon: "📚",
    title: "Multipurpose Online & Physical Library",
    desc: "A hybrid library combining traditional books with digital resources for research, learning, and personal development.",
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
  },
  {
    icon: "🚀",
    title: "Amplify Your Skill with Technology",
    desc: "Advanced training programs that leverage technology to enhance professional skills and career opportunities.",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
  },
];

const GALLERY_IMAGES = [
  { title: "WAEC CBT Prep Workshop", loc: "Oyo State, Nigeria", desc: "Intensive computer-based test preparation for WAEC candidates at our ICT lab.", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop" },
  { title: "Community Tech Outreach", loc: "Rural Communities, Nigeria", desc: "Bringing digital literacy and technology access to underserved rural communities.", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop" },
  { title: "Youth Leadership Summit", loc: "West Africa Region", desc: "Empowering young leaders with digital skills and leadership training for the future.", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop" },
  { title: "Typing Skills Workshop", loc: "Irawo-Owode, Nigeria", desc: "Students building essential typing speed and accuracy for academic and professional success.", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop" },
  { title: "Microsoft Office Training", loc: "Ibadan, Nigeria", desc: "Practical training on Word, Excel, and PowerPoint for workplace readiness.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop" },
  { title: "Internet Safety Seminar", loc: "Oyo State, Nigeria", desc: "Educating the community on online safety, privacy, and responsible internet use.", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" },
  { title: "Digital Marketing Workshop", loc: "West Africa, Nigeria", desc: "Social media strategy and online business skills for entrepreneurs and professionals.", img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop" },
  { title: "Group Project Session", loc: "Irawo-Owode, Nigeria", desc: "Learners collaborating on group assignments using digital tools and shared workspaces.", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop" },
  { title: "One-on-One Mentorship", loc: "Atisbo LGA, Nigeria", desc: "Personalized guidance and mentorship sessions to support individual learning goals.", img: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&h=400&fit=crop" },
  { title: "Certificate Presentation", loc: "Ibadan, Nigeria", desc: "Recognizing achievement as learners receive certificates for completed programs.", img: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop" },
  { title: "Digital Classroom in Action", loc: "Rural Communities, Nigeria", desc: "Students engaging with digital learning materials in a modern classroom setup.", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop" },
  { title: "End of Year Celebration", loc: "Irawo-Owode, Nigeria", desc: "Celebrating a year of impact, learning milestones, and community transformation.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" },
];

const GALLERY_VIDEOS = [
  { title: "Digital Literacy Graduation", loc: "Ibadan, Nigeria", desc: "Celebrating our latest cohort of graduates from the 6-week digital literacy program.", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop" },
  { title: "Intro to Coding Bootcamp", loc: "Atisbo LGA, Nigeria", desc: "Beginners learning programming fundamentals in a hands-on coding environment.", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop" },
  { title: "Full-Day ICT Workshop", loc: "Oyo State, Nigeria", desc: "Immersive full-day training sessions covering multiple digital skills and applications.", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop" },
  { title: "Virtual Lab Orientation", loc: "Online, Nigeria", desc: "Guided virtual tour of our digital lab facilities and available resources for remote learners.", img: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop" },
  { title: "Tech Career Fair", loc: "Ibadan, Nigeria", desc: "Connecting learners with tech employers and career opportunities in the digital economy.", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop" },
  { title: "Digital Skills for Women", loc: "Atisbo LGA, Nigeria", desc: "Empowering women with essential digital skills for entrepreneurship and personal development.", img: "https://images.unsplash.com/photo-1573164574572-cb89e39749e0?w=600&h=400&fit=crop" },
  { title: "Robotics Workshop", loc: "Oyo State, Nigeria", desc: "Hands-on introduction to robotics and automation for students passionate about technology.", img: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=600&h=400&fit=crop" },
  { title: "Data Literacy Bootcamp", loc: "West Africa, Nigeria", desc: "Building foundational skills in data analysis, visualization, and data-driven decision making.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" },
  { title: "AI & Machine Learning Intro", loc: "Ibadan, Nigeria", desc: "An introductory workshop on artificial intelligence and machine learning concepts and tools.", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop" },
  { title: "Cybersecurity Awareness", loc: "Atisbo LGA, Nigeria", desc: "Essential cybersecurity practices for individuals and organizations in the digital age.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop" },
  { title: "Cloud Computing Basics", loc: "Oyo State, Nigeria", desc: "Introduction to cloud platforms, storage, and collaborative tools for modern workplaces.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop" },
  { title: "Mobile App Dev Workshop", loc: "Irawo-Owode, Nigeria", desc: "Building simple mobile applications using no-code and low-code development platforms.", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop" },
];

/* ═══════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════ */

function TypewriterHeading() {
  const fullText = "LEGACY IN MOTION, IMPACTING THE FUTURE.";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    let dir = 1;
    const interval = setInterval(() => {
      i += dir;
      if (i > fullText.length) {
        dir = -1;
        i = fullText.length - 1;
      } else if (i < 0) {
        dir = 1;
        i = 0;
      }
      setDisplayText(fullText.slice(0, i));
    }, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1
      className="font-bold leading-tight mb-6"
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
      }}
    >
      <span
        style={{
          background: "linear-gradient(135deg, #FFCE1B, #FFCE1B)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {displayText}
      </span>
      <span className="inline-block" style={{ color: "#FFCE1B", animation: "blink 1s step-end infinite", fontWeight: 100 }}>|</span>
    </h1>
  );
}

function StatsMarquee() {
  return (
    <div className="relative z-20 px-5 pt-6 reveal">
      <div
        className="rounded-xl p-6 overflow-hidden border-2 transition-all duration-500 hover:shadow-[0_0_25px_rgba(40,80,46,0.12)]"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderColor: "rgba(40,80,46,0.3)",
        }}
      >
        <div className="animate-marquee flex w-max">
          {[...STATS, ...STATS].map((s, i) => (
            <div key={i} className="flex items-center gap-4 whitespace-nowrap group/stat transition-all duration-300 hover:scale-110 mx-[26px]">
              <span
                className="font-black transition-all duration-300"
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  background: "linear-gradient(135deg, #FFCE1B, #FFCE1B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.n}
              </span>
              <span className="text-sm md:text-base font-semibold text-jorc-green transition-all duration-300 group-hover/stat:text-[#FFCE1B]">
                {s.l}
              </span>
              <span
                className="w-px h-8 flex-shrink-0"
                style={{ background: "rgba(40,80,46,0.2)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryRow({ items, isVideo }: { items: typeof GALLERY_IMAGES; isVideo?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!ref.current) return;
    const card = ref.current.querySelector<HTMLDivElement>("[data-gallery-card]");
    const w = card ? card.offsetWidth + 24 : 364;
    ref.current.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <div className="gallery-wrap relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white border flex items-center justify-center shadow-md hover:bg-jorc-green hover:text-white hover:scale-110 transition-all text-jorc-green text-2xl leading-none select-none"
        style={{ borderColor: "#e5e7eb" }}
        aria-label="Previous"
      >
        ‹
      </button>
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto py-2 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            data-gallery-card
            className="flex-shrink-0 w-[300px] md:w-[340px] min-h-[300px] rounded-xl overflow-hidden relative cursor-pointer transition-all duration-500 hover:scale-[1.03] brightness-[0.85] hover:brightness-100"
            style={{
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "2px solid transparent",
              borderColor: "#FFCE1B00",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FFCE1B";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#FFCE1B00";
            }}
          >
            <div className="absolute inset-0 z-[1] transition-all duration-500" style={{ background: "rgba(40,80,46,0.3)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(40,80,46,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(40,80,46,0.3)"; }}
            />
            {isVideo && (
              <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-1.5 opacity-0 hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" className="transition-all duration-300 hover:scale-110" style={{ animation: "icon-bounce 3s ease-in-out infinite" }}>
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10,8 16,12 10,16" fill="rgba(255,255,255,0.9)" stroke="none" />
                </svg>
                <span className="text-xs font-semibold text-white uppercase tracking-wider" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
                  Event Highlight
                </span>
              </div>
            )}
            <div className="relative z-[2] p-6 text-white w-full h-full flex flex-col justify-end">
              <span
                className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2 w-fit"
                style={{ background: "rgba(255,206,27,0.85)", color: "#1a1a2e" }}
              >
                {item.loc}
              </span>
              <h3 className="text-lg font-bold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white border flex items-center justify-center shadow-md hover:bg-jorc-green hover:text-white hover:scale-110 transition-all text-jorc-green text-2xl leading-none select-none"
        style={{ borderColor: "#e5e7eb" }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}

function ProgramCard({ p }: { p: typeof HOME_PROGRAMS[0] }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden min-h-[360px] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-strong group/card"
      style={{
        backgroundImage: `url(${p.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 z-[1] transition-all duration-500" style={{ background: "rgba(40,80,46,0.7)" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(40,80,46,0.82)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(40,80,46,0.7)"; }}
      />
      <div className="relative z-[2] p-6 pt-9 text-white flex flex-col h-full">
        <div className="text-5xl mb-3.5 transition-all duration-500 group-hover/card:scale-110 group-hover/card:animate-[icon-bounce_0.6s_ease-in-out]">{p.icon}</div>
        <h3 className="text-xl md:text-2xl font-bold mb-2">{p.title}</h3>
        <p className="text-sm md:text-base leading-relaxed opacity-90 mb-5">{p.desc}</p>
        <div className="mt-auto">
          <Button
            asChild
            size="sm"
            className="rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,206,27,0.4)] group/btn"
            style={{
              background: "linear-gradient(135deg, #FFCE1B, #FFCE1B)",
              color: "#1a1a2e",
              border: "none",
            }}
          >
            <Link to="/programs">
              Learn More <span className="ml-1 inline-block transition-all duration-300 group-hover/btn:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */

const Index = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLDivElement>(null);

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
    const grids = [imgRef.current, vidRef.current];
    const rafIds: number[] = [];

    grids.forEach((grid) => {
      if (!grid) return;
      let paused = false;

      const step = () => {
        if (paused) return;
        grid!.scrollLeft += 0.5;
        const half = grid!.scrollWidth / 2;
        if (grid!.scrollLeft >= half) grid!.scrollLeft = 0;
        else if (grid!.scrollLeft <= 0) grid!.scrollLeft = half;
        rafIds.push(requestAnimationFrame(step));
      };
      rafIds.push(requestAnimationFrame(step));

      const onEnter = () => { paused = true; };
      const onLeave = () => { paused = false; step(); };
      grid.addEventListener("mouseenter", onEnter);
      grid.addEventListener("mouseleave", onLeave);
    });

    return () => {
      rafIds.forEach((id) => cancelAnimationFrame(id));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal-scale.is-visible { opacity: 1; transform: scale(1); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float-circle { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(255,206,27,0.3)} 50%{box-shadow:0 0 20px 6px rgba(255,206,27,0.15)} }
        @keyframes icon-bounce { 0%,100%{transform:scale(1)} 40%{transform:scale(1.2)} 60%{transform:scale(0.95)} }
        .floating-circle { position:absolute; border-radius:50%; opacity:0.12; pointer-events:none; }
      `}</style>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: "#1A472A" }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=600&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center 35%",
              opacity: 0.35,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, rgba(255,206,27,0.12), transparent 60%)",
            }}
          />
          {/* Floating circles */}
          <div className="floating-circle w-36 h-36 -top-8 -left-8 bg-jorc-green-light" style={{ animation: "float-circle 6s ease-in-out infinite" }} />
          <div className="floating-circle w-28 h-28 top-1/3 -right-4 bg-jorc-green-light" style={{ animation: "float-circle 8s ease-in-out infinite 1s" }} />
          <div className="floating-circle w-44 h-44 bottom-0 left-1/4 bg-jorc-green" style={{ animation: "float-circle 7s ease-in-out infinite 0.5s" }} />
          <div className="floating-circle w-20 h-20 top-1/4 right-1/3 bg-[#FFCE1B]" style={{ animation: "float-circle 9s ease-in-out infinite 2s" }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-5">
          <TypewriterHeading />
          <p className="text-white/85 text-lg md:text-xl mb-10 max-w-3xl mx-auto reveal" style={{ transitionDelay: "0.2s" }}>
            A hub for digital literacy, leadership, and innovation across Africa — empowering
            individuals with access to high-quality learning resources and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap reveal" style={{ transitionDelay: "0.35s" }}>
            <Button
              asChild
              size="lg"
              className="font-bold shadow-lg border-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,206,27,0.4)] group"
              style={{
                background: "linear-gradient(135deg, #FFCE1B, #FFCE1B)",
                color: "#1a1a2e",
              }}
            >
              <Link to="/programs">
                Register <span className="ml-1 inline-block transition-all duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/60 text-white bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white hover:text-jorc-green"
            >
              <Link to="/facility">Book the Lab</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════ STATS MARQUEE ═══════ */}
      <StatsMarquee />

      {/* ═══════ ABOUT INTRO ═══════ */}
      <section className="py-16 bg-background reveal">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-6 reveal" style={{ transitionDelay: "0.1s" }}>
            About JORC
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed reveal" style={{ transitionDelay: "0.2s" }}>
            The Jonah Otunla Resource Center is an initiative of the Francisca and Jonah Otunla
            Foundation, dedicated to transforming communities through digital literacy, innovation,
            and leadership development.
          </p>
          <div className="reveal" style={{ transitionDelay: "0.3s" }}>
          <Button asChild variant="outline" className="group transition-all duration-300 hover:border-jorc-green">
            <Link to="/about">
              Learn More <span className="ml-1 inline-block transition-all duration-300 group-hover:translate-x-1.5" aria-hidden="true">→</span>
            </Link>
          </Button>
          </div>
        </div>
      </section>

      {/* ═══════ EVENT GALLERY ═══════ */}
      <section className="py-16 bg-jorc-green-lighter reveal">
        <div className="container mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-4 reveal" style={{ transitionDelay: "0.1s" }}>
              Moment at JORC
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto reveal" style={{ transitionDelay: "0.2s" }}>
              Capturing the spirit of transformation, learning, and community across our programs
              and events.
            </p>
          </div>
        </div>
        <div className="px-5 space-y-6">
          <GalleryRow items={GALLERY_IMAGES} />
          <GalleryRow items={GALLERY_VIDEOS} isVideo />
        </div>
      </section>

      {/* ═══════ PROGRAMS HIGHLIGHT ═══════ */}
      <section className="py-16 bg-jorc-green-lighter reveal">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-4 reveal" style={{ transitionDelay: "0.1s" }}>Our Programs</h2>
          <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto text-muted-foreground reveal" style={{ transitionDelay: "0.2s" }}>
            Comprehensive training programs designed to empower individuals with digital skills
            and prepare them for the modern workforce.
          </p>
          <div
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            style={{ textAlign: "left" }}
          >
            {HOME_PROGRAMS.map((p, i) => (
              <ProgramCard key={i} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY JORC ═══════ */}
      <section className="py-16 bg-background reveal">
        <div className="container mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-6 reveal" style={{ transitionDelay: "0.1s" }}>
                Why Choose JORC?
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8 reveal" style={{ transitionDelay: "0.2s" }}>
                We are committed to delivering quality education that creates lasting impact in our
                communities and prepares learners for global opportunities.
              </p>
              <ul className="space-y-4">
                {WHY.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground group/bullet transition-all duration-300 hover:translate-x-1.5">
                    <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-jorc-green-lighter flex items-center justify-center text-jorc-green transition-all duration-400 group-hover/bullet:bg-jorc-green group-hover/bullet:scale-110">
                      <item.icon className="h-4 w-4 transition-all duration-400 group-hover/bullet:text-white" />
                    </span>
                    <span className="pt-1.5 border-l-2 border-transparent pl-3 transition-all duration-300 group-hover/bullet:border-jorc-green">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.3s" }}>
              <div
                className="min-h-[320px] rounded-xl shadow-strong transition-all duration-700 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-16 bg-jorc-green-lighter reveal">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-4 reveal" style={{ transitionDelay: "0.1s" }}>
            What Our Community Says
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 reveal" style={{ transitionDelay: "0.2s" }}>
            Hear from learners who have transformed their lives through our programs.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: "The digital literacy program opened my eyes to what's possible. I went from knowing nothing about computers to confidently using MS Office every day.",
                name: "Adeola M.",
                role: "Digital Literacy Graduate",
              },
              {
                quote: "JORC isn't just a training center — it's a community. The support from instructors and fellow learners made all the difference in my journey.",
                name: "Chidi O.",
                role: "CBT Prep Graduate",
              },
              {
                quote: "I booked the ICT lab for my organization's training and the experience was seamless. Modern equipment, reliable power, and professional support.",
                name: "Funmi A.",
                role: "Corporate Client",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 text-left shadow-soft transition-all duration-400 hover:-translate-y-1.5 hover:shadow-strong group/testimonial"
                style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
              >
                <Quote className="h-6 w-6 text-jorc-green/30 mb-3 transition-all duration-400 group-hover/testimonial:scale-110 group-hover/testimonial:text-jorc-green/60" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t">
                  <div className="w-9 h-9 rounded-full bg-jorc-green text-white flex items-center justify-center text-xs font-bold transition-all duration-400 group-hover/testimonial:bg-[#FFCE1B] group-hover/testimonial:scale-110">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="py-12 text-white relative overflow-hidden reveal" style={{ background: "#1A472A" }}>
        {/* Animated dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        {/* Floating shapes */}
        <div className="floating-circle w-24 h-24 -top-4 -right-4 bg-jorc-green-light" style={{ animation: "float-circle 7s ease-in-out infinite" }} />
        <div className="floating-circle w-16 h-16 bottom-0 left-1/4 bg-[#FFCE1B]" style={{ animation: "float-circle 9s ease-in-out infinite 1.5s" }} />
        <div className="container mx-auto px-5 text-center relative z-10">
          <h3 className="text-xl md:text-2xl font-bold mb-4 reveal" style={{ transitionDelay: "0.1s" }}>Stay Updated</h3>
          <p className="text-base md:text-lg opacity-90 mb-6 reveal" style={{ transitionDelay: "0.2s" }}>
            Transform your future with our digital literacy programs. Enroll today and take the first step!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal" style={{ transitionDelay: "0.3s" }}>
            <Button asChild variant="secondary" size="lg" className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Link to="/programs">View Programs</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white hover:text-jorc-green"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
