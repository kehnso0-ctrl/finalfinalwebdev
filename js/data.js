/**
 * NexusArena - Campus Esports & Tech Events Platform
 * Simulated Local JavaScript Database (No backend required)
 */

// Predefined Sample Accounts for Credential Simulation & Teacher Evaluation
const DEFAULT_SAMPLE_ACCOUNTS = [
  {
    fullName: "Alex Rivera",
    username: "alex_esports",
    email: "alex@campus.edu",
    password: "Password123!",
    role: "Esports Varsity Captain",
    studentId: "CS-2024-8821"
  },
  {
    fullName: "Sarah Chen",
    username: "sarah_tech",
    email: "sarah@univ.edu",
    password: "TechLead2026",
    role: "ACM Student Chapter President",
    studentId: "IT-2023-4109"
  },
  {
    fullName: "Demo Guest",
    username: "guest_user",
    email: "guest@campus.edu",
    password: "GuestPassword",
    role: "Campus Student Member",
    studentId: "ENG-2025-1044"
  }
];

// In-memory session and user store fallback for environments where localStorage is restricted
let inMemoryUsers = [...DEFAULT_SAMPLE_ACCOUNTS];
let inMemoryCurrentUser = null;

// Safe Local Storage Accessor
function isLocalStorageAvailable() {
  try {
    const test = '__nexus_storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Initialize Local User Accounts Storage
function getRegisteredUsers() {
  if (isLocalStorageAvailable()) {
    try {
      const stored = localStorage.getItem('nexus_registered_users');
      if (!stored) {
        localStorage.setItem('nexus_registered_users', JSON.stringify(DEFAULT_SAMPLE_ACCOUNTS));
        return DEFAULT_SAMPLE_ACCOUNTS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Storage parse error, using default accounts:", e);
      return DEFAULT_SAMPLE_ACCOUNTS;
    }
  }
  return inMemoryUsers;
}

function saveRegisteredUser(newUser) {
  if (isLocalStorageAvailable()) {
    try {
      const users = getRegisteredUsers();
      users.push(newUser);
      localStorage.setItem('nexus_registered_users', JSON.stringify(users));
      return true;
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }
  }
  inMemoryUsers.push(newUser);
  return true;
}

// Session State Management (Simulated Session)
function getCurrentUser() {
  if (isLocalStorageAvailable()) {
    try {
      const session = localStorage.getItem('nexus_current_user');
      if (!session) return inMemoryCurrentUser;
      return JSON.parse(session);
    } catch (e) {
      return inMemoryCurrentUser;
    }
  }
  return inMemoryCurrentUser;
}

function setCurrentUser(user) {
  inMemoryCurrentUser = user;
  if (isLocalStorageAvailable()) {
    try {
      if (!user) {
        localStorage.removeItem('nexus_current_user');
      } else {
        localStorage.setItem('nexus_current_user', JSON.stringify(user));
      }
    } catch (e) {
      console.warn("Could not save session to localStorage:", e);
    }
  }
}

function logoutUser() {
  inMemoryCurrentUser = null;
  if (isLocalStorageAvailable()) {
    try {
      localStorage.removeItem('nexus_current_user');
    } catch (e) {}
  }
  window.location.reload();
}

// Master Events Catalog
const CAMPUS_EVENTS = [
  {
    id: "valorant-collegiate-championship",
    title: "Valorant Collegiate Championship 2026",
    category: "esports",
    categoryLabel: "Esports Tournament",
    date: "November 14, 2026",
    time: "10:00 AM - 8:00 PM EST",
    venue: "Main Campus Arena & Esports Complex",
    organizer: "University Esports Federation & Gaming Guild",
    feePerPerson: 15,
    teamSizeMin: 5,
    teamSizeMax: 6,
    slotsTotal: 16,
    slotsBooked: 11,
    image: "/assets/images/event_valorant.jpg",
    shortDesc: "The premier 5v5 collegiate tactical shooter tournament. 16 departmental squads battle for campus supremacy, trophies, and hardware sponsorships.",
    fullDesc: "The annual Valorant Collegiate Championship brings together top university squads in a double-elimination, LAN-hosted tactical tournament. Featuring high-refresh 240Hz battle stations, live shoutcasting in the arena, and streamed to thousands of campus fans. Matches are played under official VCT collegiate competitive rulesets.",
    schedule: [
      { time: "09:30 AM", title: "Team Check-in & Gear Calibration", desc: "Peripheral inspection and warm-up server access." },
      { time: "10:30 AM", title: "Group Stage Round-Robin (Best of 1)", desc: "Four groups battling concurrently on stage and practice bays." },
      { time: "02:00 PM", title: "Quarter-Finals & Semi-Finals (Best of 3)", desc: "Bracket elimination matches streamed to the main theater screen." },
      { time: "06:00 PM", title: "Grand Finals & Championship Ceremony", desc: "Best of 5 showdown followed by medal and trophy awards." }
    ],
    rules: [
      "All team members must be actively enrolled university students with valid student IDs.",
      "Teams must consist of 5 active starters and up to 1 registered substitute.",
      "Strict zero-tolerance policy against toxic conduct, cheating software, and macro exploits.",
      "All players must check in at the Tournament Desk 30 minutes prior to their designated match."
    ],
    prizes: "$2,500 Prize Pool + Custom Departmental Trophy + High-End Gaming Peripherals"
  },
  {
    id: "campus-hackathon-2026",
    title: "Campus CodeSprint Hackathon 2026",
    category: "tech",
    categoryLabel: "Tech Hackathon",
    date: "November 21-22, 2026",
    time: "36-Hour Overnight Sprint (Starts Sat 9:00 AM)",
    venue: "Engineering & Computer Science Innovation Hall",
    organizer: "Department of Computer Science & ACM Student Chapter",
    feePerPerson: 0,
    teamSizeMin: 1,
    teamSizeMax: 4,
    slotsTotal: 60,
    slotsBooked: 48,
    image: "/assets/images/event_hackathon.jpg",
    shortDesc: "36 hours of non-stop building, pizza, mentorship, and tech demos. Build web applications, AI models, or robotics prototypes.",
    fullDesc: "Campus CodeSprint is the flagship university hackathon uniting software developers, hardware tinkerers, UI/UX designers, and domain enthusiasts. Participants receive free hardware dev kits, mentorship from industry tech leads, and 36 hours of catering to turn visionary concepts into working software.",
    schedule: [
      { time: "Sat 09:00 AM", title: "Opening Ceremony & Problem Tracks", desc: "Announcement of campus problem statements and sponsor tracks." },
      { time: "Sat 12:00 PM", title: "Hacking Begins & Mentor Office Hours", desc: "Architecture consultations with software engineers and faculty." },
      { time: "Sun 10:00 AM", title: "Code Freeze & Expo Hall Setup", desc: "Final commits to GitHub and project display preparation." },
      { time: "Sun 02:00 PM", title: "Live Pitches & Judges Showcase", desc: "Top 8 finalists pitch live on the main stage to venture judges." }
    ],
    rules: [
      "All code and prototypes must be authored during the 36-hour sprint window.",
      "Open-source libraries, frameworks, and public APIs are enthusiastically allowed.",
      "Teams can comprise 1 to 4 students across any academic year or degree program.",
      "Each team must submit a GitHub repo link and a 2-minute demonstration video."
    ],
    prizes: "$3,000 Grand Prize + Incubation Grants + Industry Internship Interviews"
  },
  {
    id: "cyber-defense-summit",
    title: "Cyber Defense & AI Architecture Summit",
    category: "seminars",
    categoryLabel: "Tech Seminar",
    date: "November 28, 2026",
    time: "1:00 PM - 5:30 PM EST",
    venue: "Auditorium Hall B & Virtual Live Stream",
    organizer: "Cybersecurity Club & Information Systems Society",
    feePerPerson: 5,
    teamSizeMin: 1,
    teamSizeMax: 1,
    slotsTotal: 120,
    slotsBooked: 89,
    image: "/assets/images/event_cyber.jpg",
    shortDesc: "Keynote lectures and hands-on defense demonstrations exploring defensive AI, zero-trust campus networks, and cloud security.",
    fullDesc: "Learn from veteran threat researchers, ethical hackers, and enterprise system architects. Topics span real-time penetration testing, safeguarding distributed microservices, neural network attack vectors, and career pathways in modern infosec.",
    schedule: [
      { time: "01:00 PM", title: "Keynote: The Zero-Trust University", desc: "Architecting campus identities in an era of automated credential attacks." },
      { time: "02:15 PM", title: "Deep Dive: Defensive AI & Threat Hunting", desc: "Using local machine learning models for anomaly detection in telemetry logs." },
      { time: "03:45 PM", title: "Live Interactive CTF Demonstration", desc: "Step-by-step exploit analysis and live patching on vulnerable test containers." },
      { time: "04:45 PM", title: "Industry Career Panel & Open Q&A", desc: "Direct networking with security engineers and hiring managers." }
    ],
    rules: [
      "Attendees will receive an official verifiable Certificate of Attendance upon completion.",
      "Laptops are recommended for the hands-on packet inspection breakout session.",
      "Respect all speakers and adhere strictly to professional ethical research standards."
    ],
    prizes: "Official Certification of Completion + 1-Year TryHackMe Premium Vouchers"
  },
  {
    id: "league-of-legends-cup",
    title: "Inter-College League of Legends Derby",
    category: "esports",
    categoryLabel: "Esports Tournament",
    date: "December 05, 2026",
    time: "11:00 AM - 7:00 PM EST",
    venue: "Student Union Gaming Lounge",
    organizer: "MOBA Society & Campus Esports",
    feePerPerson: 10,
    teamSizeMin: 5,
    teamSizeMax: 6,
    slotsTotal: 12,
    slotsBooked: 9,
    image: "/assets/images/hero_arena.jpg",
    shortDesc: "5v5 Summoner's Rift showdown across computer science, engineering, business, and arts faculties.",
    fullDesc: "Witness intense collegiate MOBA gameplay as cross-departmental squads fight for inter-college glory. Full tournament draft, stage projection, tournament admins, and post-game interview desk.",
    schedule: [
      { time: "11:00 AM", title: "Bracket Seeding & Captains Meeting", desc: "Draft rules, coin toss for side selection, and referee checks." },
      { time: "12:00 PM", title: "Group Elimination Rounds", desc: "Simultaneous matches across dual PC suites." },
      { time: "04:30 PM", title: "Third-Place Match & Final Clash", desc: "Best of 3 finals with live commentator booth." }
    ],
    rules: [
      "Tournament draft format on current Riot tournament realm patch.",
      "Players must use their own personal peripherals (mouse, keyboard, headset).",
      "Standard pause regulations: max 10 minutes total technical pause per squad."
    ],
    prizes: "$1,200 Cash Pool + Custom Engraved Medals + RP Vouchers"
  },
  {
    id: "game-jam-social-night",
    title: "Indie Game Jam & LAN Social Night",
    category: "social",
    categoryLabel: "Social Gathering",
    date: "December 12, 2026",
    time: "5:00 PM - 11:00 PM EST",
    venue: "Student Activity Center & Terrace",
    organizer: "Game Development Guild & Digital Arts Guild",
    feePerPerson: 0,
    teamSizeMin: 1,
    teamSizeMax: 4,
    slotsTotal: 80,
    slotsBooked: 62,
    image: "/assets/images/event_hackathon.jpg",
    shortDesc: "Play student-made games, trade game dev assets, enjoy free snacks, and test out retro console stations.",
    fullDesc: "An open social evening celebrating creative game development, pixel art, sound design, and local multiplayer fun. Showcase your work-in-progress game or join casual tournament brackets in Smash Bros, Mario Kart, and Tekken.",
    schedule: [
      { time: "05:00 PM", title: "Showcase Floor Open & Free Play", desc: "Try out 20+ playable game dev booths created by students." },
      { time: "07:00 PM", title: "Lightning Demos: 3-Minute Show & Tell", desc: "Students present their mechanics, shaders, and dev struggles." },
      { time: "08:30 PM", title: "Casual Party Game Tournaments & Pizza", desc: "Community bracket competitions on retro projection screens." }
    ],
    rules: [
      "Open to all enrolled students regardless of experience or major.",
      "Free snacks and non-alcoholic drinks provided with valid ticket RSVP.",
      "Community voting for 'Best Student Game' concludes at 09:30 PM."
    ],
    prizes: "Steam Gift Cards + Hardware Gamepads + 3D Printed Trophy"
  },
  {
    id: "cloud-devops-masterclass",
    title: "Cloud Infrastructure & Docker Masterclass",
    category: "seminars",
    categoryLabel: "Tech Seminar",
    date: "December 16, 2026",
    time: "2:00 PM - 5:00 PM EST",
    venue: "Computer Lab 402 & Google Meet",
    organizer: "Cloud Computing Student Circle",
    feePerPerson: 0,
    teamSizeMin: 1,
    teamSizeMax: 1,
    slotsTotal: 50,
    slotsBooked: 41,
    image: "/assets/images/event_cyber.jpg",
    shortDesc: "Hands-on containerization workshop: build Dockerfiles, set up CI/CD pipelines, and deploy web applications to cloud servers.",
    fullDesc: "Master container orchestration from the ground up. This hands-on seminar covers container basics, multi-stage Docker builds, Kubernetes pods, and automated GitHub Actions deployments.",
    schedule: [
      { time: "02:00 PM", title: "Containerization Fundamentals", desc: "Why containers matter, architecture, and Docker engine internals." },
      { time: "03:15 PM", title: "Live Lab: Deploying a Multi-Tier App", desc: "Building frontend and API containers with automated health checks." },
      { time: "04:30 PM", title: "CI/CD Pipeline Automation", desc: "Setting up continuous testing and delivery on cloud instances." }
    ],
    rules: [
      "Participants should have Git and Docker Desktop pre-installed on their laptops.",
      "Free student cloud credits will be distributed at check-in."
    ],
    prizes: "Official Training Certificate + $100 Cloud Platform Credits"
  },
  {
    id: "robotics-iot-expo",
    title: "Robotics & Embedded Systems Hardware Expo",
    category: "tech",
    categoryLabel: "Tech Expo",
    date: "January 09, 2027",
    time: "10:00 AM - 4:00 PM EST",
    venue: "Mechatronics Laboratory & Atrium",
    organizer: "Robotics Club & IEEE Student Branch",
    feePerPerson: 8,
    teamSizeMin: 1,
    teamSizeMax: 3,
    slotsTotal: 30,
    slotsBooked: 22,
    image: "/assets/images/event_hackathon.jpg",
    shortDesc: "Autonomous obstacle rovers, drone obstacle courses, sensor arrays, and microcontroller design showcases.",
    fullDesc: "Witness cutting-edge student hardware innovations including line-tracking robots, computer-vision obstacle drones, ESP32 IoT monitoring arrays, and 3D printed mechanical arms.",
    schedule: [
      { time: "10:00 AM", title: "Expo Hall Open & Interactive Demos", desc: "Inspect hardware schematics and talk to student creators." },
      { time: "01:00 PM", title: "Obstacle Navigation Rover Time Trials", desc: "Autonomous rovers navigate a surprise obstacle course." },
      { time: "03:15 PM", title: "Robo-Sumo Tournament", desc: "Heavyweight autonomous bot pushing championship." }
    ],
    rules: [
      "All batteries and lithium polymer packs must meet lab safety standards.",
      "Hardware entries must be built by current student members."
    ],
    prizes: "Oscilloscopes + Soldering Stations + Robotics Component Kits"
  },
  {
    id: "rocket-league-derby",
    title: "Rocket League 3v3 Campus Showdown",
    category: "esports",
    categoryLabel: "Esports Tournament",
    date: "January 16, 2027",
    time: "1:00 PM - 6:00 PM EST",
    venue: "Campus Esports Arena",
    organizer: "University Esports Federation",
    feePerPerson: 10,
    teamSizeMin: 3,
    teamSizeMax: 3,
    slotsTotal: 16,
    slotsBooked: 13,
    image: "/assets/images/event_valorant.jpg",
    shortDesc: "High-flying 3v3 vehicular soccer action with aerial goals, double-elimination brackets, and campus rivalries.",
    fullDesc: "Fast-paced, high-flying car soccer tournament featuring 16 collegiate trios. Dual casting streams, replay analysis, and spectator seating with stadium sound.",
    schedule: [
      { time: "01:00 PM", title: "Warm-up & Bracket Announcement", desc: "Controller checks and custom lobby configuration." },
      { time: "01:45 PM", title: "Upper & Lower Bracket Matches", desc: "Rapid-fire best of 5 match series." },
      { time: "05:00 PM", title: "Grand Final Match", desc: "Bracket reset showdown for championship rings." }
    ],
    rules: [
      "Standard 3v3 Soccar game mode on standard regulation arena maps.",
      "Controllers, keyboard, and cross-platform accounts are all eligible."
    ],
    prizes: "$900 Prize Pool + Custom Esports Banners + Controller Bundles"
  },
  {
    id: "tech-career-networking",
    title: "Tech Career & Alumni Networking Mixer",
    category: "social",
    categoryLabel: "Social & Career",
    date: "January 23, 2027",
    time: "4:00 PM - 8:00 PM EST",
    venue: "Alumni Memorial Ballroom",
    organizer: "Career Services & Engineering Council",
    feePerPerson: 0,
    teamSizeMin: 1,
    teamSizeMax: 1,
    slotsTotal: 150,
    slotsBooked: 114,
    image: "/assets/images/event_cyber.jpg",
    shortDesc: "Connect with campus alumni working at top tech firms, participate in mock coding reviews, and build professional ties.",
    fullDesc: "Bring your resume, portfolio links, and curiosity. This evening connects current undergraduate and graduate students with graduates who are now senior engineers, engineering directors, and startup founders.",
    schedule: [
      { time: "04:00 PM", title: "Check-in & Resume Table Open", desc: "Get rapid 5-minute resume feedback from tech hiring leads." },
      { time: "05:15 PM", title: "Panel Discussion: Transitioning from Campus to Tech", desc: "Tips for passing coding assessments and finding your first role." },
      { time: "06:30 PM", title: "Catered Mixer & Informal Coffee Networking", desc: "Open conversations across discipline-specific stations." }
    ],
    rules: [
      "Business casual dress code encouraged.",
      "Digital resume QR codes or printed copies permitted."
    ],
    prizes: "Complimentary Professional LinkedIn Headshot Station"
  },
  {
    id: "super-smash-ultimate-cup",
    title: "Super Smash Bros. Ultimate Open",
    category: "esports",
    categoryLabel: "Esports Tournament",
    date: "January 30, 2027",
    time: "12:00 PM - 7:00 PM EST",
    venue: "Student Activity Center Room 101",
    organizer: "FGC & Smash Campus Community",
    feePerPerson: 5,
    teamSizeMin: 1,
    teamSizeMax: 1,
    slotsTotal: 64,
    slotsBooked: 52,
    image: "/assets/images/hero_arena.jpg",
    shortDesc: "1v1 double-elimination Smash Ultimate open tournament with 64-player bracket, CRT/low-lag monitors, and open friendlies.",
    fullDesc: "The biggest fighting game gathering on campus. 64 fighters enter, one champion leaves with the golden controller trophy. Casual setup stations available for non-tournament players all afternoon.",
    schedule: [
      { time: "12:00 PM", title: "Friendlies & Bracket Check-in", desc: "Warm-up stations and wave-1 pool assignments." },
      { time: "01:00 PM", title: "Wave 1 & Wave 2 Bracket Pools", desc: "Best of 3 double-elimination pools to top 16." },
      { time: "04:30 PM", title: "Top 8 Finals (Best of 5)", desc: "Main stage competition with live commentary." }
    ],
    rules: [
      "Standard competitive 3-stock, 7-minute ruleset with hazard toggle off.",
      "Legal stage list: Battlefield, Final Destination, Smashville, Town & City, Small Battlefield."
    ],
    prizes: "$500 Cash Prize + Golden Gamecube Controller + Campus Bragging Rights"
  }
];

// Helper to find event by ID
function getEventById(id) {
  if (!id) return CAMPUS_EVENTS[0];
  const found = CAMPUS_EVENTS.find(e => e.id === id);
  return found || CAMPUS_EVENTS[0];
}
