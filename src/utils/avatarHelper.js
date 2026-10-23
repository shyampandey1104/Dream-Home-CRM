// Utility to accurately detect gender and return high-quality vector illustrated Boy/Girl Avatar Icons

const FEMALE_NAMES = new Set([
  "pooja", "kavita", "sneha", "ananya", "nisha", "radhika", "priya", "neha", "ritu",
  "swati", "shreya", "divya", "aarti", "simran", "tanya", "sunita", "geeta", "meena",
  "anita", "rashmi", "preeti", "deepika", "priyanka", "sonali", "komal", "payal", "megha",
  "anjali", "kriti", "shruti", "aditi", "sonia", "sheetal", "roshni", "isha", "pallavi",
  "smita", "tanvi", "sangeeta", "kajal", "barkha", "bhavna", "vandana", "archana", "sakshi",
  "alia", "kiara", "tara", "kareena", "katrina", "riya", "rekha", "dimple", "shweta", "mona",
  "juhi", "madhuri", "sushmita", "aishwarya", "bipasha", "vidya", "tabu", "rani", "kajol",
  "shilpa", "karisma", "malaika", "dia", "urvashi", "jacqueline", "nora", "tamannaah", "samantha",
  "rashmika", "trisha", "nayanthara", "sai", "keerthy", "poornima", "laxmi", "lakshmi", "saraswati",
  "parvati", "durga", "chhaya", "maya", "leela", "kamla", "sarita", "pushpa", "sushila", "santosh",
  "asha", "usha", "rekha", "manju", "anita", "sunita", "babita", "kavita", "lalita", "mamta", "sapna"
]);

const MALE_NAMES = new Set([
  "aarav", "rohan", "vikram", "deepak", "rahul", "siddharth", "vikramaditya", "shyam",
  "amit", "raj", "rohit", "aditya", "rajesh", "suresh", "ramesh", "manish", "kunal",
  "sameer", "gaurav", "nikhil", "mohit", "yash", "abhishek", "arjun", "vivek", "sachin",
  "ajay", "vijay", "sunil", "anil", "pankaj", "vikas", "rakesh", "manoj", "dharmendra",
  "sanjay", "karan", "ashish", "akash", "harsh", "varun", "ayush", "kabir", "dev", "dhruv",
  "reyansh", "vihaan", "shaurya", "atharv", "rudra", "krrish", "ayan", "pranav", "rishi",
  "neeraj", "alok", "hemant", "chetan", "sumit", "sourabh", "saurabh", "vinay", "vipul",
  "tarun", "deep", "aman", "kartik", "chirag", "tushar", "bhavesh", "hitesh", "jitesh", "kamlesh",
  "mahesh", "naresh", "paresh", "yogesh", "mukesh", "dinesh", "umesh", "ganesh", "santosh", "ashok",
  "vinod", "pramod", "subhash", "prakash", "jagdish", "satish", "harish", "girish", "anil", "sunil"
]);

export function detectGender(name) {
  if (!name) return "male";
  const clean = name.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return "male";

  if (FEMALE_NAMES.has(clean)) return "female";
  if (MALE_NAMES.has(clean)) return "male";

  // Common Indian feminine name suffixes
  if (
    clean.endsWith("ita") ||
    clean.endsWith("ika") ||
    clean.endsWith("iya") ||
    clean.endsWith("sha") ||
    clean.endsWith("nya") ||
    clean.endsWith("ti") ||
    clean.endsWith("ni") ||
    clean.endsWith("shi") ||
    clean.endsWith("ree") ||
    clean.endsWith("ka")
  ) {
    // Exceptions like 'Surya', 'Shiva', 'Krishna'
    if (["surya", "shiva", "krishna", "rama", "brahma"].includes(clean)) {
      return "male";
    }
    return "female";
  }

  return "male";
}

// 1. BOY AVATAR 1 (Modern Executive Male with Indigo Gradient)
const BOY_SVG_1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bgM1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="skM1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fdba74"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bgM1)"/>
  <path d="M22 88 C22 68, 34 63, 50 63 C66 63, 78 68, 78 88 Z" fill="#1e293b"/>
  <polygon points="50,75 42,63 58,63" fill="#ffffff"/>
  <polygon points="50,83 46,67 54,67" fill="#ef4444"/>
  <rect x="44" y="54" width="12" height="12" rx="2" fill="url(#skM1)"/>
  <circle cx="50" cy="42" r="18" fill="url(#skM1)"/>
  <circle cx="32" cy="43" r="4" fill="url(#skM1)"/>
  <circle cx="68" cy="43" r="4" fill="url(#skM1)"/>
  <circle cx="43" cy="41" r="2.5" fill="#0f172a"/>
  <circle cx="57" cy="41" r="2.5" fill="#0f172a"/>
  <path d="M44 49 Q50 54 56 49" fill="none" stroke="#9a3412" stroke-width="2" stroke-linecap="round"/>
  <path d="M30 38 C30 24, 40 18, 52 18 C64 18, 70 24, 70 36 C70 38, 66 32, 60 30 C52 28, 44 32, 30 38 Z" fill="#0f172a"/>
</svg>`;

// 2. BOY AVATAR 2 (Tech Professional Male with Emerald/Teal Gradient)
const BOY_SVG_2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bgM2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="skM2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fbcfe8"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bgM2)"/>
  <path d="M22 88 C22 69, 34 64, 50 64 C66 64, 78 69, 78 88 Z" fill="#065f46"/>
  <polygon points="50,74 43,64 57,64" fill="#d1fae5"/>
  <rect x="44" y="54" width="12" height="12" rx="2" fill="url(#skM2)"/>
  <circle cx="50" cy="42" r="18" fill="url(#skM2)"/>
  <circle cx="32" cy="43" r="4" fill="url(#skM2)"/>
  <circle cx="68" cy="43" r="4" fill="url(#skM2)"/>
  <!-- Glasses -->
  <circle cx="43" cy="41" r="5" fill="none" stroke="#0f172a" stroke-width="1.8"/>
  <circle cx="57" cy="41" r="5" fill="none" stroke="#0f172a" stroke-width="1.8"/>
  <line x1="48" y1="41" x2="52" y2="41" stroke="#0f172a" stroke-width="1.8"/>
  <circle cx="43" cy="41" r="2" fill="#0f172a"/>
  <circle cx="57" cy="41" r="2" fill="#0f172a"/>
  <path d="M45 50 Q50 54 55 50" fill="none" stroke="#9a3412" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Wavy Modern Hair -->
  <path d="M31 37 C31 22, 42 17, 51 17 C62 17, 70 23, 69 36 C64 30, 54 28, 45 29 C36 30, 33 34, 31 37 Z" fill="#1e1b4b"/>
</svg>`;

// 3. BOY AVATAR 3 (Casual Cool Male with Royal Violet Gradient)
const BOY_SVG_3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bgM3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <linearGradient id="skM3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffedd5"/>
      <stop offset="100%" stop-color="#fed7aa"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bgM3)"/>
  <path d="M22 88 C22 68, 34 63, 50 63 C66 63, 78 68, 78 88 Z" fill="#18181b"/>
  <polygon points="50,73 44,63 56,63" fill="#e0e7ff"/>
  <rect x="44" y="54" width="12" height="12" rx="2" fill="url(#skM3)"/>
  <circle cx="50" cy="42" r="18" fill="url(#skM3)"/>
  <circle cx="32" cy="43" r="4" fill="url(#skM3)"/>
  <circle cx="68" cy="43" r="4" fill="url(#skM3)"/>
  <circle cx="43" cy="41" r="2.5" fill="#0f172a"/>
  <circle cx="57" cy="41" r="2.5" fill="#0f172a"/>
  <path d="M44 49 Q50 54 56 49" fill="none" stroke="#9a3412" stroke-width="2" stroke-linecap="round"/>
  <!-- Spiky / Clean Crop Hair -->
  <path d="M30 36 C30 22, 42 16, 52 16 C63 16, 70 23, 70 36 C65 31, 56 26, 46 27 C37 28, 33 32, 30 36 Z" fill="#312e81"/>
</svg>`;

// 4. GIRL AVATAR 1 (Professional Female with Rose/Pink Gradient)
const GIRL_SVG_1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bgF1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#be185d"/>
    </linearGradient>
    <linearGradient id="skF1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffedd5"/>
      <stop offset="100%" stop-color="#fed7aa"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bgF1)"/>
  <!-- Hair Behind (Long Hair) -->
  <path d="M26 36 C24 55, 26 75, 34 82 C35 72, 35 60, 36 50 Z" fill="#18181b"/>
  <path d="M74 36 C76 55, 74 75, 66 82 C65 72, 65 60, 64 50 Z" fill="#18181b"/>
  <path d="M24 88 C24 69, 35 64, 50 64 C65 64, 76 69, 76 88 Z" fill="#4c1d95"/>
  <polygon points="50,75 43,64 57,64" fill="url(#skF1)"/>
  <rect x="45" y="55" width="10" height="12" rx="2" fill="url(#skF1)"/>
  <circle cx="50" cy="42" r="17" fill="url(#skF1)"/>
  <!-- Gold Earrings -->
  <circle cx="33" cy="45" r="2.5" fill="#facc15"/>
  <circle cx="67" cy="45" r="2.5" fill="#facc15"/>
  <circle cx="44" cy="41" r="2.2" fill="#0f172a"/>
  <circle cx="56" cy="41" r="2.2" fill="#0f172a"/>
  <path d="M44 49 Q50 54 56 49" fill="none" stroke="#be123c" stroke-width="2" stroke-linecap="round"/>
  <!-- Front Hair with Bangs -->
  <path d="M30 38 C30 22, 42 16, 52 16 C66 16, 72 24, 72 38 C68 32, 58 26, 48 26 C38 26, 32 32, 30 38 Z" fill="#18181b"/>
</svg>`;

// 5. GIRL AVATAR 2 (Corporate Female with Purple Gradient & Ponytail)
const GIRL_SVG_2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bgF2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#7e22ce"/>
    </linearGradient>
    <linearGradient id="skF2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff1f2"/>
      <stop offset="100%" stop-color="#fecdd3"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bgF2)"/>
  <!-- High Ponytail on Right -->
  <ellipse cx="68" cy="30" rx="9" ry="14" fill="#27272a" transform="rotate(25 68 30)"/>
  <path d="M24 88 C24 70, 35 64, 50 64 C65 64, 76 70, 76 88 Z" fill="#0f766e"/>
  <polygon points="50,73 44,64 56,64" fill="#ccfbf1"/>
  <rect x="45" y="54" width="10" height="12" rx="2" fill="url(#skF2)"/>
  <circle cx="50" cy="42" r="17" fill="url(#skF2)"/>
  <!-- Pearl Earrings -->
  <circle cx="33" cy="44" r="2.5" fill="#ffffff"/>
  <circle cx="67" cy="44" r="2.5" fill="#ffffff"/>
  <!-- Glasses -->
  <circle cx="43" cy="41" r="4.8" fill="none" stroke="#be185d" stroke-width="1.8"/>
  <circle cx="57" cy="41" r="4.8" fill="none" stroke="#be185d" stroke-width="1.8"/>
  <line x1="48" y1="41" x2="52" y2="41" stroke="#be185d" stroke-width="1.8"/>
  <circle cx="43" cy="41" r="2" fill="#0f172a"/>
  <circle cx="57" cy="41" r="2" fill="#0f172a"/>
  <path d="M45 50 Q50 54 55 50" fill="none" stroke="#be123c" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Sleek Hair Cut -->
  <path d="M31 36 C31 23, 42 17, 52 17 C64 17, 70 23, 70 36 C66 30, 56 26, 47 27 C38 28, 33 32, 31 36 Z" fill="#27272a"/>
</svg>`;

// 6. GIRL AVATAR 3 (Warm Professional Female with Coral Gradient)
const GIRL_SVG_3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bgF3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </linearGradient>
    <linearGradient id="skF3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffedd5"/>
      <stop offset="100%" stop-color="#fed7aa"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bgF3)"/>
  <!-- Shoulder Length Curly Hair -->
  <path d="M26 36 C22 52, 25 72, 33 76 C35 68, 34 56, 36 48 Z" fill="#3f3f46"/>
  <path d="M74 36 C78 52, 75 72, 67 76 C65 68, 66 56, 64 48 Z" fill="#3f3f46"/>
  <path d="M24 88 C24 70, 35 64, 50 64 C65 64, 76 70, 76 88 Z" fill="#0369a1"/>
  <polygon points="50,75 43,64 57,64" fill="url(#skF3)"/>
  <rect x="45" y="54" width="10" height="12" rx="2" fill="url(#skF3)"/>
  <circle cx="50" cy="42" r="17" fill="url(#skF3)"/>
  <!-- Ruby Earrings -->
  <circle cx="33" cy="45" r="2.5" fill="#f43f5e"/>
  <circle cx="67" cy="45" r="2.5" fill="#f43f5e"/>
  <circle cx="44" cy="41" r="2.2" fill="#0f172a"/>
  <circle cx="56" cy="41" r="2.2" fill="#0f172a"/>
  <path d="M44 49 Q50 54 56 49" fill="none" stroke="#be123c" stroke-width="2" stroke-linecap="round"/>
  <!-- Wavy Crown Hair -->
  <path d="M29 38 C29 22, 42 16, 52 16 C66 16, 72 24, 72 38 C68 32, 58 26, 48 26 C38 26, 32 32, 29 38 Z" fill="#3f3f46"/>
</svg>`;

const toDataUri = (svgStr) => `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;

const BOY_AVATARS = [
  toDataUri(BOY_SVG_1),
  toDataUri(BOY_SVG_2),
  toDataUri(BOY_SVG_3)
];

const GIRL_AVATARS = [
  toDataUri(GIRL_SVG_1),
  toDataUri(GIRL_SVG_2),
  toDataUri(GIRL_SVG_3)
];

/**
 * Returns accurate Boy or Girl vector avatar icon based on client name
 */
export function getLeadAvatar(nameOrLead, index = 0) {
  const name = typeof nameOrLead === "string" ? nameOrLead : (nameOrLead?.name || nameOrLead?.lead_name || "");
  const gender = detectGender(name);
  
  const hash = Math.abs(
    (name || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), index)
  );

  if (gender === "female") {
    return GIRL_AVATARS[hash % GIRL_AVATARS.length];
  }
  return BOY_AVATARS[hash % BOY_AVATARS.length];
}
