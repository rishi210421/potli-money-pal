export type Question = { q: string; opts: string[]; ans: number; tip: string };
export type Category = {
  slug: string;
  emoji: string;
  title: string;
  blurb: string;
  color: string;
  questions: Question[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "budgeting",
    emoji: "📊",
    title: "Budgeting Basics",
    blurb: "Plan smarter, spend smarter",
    color: "var(--potli-green-soft)",
    questions: [
      { q: "In the 50-30-20 rule, what % goes to savings?", opts: ["10%", "20%", "30%", "50%"], ans: 1, tip: "20% savings is the cornerstone of the 50-30-20 rule." },
      { q: "The 50% in 50-30-20 covers…", opts: ["Wants", "Needs", "Savings", "Investments"], ans: 1, tip: "Needs = rent, food, transport, bills." },
      { q: "Best time to set a monthly budget?", opts: ["Mid-month", "End of month", "Start of month", "When broke"], ans: 2, tip: "Plan before you spend, not after." },
      { q: "An emergency fund should cover…", opts: ["1 day", "1 week", "3–6 months", "10 years"], ans: 2, tip: "Aim for 3–6 months of essential expenses." },
      { q: "Zero-based budgeting means…", opts: ["Spend ₹0", "Every ₹ has a job", "Save everything", "Track only food"], ans: 1, tip: "Income − Allocations = 0. Every rupee assigned." },
      { q: "Fixed expense example?", opts: ["Movie tickets", "Hostel rent", "Shopping", "Eating out"], ans: 1, tip: "Rent is fixed; entertainment is variable." },
      { q: "Best way to track expenses?", opts: ["Memory", "Daily app log", "Once a year", "Don't"], ans: 1, tip: "Daily logging beats month-end guesswork." },
      { q: "If you overspend on food, you should…", opts: ["Ignore it", "Cut another category", "Borrow more", "Skip rent"], ans: 1, tip: "Rebalance — every category is connected." },
      { q: "A budget should be reviewed…", opts: ["Never", "Yearly", "Monthly", "Only when in trouble"], ans: 2, tip: "Monthly reviews keep budgets realistic." },
      { q: "What's lifestyle inflation?", opts: ["Cheaper life", "Spending more as income grows", "Tax", "Loan"], ans: 1, tip: "Income up + spending up = savings flat." },
    ],
  },
  {
    slug: "saving",
    emoji: "🪙",
    title: "Saving Money",
    blurb: "Small habits, big stack",
    color: "var(--potli-yellow-soft, #FFF4B0)",
    questions: [
      { q: "Saving ₹50/day for a year is roughly…", opts: ["₹3,650", "₹18,250", "₹5,000", "₹50,000"], ans: 1, tip: "50 × 365 = ₹18,250 🎉" },
      { q: "Best place for short-term savings?", opts: ["Stocks", "Savings account", "Cash under bed", "Crypto"], ans: 1, tip: "Safe + liquid wins for short-term." },
      { q: "What is 'pay yourself first'?", opts: ["Buy yourself gifts", "Save before spending", "Eat first", "Spend first"], ans: 1, tip: "Auto-save on payday before bills hit." },
      { q: "Compound interest works best with…", opts: ["Short time", "Long time", "Spending", "Loans"], ans: 1, tip: "Time is the magic ingredient." },
      { q: "A recurring deposit is…", opts: ["A loan", "Monthly fixed saving", "A scam", "A credit card"], ans: 1, tip: "RD = monthly savings earning fixed interest." },
      { q: "Cheapest student saving hack?", opts: ["Cook 1 meal/day", "Order daily", "Buy new clothes", "Take cabs"], ans: 0, tip: "Home cooking can save ₹3000+/month." },
      { q: "Emergency fund should be kept in…", opts: ["Stocks", "Liquid savings", "Real estate", "Crypto"], ans: 1, tip: "Must be accessible within hours." },
      { q: "The ₹100 jar trick teaches…", opts: ["Greed", "Consistency", "Luck", "Investing"], ans: 1, tip: "Small consistent action > large bursts." },
      { q: "Savings rate of 20% means…", opts: ["Spend 20%", "Save 20% of income", "Earn 20%", "Borrow 20%"], ans: 1, tip: "Save 20 out of every 100 you earn." },
      { q: "Best way to beat impulse buys?", opts: ["Buy now", "24-hour wait rule", "Borrow", "Spend more"], ans: 1, tip: "Sleep on it — most urges fade by morning." },
    ],
  },
  {
    slug: "student-finance",
    emoji: "🎓",
    title: "Student Finance",
    blurb: "Loans, IDs, scholarships",
    color: "#E5F0FF",
    questions: [
      { q: "Best discount source for students?", opts: ["Student ID cards", "Random coupons", "Nothing", "Friends"], ans: 0, tip: "Flash your student ID — discounts everywhere." },
      { q: "Education loan interest typically starts…", opts: ["Day 1", "After course + grace", "Never", "After 10 years"], ans: 1, tip: "Most have a 6–12 month moratorium." },
      { q: "Scholarships are usually…", opts: ["Loans", "Free money for merit/need", "Taxes", "Fees"], ans: 1, tip: "Free money — apply to every one you qualify for." },
      { q: "A credit score is built by…", opts: ["Saving cash", "Responsible credit use", "Spending more", "Avoiding banks"], ans: 1, tip: "On-time payments + low utilization." },
      { q: "First credit card tip?", opts: ["Max it out", "Pay full balance monthly", "Skip payments", "Buy luxuries"], ans: 1, tip: "Pay full to avoid 30%+ interest." },
      { q: "UPI scam red flag?", opts: ["Receiving money needs PIN", "Sending needs PIN", "Free coffee", "QR from friend"], ans: 0, tip: "You NEVER enter PIN to receive money." },
      { q: "Safe place to store passwords?", opts: ["Notes app", "Password manager", "WhatsApp", "Sticky note"], ans: 1, tip: "Use a real password manager." },
      { q: "Best part-time income for students?", opts: ["Gambling", "Freelancing/tutoring", "Quick loans", "MLM schemes"], ans: 1, tip: "Skill-based work compounds for life." },
      { q: "Hostel mess fee is a…", opts: ["Want", "Need", "Investment", "Tax"], ans: 1, tip: "Food = need. Eating out daily = want." },
      { q: "Loan EMI shouldn't exceed…", opts: ["80% income", "50% income", "30–40% income", "100% income"], ans: 2, tip: "Keep EMIs under 40% of monthly income." },
    ],
  },
  {
    slug: "smart-spending",
    emoji: "🧠",
    title: "Smart Spending",
    blurb: "Spend without regret",
    color: "#FFE9E9",
    questions: [
      { q: "Cheapest way to eat well as a student?", opts: ["Order daily", "Cook at home", "Skip meals", "Fancy cafe"], ans: 1, tip: "Cooking saves money AND is healthier." },
      { q: "Before buying online, you should…", opts: ["Buy fast", "Compare prices", "Borrow", "Buy 2x"], ans: 1, tip: "Compare across apps; use price-history tools." },
      { q: "BNPL (Buy Now Pay Later) is risky because…", opts: ["It's free", "Easy to overspend", "Saves money", "Earns interest"], ans: 1, tip: "Hidden debt that snowballs fast." },
      { q: "A 'sale' is a good deal only if…", opts: ["You needed it", "It's cheap", "Influencer said so", "It's trending"], ans: 0, tip: "70% off something you don't need = 100% waste." },
      { q: "Subscription audit means…", opts: ["Buy more", "Cancel unused subs", "Share Netflix", "Pay yearly"], ans: 1, tip: "Most students leak ₹500+/month here." },
      { q: "Best way to handle peer pressure spending?", opts: ["Join in", "Suggest cheaper plans", "Skip friends", "Take a loan"], ans: 1, tip: "Suggest budget-friendly hangouts — most agree." },
      { q: "Cashback is only worth it if…", opts: ["You'd buy anyway", "It's 1%", "You spend extra", "Always"], ans: 0, tip: "Never spend ₹100 to 'earn' ₹5 cashback." },
      { q: "Cheapest college transport?", opts: ["Cabs", "Public transport/cycle", "Bike rental daily", "Rideshare app"], ans: 1, tip: "Bus pass + cycle = ₹0 marginal cost." },
      { q: "Best mindset before big purchases?", opts: ["YOLO", "Need vs Want check", "Borrow first", "Buy 2"], ans: 1, tip: "Ask: 'Will I use this in 30 days?'" },
      { q: "Smart spending is about…", opts: ["Never spending", "Spending on what matters", "Hoarding", "Showing off"], ans: 1, tip: "Spend boldly on value, ruthlessly cut waste." },
    ],
  },
];

export function getCategory(slug: string): Category {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}
