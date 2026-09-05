// Mock data for demo mode — mirrors exact Gemini JSON schema output

export const MOCK_IDEAS = {
  ideas: [
    {
      title: "SmartCampus Navigator",
      one_line_pitch: "An AR-powered indoor navigation app that helps students find classes, labs, and faculty rooms using their phone camera.",
      difficulty: "medium",
      domain: "Mobile / AR",
      why_it_fits_you: "Your interest in mobile development and React Native pairs perfectly with AR frameworks like ViroReact. Your JavaScript skills transfer directly.",
      core_problem_solved: "Students and visitors waste time finding rooms in large campus buildings, especially during the first weeks of a semester.",
      estimated_weeks: 10,
    },
    {
      title: "PeerReview Pro",
      one_line_pitch: "A structured peer-review platform for student assignments with plagiarism detection, blind reviews, and AI feedback summaries.",
      difficulty: "medium",
      domain: "Web / EdTech",
      why_it_fits_you: "Your web development skills and interest in education tech make this a natural fit. Node.js backend + React frontend covers your full stack experience.",
      core_problem_solved: "Professors managing large classes struggle to give personalized feedback; students get no peer perspective on their work.",
      estimated_weeks: 8,
    },
    {
      title: "DevHabits",
      one_line_pitch: "A GitHub-integrated habit tracker that auto-logs coding streaks, visualizes productivity patterns, and sends smart nudges to keep you consistent.",
      difficulty: "easy",
      domain: "Web / Productivity",
      why_it_fits_you: "Uses GitHub API (REST) which you're already comfortable with. Clean React dashboard project that showcases data visualization skills.",
      core_problem_solved: "Developers struggle to maintain consistent coding habits without visibility into their actual patterns over time.",
      estimated_weeks: 6,
    },
    {
      title: "LocalLens",
      one_line_pitch: "A hyperlocal community app where residents report, upvote, and track civic issues (potholes, broken lights) with ML-based photo classification.",
      difficulty: "hard",
      domain: "AI/ML / Civic Tech",
      why_it_fits_you: "Combines your Python/ML interest with a real social impact use case. TensorFlow.js lets you run inference client-side for the wow factor.",
      core_problem_solved: "Civic issue reporting is fragmented, slow, and gives citizens no visibility on resolution status.",
      estimated_weeks: 12,
    },
    {
      title: "MediSchedule",
      one_line_pitch: "An intelligent appointment scheduling system for small clinics with SMS reminders, no-show prediction, and slot optimization.",
      difficulty: "medium",
      domain: "Web / Healthcare",
      why_it_fits_you: "Your database skills and interest in healthcare problems make this ideal. ML no-show prediction adds a research component for your final report.",
      core_problem_solved: "Small clinics lose 20-30% of appointment slots to no-shows with no prediction or mitigation system.",
      estimated_weeks: 10,
    },
    {
      title: "CodeClimate",
      one_line_pitch: "A VS Code extension that provides real-time technical debt scoring, refactoring suggestions, and team code-health dashboards.",
      difficulty: "easy",
      domain: "Developer Tools",
      why_it_fits_you: "If you use VS Code daily, building an extension shows deep platform knowledge. TypeScript + static analysis APIs are your comfort zone.",
      core_problem_solved: "Developers accumulate technical debt invisibly until it causes major slowdowns; no lightweight real-time metric exists.",
      estimated_weeks: 7,
    },
  ],
};

export const MOCK_PLAN = {
  problem_statement:
    "Students and visitors in large university campuses frequently struggle to locate specific rooms, labs, and facilities, especially in multi-story buildings without clear signage. Current solutions rely on outdated static maps that don't account for real-time changes like room reassignments or temporary closures. A mobile AR navigation solution would dramatically reduce time wasted and improve campus experience.",
  features: {
    core: [
      "QR code-based room anchoring for AR positioning",
      "Turn-by-turn indoor navigation with AR overlays",
      "Campus map with all rooms, labs, and facilities",
      "Search by room number, faculty name, or department",
      "Offline support for downloaded campus maps",
    ],
    stretch: [
      "Real-time room occupancy display via sensor integration",
      "Faculty availability integration (from timetable DB)",
      "Crowd-sourced map corrections from student contributors",
      "Accessibility mode with elevator-priority routing",
      "Integration with university event calendar",
    ],
  },
  tech_stack: [
    {
      layer: "Frontend / Mobile",
      choice: "React Native + Expo",
      why: "Cross-platform (iOS + Android) from one codebase. Expo reduces setup friction significantly for a student project.",
    },
    {
      layer: "AR Layer",
      choice: "ViroReact",
      why: "React Native-native AR framework with good documentation. Handles marker-based tracking for QR anchors out of the box.",
    },
    {
      layer: "Backend API",
      choice: "Node.js + Express",
      why: "Matches your JavaScript skill set. REST API for room data, search, and map assets.",
    },
    {
      layer: "Database",
      choice: "PostgreSQL + PostGIS",
      why: "PostGIS extension adds spatial query support for indoor coordinate math. Standard Postgres everywhere else.",
    },
    {
      layer: "Map Data",
      choice: "Custom SVG floor plans + IndoorAtlas SDK",
      why: "SVG floor plans are editable and version-controllable. IndoorAtlas provides Wi-Fi/BLE positioning as a fallback to AR.",
    },
    {
      layer: "Auth",
      choice: "Firebase Auth",
      why: "Free, handles university email domain restriction (restrict to @university.edu) trivially.",
    },
  ],
  roadmap: [
    {
      week: 1,
      goal: "Project setup and architecture finalization",
      tasks: [
        "Initialize React Native + Expo project",
        "Set up Node.js/Express backend",
        "Design database schema for rooms, floors, buildings",
        "Create GitHub repo with branch strategy",
      ],
    },
    {
      week: 2,
      goal: "Static campus map and data entry",
      tasks: [
        "Convert building floor plans to SVG format",
        "Build admin panel for room data entry",
        "Populate DB with 2 test buildings",
        "Implement search API endpoint",
      ],
    },
    {
      week: 3,
      goal: "Mobile app foundation",
      tasks: [
        "Build campus map screen with SVG overlay",
        "Implement room search UI",
        "Add room detail screen (faculty, schedule, facilities)",
        "Set up Firebase Auth with university email",
      ],
    },
    {
      week: 4,
      goal: "Indoor navigation (non-AR baseline)",
      tasks: [
        "Implement pathfinding algorithm (A* on room graph)",
        "Render step-by-step directions on SVG map",
        "Add floor-change instructions (stairs/elevator)",
        "User testing with 3–5 classmates for usability",
      ],
    },
    {
      week: 5,
      goal: "AR integration (core wow factor)",
      tasks: [
        "Install and configure ViroReact",
        "Print and place QR anchor codes at building entrances",
        "Implement QR scan → AR session initialization",
        "Render basic AR arrows for directional guidance",
      ],
    },
    {
      week: 6,
      goal: "AR polish + offline support",
      tasks: [
        "Improve AR arrow visuals and distance display",
        "Implement map download for offline use",
        "Handle edge cases: no camera permission, low light",
        "Performance profiling on mid-range Android device",
      ],
    },
    {
      week: 7,
      goal: "Stretch features (1-2 of your choice)",
      tasks: [
        "Add real-time room occupancy (mock data or sensor integration)",
        "Integrate faculty availability from timetable",
        "Accessibility routing mode",
      ],
    },
    {
      week: 8,
      goal: "Testing, polish, and final report",
      tasks: [
        "End-to-end user testing with 10+ real students",
        "UI polish: dark mode, onboarding flow, error states",
        "Write technical report sections (architecture, evaluation)",
        "Prepare demo video and viva presentation",
      ],
    },
  ],
  improvements: [
    "Use real building data from your university's facilities management office — real data always impresses examiners more than mock data.",
    "Add a short demo video to your viva showing the AR overlay working live in the actual building — this is your single biggest wow moment.",
    "Add analytics: track which rooms are searched most, surface this as a 'Popular Destinations' feature to show your data layer thinking.",
    "Write a brief evaluation section comparing your A* pathfinding time vs. a naive BFS — examiners love when you benchmark your own system.",
  ],
  pitfalls: [
    {
      problem: "AR tracking drifts and becomes inaccurate after 20-30 meters indoors",
      solution: "Place QR re-anchor points every 30m in corridors. The app re-calibrates its AR session at each anchor, keeping drift minimal.",
    },
    {
      problem: "SVG floor plans are hard to align precisely with real-world coordinates",
      solution: "Use at least 3 known reference points (doors, stairs) to calculate a transformation matrix between SVG space and real-world coordinates.",
    },
    {
      problem: "Offline map downloads hit the 50MB App Store limit quickly for large campuses",
      solution: "Compress SVGs aggressively (SVGO), and implement on-demand floor-by-floor downloads instead of a single campus-wide bundle.",
    },
    {
      problem: "Getting real campus data from the university facilities office takes weeks",
      solution: "Start with one building you can manually map in week 1. Use that as your demo scope; mention full campus scalability in your report.",
    },
  ],
};
