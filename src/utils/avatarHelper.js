// Utility to accurately detect gender across all Indian & International names
// and strictly return high-quality vector illustrated Boy/Girl Avatar Icons

const FEMALE_NAMES = new Set([
  // Popular Hindu & North Indian Female Names
  "pooja", "kavita", "sneha", "ananya", "nisha", "radhika", "priya", "neha", "ritu",
  "swati", "shreya", "divya", "aarti", "simran", "tanya", "sunita", "geeta", "meena",
  "anita", "rashmi", "preeti", "deepika", "priyanka", "sonali", "komal", "payal", "megha",
  "anjali", "kriti", "shruti", "aditi", "sonia", "sheetal", "roshni", "isha", "pallavi",
  "smita", "tanvi", "sangeeta", "kajal", "barkha", "bhavna", "vandana", "archana", "sakshi",
  "alia", "kiara", "tara", "kareena", "katrina", "riya", "rekha", "dimple", "shweta", "mona",
  "juhi", "madhuri", "sushmita", "aishwarya", "bipasha", "vidya", "tabu", "rani", "kajol",
  "shilpa", "karisma", "malaika", "dia", "urvashi", "jacqueline", "nora", "tamannaah", "samantha",
  "rashmika", "trisha", "nayanthara", "sai", "keerthy", "poornima", "laxmi", "lakshmi", "saraswati",
  "parvati", "durga", "chhaya", "maya", "leela", "kamla", "sarita", "pushpa", "sushila",
  "asha", "usha", "manju", "babita", "lalita", "mamta", "sapna", "meera", "deepa", "anamika",
  "kanchan", "kirti", "jaya", "hema", "karuna", "alpa", "amita", "ashta", "bina", "chitra",
  "daksha", "damini", "ela", "falguni", "gita", "heena", "indira", "jasmin", "jyoti", "kiranmayi",
  "latika", "malati", "namrata", "prabha", "radha", "saroj", "uma", "veena", "shikha", "richa",
  "garima", "mansi", "apoorva", "ankita", "monika", "anupama", "alka", "renu", "seema", "reena",
  "trupti", "smriti", "arpita", "alisha", "avani", "bhumika", "charu", "disha", "ekta", "gayatri",
  "harshita", "ishita", "jagriti", "kalpana", "lavanya", "mahima", "nandini", "ojasvi", "prerna",
  "ragini", "rupali", "saloni", "tanushree", "upasana", "vidhi", "yamini", "zeenat",
  // Muslim / Urdu Female Names
  "zarina", "zoya", "fatima", "ayesha", "maryam", "sana", "samina", "shabana", "parveen", "nasreen",
  "yasmin", "rubina", "farha", "nazia", "sultana", "heena", "samreen", "bushra", "zainab", "alina",
  // Christian Female Names
  "mary", "rosy", "maria", "elizabeth", "ann", "anna", "jessica", "rebecca", "sandra", "nancy",
  "rachel", "stella", "grace", "sharon", "teresa", "monica", "daisy", "cynthia", "angela", "rita",
  // Marathi & Gujarati Female Names
  "pranita", "sayali", "mrunal", "tejaswini", "kasturi", "vaishali", "ashwini", "shubhangi", "anagha",
  "ketaki", "tanuja", "siddhi", "riddhi", "pranjal", "rutuja", "kinjal", "hetal", "toral", "dharini"
]);

const MALE_NAMES = new Set([
  // Popular Hindu & North Indian Male Names
  "aarav", "rohan", "vikram", "deepak", "rahul", "siddharth", "vikramaditya", "shyam",
  "amit", "raj", "rohit", "aditya", "rajesh", "suresh", "ramesh", "manish", "kunal",
  "sameer", "gaurav", "nikhil", "mohit", "yash", "abhishek", "arjun", "vivek", "sachin",
  "ajay", "vijay", "sunil", "anil", "pankaj", "vikas", "rakesh", "manoj", "dharmendra",
  "sanjay", "karan", "ashish", "akash", "harsh", "varun", "ayush", "kabir", "dev", "dhruv",
  "reyansh", "vihaan", "shaurya", "atharv", "rudra", "krrish", "ayan", "pranav", "rishi",
  "neeraj", "alok", "hemant", "chetan", "sumit", "sourabh", "saurabh", "vinay", "vipul",
  "tarun", "deep", "aman", "kartik", "chirag", "tushar", "bhavesh", "hitesh", "jitesh", "kamlesh",
  "mahesh", "naresh", "paresh", "yogesh", "mukesh", "dinesh", "umesh", "ganesh", "ashok",
  "vinod", "pramod", "subhash", "prakash", "jagdish", "satish", "harish", "girish",
  "anand", "ratan", "kiran", "alap", "amey", "aniket", "aniruddh", "ankit", "anup", "aravind",
  "arvind", "ashwin", "avinash", "badal", "balram", "bharat", "bipin", "brijesh", "chandan",
  "chinmay", "darshan", "deven", "digvijay", "dilip", "divyansh", "gajendra", "gautam", "govind",
  "hardik", "harit", "himanshu", "ishaan", "jaideep", "jay", "jayant", "jitendra", "kalpesh",
  "kapil", "kaushik", "keshav", "krishna", "kuldeep", "lakshya", "lalit", "madhav", "mangesh",
  "mayur", "milind", "mukul", "nakul", "narendra", "navin", "nihar", "nilesh", "nitin", "omkar",
  "paras", "parth", "piyush", "pradeep", "pramath", "prashant", "prateek", "prem", "raghav",
  "rajiv", "rajan", "ranveer", "ranbir", "rishabh", "ritesh", "ronit", "sagar", "sahil", "samrat",
  "sanket", "sarvesh", "shantanu", "sharad", "shashi", "shivam", "shridhar", "siddhesh", "sohan",
  "somesh", "sparsh", "sudeep", "sudhir", "suraj", "suyash", "tanmay", "tejas", "uday", "ujjwal",
  "utkarsh", "vaibhav", "vatsal", "vedant", "vidyut", "vimal", "viral", "virendra", "vishal", "yuvraj",
  // Muslim / Urdu Male Names
  "faizan", "ali", "ahmed", "ahmad", "mohammed", "mohd", "khan", "salman", "shahrukh", "aamir",
  "imran", "irfan", "saif", "zaheer", "farhan", "tariq", "bilal", "hamza", "adnan", "usman", "omar",
  "rizwan", "sohail", "nadeem", "arbaaz", "asif", "arif", "javed", "rashid", "shabbir", "iqbal",
  // Christian Male Names
  "john", "david", "michael", "george", "peter", "paul", "joseph", "thomas", "anthony", "robert",
  "william", "charles", "richard", "james", "matthew", "mark", "luke", "stephen", "andrew", "philip",
  // Special CRM test names
  "zram", "shyaram", "shyamkumar", "kumar"
]);

const MALE_ENDING_EXCEPTIONS = new Set([
  "shiva", "krishna", "rama", "surya", "brahma", "bappa", "rana", "dhanna", "deva", "ranga", "billa"
]);

const MALE_I_EXCEPTIONS = new Set([
  "ravi", "hari", "rishi", "ali", "giri", "mani", "shri", "balaji", "tirupati"
]);

/**
 * Universal Gender Detection Algorithm for Indian & Global Names
 * Returns "female" for women/girls, "male" for men/boys
 */
export function detectGender(name) {
  if (!name) return "male";
  const raw = name.toLowerCase().trim();
  const words = raw.split(/[\s,._-]+/).filter(Boolean);
  if (!words.length) return "male";

  // 1. Check Explicit Salutations / Titles
  const firstWord = words[0];
  if (["mrs", "ms", "miss", "smt", "shrimati", "kumari", "madam", "lady"].includes(firstWord)) {
    return "female";
  }
  if (["mr", "shri", "shree", "master", "sir"].includes(firstWord)) {
    return "male";
  }

  // If title is Dr., Prof., etc., analyze the subsequent words
  let relevantWords = words;
  if (["dr", "prof", "capt", "adv", "er"].includes(firstWord)) {
    relevantWords = words.slice(1);
    if (!relevantWords.length) return "male";
  }

  const primaryName = relevantWords[0];

  // 2. Exact match in comprehensive dictionaries (First Name Priority!)
  if (FEMALE_NAMES.has(primaryName)) {
    return "female";
  }
  if (MALE_NAMES.has(primaryName)) {
    return "male";
  }

  // 3. Scan across full name tokens for definitive gender indicators
  for (const w of relevantWords) {
    if (["kaur", "devi", "begum", "khatun", "ben", "bai", "kumari"].includes(w)) {
      return "female";
    }
  }

  // Check male lineage indicators (only if not confirmed female)
  for (const w of relevantWords) {
    if (["bhai", "prasad", "lal", "chand"].includes(w)) {
      return "male";
    }
    if (w === "singh" && !relevantWords.includes("kaur")) {
      // Surnames like 'Singh' can belong to females if first name ends with feminine suffix
      if (!primaryName.endsWith("a") && !primaryName.endsWith("i") && !primaryName.endsWith("ee")) {
        return "male";
      }
    }
  }

  // 4. Male Specific Exceptions for -a or -i endings
  if (MALE_ENDING_EXCEPTIONS.has(primaryName)) {
    return "male";
  }
  if (MALE_I_EXCEPTIONS.has(primaryName)) {
    return "male";
  }

  // 5. Morphological Feminine Suffixes in Indian Languages
  if (
    primaryName.endsWith("ita") ||
    primaryName.endsWith("ika") ||
    primaryName.endsWith("iya") ||
    primaryName.endsWith("sha") ||
    primaryName.endsWith("nya") ||
    primaryName.endsWith("ti") ||
    primaryName.endsWith("ni") ||
    primaryName.endsWith("shi") ||
    primaryName.endsWith("ree") ||
    primaryName.endsWith("na") ||
    primaryName.endsWith("ma") ||
    primaryName.endsWith("la") ||
    primaryName.endsWith("ta") ||
    primaryName.endsWith("da") ||
    primaryName.endsWith("ya") ||
    primaryName.endsWith("ka") ||
    primaryName.endsWith("ri") ||
    primaryName.endsWith("vi") ||
    primaryName.endsWith("li") ||
    primaryName.endsWith("mi") ||
    primaryName.endsWith("i") ||
    primaryName.endsWith("ee")
  ) {
    return "female";
  }

  // Default to Male for standard unmarked names
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
 * Returns strictly Boy/Man vector avatar icon for male names,
 * and strictly Girl/Woman vector avatar icon for female names.
 */
export function getLeadAvatar(nameOrLead, index = 0) {
  const name = typeof nameOrLead === "string" 
    ? nameOrLead 
    : (nameOrLead?.name || nameOrLead?.lead_name || nameOrLead?.client || nameOrLead?.name_client || nameOrLead?.name_lead || nameOrLead?.name_member || "");
  const gender = detectGender(name);
  
  const hash = Math.abs(
    (name || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), index)
  );

  if (gender === "female") {
    return GIRL_AVATARS[hash % GIRL_AVATARS.length];
  }
  return BOY_AVATARS[hash % BOY_AVATARS.length];
}
