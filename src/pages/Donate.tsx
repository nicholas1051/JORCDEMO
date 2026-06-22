import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Heart } from "lucide-react";

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
      <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden">
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
          <div className="floating-circle w-32 h-32 -top-6 -left-6 bg-jorc-green-light" style={{ animation: "float-circle 6s ease-in-out infinite" }} />
          <div className="floating-circle w-24 h-24 top-1/3 -right-4 bg-jorc-green-light" style={{ animation: "float-circle-delayed 8s ease-in-out infinite" }} />
          <div className="floating-circle w-40 h-40 bottom-0 left-1/4 bg-jorc-green" style={{ animation: "float-circle 7s ease-in-out infinite 1s" }} />
          <div className="floating-circle w-20 h-20 top-1/4 left-1/2 bg-[#FFCE1B]" style={{ animation: "float-circle-delayed 9s ease-in-out infinite 2s" }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-5">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase reveal" style={{ background: "rgba(255,206,27,0.15)", color: "#FFCE1B", border: "1px solid rgba(255,206,27,0.3)", transitionDelay: "0.05s", animation: "gold-pulse 3s ease-in-out infinite" }}>
            #SupportJORC
          </span>
          <h1
            className="font-black mb-6 leading-tight"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.75rem, 5vw, 3.25rem)",
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
              onClick={() =>
                toast({
                  title: "Thank you for your generosity!",
                  description: "Donation feature coming soon. We'll notify you when it's live.",
                })
              }
            >
              <Heart className="h-5 w-5 mr-2 transition-all duration-300 group-hover:translate-x-1" />
              <span className="transition-all duration-300 group-hover:translate-x-0.5">Give Today — Support #SupportJORC</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════ WHERE YOUR MONEY GOES ═══════ */}
      <section id="donut-section" className="py-16 md:py-20 bg-background reveal">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-4 reveal" style={{ transitionDelay: "0.1s" }}>
              Where Your Money Goes
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto reveal" style={{ transitionDelay: "0.2s" }}>
              Every donation is reinvested directly into our community hub. Here's how we allocate
              funds to keep JORC running at full capacity.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            {/* Donut chart */}
            <div className="relative w-56 h-56 md:w-64 md:h-64 flex-shrink-0 reveal" style={{ transitionDelay: "0.3s" }}>
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
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke={cat.color}
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
                {/* White centre hole */}
                <circle cx="50" cy="50" r="28" fill="var(--background)" stroke="none" />
              </svg>
              {/* Centre label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-2xl md:text-3xl font-bold text-jorc-green transition-all duration-500">{countUp}%</span>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">of donations</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 w-full max-w-sm reveal" style={{ transitionDelay: "0.4s" }}>
              {categories.map((cat, i) => (
                <div
                  key={cat.label}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-default ${
                    hoveredIdx === i
                      ? "bg-jorc-green-lighter shadow-sm translate-x-1"
                      : "hover:bg-jorc-green-lighter/50"
                  }`}
                  style={{ borderLeft: hoveredIdx === i ? `3px solid ${cat.color}` : "3px solid transparent" }}
                >
                  <span className="w-4 h-4 rounded-full flex-shrink-0 transition-transform duration-300" style={{ background: cat.color, transform: hoveredIdx === i ? "scale(1.3)" : "scale(1)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold transition-colors duration-300 ${hoveredIdx === i ? "text-jorc-green" : "text-jorc-green"}`}>{cat.label}</span>
                      <span className="text-sm font-bold transition-all duration-300" style={{ color: cat.color, transform: hoveredIdx === i ? "scale(1.15)" : "scale(1)" }}>{cat.pct}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WHY SUPPORT ═══════ */}
      <section className="py-16 md:py-20 bg-jorc-green-lighter reveal">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-6 reveal" style={{ transitionDelay: "0.1s" }}>
            Why Support JORC?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto reveal" style={{ transitionDelay: "0.2s" }}>
            Unlike traditional programs that charge heavy tuition fees, every class, book borrow, and
            computer hour at <strong className="text-jorc-green">JORC is entirely free of charge</strong> for our local learners.
          </p>
          <div className="bg-white rounded-xl p-8 shadow-soft text-left max-w-3xl mx-auto reveal reveal-scale group transition-all duration-500 hover:shadow-[0_0_30px_rgba(40,80,46,0.2)] hover:-translate-y-1" style={{ transitionDelay: "0.35s" }}>
            <p className="text-muted-foreground leading-relaxed mb-6">
              To maintain this high-standard, high-availability space, we rely on the generosity of
              supporters like you. By donating to JORC, you are directly investing in the digital
              inclusion of Nigeria.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-lg transition-all duration-300 hover:bg-[rgba(40,80,46,0.1)]" style={{ background: "rgba(40,80,46,0.06)" }}>
              <Heart className="h-6 w-6 text-jorc-green flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ animation: "icon-pulse 2s ease-in-out infinite" }} />
              <p className="text-sm font-semibold text-jorc-green">
                100% of your donation is channeled directly into operations, hardware maintenance,
                and trainee support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST & TRANSPARENCY ═══════ */}
      <section className="py-16 md:py-20 bg-background reveal">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-jorc-green mb-4 reveal" style={{ transitionDelay: "0.1s" }}>
              Trust & Transparency
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
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
            onClick={() =>
              toast({
                title: "Thank you!",
                description: "Donation feature coming soon. We'll notify you when it's live.",
              })
            }
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
