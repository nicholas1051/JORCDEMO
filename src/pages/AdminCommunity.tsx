import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle, XCircle, Clock, MessageCircle, ArrowLeft, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import servicesBannerImg from "@/assets/services-banner.jpg";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "jorcadmin2024";

type Post = {
  id: string;
  author_name: string;
  author_email?: string;
  title: string;
  content: string;
  category: string;
  status: string;
  likes: number;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  status: string;
  created_at: string;
};

type Tab = "pending-posts" | "pending-comments" | "all-posts";

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

const AdminCommunity = () => {
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tab, setTab] = useState<Tab>("pending-posts");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const fetchData = async () => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [postsRes, commentsRes] = await Promise.all([
      supabase.from("posts").select("*").order("created_at", { ascending: false }),
      supabase.from("comments").select("*").order("created_at", { ascending: false }),
    ]);
    if (!postsRes.error && postsRes.data) setPosts(postsRes.data);
    if (!commentsRes.error && commentsRes.data) setComments(commentsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const updatePostStatus = async (id: string, status: string) => {
    setActionLoading(id);
    if (hasSupabase) {
      const { error } = await supabase.from("posts").update({ status }).eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setActionLoading(null);
        return;
      }
    }
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast({ title: `Post ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "archived"}` });
    setActionLoading(null);
  };

  const updateCommentStatus = async (id: string, status: string) => {
    setActionLoading(id);
    if (hasSupabase) {
      const { error } = await supabase.from("comments").update({ status }).eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setActionLoading(null);
        return;
      }
    }
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    toast({ title: `Comment ${status === "approved" ? "approved" : "rejected"}` });
    setActionLoading(null);
  };

  const deletePost = async (id: string) => {
    setActionLoading(id);
    if (hasSupabase) {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setActionLoading(null);
        return;
      }
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Post deleted" });
    setActionLoading(null);
  };

  const stats = {
    total: posts.length,
    pending: posts.filter((p) => p.status === "pending").length,
    approved: posts.filter((p) => p.status === "approved").length,
    rejected: posts.filter((p) => p.status === "rejected").length,
    pendingComments: comments.filter((c) => c.status === "pending").length,
    approvedComments: comments.filter((c) => c.status === "approved").length,
  };

  const pendingPosts = posts.filter((p) => p.status === "pending");
  const pendingComments = comments.filter((c) => c.status === "pending");

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jorc-green/5 to-jorc-grey/40">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-jorc-green flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-jorc-green">Admin Access</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Enter the admin password to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                  className={passwordError ? "border-red-500" : ""}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Incorrect password
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full bg-jorc-green hover:bg-jorc-green-light">
                <ShieldCheck className="h-4 w-4 mr-2" /> Unlock
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/community" className="text-sm text-muted-foreground hover:text-jorc-green transition-colors">
                ← Back to Community
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section
        className="relative overflow-hidden min-h-[200px] md:min-h-[240px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 71, 42, 0.88), rgba(26, 71, 42, 0.65)), url(${servicesBannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center py-12 md:py-16 px-5 max-w-4xl relative z-10">
          <Link to="/community" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Community
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-white/80 mt-2">Review, approve, and manage community content</p>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 md:py-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <StatCard label="Total Posts" value={stats.total} icon={MessageCircle} color="text-jorc-green" />
            <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="text-green-600" />
            <StatCard label="Pending" value={stats.pending} icon={Clock} color="text-amber-600" />
            <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="text-red-600" />
            <StatCard label="Comments Pending" value={stats.pendingComments} icon={Clock} color="text-amber-600" />
            <StatCard label="Comments Approved" value={stats.approvedComments} icon={CheckCircle} color="text-green-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-jorc-grey/40 min-h-screen pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 pt-6 pb-4 border-b border-border mb-6">
            {[
              { id: "pending-posts" as Tab, label: "Pending Posts", count: stats.pending },
              { id: "pending-comments" as Tab, label: "Pending Comments", count: stats.pendingComments },
              { id: "all-posts" as Tab, label: "All Posts", count: stats.total },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  tab === t.id
                    ? "bg-jorc-green text-white shadow-md"
                    : "bg-white text-foreground border border-border hover:border-jorc-green hover:shadow-sm"
                }`}
              >
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab === t.id ? "bg-white/20 text-white" : "bg-jorc-green-lighter text-jorc-green"
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-jorc-green" />
              <p className="text-muted-foreground">Loading content...</p>
            </div>
          ) : !hasSupabase ? (
            <Card className="text-center py-12 border-dashed border-2">
              <CardContent>
                <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                <p className="text-lg font-medium text-jorc-green mb-1">Supabase Not Configured</p>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable the admin dashboard.
                </p>
              </CardContent>
            </Card>
          ) : tab === "pending-posts" && pendingPosts.length === 0 ? (
            <Card className="text-center py-12 border-dashed border-2">
              <CardContent>
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium text-jorc-green mb-1">All caught up!</p>
                <p className="text-muted-foreground text-sm">No pending posts to review.</p>
              </CardContent>
            </Card>
          ) : tab === "pending-posts" ? (
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <AdminPostCard
                  key={post.id}
                  post={post}
                  actionLoading={actionLoading}
                  onApprove={() => updatePostStatus(post.id, "approved")}
                  onReject={() => updatePostStatus(post.id, "rejected")}
                  onDelete={() => deletePost(post.id)}
                />
              ))}
            </div>
          ) : tab === "pending-comments" && pendingComments.length === 0 ? (
            <Card className="text-center py-12 border-dashed border-2">
              <CardContent>
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium text-jorc-green mb-1">All caught up!</p>
                <p className="text-muted-foreground text-sm">No pending comments to review.</p>
              </CardContent>
            </Card>
          ) : tab === "pending-comments" ? (
            <div className="space-y-3">
              {pendingComments.map((comment) => (
                <AdminCommentCard
                  key={comment.id}
                  comment={comment}
                  actionLoading={actionLoading}
                  onApprove={() => updateCommentStatus(comment.id, "approved")}
                  onReject={() => updateCommentStatus(comment.id, "rejected")}
                />
              ))}
            </div>
          ) : (
            /* All Posts tab */
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="text-center py-12 border-dashed border-2">
                  <CardContent>
                    <MessageCircle className="h-12 w-12 mx-auto text-jorc-green-light mb-4" />
                    <p className="text-lg font-medium text-jorc-green mb-1">No posts yet</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <AdminPostCard
                    key={post.id}
                    post={post}
                    actionLoading={actionLoading}
                    onApprove={post.status !== "approved" ? () => updatePostStatus(post.id, "approved") : undefined}
                    onReject={post.status !== "rejected" ? () => updatePostStatus(post.id, "rejected") : undefined}
                    onDelete={() => deletePost(post.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) => (
  <div className="bg-jorc-grey/30 rounded-lg px-3 py-3 flex items-center gap-3">
    <div className="h-9 w-9 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
      <Icon className={`h-4 w-4 ${color}`} />
    </div>
    <div className="min-w-0">
      <div className={`text-lg font-bold leading-none ${color}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground truncate">{label}</div>
    </div>
  </div>
);

const AdminPostCard = ({
  post,
  actionLoading,
  onApprove,
  onReject,
  onDelete,
}: {
  post: Post;
  actionLoading: string | null;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
}) => {
  const statusColors: Record<string, string> = {
    approved: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <Card className="bg-white border-border hover:shadow-md transition-shadow">
      <CardContent className="pt-4 md:pt-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-jorc-green text-white flex items-center justify-center font-semibold flex-shrink-0 text-sm">
            {initials(post.author_name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm mb-1">
              <span className="font-semibold text-jorc-green">{post.author_name}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{timeAgo(post.created_at)}</span>
              {post.author_email && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground text-xs truncate">{post.author_email}</span>
                </>
              )}
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[post.status] || "bg-gray-100 text-gray-700"}`}>
                {post.status}
              </span>
            </div>
            <h3 className="font-bold text-base mb-1">{post.title}</h3>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-3">{post.content}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
              {onApprove && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800 text-xs"
                  onClick={onApprove}
                  disabled={actionLoading === post.id}
                >
                  {actionLoading === post.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-red-700 border-red-300 hover:bg-red-50 hover:text-red-800 text-xs"
                  onClick={onReject}
                  disabled={actionLoading === post.id}
                >
                  {actionLoading === post.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
                  Reject
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-muted-foreground hover:text-red-600 text-xs ml-auto"
                onClick={onDelete}
                disabled={actionLoading === post.id}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminCommentCard = ({
  comment,
  actionLoading,
  onApprove,
  onReject,
}: {
  comment: Comment;
  actionLoading: string | null;
  onApprove: () => void;
  onReject: () => void;
}) => (
  <Card className="bg-white border-border hover:shadow-md transition-shadow">
    <CardContent className="py-3 md:py-4">
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-jorc-green/20 text-jorc-green flex items-center justify-center font-semibold text-xs flex-shrink-0">
          {initials(comment.author_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-jorc-green">{comment.author_name}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">pending</span>
          </div>
          <p className="text-sm text-foreground/80 mt-1">{comment.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800 text-xs"
              onClick={onApprove}
              disabled={actionLoading === comment.id}
            >
              {actionLoading === comment.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-red-700 border-red-300 hover:bg-red-50 hover:text-red-800 text-xs"
              onClick={onReject}
              disabled={actionLoading === comment.id}
            >
              {actionLoading === comment.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
              Reject
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminCommunity;
