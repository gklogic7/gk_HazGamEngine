export interface CheatSheetSection {
  title: string;
  category: 'HTML' | 'CSS' | 'JavaScript';
  items: {
    name: string;
    syntax: string;
    note: string;
  }[];
}

export const CHEAT_SHEETS: CheatSheetSection[] = [
  {
    title: 'Modern DOM Selection & Manipulation',
    category: 'JavaScript',
    items: [
      {
        name: 'Query Single Element',
        syntax: 'const el = document.querySelector(".item");',
        note: 'Returns first matching Element or null'
      },
      {
        name: 'Query All Elements',
        syntax: 'const list = document.querySelectorAll(".item");',
        note: 'Returns a static NodeList (iterable with forEach)'
      },
      {
        name: 'Create Element',
        syntax: 'const btn = document.createElement("button");',
        note: 'Creates an in-memory DOM element'
      },
      {
        name: 'Class Toggle / Add / Remove',
        syntax: 'el.classList.toggle("active");\nel.classList.add("open");',
        note: 'High-performance class modifications'
      },
      {
        name: 'Closest Ancestor',
        syntax: 'const parentCard = e.target.closest(".card");',
        note: 'Traverses upward to find nearest selector match'
      },
      {
        name: 'Custom Dataset Attributes',
        syntax: 'const val = el.dataset.itemId; // reads data-item-id',
        note: 'Read and write HTML5 data-* attributes'
      }
    ]
  },
  {
    title: 'Native Event Listeners & Dispatching',
    category: 'JavaScript',
    items: [
      {
        name: 'Basic Event Listener',
        syntax: 'btn.addEventListener("click", (e) => { ... });',
        note: 'Standard event binding'
      },
      {
        name: 'Prevent Default / Stop Propagation',
        syntax: 'e.preventDefault();\ne.stopPropagation();',
        note: 'Prevents browser action or bubbling'
      },
      {
        name: 'Custom Events',
        syntax: 'window.dispatchEvent(new CustomEvent("my-event", { detail: { score: 10 } }));',
        note: 'Decoupled event messaging'
      },
      {
        name: 'Passive Touch/Scroll Listener',
        syntax: 'window.addEventListener("scroll", handler, { passive: true });',
        note: 'Improves scroll performance by omitting preventDefault'
      }
    ]
  },
  {
    title: 'Web Audio API Basics',
    category: 'JavaScript',
    items: [
      {
        name: 'Audio Context Initializer',
        syntax: 'const ctx = new (window.AudioContext || window.webkitAudioContext)();',
        note: 'Needs user gesture to resume state if suspended'
      },
      {
        name: 'Oscillator & Gain Node',
        syntax: 'const osc = ctx.createOscillator();\nconst gain = ctx.createGain();\nosc.connect(gain);\ngain.connect(ctx.destination);',
        note: 'Wave synthesis routing chain'
      },
      {
        name: 'Waveform Types',
        syntax: 'osc.type = "sine" | "square" | "sawtooth" | "triangle";',
        note: 'Standard geometric wave shapes'
      }
    ]
  },
  {
    title: 'CSS Grid & Flexbox Quick Reference',
    category: 'CSS',
    items: [
      {
        name: 'Auto-Fit Responsive Grid',
        syntax: 'display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\ngap: 1rem;',
        note: 'Fluid multi-column grid without media queries'
      },
      {
        name: 'Absolute Centering with Flexbox',
        syntax: 'display: flex;\nalign-items: center;\njustify-content: center;',
        note: 'Centers child elements vertically and horizontally'
      },
      {
        name: 'CSS Custom Properties (Variables)',
        syntax: ':root { --primary: #38bdf8; }\n.btn { background: var(--primary); }',
        note: 'Dynamic runtime theming variables'
      },
      {
        name: 'Clamp Responsive Typography',
        syntax: 'font-size: clamp(1rem, 2.5vw, 2.2rem);',
        note: 'Min, preferred fluid size, and max clamp'
      }
    ]
  },
  {
    title: 'HTML5 Semantic & Modern Tags',
    category: 'HTML',
    items: [
      {
        name: 'Native Dialog Modal',
        syntax: '<dialog id="modal"><button onclick="this.closest(\'dialog\').close()">Close</button></dialog>\ndialog.showModal();',
        note: 'Built-in accessible backdrop and focus trap'
      },
      {
        name: 'Details & Summary',
        syntax: '<details><summary>Click to expand</summary><p>Hidden content</p></details>',
        note: 'Zero-JS accordion disclosure widget'
      },
      {
        name: 'Native Color & Date Pickers',
        syntax: '<input type="color" value="#38bdf8">\n<input type="date">\n<input type="range" min="0" max="100">',
        note: 'Rich native browser input controls'
      }
    ]
  }
];
