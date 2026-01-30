export type Project = {
  id: string;
  title: string;
  year: string;
  category: string;
  tagline: string;
  tags: string[];
  pdf?: string; // /pdfs/Whatever.pdf
  images?: { src: string; alt: string }[];
  modelGlb?: string; // /models/model.glb
  video?: { type: "file" | "youtube"; src: string };
  iframe?: { src: string; height?: number };
  highlights: string[];
};

export const projects: Project[] = [
  {
    id: "quantum",
    title: "Computational Quantum Mechanics — 3D Schrödinger Simulation",
    year: "2025",
    category: "Simulation / Computational Physics",
    tagline:
      "Interactive 3D wavepacket visualization exported from MATLAB and rendered in WebGL with frame scrubbing and threshold control.",
    tags: ["MATLAB", "Numerics", "3D Visualization", "Quantum"],
    pdf: "/pdfs/Quantum.pdf",
    iframe: {
      src: "https://marcus-unburned-unthroatily.ngrok-free.dev",
      height: 800
    },
    highlights: [
  "Implemented a time-accurate Schrödinger solver with Δt = 0.01 and validated behavior across multiple barrier geometries to quantify reflection/transmission response.",
  "Ran controlled case studies (e.g., barrier inputs (6.3, 5.3, 5.5) and (1.5, 10, 1.5)) and reported R/T outcomes (e.g., R = 0.224, T = 0.920; R = 0.031, T = 0.969) to ground the visuals in real physics, not just graphics.",
  "Exported the simulation timeline into a 120-frame interactive viewer with scrubbing + threshold control for interpretable probability-density exploration.",
  "Designed the experience around interpretability: parameter choice → wave behavior → measurable R/T → visualization controls that surface the underlying mechanics."
]
  },
  {
    id: "f35",
    title: "Corporate F35 — CAD + DFM (SLS)",
    year: "2024",
    category: "CAD / Manufacturing",
    tagline:
      "3D-printable aircraft model designed with tolerance stackups, join strategy, and manufacturing constraints in mind.",
    tags: ["SolidWorks", "DFM", "SLS", "Tolerances"],
    pdf: "/pdfs/F35.pdf",
    modelGlb: "/models/f35.glb",
    images: [
      { src: "/images/projects/f35/1.jpg", alt: "ME2110 robot CAD" },
      { src: "/images/projects/f35/2.jpg", alt: "ME2110 robot assembly" },
      { src: "/images/projects/f35/3.jpg", alt: "ME2110 competition robot" },
      { src: "/images/projects/f35/4.jpg", alt: "ME2110 competition robot" },
      { src: "/images/projects/f35/5.jpg", alt: "ME2110 competition robot" },
      { src: "/images/projects/f35/6.jpg", alt: "ME2110 competition robot" },
      { src: "/images/projects/f35/7.jpg", alt: "ME2110 competition robot" }
    ],
    highlights: [
  "Designed for SLS manufacturability from day one with a minimum wall thickness of 0.4 in to improve robustness and print success.",
  "Engineered controlled radii (R0.04, R0.20) at transitions to reduce stress concentrations and improve assembly fit consistency.",
  "Locked in repeatable assembly geometry using fixed angles (112°, 12°) to prevent alignment drift and ‘close-enough’ mating errors.",
  "Treated the CAD like a product: DFM constraints first, geometry second—so the final model is buildable, not just CAD-pretty."
]
  },
  {
    id: "me2110",
    title: "ME2110 Competition Robot — “The Depresant”",
    year: "2024",
    category: "Robotics",
    tagline:
      "Mechanism-driven robot design optimized for reliability, repeatability, and fast iteration under competition constraints.",
    tags: ["Mechanisms", "Pneumatics", "Integration", "Iteration"],
    pdf: "/pdfs/ME2110.pdf",
    modelGlb: "/models/me2110.glb",
    images: [
      { src: "/images/projects/me2110/1.jpg", alt: "ME2110 robot CAD" },
      { src: "/images/projects/me2110/2.jpg", alt: "ME2110 robot assembly" },
      { src: "/images/projects/me2110/3.jpg", alt: "ME2110 competition robot" },
      { src: "/images/projects/me2110/4.jpg", alt: "ME2110 competition robot" },
      { src: "/images/projects/me2110/5.jpg", alt: "ME2110 competition robot" },
      { src: "/images/projects/me2110/6.jpg", alt: "ME2110 competition robot" }
    ],

    highlights: [
  "Delivered competition-level performance on a strict $120 budget while meeting a tight 18\"×18\"×20\" envelope and completing the course in < 40 s.",
  "Proved reliability under match conditions with 78 points (Sprint 3) and 157 points (Final), reflecting strong iteration quality and system robustness.",
  "Designed for controlled repeatability with a target speed band of 1.5–2 ft/s, prioritizing stability over brittle ‘max speed’ behavior.",
  "Engineered rapid recovery + dependable operation: reset time < 4 minutes, sensor feedback targets ≤ 0.5 s, and safe operating limits (7–12 V).",
  "Optimized for reliable mechanisms and controllability with a weight target < 11 lb to reduce failure modes and maintain consistent performance."
    ]
  },
  {
    id: "fire-tornado",
    title: "Fire Tornado — Gap Ratio Experiment + Presentation",
    year: "2025",
    category: "Fluids / Experimental",
    tagline:
      "Experiment concept and presentation featuring a geometry sweep to connect enclosure gap ratio to swirl strength and flame behavior.",
    tags: ["Fluids", "Experimental Design", "Modeling", "Presentation"],
    pdf: "/pdfs/FireTornado.pdf",
    images: [
      { src: "/images/projects/fire-tornado/1.jpg", alt: "Fire Tornado setup" },
      { src: "/images/projects/fire-tornado/2.jpg", alt: "Fire Tornado experiment" },
      { src: "/images/projects/fire-tornado/3.jpg", alt: "Fire Tornado results/presentation" }
    ],
    video: { type: "file", src: "/videos/fire-tornado.mp4" },
    highlights: [
  "Designed an adjustable enclosure study to map gap-space offset to flame height, sweeping offsets across [5, 10, 15, 20, 25] cm for a clean parameter study.",
  "Used tracker video analysis for repeatable flame-height measurement (no eyeballing), enabling consistent comparisons across trials.",
  "Developed a clear hypothesis and validation plan: predicted a non-monotonic response and defined an optimal gap ratio φ to test experimentally.",
  "Framed the experiment with real-world relevance—how openings/gaps can amplify swirls in wildfire or built-environment scenarios—making results actionable."
    ]
  },

  {
    id: "autospotter",
    title: "AutoSpotter — Automatic Bench Press Spotting Device",
    year: "2023",
    category: "Product Design / Safety",
    tagline:
      "Concept-to-prototype engineering project exploring a safer solo bench-press experience via an automatic spotting mechanism.",
    tags: ["Product Design", "Mechanisms", "Safety", "Prototyping", "DFM"],
    pdf: "/pdfs/AutoSpotter.pdf",
    images: [
      { src: "/images/projects/autospotter/1.jpg", alt: "AutoSpotter concept sketch" },
      { src: "/images/projects/autospotter/2.jpg", alt: "AutoSpotter mechanism detail" },
      { src: "/images/projects/autospotter/3.jpg", alt: "AutoSpotter prototype" },
      { src: "/images/projects/autospotter/4.jpg", alt: "AutoSpotter prototype" },
      { src: "/images/projects/autospotter/5.jpg", alt: "AutoSpotter prototype" },
    ],
    highlights: [
  "Engineered around hard safety + usability constraints: activation ≤ 0.367 s, portable (no wall outlet), no cage-like add-ons, and adds ≤ 10 lb to the barbell.",
  "Designed to integrate with standard gym hardware (45 lb barbell) and full bench geometry (86.6\" length, 39.4\" width, 80.1\" height, 72.6\" bar height).",
  "Demonstrated rapid-response feasibility: pneumatic concept achieved ~15 ms actuation and reached ~54.5\" to catch/support the bar during failure scenarios.",
  "Validated through prototyping (not just CAD): clip-on-crutch concept achieved 4/4 repeatability, 72% feasibility, and 75% effectiveness in test evaluation.",
  "Targeted real adoption by holding the product to a practical cost ceiling (< $500) while addressing a safety problem linked to ~6,000 injuries/year."
    ]
  },

  {
    id: "carbon-nano",
    title: "Carbon Nanomaterials as Functional Fillers in Polymer Scaffolds",
    year: "2025",
    category: "Research / Biomaterials",
    tagline:
      "Literature synthesis on CNT/graphene (GO/rGO) polymer scaffolds for bone & osteochondral tissue engineering, linking processing to device-level metrics.",
    tags: ["CNT", "Graphene", "Biomaterials", "Literature Review", "Tissue Engineering"],
    pdf: "/pdfs/CarbonNano.pdf",
    highlights: [
  "Synthesized key conduction thresholds that drive design: CNT percolation often occurs below 1 wt%, and graphene-polymer systems report percolation as low as ~0.3 vol%.",
  "Mapped literature to device-level electrical performance with typical scaffold conductivities spanning 10⁻⁶ to 10⁻² S/cm—sufficient for clinically relevant stimulation ranges.",
  "Extracted sensing implications: reported piezoresistive gauge factors can reach tens to hundreds, framing scaffolds as self-monitoring implants rather than passive structures.",
  "Anchored mechanical gains with hard metrics: 0.5 wt% rGO in PCL scaffolds shows ~185% higher compressive strength and ~150% higher modulus vs neat PCL.",
  "Emphasized translational realism by highlighting why many strategies target ‘just above percolation’ to balance conductivity, reinforcement, and cytocompatibility while minimizing toxicity risk."
    ]
  }
];
