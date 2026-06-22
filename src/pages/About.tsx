import { useEffect, useState } from "react";
import { Users, Target, Heart, Lightbulb, ChevronDown, X, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";

const team = [
  {
    name: "Francisca Otunla",
    role: "Executive Director",
    bio: "Leading the vision of JORC with decades of experience in community development and educational advocacy.",
    photo: team1,
  },
  {
    name: "Dr. Adebayo Ogunlesi",
    role: "Head of Programs",
    bio: "Drives curriculum development and ensures training programs meet global standards.",
    photo: team2,
  },
  {
    name: "Chioma Eze",
    role: "ICT Lab Manager",
    bio: "Oversees the digital laboratory operations and technical training delivery.",
    photo: team3,
  },
  {
    name: "Samuel Adeyemi",
    role: "Community Outreach Lead",
    bio: "Connects JORC with communities across Oyo State to expand access to digital literacy.",
    photo: team4,
  },
];

const About = () => {
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

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const storyImages = [
    "https://i.postimg.cc/7695rtPg/Whats-App-Image-2026-03-02-at-12-25-29-PM.jpg",
    "https://i.postimg.cc/SRtjJXMX/IMG-20260314-115016-Copy-Copy.jpg",
    "https://i.postimg.cc/8cnsjF6Z/IMG-20260314-105737.jpg",
    "https://i.postimg.cc/8ky7yY0g/IMG-20260314-103257.jpg",
    "https://i.postimg.cc/26G1N9j2/IMG-20251006-162223.jpg",
    "https://i.postimg.cc/VvNdf9d1/20260223-052105.jpg",
  ];

  const ourStoryImages = [
    "https://i.postimg.cc/JhcNtq4P/IMG-20260615-WA0017.jpg",
    "https://i.postimg.cc/FKgy1Zsg/IMG-20260615-WA0013.jpg",
    "https://i.postimg.cc/DZvqGX85/20260228-034814.jpg",
    "https://i.postimg.cc/DZvqGX8p/20260228-033638.jpg",
  ];

  const values = [
    {
      icon: Users,
      title: "Leadership",
      description: "Developing leaders who will drive positive change in their communities and beyond.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Maintaining the highest standards of honesty, transparency, and ethical conduct.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Embracing new technologies and creative solutions to solve real-world problems.",
    },
    {
      icon: Target,
      title: "Service",
      description: "Committed to serving our community with excellence and dedication.",
    },
  ];

  const impactAreas = [
    {
      title: "Education & Digital Literacy",
      desc: "Providing accessible digital skills training and educational resources to bridge the digital divide in underserved communities.",
      image: "https://i.postimg.cc/pTLMPZGt/20260303-155900.jpg",
    },
    {
      title: "Information & Communication Technology",
      desc: "Equipping individuals with modern ICT skills needed to thrive in the rapidly evolving digital economy.",
      image: "https://i.postimg.cc/j5ZjQc31/IMG-20260314-112740.jpg",
    },
    {
      title: "Effective library usage and utilization",
      desc: "Empowering communities through effective library utilization, fostering access to knowledge, lifelong learning, and innovative research skills for personal and professional growth.",
      image: "https://i.postimg.cc/J7jZs5rp/IMG-20260615-WA0015.jpg",
    },
    {
      title: "Community Transformation",
      desc: "Creating lasting social impact through community-centered programs that empower and uplift entire neighborhoods.",
      image: "https://i.postimg.cc/pLjsnFhd/20260102-162024.jpg",
    },
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
        .film-fade-left { background: linear-gradient(to right, white 0%, transparent 100%); }
        .film-fade-right { background: linear-gradient(to left, white 0%, transparent 100%); }
      `}</style>
      {/* Welcome Message - full width, joins the navbar */}
      <section className="relative overflow-hidden min-h-[320px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 71, 42, 0.88), rgba(26, 71, 42, 0.65)), url(https://i.postimg.cc/JnQfmK2g/20260423-083708.jpg)`,
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              About JORC
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: "0.3s" }}>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              The Jonah Otunla Resource Center stands as a beacon of hope and transformation, 
              carrying forward the visionary legacy of Jonah Ogunniyi Otunla.
            </p>
          </div>
        </div>
      </section>

      {/* Image Carousel - Film strip */}
      <section>
        <style>{`
          @keyframes film-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .film-track {
            animation: film-scroll 30s linear infinite;
          }
          .film-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="relative overflow-hidden border-y border-jorc-green-lighter shadow-lg">
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, white 0%, transparent 100%)" }} />
          <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, white 0%, transparent 100%)" }} />
          <div className="py-8">
            <div className="flex gap-2 film-track">
              {[...storyImages, ...storyImages].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxImg(img)}
                  className="flex-shrink-0 w-72 rounded-lg overflow-hidden border-2 border-white/60 hover:border-jorc-green transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none"
                >
                  <img src={img} alt="" className="w-full h-48 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Founder's Vision */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-left">
              <div className="inline-block">
                <h2 className="text-3xl font-bold text-jorc-green relative inline-block">
                  Founder's Vision
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-jorc-green rounded-full" />
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6 text-justify mt-8">


                Founded in honor of Jonah Ogunniyi Otunla OFR (June 12, 1955 – June 16, 2024), 
                a visionary leader and advocate of educational advancement, JORC embodies his 
                unwavering commitment to empowering communities through education and innovation.
              </p>
              <p className="text-muted-foreground mb-6 text-justify">
                Our founder believed that education is the most powerful tool for transformation. 
                His vision was to create a center where individuals, especially the youth, could 
                access quality learning resources and develop the skills needed to thrive in the 
                digital age.
              </p>
              <div className="relative pl-6 border-l-4 border-jorc-green">
                <Star className="absolute -left-3 top-0 h-5 w-5 text-jorc-green bg-white" />
                <blockquote className="italic text-jorc-green pl-2">
                  "Legacy in motion, impacting the future" — this is not just our tagline, 
                  but our commitment to continuing the transformative work that defines our purpose.
                </blockquote>
              </div>
            </div>
            <div className="reveal-right overflow-hidden rounded-lg shadow-strong group">
              <img
                src="https://i.postimg.cc/3Nj6sfmx/Whats-App-Image-2026-03-02-at-4-39-21-PM.jpg"
                alt="JORC Facility"
                className="w-full transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="relative overflow-hidden mb-16 bg-jorc-green-lighter rounded-2xl p-8 reveal">
          {/* Decorative bg shapes */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-jorc-green/5 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-jorc-green/8 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-block">
                <h2 className="text-3xl font-bold text-jorc-green relative inline-block">
                  Our Story
                  <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-jorc-green rounded-full" />
                </h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="grid grid-cols-2 gap-3">
                {ourStoryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxImg(img)}
                    className="rounded-xl overflow-hidden border-2 border-white/60 hover:border-jorc-green transition-all duration-300 hover:scale-[1.03] hover:shadow-lg focus:outline-none shadow-soft"
                  >
                    <img src={img} alt="" className="w-full h-40 object-cover" />
                  </button>
                ))}
              </div>
              <div>
                <p className="text-lg text-muted-foreground mb-6 text-justify">
                  Established as an initiative of the Francisca and Jonah Otunla Foundation, 
                  JORC was born from a deep understanding of the transformative power of 
                  digital literacy and community-centered education.
                </p>
                <p className="text-muted-foreground mb-6 text-justify">
                  Located in Irawo-Owode, Atisbo LGA, Oyo State, our center serves as a 
                  bridge between traditional education and modern digital skills, ensuring 
                  that no one is left behind in the rapidly evolving technological landscape.
                </p>
                <p className="text-muted-foreground text-justify">
                  We are committed to creating sustainable change by providing accessible, 
                  affordable, and high-quality training programs that prepare individuals 
                  for success in the 21st century economy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="reveal-left">
              <Card className="bg-jorc-green text-white border-jorc-green card-glow transition-all duration-500 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-white/70" />
                    <CardTitle className="text-white text-2xl">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    To empower individuals, especially youth, with access to high-quality 
                    learning resources, mentorship, and opportunities for personal and 
                    professional growth through innovative digital literacy programs and 
                    community-centered education.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="reveal-right">
              <Card className="bg-jorc-green text-white border-jorc-green card-glow transition-all duration-500 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-white/70" />
                    <CardTitle className="text-white text-2xl">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    To be the leading resource center for digital literacy and innovation 
                    in West Africa, creating a generation of digitally empowered leaders 
                    who will drive sustainable development and transformation in their 
                    communities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <div className="text-center mb-12 reveal">
            <div className="inline-block">
              <h2 className="text-3xl font-bold text-jorc-green relative inline-block">
                Our Core Values
                <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-jorc-green rounded-full" />
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="reveal" style={{ transitionDelay: `${index * 0.12}s` }}>
                <Card
                  className="group text-center cursor-default transition-all duration-300 hover:shadow-strong bg-jorc-green text-white border-jorc-green hover:border-jorc-green-light hover:scale-[1.10] card-glow"
                >
                  <CardHeader>
                    <value.icon className="h-12 w-12 mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300" />
                    <CardTitle className="text-white">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100">
                      <p className="text-sm text-white/80">{value.description}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 mx-auto mt-3 text-white/50 group-hover:text-white transition-all duration-300 group-hover:rotate-180" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Areas */}
        <section className="mb-16">
          <div className="text-center mb-4 reveal">
            <div className="inline-block">
              <h2 className="text-3xl font-bold text-jorc-green relative inline-block">
                Our Impact Areas
                <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-jorc-green rounded-full" />
              </h2>
            </div>
          </div>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12 reveal">
            Focus areas where JORC is making a measurable difference in communities across Oyo State and beyond.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="reveal" style={{ transitionDelay: `${index * 0.15}s` }}>
                <div className="flex rounded-xl overflow-hidden border border-jorc-green bg-jorc-green text-white shadow-soft hover:shadow-strong transition-all duration-300 group hover:scale-[1.05] card-glow">
                  <div className="w-44 flex-shrink-0 overflow-hidden relative">
                    <img src={area.image} alt={area.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-jorc-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="flex-1 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{area.title}</h3>
                    <p className="text-white/80">{area.desc}</p>
                    <div className="h-1 w-12 bg-white/50 rounded mt-4 transition-all duration-300 group-hover:w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section>
          <div className="text-center mb-4 reveal">
            <div className="inline-block">
              <h2 className="text-3xl font-bold text-jorc-green relative inline-block">
                Our Team
                <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-jorc-green rounded-full" />
              </h2>
            </div>
          </div>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12 reveal">
            Meet the dedicated professionals driving the mission of JORC forward.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="reveal-scale" style={{ transitionDelay: `${index * 0.12}s` }}>
                <Card className="text-center bg-jorc-green text-white border-jorc-green hover:scale-[1.08] transition-all duration-300 group hover:shadow-strong card-glow">
                  <CardHeader>
                    <div className="h-28 w-28 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-white/30 group-hover:ring-white/60 group-hover:scale-110 transition-all duration-300">
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <CardTitle className="text-white">{member.name}</CardTitle>
                    <p className="text-sm font-medium text-white/70">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/80">{member.bio}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <Dialog open={!!lightboxImg} onOpenChange={() => setLightboxImg(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-0 shadow-none p-0">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          {lightboxImg && (
            <div className="relative">
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <img src={lightboxImg} alt="" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default About;