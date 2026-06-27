import { useEffect, useState } from "react";
import { MessageCircle, ThumbsUp, Pin, Send, Users, BookOpen, Loader2, ChevronDown, Reply } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import servicesBannerImg from "@/assets/services-banner.jpg";

type Post = {
  id: string;
  author_name: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  status: "approved" | "pending";
  created_at: string;
};

const CATEGORIES = ["All", "Announcements", "Experiences", "Questions", "Feedback", "Success Stories"];
const PAGE_SIZE = 10;

const dummyPosts: Post[] = [
  {
    id: "1",
    author_name: "Chioma Eze",
    title: "Just completed the Digital Literacy Program!",
    content: "I wanted to share my amazing experience with the Digital Literacy Program at JORC. I went from knowing nothing about computers to confidently using Microsoft Office, browsing the internet, and even creating presentations. The instructors were patient and thorough. I highly recommend this to anyone looking to gain digital skills.",
    category: "Success Stories",
    likes: 24,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "2",
    author_name: "Samuel Adeyemi",
    title: "Upcoming community outreach this weekend",
    content: "Hello everyone! We'll be organizing a community outreach program this Saturday at Irawo-Owode. We'll have free digital literacy workshops for beginners, career counseling sessions, and a Q&A panel with industry professionals. Venue is the JORC facility. Time is 10 AM to 4 PM. Bring a friend!",
    category: "Announcements",
    likes: 18,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    author_name: "Francisca Otunla",
    title: "How can I prepare for the WAEC CBT?",
    content: "I'm writing my WAEC exams next month and I'm a bit nervous about the computer-based test format. I've practiced typing but I'm worried about navigating the interface during the exam. Does anyone have tips or resources that helped them prepare? Are there any mock tests available at the center?",
    category: "Questions",
    likes: 12,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "4",
    author_name: "Dr. Adebayo Ogunlesi",
    title: "The impact of digital literacy on rural communities",
    content: "I've been researching the impact of our digital literacy programs across Oyo State over the past year. The results are inspiring — over 200 community members now have basic digital skills, 45 have secured jobs requiring computer proficiency, and 30 small businesses have adopted digital tools for their operations. This is just the beginning.",
    category: "Experiences",
    likes: 31,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "5",
    author_name: "Tunde Bakare",
    title: "Suggestions for weekend workshop times",
    content: "I work full-time during the week and would love to attend more workshops at JORC, but most of them are scheduled on weekdays. Would it be possible to have some sessions on Saturdays or Sunday afternoons? I know a few other community members who feel the same way.",
    category: "Feedback",
    likes: 8,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

const dummyComments: Record<string, Comment[]> = {
  "1": [
    { id: "c1", post_id: "1", author_name: "Samuel Adeyemi", content: "Congratulations Chioma! We're so proud of your progress!", status: "approved", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: "c2", post_id: "1", author_name: "Francisca Otunla", content: "This is wonderful! Keep learning and growing.", status: "approved", created_at: new Date(Date.now() - 1800000).toISOString() },
  ],
  "2": [
    { id: "c3", post_id: "2", author_name: "Chioma Eze", content: "I'll be there! Can't wait for the career counseling session.", status: "approved", created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  ],
  "3": [
    { id: "c4", post_id: "3", author_name: "Dr. Adebayo Ogunlesi", content: "We have mock CBT sessions every Saturday at the center. Visit the ICT lab and register at the front desk.", status: "approved", created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "c5", post_id: "3", author_name: "Tunde Bakare", content: "I used the mock tests last month and they really helped. Highly recommended!", status: "approved", created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  ],
  "4": [
    { id: "c6", post_id: "4", author_name: "Francisca Otunla", content: "These numbers are incredible. Thank you for sharing this research, Dr. Ogunlesi.", status: "approved", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  ],
};

const Community = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [comments, setComments] = useState<Record<string, Comment[]>>(dummyComments);
  const [activeCat, setActiveCat] = useState("All");
  const [loading, setLoading] = useState(false);
  const [openCompose, setOpenCompose] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [form, setForm] = useState({
    author_name: "",
    author_email: "",
    title: "",
    content: "",
    category: "Experiences",
  });

  useEffect(() => {
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!hasSupabase) return;
    setLoading(true);
    const promise = supabase
      .from("posts")
      .select("id, author_name, title, content, category, likes, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    Promise.resolve(promise).then(({ data, error }: { data: Post[] | null; error: unknown }) => {
      if (!error && data) setPosts(data);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

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
  }, [posts, visibleCount, comments]);

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author_name || !form.title || !form.content) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("posts").insert({
      author_name: form.author_name,
      author_email: form.author_email || null,
      title: form.title,
      content: form.content,
      category: form.category,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit post", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Submitted for review",
      description: "Your post will appear here after an admin approves it.",
    });
    setForm({ author_name: "", author_email: "", title: "", content: "", category: "Experiences" });
    setOpenCompose(false);
  };

  const submitComment = async () => {
    if (!commentName.trim() || !commentText.trim()) {
      toast({ title: "Please fill in your name and comment", variant: "destructive" });
      return;
    }
    if (!viewPost) return;
    setSubmittingComment(true);
    const { error } = await supabase.from("comments").insert({
      post_id: viewPost.id,
      author_name: commentName.trim(),
      content: commentText.trim(),
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSubmittingComment(false); return; }
    const newComment: Comment = {
      id: `c${Date.now()}`,
      post_id: viewPost.id,
      author_name: commentName.trim(),
      content: commentText.trim(),
      status: "pending",
      created_at: new Date().toISOString(),
    };
    setComments((prev) => ({
      ...prev,
      [viewPost.id]: [...(prev[viewPost.id] || []), newComment],
    }));
    toast({
      title: "Comment submitted for review",
      description: "It will appear after an admin approves it.",
    });
    setCommentText("");
    setSubmittingComment(false);
  };

  const filtered = activeCat === "All" ? posts : posts.filter((p) => p.category === activeCat);
  const visiblePosts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d}d ago`;
    const h = Math.floor(diff / 3600000);
    if (h > 0) return `${h}h ago`;
    const m = Math.floor(diff / 60000);
    return `${m}m ago`;
  };

  const postComments = viewPost ? comments[viewPost.id] || [] : [];
  const approvedComments = postComments.filter((c) => c.status === "approved");
  const pendingCount = postComments.filter((c) => c.status === "pending").length;

  return (
    <div>
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal-scale.is-visible { opacity: 1; transform: scale(1); }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer-bg { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); background-size: 200% 100%; animation: shimmer 3s infinite; }
        .card-glow:hover { box-shadow: 0 0 25px rgba(26, 71, 42, 0.25); }
      `}</style>

      {/* Hero Banner */}
      <section
        className="relative overflow-hidden min-h-[300px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 71, 42, 0.88), rgba(26, 71, 42, 0.65)), url(${servicesBannerImg})`,
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
        <div className="text-center py-12 md:py-16 px-6 max-w-4xl relative z-10">
          <div className="reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="inline-flex items-center gap-2 mb-6 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-4 py-1.5 rounded-full text-sm font-medium">
              Connect & Share
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              JORC Community
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: "0.3s" }}>
            <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Share your experience, ask questions, and learn from fellow learners.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-2 md:gap-4 py-4 md:py-5">
            {[
              { label: "Community", value: "Active", icon: Users },
              { label: "Discussions", value: posts.length.toString(), icon: MessageCircle },
              { label: "Categories", value: String(CATEGORIES.length - 1), icon: BookOpen },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-jorc-grey/30 rounded-lg border-l-4 border-r-4 px-2 md:px-4 py-2 md:py-3 flex flex-col md:flex-row items-center gap-1 md:gap-3 reveal text-center md:text-left"
                style={{ borderLeftColor: i === 1 ? "#2D6B3E" : "#1A472A", borderRightColor: i === 1 ? "#2D6B3E" : "#1A472A", transitionDelay: `${i * 0.12}s` }}
              >
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-jorc-green" />
                </div>
                <div>
                  <div className="text-sm md:text-lg font-bold text-jorc-green leading-none">{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-jorc-grey/40 min-h-screen pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="pt-6 md:pt-8 mb-5 md:mb-6 reveal">
            <div className="inline-block">
              <h1 className="text-xl md:text-2xl font-bold text-jorc-green relative inline-block">
                Community Feed
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-jorc-green rounded-full" />
              </h1>
            </div>
            <p className="text-muted-foreground text-xs md:text-sm mt-2 md:mt-3">
              Discover stories, ask questions, and connect with the JORC community.
            </p>
          </div>

          {/* Compose box */}
          <div className="reveal">
            <Dialog open={openCompose} onOpenChange={setOpenCompose}>
              <DialogTrigger asChild>
                <button className="w-full bg-white rounded-xl border border-border px-4 md:px-5 py-3 md:py-5 mb-4 md:mb-5 flex items-center gap-3 text-left hover:shadow-lg hover:border-jorc-green/30 transition-all duration-300 group">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-jorc-green text-white flex items-center justify-center font-semibold group-hover:scale-110 transition-transform duration-300 text-base md:text-lg flex-shrink-0">
                    +
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm md:text-base text-foreground font-medium group-hover:text-jorc-green transition-colors">
                      Share with the community
                    </span>
                    <p className="text-muted-foreground text-xs md:text-sm mt-0.5 hidden md:block">
                      Share your experience, ask a question, or post an update…
                    </p>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-jorc-green">Share with the community</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitPost} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Your name *</Label>
                      <Input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Email (optional)</Label>
                      <Input type="email" value={form.author_email} onChange={(e) => setForm({ ...form, author_email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Title *</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Your message *</Label>
                    <Textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Posts are reviewed by a community admin before becoming visible to everyone.
                  </p>
                  <Button type="submit" disabled={submitting} className="w-full">
                    <Send className="h-4 w-4 mr-2" /> {submitting ? "Submitting…" : "Submit for review"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-5 md:mb-6 reveal">
            {CATEGORIES.map((c) => {
              const active = c === activeCat;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium border transition-all duration-300 ${
                    active
                      ? "bg-jorc-green text-white border-jorc-green shadow-md scale-105"
                      : "bg-white text-foreground border-border hover:border-jorc-green hover:shadow-sm"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Posts feed */}
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-jorc-green" />
              <p className="text-muted-foreground">Loading posts…</p>
            </div>
          ) : filtered.length === 0 ? (
            <Card className="text-center py-16 border-dashed border-2 reveal">
              <CardContent>
                <MessageCircle className="h-12 w-12 mx-auto text-jorc-green-light mb-4" />
                <p className="text-lg font-medium text-jorc-green mb-1">No posts yet</p>
                <p className="text-muted-foreground text-sm">Be the first to share in this category!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3 md:space-y-4">
                {visiblePosts.map((post, index) => {
                  const count = (comments[post.id] || []).filter((c) => c.status === "approved").length;
                  return (
                    <div key={post.id} className="reveal" style={{ transitionDelay: `${index * 0.08}s` }}>
                      <Card
                        className="bg-white hover:shadow-lg transition-all duration-300 border-border hover:border-jorc-green/20 card-glow cursor-pointer"
                        onClick={() => setViewPost(post)}
                      >
                        <CardContent className="pt-4 md:pt-5">
                          <div className="flex items-start gap-2 md:gap-3">
                            <div className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-jorc-green text-white flex items-center justify-center font-semibold flex-shrink-0 text-xs md:text-sm">
                              {initials(post.author_name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm flex-wrap">
                                <span className="font-semibold text-jorc-green">{post.author_name}</span>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground">{timeAgo(post.created_at)}</span>
                                <span className="inline-flex items-center gap-1 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full bg-jorc-green-lighter text-jorc-green">
                                  <Pin className="h-2.5 w-2.5 md:h-3 md:w-3" /> {post.category}
                                </span>
                              </div>
                              <h3 className="text-base md:text-lg font-bold mt-1 mb-1">{post.title}</h3>
                              <p className="text-sm md:text-base text-foreground/80 whitespace-pre-wrap line-clamp-2 md:line-clamp-3">{post.content}</p>
                              <div className="flex items-center gap-4 md:gap-5 mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
                                <span className="flex items-center gap-1 hover:text-jorc-green transition-colors">
                                  <ThumbsUp className="h-4 w-4" /> {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" /> {count}
                                </span>
                                <span className="flex items-center gap-1 hover:text-jorc-green transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewPost(post); }}>
                                  <Reply className="h-4 w-4" /> Reply
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className="text-center mt-8 reveal">
                  <Button
                    variant="outline"
                    className="border-jorc-green text-jorc-green hover:bg-jorc-green hover:text-white transition-all duration-300"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Load More ({filtered.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Expanded Post View Dialog */}
      <Dialog open={!!viewPost} onOpenChange={() => setViewPost(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {viewPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-jorc-green-lighter text-jorc-green">
                    <Pin className="h-3 w-3" /> {viewPost.category}
                  </span>
                </div>
                <DialogTitle className="text-jorc-green text-xl">{viewPost.title}</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-jorc-green text-white flex items-center justify-center font-semibold text-sm">
                  {initials(viewPost.author_name)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{viewPost.author_name}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(viewPost.created_at)}</p>
                </div>
              </div>
              <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">{viewPost.content}</p>
              <div className="flex items-center gap-5 mt-6 text-sm text-muted-foreground border-t pt-4">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> {viewPost.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {approvedComments.length} {approvedComments.length === 1 ? "comment" : "comments"}
                </span>
              </div>

              {/* Comments */}
              <div className="mt-6 border-t pt-6">
                <h4 className="font-semibold text-jorc-green mb-4 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comments
                  {pendingCount > 0 && (
                    <span className="text-xs font-normal text-muted-foreground">({pendingCount} pending approval)</span>
                  )}
                </h4>
                {approvedComments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                ) : (
                  <div className="space-y-4 mb-6">
                    {approvedComments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-jorc-green/20 text-jorc-green flex items-center justify-center font-semibold text-xs flex-shrink-0">
                          {initials(c.author_name)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{c.author_name}</span>
                            <span className="text-xs text-muted-foreground">{timeAgo(c.created_at)}</span>
                          </div>
                          <p className="text-sm text-foreground/80 mt-0.5">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending comments (only visible to the submitter during session) */}
                {postComments.filter((c) => c.status === "pending").map((c) => (
                  <div key={c.id} className="flex gap-3 mb-4 opacity-60">
                    <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {initials(c.author_name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{c.author_name}</span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Pending</span>
                      </div>
                      <p className="text-sm text-foreground/60 mt-0.5">{c.content}</p>
                    </div>
                  </div>
                ))}

                {/* Comment form */}
                <div className="border-t pt-4 mt-4">
                  <h5 className="text-sm font-medium mb-3">Leave a comment</h5>
                  <div className="space-y-3">
                    <Input
                      placeholder="Your name *"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                    />
                    <Textarea
                      placeholder="Write your comment…"
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Comments are reviewed before being published.</p>
                      <Button
                        size="sm"
                        disabled={submittingComment}
                        onClick={submitComment}
                        className="bg-jorc-green hover:bg-jorc-green-light text-white"
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        {submittingComment ? "Sending…" : "Submit"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;