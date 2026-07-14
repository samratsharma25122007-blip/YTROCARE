/* Centralised content for RO Care India. Keeps components clean and reusable. */

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

/** Dynamic captions that cross-fade over the scroll-scrubbed video. */
export const STORY_CAPTIONS = [
  "Pure Water Starts Here",
  "Your Filters Begin Collecting Impurities",
  "Minerals Start Building Up",
  "Bacteria Can Multiply",
  "Water Flow Starts Slowing",
  "Taste Begins Changing",
  "Your Family Drinks Less Safe Water",
  "It's Time To Service Your RO",
] as const;

export const WHY_MATTERS = [
  {
    title: "Longer Filter Life",
    body: "Routine servicing clears sediment before it clogs your membranes — so every filter lasts the way it was engineered to.",
    metric: "2×",
    metricLabel: "filter lifespan",
  },
  {
    title: "Better Water Taste",
    body: "Fresh carbon and a clean tank strip away the flat, metallic notes that build up over months of neglect.",
    metric: "100%",
    metricLabel: "fresh taste restored",
  },
  {
    title: "Healthier Drinking Water",
    body: "A serviced RO removes what it's supposed to — bacteria, heavy metals and dissolved impurities your family shouldn't drink.",
    metric: "0",
    metricLabel: "compromises on safety",
  },
] as const;

export const SERVICE_COMPONENTS = [
  { name: "Pre Filter", desc: "First line of defence against coarse sediment.", x: 12, y: 22 },
  { name: "Sediment Filter", desc: "Traps fine dust, sand and rust particles.", x: 30, y: 40 },
  { name: "Carbon Filter", desc: "Removes chlorine, odour and organic compounds.", x: 20, y: 66 },
  { name: "RO Membrane", desc: "The heart — filters dissolved salts and heavy metals.", x: 50, y: 30 },
  { name: "UF Membrane", desc: "Blocks bacteria and cysts down to 0.01 micron.", x: 68, y: 52 },
  { name: "UV Chamber", desc: "Deactivates living micro-organisms with UV-C light.", x: 82, y: 28 },
  { name: "Copper Cartridge", desc: "Infuses water with the goodness of copper.", x: 44, y: 70 },
  { name: "Tank Cleaning", desc: "Full sanitisation of the storage tank.", x: 74, y: 74 },
  { name: "Pump Inspection", desc: "Checks pressure, flow and motor health.", x: 58, y: 14 },
  { name: "Leak Testing", desc: "Every joint pressure-tested before we leave.", x: 34, y: 12 },
] as const;

export const PROCESS_STEPS = [
  { title: "Book Service", desc: "Pick a slot in under a minute. No calls, no waiting." },
  { title: "Engineer Assigned", desc: "A certified RO Care India engineer is matched to your area." },
  { title: "Home Visit", desc: "Doorstep arrival at your preferred time — every time." },
  { title: "Professional Cleaning", desc: "Genuine parts, calibrated tools, meticulous care." },
  { title: "Water Testing", desc: "TDS and flow verified in front of you." },
  { title: "Healthy Water", desc: "Your RO performs like the day it was installed." },
] as const;

export const PRICING = [
  {
    tier: "Basic",
    price: "₹499",
    cadence: "per visit",
    tagline: "Essential check-up",
    features: [
      "Full external cleaning",
      "Filter inspection",
      "TDS water testing",
      "Leak check",
      "30-day service warranty",
    ],
    highlight: false,
  },
  {
    tier: "Premium",
    price: "₹1,299",
    cadence: "per visit",
    tagline: "The complete overhaul",
    features: [
      "Everything in Standard",
      "RO + UF membrane service",
      "Copper cartridge care",
      "Deep tank sanitisation",
      "Pump & motor tuning",
      "90-day service warranty",
      "Priority same-day slots",
    ],
    highlight: true,
  },
  {
    tier: "Standard",
    price: "₹849",
    cadence: "per visit",
    tagline: "Most popular",
    features: [
      "Everything in Basic",
      "Sediment + carbon change",
      "Tank cleaning",
      "UV chamber service",
      "60-day service warranty",
    ],
    highlight: false,
  },
] as const;

export const REVIEWS = [
  {
    name: "Ananya Sharma",
    role: "Bengaluru",
    rating: 5,
    quote:
      "Genuinely felt like an Apple unboxing. The engineer arrived on time, showed me the TDS before and after — water tastes brand new.",
    avatar: "AS",
  },
  {
    name: "Rahul Mehta",
    role: "Mumbai",
    rating: 5,
    quote:
      "I had no idea my filters were this dirty. Booked in a minute, serviced the same day. This is how every service should feel.",
    avatar: "RM",
  },
  {
    name: "Priya Nair",
    role: "Pune",
    rating: 5,
    quote:
      "Transparent pricing, certified engineer, genuine parts. My RO flow doubled after the service. Absolutely worth it.",
    avatar: "PN",
  },
  {
    name: "Vikram Singh",
    role: "Delhi",
    rating: 5,
    quote:
      "The whole experience is premium — from the booking page to the doorstep. RO Care India has earned a customer for life.",
    avatar: "VS",
  },
] as const;

export const WHY_CHOOSE = [
  { title: "Certified Engineers", icon: "shield" },
  { title: "Same Day Service", icon: "bolt" },
  { title: "Affordable Pricing", icon: "tag" },
  { title: "Doorstep Service", icon: "home" },
  { title: "Warranty", icon: "check" },
  { title: "Genuine Parts", icon: "cog" },
  { title: "Trusted By Thousands", icon: "heart" },
] as const;

export const FAQS = [
  {
    q: "How often should I service my RO purifier?",
    a: "For most households we recommend a full service every 6 months, or sooner if you notice slower flow, a change in taste, or a rise in TDS. Hard-water areas may benefit from more frequent care.",
  },
  {
    q: "Do you use genuine parts?",
    a: "Always. Every filter, membrane and cartridge we fit is genuine and sealed. We show you each part before installation and hand over the old ones.",
  },
  {
    q: "Is same-day service really possible?",
    a: "Yes. Book before 2 PM in a serviceable area and a certified engineer will typically reach you the same day, subject to slot availability.",
  },
  {
    q: "What brands do you service?",
    a: "All major RO brands — Kent, Aquaguard, Pureit, Livpure, Blue Star, AO Smith and more. Just tell us your brand and model when booking.",
  },
  {
    q: "Is there any warranty on the service?",
    a: "Every service carries a warranty of 30 to 90 days depending on your plan. If anything isn't right, we return and fix it free of charge.",
  },
  {
    q: "How is the pricing decided?",
    a: "Pricing is fixed and transparent by plan — no surprise charges at your doorstep. Any additional parts, if ever needed, are approved by you first.",
  },
] as const;

export const CONTACT = {
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "rocareindia123@gmail.com",
} as const;

/**
 * Path to the scroll-scrubbed story video.
 * Drop your rendered clip at: public/videos/ro-story.mp4
 */
export const STORY_VIDEO_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/videos/ro-story.mp4`;
