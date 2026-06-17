import * as fs from 'fs';

const content = `"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  FileText,
  Globe,
  Leaf,
  MapPin,
  PenTool,
  RefreshCw,
  Share2,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { getCategories, getPamphlets } from "@/services/api";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Pamphlet = {
  id: number;
  title: string;
  url_key: string;
  category: string;
  short_description: string;
  thumbnail_image: string | null;
  created_at: string;
  location: { city: string } | null;
};

type PamphletPayload = { data?: Pamphlet[]; items?: Pamphlet[] };

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
).replace(/\\/api\\/?$/, "");

const getThumbnailUrl = (src?: string | null): string | null => {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const clean = src.startsWith("/") ? src : \`/uploads/$\{src}\`;
  return \`$\{API_ORIGIN}$\{clean}\`;
};

// ---- Utility Components ----

const SectionHeading = ({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="text-center max-w-2xl mx-auto mb-16">
    {label && (
      <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold tracking-wide uppercase mb-4">
        {label}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-lg text-neutral-500 leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

const FadeInSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={\`transition-all duration-700 $\{visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}\`}
    >
      <div className={className}>{children}</div>
    </div>
  );
};

const problems = [
  { icon: DollarSign, title: "High Printing Costs", desc: "Thousands spent on printing materials that become outdated quickly." },
  { icon: MapPin, title: "Manual Distribution", desc: "Time-consuming physical delivery with limited reach and no tracking." },
  { icon: RefreshCw, title: "Outdated Information", desc: "Static content that cannot be updated once printed." },
  { icon: Users, title: "Limited Audience", desc: "Physical distribution restricts your reach to a small local area." },
  { icon: BarChart3, title: "No Insights", desc: "Zero data on how many people viewed or engaged with your content." },
  { icon: Leaf, title: "Environmental Waste", desc: "Thousands of pamphlets end up in landfills without being read." },
];

const solutions = [
  { icon: Globe, title: "Publish Once, Share Everywhere", desc: "Create digital pamphlets that can be shared instantly via links, QR codes, and social media." },
  { icon: RefreshCw, title: "Real-Time Updates", desc: "Update content anytime — no reprinting, no redistribution, no extra cost." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track views, engagement, and distribution performance in real time." },
  { icon: CheckCircle2, title: "Cost Effective", desc: "Eliminate printing and distribution costs entirely with a fully digital workflow." },
];

const comparisonData = [
  { traditional: "Print Thousands", parchahub: "Publish Once" },
  { traditional: "Manual Distribution", parchahub: "Instant Sharing" },
  { traditional: "Static Information", parchahub: "Real-Time Updates" },
  { traditional: "No Insights", parchahub: "Analytics Dashboard" },
  { traditional: "High Cost", parchahub: "Cost Effective" },
  { traditional: "Limited Reach", parchahub: "Global Audience" },
];

const benefits = [
  { icon: DollarSign, stat: "80%", label: "Cost Reduction", desc: "Eliminate printing and distribution expenses entirely." },
  { icon: Globe, stat: "10x", label: "Wider Reach", desc: "Share pamphlets instantly through links, email, and social." },
  { icon: RefreshCw, stat: "Real-time", label: "Instant Updates", desc: "Update content anytime without reprinting materials." },
  { icon: TrendingUp, stat: "100%", label: "Trackable", desc: "Know exactly who viewed and engaged with your content." },
  { icon: Users, stat: "Centralized", label: "One Platform", desc: "Manage all your pamphlets from a single dashboard." },
  { icon: Leaf, stat: "Zero Waste", label: "Eco-Friendly", desc: "Go paperless and reduce your environmental footprint." },
];

const howItWorks = [
  { step: "01", icon: PenTool, title: "Create", desc: "Design or upload your pamphlet using our intuitive editor. Add images, rich text, and contact information." },
  { step: "02", icon: Share2, title: "Publish", desc: "Share instantly through unique links, QR codes, or embed on your website. No printing required." },
  { step: "03", icon: TrendingUp, title: "Analyze", desc: "Track views, engagement metrics, and distribution performance through your analytics dashboard." },
];

const useCases = [
  { title: "Educational Institutions", desc: "Schools and universities sharing notices, event information, and academic materials.", icon: FileText, color: "bg-blue-50 text-blue-600" },
  { title: "Government Organizations", desc: "Public notices, awareness campaigns, and policy documents distributed digitally.", icon: Target, color: "bg-green-50 text-green-600" },
  { title: "Healthcare", desc: "Health awareness campaigns, clinic information, and patient education materials.", icon: Leaf, color: "bg-emerald-50 text-emerald-600" },
  { title: "Businesses", desc: "Marketing materials, promotional offers, and product catalogs shared with customers.", icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
  { title: "NGOs & Non-Profits", desc: "Community outreach programs, fundraising campaigns, and impact reports.", icon: Users, color: "bg-amber-50 text-amber-600" },
];

const testimonials = [
  { quote: "We reduced our annual printing budget by 80% while reaching 3x more people. ParchaHub transformed how we communicate with our community.", author: "Sarah Chen", role: "Communications Director, City Council" },
  { quote: "The analytics alone are worth it. For the first time, we can actually measure how many people read our materials and which content resonates.", author: "James Okonkwo", role: "Head of Outreach, HealthFirst NGO" },
  { quote: "Updating our pamphlets used to take weeks of reprinting and redistribution. Now we make changes in minutes and everyone gets the latest version instantly.", author: "Priya Sharma", role: "Marketing Manager, EduPrime Schools" },
];

const stats = [
  { value: "10K+", label: "Digital Pamphlets Created" },
  { value: "500+", label: "Organizations Using ParchaHub" },
  { value: "85%", label: "Average Cost Reduction" },
  { value: "5M+", label: "Digital Views Delivered" },
];

// ---- Main Component ----

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pamphlets, setPamphlets] = useState<Pamphlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [catData, pamData] = await Promise.all([
          getCategories(),
          getPamphlets(1, 6),
        ]);
        if (!mounted) return;
        setCategories(Array.isArray(catData) ? catData : []);
        const items = Array.isArray(pamData)
          ? pamData
          : (pamData as PamphletPayload)?.data || (pamData as PamphletPayload)?.items || [];
        setPamphlets(items);
      } catch { /* ignore */ }
      if (mounted) setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-hidden">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight text-neutral-900">
              <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              ParchaHub
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("problem")} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Problem</button>
              <button onClick={() => scrollToSection("solution")} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Solution</button>
              <button onClick={() => scrollToSection("benefits")} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Benefits</button>
              <button onClick={() => scrollToSection("how-it-works")} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">How It Works</button>
              <button onClick={() => scrollToSection("use-cases")} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Use Cases</button>
              <Link href="/login" className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors">Sign In</Link>
              <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blueDark px-4 py-2 rounded-full transition-all hover:shadow-lift">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              {mobileMenuOpen ? <X size={20} /> : <div className="w-5 h-0.5 bg-neutral-700 rounded" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              {["Problem", "Solution", "Benefits", "How It Works", "Use Cases"].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase().replace(/\\s+/g, "-"))} className="block w-full text-left text-sm text-neutral-600 hover:text-neutral-900 py-2 transition-colors">
                  {item}
                </button>
              ))}
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                <Link href="/login" className="block text-center text-sm font-semibold text-neutral-700 py-2.5 rounded-full border border-neutral-200 hover:border-neutral-300 transition-colors">Sign In</Link>
                <Link href="/register" className="block text-center text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blueDark py-2.5 rounded-full transition-colors">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─── 1. Hero Section ─── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-brand-blue/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <FadeInSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold tracking-wide uppercase mb-6 border border-brand-blue/20">
              The Future of Pamphlet Distribution
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Replace Traditional Pamphlets with{" "}
              <span className="text-brand-blue">Smart Digital Distribution</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Create, manage, update, and distribute pamphlets digitally while
              tracking engagement in real time. No printing. No distribution
              costs. No waste.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
             
              <button
                onClick={() => scrollToSection("solution")}
                className="inline-flex items-center gap-2 text-neutral-700 font-semibold px-8 py-3.5 rounded-full border border-neutral-200 hover:border-neutral-300 transition-all text-base"
              >
                See How It Works <ChevronRight size={16} />
              </button>
            </div>

            {/* Hero visual: transformation */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="relative bg-white rounded-2xl border border-neutral-100 shadow-soft p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="text-center p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-red-50 flex items-center justify-center mb-3">
                      <FileText size={20} className="text-red-500" />
                    </div>
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Paper</div>
                    <p className="text-sm text-neutral-700 mt-1 font-medium">Static, costly, limited</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <ArrowRight size={24} className="text-brand-blue" />
                  </div>
                  <div className="text-center p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                      <Globe size={20} className="text-brand-blue" />
                    </div>
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Digital</div>
                    <p className="text-sm text-neutral-700 mt-1 font-medium">Dynamic, shareable, instant</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <ArrowRight size={24} className="text-brand-blue" />
                  </div>
                  <div className="text-center p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-green-50 flex items-center justify-center mb-3">
                      <BarChart3 size={20} className="text-green-600" />
                    </div>
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Analytics</p>
                    <p className="text-sm text-neutral-700 mt-1 font-medium">Tracked, measured, optimized</p>
                  </div>
                </div>
                <div className="md:hidden flex items-center justify-center gap-4 my-4">
                  <ArrowRight size={20} className="text-brand-blue" />
                  <ArrowRight size={20} className="text-brand-blue" />
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="relative py-12 border-y border-neutral-100 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <FadeInSection key={i}>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-brand-blue">{s.value}</p>
                <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ─── 2. Problem Section ─── */}
      <section id="problem" className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <SectionHeading
              label="The Problem"
              title="The Cost of Traditional Pamphlets"
              subtitle="Organizations still struggle with expensive printing, manual distribution, and outdated content — with zero insight into performance."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((p, i) => (
              <FadeInSection key={i}>
                <div className="group p-6 rounded-2xl border border-neutral-100 bg-white hover:border-red-100 hover:bg-red-50/30 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                    <p.icon size={18} className="text-red-500" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{p.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Solution Section ─── */}
      <section id="solution" className="py-20 md:py-28 px-4 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <SectionHeading
              label="The Solution"
              title="A Smarter Way to Share Information"
              subtitle="ParchaHub transforms every aspect of pamphlet management — from creation to distribution to analytics."
            />
          </FadeInSection>

          {/* Comparison Table */}
          <FadeInSection>
            <div className="max-w-3xl mx-auto mb-16 bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
              <div className="grid grid-cols-3 border-b border-neutral-100 bg-neutral-50">
                <div className="p-4 text-sm font-semibold text-neutral-400 uppercase tracking-wide text-center"></div>
                <div className="p-4 text-sm font-semibold text-red-500 uppercase tracking-wide text-center border-x border-neutral-100">Traditional</div>
                <div className="p-4 text-sm font-semibold text-green-600 uppercase tracking-wide text-center">ParchaHub</div>
              </div>
              {comparisonData.map((row, i) => (
                <div key={i} className={\`grid grid-cols-3 \${i < comparisonData.length - 1 ? "border-b border-neutral-50" : ""}\`}>
                  <div className="p-4 text-sm text-neutral-700 font-medium">{row.traditional.split(" ")[0]}</div>
                  <div className="p-4 text-sm text-neutral-500 text-center border-x border-neutral-50 flex items-center justify-center gap-2">
                    <X size={14} className="text-red-400 shrink-0" />
                    <span>{row.traditional}</span>
                  </div>
                  <div className="p-4 text-sm text-neutral-900 font-medium text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                    <span>{row.parchahub}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>

          {/* Solution Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {solutions.map((s, i) => (
              <FadeInSection key={i}>
                <div className="p-6 rounded-2xl border border-neutral-100 bg-white hover:border-brand-blue/20 hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <s.icon size={18} className="text-brand-blue" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Product Showcase ─── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <SectionHeading
              label="Platform"
              title="Everything You Need in One Place"
              subtitle="A complete platform for creating, managing, and analyzing your digital pamphlets."
            />
          </FadeInSection>

          <FadeInSection>
            <div className="bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-soft max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {["Dashboard", "Create", "Analytics", "Manage", "Users"].map((tab, i) => (
                  <div key={i} className={\`px-4 py-2 rounded-lg text-xs font-semibold text-center transition-colors \${i === 0 ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white"}\`}>
                    {tab}
                  </div>
                ))}
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                      <BarChart3 size={16} className="text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Dashboard Overview</p>
                      <p className="text-xs text-neutral-400">Last 30 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span>Views: <strong className="text-white">12,847</strong></span>
                    <span>Engagement: <strong className="text-white">34%</strong></span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[{ label: "Total Pamphlets", value: "156", change: "+12%", color: "text-blue-400" },
                    { label: "Total Views", value: "12,847", change: "+8.3%", color: "text-green-400" },
                    { label: "Active Users", value: "1,423", change: "+18.7%", color: "text-purple-400" },
                  ].map((card, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-xs text-neutral-400">{card.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                      <p className={\`text-xs mt-1 \${card.color}\`}>{card.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── 5. Key Benefits ─── */}
      <section id="benefits" className="py-20 md:py-28 px-4 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <SectionHeading
              label="Benefits"
              title="Outcomes That Matter"
              subtitle="Real results for organizations that switch to digital pamphlet distribution."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <FadeInSection key={i}>
                <div className="p-6 rounded-2xl bg-white border border-neutral-100 hover:border-brand-blue/20 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <b.icon size={20} className="text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-blue">{b.stat}</p>
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{b.label}</p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">{b.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. How It Works ─── */}
      <section id="how-it-works" className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <SectionHeading
              label="How It Works"
              title="Three Simple Steps"
              subtitle="Get started with digital pamphlet distribution in minutes."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, i) => (
              <FadeInSection key={i}>
                <div className="relative text-center p-8 rounded-2xl bg-white border border-neutral-100 hover:shadow-soft transition-all duration-300">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                    <step.icon size={24} className="text-brand-blue" />
                  </div>
                  <span className="text-5xl font-black text-brand-blue/10 absolute top-4 right-6 select-none">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
         
        </div>
      </section>

      {/* ─── 7. Use Cases ─── */}
      <section id="use-cases" className="py-20 md:py-28 px-4 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <SectionHeading
              label="Use Cases"
              title="Who Benefits from ParchaHub"
              subtitle="From schools to government agencies, organizations of all types are going digital."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((uc, i) => (
              <FadeInSection key={i}>
                <div className="p-6 rounded-2xl bg-white border border-neutral-100 hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5">
                  <div className={\`w-10 h-10 rounded-xl $\{uc.color} flex items-center justify-center mb-4\`}>
                    <uc.icon size={18} />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">{uc.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{uc.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection>
            <div className="mt-10 text-center">
              <p className="text-sm text-neutral-400 mb-4">And many more organizations across every sector</p>
              <Link href="/register" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:text-brand-blueDark transition-colors">
                See how ParchaHub fits your organization <ArrowRight size={14} />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── 8. Analytics Section ─── */}
      <section id="analytics" className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <SectionHeading
              label="Analytics"
              title="Insights Traditional Pamphlets Can't Provide"
              subtitle="Know exactly how your content performs with real-time analytics and engagement tracking."
            />
          </FadeInSection>

          <FadeInSection>
            <div className="max-w-4xl mx-auto bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-soft">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Views", value: "12,847", icon: BarChart3, change: "+18%", color: "text-blue-400" },
                  { label: "Downloads", value: "3,421", icon: TrendingUp, change: "+12%", color: "text-green-400" },
                  { label: "Engagement Rate", value: "34.2%", icon: Target, change: "+5.4%", color: "text-purple-400" },
                  { label: "Avg. Session", value: "2m 14s", icon: Users, change: "+22%", color: "text-amber-400" },
                ].map((metric, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <metric.icon size={14} className="text-neutral-400 mb-2" />
                    <p className="text-lg md:text-xl font-bold text-white">{metric.value}</p>
                    <p className="text-xs text-neutral-400">{metric.label}</p>
                    <p className={\`text-xs mt-1 $\{metric.color}\`}>{metric.change}</p>
                  </div>
                ))}
              </div>
              {/* Mini chart placeholder */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <p className="text-sm font-semibold text-white mb-4">Views Over Time (Last 30 Days)</p>
                <div className="flex items-end gap-1.5 h-28">
                  {[40, 55, 38, 62, 48, 70, 52, 58, 42, 65, 50, 72, 68, 55, 80, 62, 45, 75, 58, 82, 70, 60, 78, 85, 72, 90, 68, 75, 88, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-brand-blue/30 hover:bg-brand-blue/50 transition-colors" style={{ height: \`$\{h}%\` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-xs text-neutral-500">
                  <span>Day 1</span>
                  <span>Day 15</span>
                  <span>Day 30</span>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── 9. Environmental Impact ─── */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-green-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-6">
                <Leaf size={28} className="text-green-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-4">
                Go Paperless. Make an Impact.
              </h2>
              <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-8">
                Every digital pamphlet saves trees, reduces carbon emissions, and eliminates waste.
                Join thousands of organizations choosing sustainable communication.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="p-5 rounded-2xl bg-white border border-green-100">
                  <p className="text-2xl font-bold text-green-600">10K+</p>
                  <p className="text-sm text-neutral-500 mt-1">Trees saved annually</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-green-100">
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-sm text-neutral-500 mt-1">Less paper waste</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-green-100">
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-sm text-neutral-500 mt-1">Digital, zero waste</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── 10. Testimonials ─── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <SectionHeading
              label="Testimonials"
              title="Trusted by Organizations Worldwide"
              subtitle="Hear from organizations that have transformed their pamphlet distribution."
            />
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <FadeInSection key={i}>
                <div className="p-6 rounded-2xl bg-white border border-neutral-100 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-center gap-1 text-brand-blue mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="border-t border-neutral-100 pt-4">
                    <p className="text-sm font-semibold text-neutral-900">{t.author}</p>
                    <p className="text-xs text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. Featured Pamphlets (from API) ─── */}
      {pamphlets.length > 0 && (
        <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <SectionHeading
                label="Featured"
                title="See ParchaHub in Action"
                subtitle="Browse real pamphlets created by organizations using the platform."
              />
            </FadeInSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pamphlets.slice(0, 6).map((item, i) => {
                const thumbUrl = getThumbnailUrl(item.thumbnail_image);
                return (
                  <FadeInSection key={item.id}>
                    <Link href={\`/pamphlet/$\{item.url_key}\`} className="block group">
                      <article className="p-4 rounded-2xl bg-white border border-neutral-100 hover:shadow-soft transition-all duration-300 hover:-translate-y-1 h-full">
                        {thumbUrl ? (
                          <img src={thumbUrl} alt={item.title} className="w-full aspect-[4/3] rounded-xl object-cover mb-4" />
                        ) : (
                          <div className="w-full aspect-[4/3] rounded-xl bg-neutral-100 flex items-center justify-center text-sm text-neutral-400 mb-4">No image</div>
                        )}
                        <span className="text-xs font-semibold text-brand-blue uppercase tracking-wide">{item.category}</span>
                        <h3 className="mt-1 text-base font-bold text-neutral-900 group-hover:text-brand-blue transition-colors line-clamp-1">{item.title}</h3>
                        <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{item.short_description}</p>
                        <p className="mt-3 text-xs text-neutral-400 flex items-center gap-1">
                          <MapPin size={12} />
                          {item.location?.city || "—"} · {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </article>
                    </Link>
                  </FadeInSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── 12. Final CTA ─── */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blueDark to-blue-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-3xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              The Future of Pamphlet Distribution Starts Here
            </h2>
            <p className="mt-6 text-lg text-blue-100/80 max-w-xl mx-auto leading-relaxed">
              Join thousands of organizations already saving time, money, and resources with digital pamphlets.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
           
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-all text-base"
              >
                Learn More <ChevronRight size={16} />
              </button>
            </div>
            <p className="mt-6 text-sm text-blue-100/60">No credit card required. Free plan available.</p>
          </FadeInSection>
        </div>
      </section>

    </div>
  );
};

export default Home;
`;

const targetPath = '/home/roshan-neupane/projects/parchahub/storefront-pamphlet/src/modules/Home/index.tsx';
fs.writeFileSync(targetPath, content, 'utf-8');
console.log('Written to', targetPath);
console.log('Size:', Buffer.byteLength(content, 'utf-8'), 'bytes');

