export const STATS = [
  { value: "2-sided", label: "Verification" },
  { value: "10+", label: "Work categories" },
  { value: "Escrow-ready", label: "Built to grow" },
  { value: "Human", label: "Admin review" },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    icon: "ShieldCheck",
    title: "Sign up & get verified",
    body: "Clients and designers both create an account, complete their profile, and get reviewed by our admin team. Trust on both sides.",
  },
  {
    icon: "Briefcase",
    title: "Post or discover work",
    body: "Clients post a job with budget and details. Once approved it goes live to our verified designer community — no phone calls needed.",
  },
  {
    icon: "MessageSquareText",
    title: "Match & get it done",
    body: "Designers apply with a pitch and price. Clients pick the best fit, agree on terms, and the work gets delivered.",
  },
] as const;

export const CLIENT_FEATURES = [
  "Post a job in minutes",
  "Compare designers, portfolios & prices",
  "No upfront negotiation over the phone",
  "Pay the designer directly once you agree",
] as const;

export const DESIGNER_FEATURES = [
  "Showcase your skills & portfolio",
  "Get a trusted verified badge",
  "Apply to jobs that match your craft",
  "Grow your reputation with every project",
] as const;

export const ALEPH_FAQS = [
  {
    question: "What is alephjobs?",
    answer:
      "alephjobs is a platform built to bridge the gap between talented professionals and top-tier employers. We streamline job posting, hiring, and collaboration into one seamless experience.",
  },
  {
    question: "How do I get hired as a talent on alephjobs?",
    answer:
      "Create your profile, showcase your portfolio or expertise, and apply directly to verified job postings. Employers can also discover your profile and reach out directly with offers.",
  },
  {
    question: "How can employers post a job?",
    answer:
      "Employers can sign up, select the job category, and publish listings within minutes. You'll receive applications from verified candidates ready to work.",
  },
  {
    question: "Is alephjobs free to use?",
    answer:
      "Creating an account, exploring listings, and setting up a candidate profile are free. We offer flexible options for employers looking to feature job listings for maximum reach.",
  },
  {
    question: "How are candidate profiles verified?",
    answer:
      "We review submitted portfolios, skill sets, and work history to maintain high standards across all listed professionals on the platform.",
  },
  {
    question: "What types of roles can I find or post on alephjobs?",
    answer:
      "We support a wide variety of roles spanning design, development, marketing, writing, management, and other digital and creative disciplines.",
  },
] as const;


export const PREVIEW_JOBS = [
  {
    title: "Logo for coffee brand",
    cat: "Logo & Branding",
    budget: "3,000 ETB",
    apps: 7,
    accent: "text-primary bg-primary/10",
  },
  {
    title: "Instagram post pack",
    cat: "Social Media",
    budget: "1,500 ETB",
    apps: 12,
    accent: "text-coral bg-coral/10",
  },
  {
    title: "Event poster design",
    cat: "Poster & Flyer",
    budget: "Negotiable",
    apps: 4,
    accent: "text-mint bg-mint/15",
  },
] as const;