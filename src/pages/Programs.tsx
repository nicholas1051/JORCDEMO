import { useEffect, useState } from "react";
import { CheckCircle, Clock, Users, Plus, ArrowRight, User, Mail, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Programs = () => {
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

  const programImages = ["https://i.postimg.cc/Vv3bS5Sj/IMG-20251006-160958.jpg", "https://i.postimg.cc/JnQfmK2g/20260423-083708.jpg", "https://i.postimg.cc/RhhVcgvj/20260310-041618.jpg", "https://i.postimg.cc/c4Dk9X0c/20260223-041630.jpg"];
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [regOpen, setRegOpen] = useState(false);
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");

  const mainPrograms = [
    {
      title: "Digital Literacy Program",
      duration: "6 Weeks",
      audience: "Youth, Professionals, Beginners",
      description: "Comprehensive foundation in digital skills for the modern world",
      content: [
        "Computer basics and navigation",
        "Microsoft Office Suite (Word, Excel, PowerPoint)",
        "Internet usage and online safety",
        "Email communication and etiquette",
        "Digital file management",
        "Practical hands-on projects",
        "Skills assessment and certification"
      ]
    },
   
    {
      title: "Inclusive Library Access",
      duration: "Ongoing",
      audience: "Community members, Students, Researchers",
      description: "Free access to a well-stocked digital and physical library for learning and research",
      content: [
        "Digital and physical book lending",
        "Quiet reading and study spaces",
        "Research assistance and guidance",
        "Internet-enabled research terminals",
        "Educational video resources",
        "Weekly reading programs",
        "Membership is free for all"
      ]
    },
    {
      title: "CBT Preparation",
      duration: "6 Weeks",
      audience: "Candidates with limited ICT experience",
      description: "Computer-based test readiness program for exam success",
      content: [
        "Typing skills and speed building",
        "Computer navigation for exams",
        "CBT exam simulations",
        "Time management strategies",
        "Online test-taking techniques",
        "Practice with past questions",
        "Mock exam sessions"
      ]
    },
    {
      title: "Teachers Training Program",
      duration: "2 Weeks",
      audience: "Educators, Teachers, School Administrators",
      description: "Equipping educators with digital tools and modern teaching methodologies for the classroom",
      content: [
        "Integrating ICT in lesson delivery",
        "Digital classroom management tools",
        "Creating interactive learning materials",
        "Online assessment and grading platforms",
        "Google Workspace for Education",
        "Blended learning strategies",
        "Certificate of completion"
      ]
    }
  ];

  const workshops = [
    {
      title: "Coding Bootcamps",
      description: "Introduction to programming languages and web development",
      duration: "2-4 weeks",
      level: "Beginner to Intermediate"
    },
    {
      title: "Professional ICT Certifications",
      description: "Preparation for industry-standard certifications",
      duration: "Varies",
      level: "Intermediate to Advanced"
    },
    {
      title: "Tech Career Talks",
      description: "Industry insights and career guidance sessions",
      duration: "1-2 days",
      level: "All levels"
    },
    {
      title: "Digital Marketing Workshop",
      description: "Social media marketing and online business skills",
      duration: "1 week",
      level: "Beginner to Intermediate"
    }
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
        .icon-rotate { transition: transform 0.4s ease; }
        .icon-rotate.open { transform: rotate(45deg); }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .float-anim-delayed { animation: float 5s ease-in-out 1s infinite; }
        .shimmer-bg { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); background-size: 200% 100%; animation: shimmer 3s infinite; }
        .card-glow:hover { box-shadow: 0 0 30px rgba(26, 71, 42, 0.3); }
        .card-glow-light:hover { box-shadow: 0 0 25px rgba(26, 71, 42, 0.15); }
      `}</style>

      {/* Hero Banner */}
      <section
        className="relative overflow-hidden min-h-[260px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 71, 42, 0.88), rgba(26, 71, 42, 0.65)), url(https://i.postimg.cc/9Xnx9vZ1/20260423-083856.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Decorative floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-4 h-4 rounded-full bg-white/10 top-1/4 left-1/4 animate-pulse float-anim" style={{ animationDuration: "4s" }} />
          <div className="absolute w-3 h-3 rounded-full bg-white/10 bottom-1/4 right-1/3 animate-pulse float-anim-delayed" style={{ animationDuration: "5s" }} />
          <div className="absolute w-5 h-5 rounded-full bg-white/10 top-1/3 right-1/4 animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "2s" }} />
          <div className="absolute w-2 h-2 rounded-full bg-white/10 bottom-1/3 left-1/3 animate-pulse float-anim" style={{ animationDuration: "6s" }} />
          <div className="absolute w-6 h-6 rounded-full bg-white/5 top-2/3 left-1/5 animate-pulse float-anim-delayed" style={{ animationDuration: "7s" }} />
          <div className="absolute w-3 h-3 rounded-full bg-white/8 top-1/5 right-1/5 animate-pulse" style={{ animationDuration: "4.5s", animationDelay: "1.5s" }} />
        </div>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer-bg pointer-events-none" />
        <div className="text-center py-16 px-6 max-w-4xl relative z-10">
          <div className="reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm px-4 py-1.5 rounded-full mb-4">
              Empowering the Future
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Our Programs
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: "0.3s" }}>
            <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Comprehensive training programs designed to empower individuals with digital skills 
              and prepare them for success in the modern economy.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats Strip */}
      <div className="bg-jorc-green-light/30 border-y border-jorc-green-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Programs", value: "4" },
              { label: "Duration", value: "2-6 Weeks" },
              { label: "Class Size", value: "Max 24" },
              { label: "Certification", value: "Yes" },
            ].map((stat, i) => (
              <div key={i} className="reveal reveal-scale" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="text-2xl md:text-3xl font-bold text-jorc-green">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Main Programs */}
        <section className="mb-16 pt-12">
          <div className="text-center mb-10 reveal">
            <div className="inline-block">
              <h2 className="text-2xl md:text-3xl font-bold text-jorc-green relative inline-block">
                Core Programs
              </h2>
            </div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              Hands-on training designed to build real-world digital skills
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {mainPrograms.map((program, index) => (
              <div key={index} className="reveal" style={{ transitionDelay: `${index * 0.15}s` }}>
                <Card className="group bg-jorc-green text-white border-jorc-green hover:shadow-strong card-glow transition-all duration-500 hover:scale-[1.02] overflow-hidden flex flex-col relative">
                  {/* Number badge */}
                  <div className="absolute top-3 right-3 z-10 bg-jorc-green-light text-white text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="h-36 md:h-44 overflow-hidden relative">
                    <img
                      src={programImages[index]}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jorc-green/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">{program.title}</CardTitle>
                    <CardDescription className="text-white/70 text-sm">
                      {program.audience}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-white/60 group-hover:text-white/90 transition-colors duration-300">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {program.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        Max 24
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 flex-1 flex flex-col">
                    <p className="text-white/80 text-sm mb-3">{program.description}</p>
                    <div className="mt-auto">
                      <button
                        onClick={() => setExpanded(expanded === index ? null : index)}
                        className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors group/btn"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/0 group-hover/btn:bg-white/20 transition-all duration-300">
                          <Plus className={`h-4 w-4 icon-rotate group-hover/btn:scale-125 group-hover/btn:text-amber-300 transition-all duration-300 ${expanded === index ? "open" : ""}`} />
                        </span>
                        {expanded === index ? "Hide details" : index === 1 ? "What We Offer" : "What You'll Learn"}
                      </button>
                      <div className={`overflow-hidden transition-all duration-400 ${expanded === index ? "max-h-96 mt-3" : "max-h-0"}`}>
                        <ul className="space-y-1.5">
                          {program.content.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-white/80">
                              <CheckCircle className="h-3.5 w-3.5 text-white/70 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className="w-full sm:w-auto mt-4 bg-white text-jorc-green hover:bg-jorc-green hover:text-white border-2 border-white/0 hover:border-white hover:shadow-xl text-sm transition-all duration-300 active:scale-95 group/regbtn"
                        onClick={() => { setSelectedProgram(program.title); setRegOpen(true); }}
                      >
                        Register Now
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-all duration-300 group-hover/regbtn:translate-x-1.5 group-hover/regbtn:scale-110" />
                      </Button>
                    </div>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Special Workshops */}
        <section className="relative overflow-hidden bg-gradient-to-br from-jorc-green-lighter via-white to-jorc-green-lighter rounded-2xl p-5 md:p-12">
          {/* Decorative background shapes */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-jorc-green/5 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-jorc-green/8 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-jorc-green/3 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-10 reveal">
              <div className="inline-block">
                <h2 className="text-2xl md:text-3xl font-bold text-jorc-green relative inline-block">
                  Future Planned Programs
                </h2>
              </div>
              <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
                Exciting programs in development to expand our impact
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {workshops.map((workshop, index) => (
                <div key={index} className="reveal reveal-scale" style={{ transitionDelay: `${index * 0.1}s` }}>
                  <Card className="group relative overflow-hidden border-jorc-green-lighter hover:border-jorc-green transition-all duration-400 card-glow-light hover:shadow-lg hover:-translate-y-1">
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-jorc-green rounded-r scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                    <CardHeader>
                      <div>
                        <CardTitle className="text-jorc-green text-lg">{workshop.title}</CardTitle>
                        <CardDescription>{workshop.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Duration: {workshop.duration}</span>
                        <Badge variant="secondary" className="bg-jorc-green/10 text-jorc-green hover:bg-jorc-green hover:text-white transition-all duration-300">{workshop.level}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Registration Dialog */}
      <Dialog open={regOpen} onOpenChange={setRegOpen}>
        <DialogContent className="sm:max-w-md">
          {regSubmitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-jorc-green mb-4">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-jorc-green text-xl font-bold mb-2">Registration Submitted!</DialogTitle>
              <p className="text-muted-foreground text-sm mb-6">
                Thank you! We'll reach out to you shortly with more details about the program.
              </p>
              <Button
                onClick={() => { setRegOpen(false); setRegSubmitted(false); }}
                className="bg-jorc-green hover:bg-jorc-green-light text-white"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <DialogTitle className="text-jorc-green text-xl font-bold">Register for a Program</DialogTitle>
              <form className="space-y-4 mt-4" onSubmit={async (e) => {
                e.preventDefault();
                const name = (document.getElementById("name") as HTMLInputElement)?.value;
                const email = (document.getElementById("email") as HTMLInputElement)?.value;
                const phone = (document.getElementById("phone") as HTMLInputElement)?.value;
                const message = (document.getElementById("message") as HTMLTextAreaElement)?.value;
                const { error } = await supabase.from("program_registrations").insert({
                  program: selectedProgram, full_name: name, email, phone, message: message || null,
                });
                if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
                setRegSubmitted(true);
                toast({ title: "Registration submitted!", description: "We'll reach out to you shortly." });
              }}>
                <div className="space-y-2">
                  <Label htmlFor="prog">Program</Label>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger className="focus:ring-2 focus:ring-jorc-green focus:ring-offset-1 transition-all">
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {mainPrograms.map((p, i) => (
                        <SelectItem key={i} value={p.title}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input id="name" placeholder="Your full name" required className="pl-10 focus:ring-2 focus:ring-jorc-green focus:ring-offset-1 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input id="email" type="email" placeholder="your@email.com" required className="pl-10 focus:ring-2 focus:ring-jorc-green focus:ring-offset-1 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input id="phone" type="tel" placeholder="+234 800 000 0000" required className="pl-10 focus:ring-2 focus:ring-jorc-green focus:ring-offset-1 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (optional)</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Textarea id="message" placeholder="Any questions or special requirements" className="pl-10 focus:ring-2 focus:ring-jorc-green focus:ring-offset-1 transition-all" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setRegOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-jorc-green hover:bg-jorc-green-light text-white">Submit Registration</Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Programs;