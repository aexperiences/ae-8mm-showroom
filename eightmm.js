/* ============================================================================
   8mm OS — SHOWROOM ENGINE
   Boutique Film & Production Studio OS · Powered by Accelerated Experiences LLC

   BROWSER-ONLY SHOWROOM. sessionStorage, resets on idle. No backend, no network.
   AEHub canon: Founder -> COO -> DH -> AE -> Event Bus -> Pacemaker -> Triad,
   confidence-gated release, LIVE/ESTIMATE/ASSUMPTION tags, the Fences.

   The business: a hybrid — top-of-funnel creative agency + military-grade
   production logistics + high-liability entertainment-law compliance. The
   headline: the One-Click WRAP BOOK. The rights-gate: nothing is delivered
   until every release and license is signed (clearance).
   ============================================================================ */
(function (global) {
  "use strict";

  var KEY = "eightmm_showroom_v1";
  var IDLE_MS = 20 * 60 * 1000;
  var STORE = (function(){ try{ localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return localStorage; }catch(e){ return sessionStorage; } })();

  function now() { return Date.now(); }
  function read() { try { return JSON.parse(STORE.getItem(KEY)) || null; } catch (e) { return null; } }
  function write(d) { d._t = now(); try { STORE.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function fresh() {
    return { _t: now(), started: now(), tier: "grandsuite", adds: [], offs: [],
      productions: clone(SEED.productions), clearances: clone(SEED.clearances), crew: clone(SEED.crew),
      gear: clone(SEED.gear), budget: clone(SEED.budget), pitches: clone(SEED.pitches),
      team: clone(SEED.team), systems: clone(SEED.systems), matters: clone(SEED.matters),
      approvals: clone(SEED.approvals), bus: [], seq: 1 };
  }
  function clone(a){ return JSON.parse(JSON.stringify(a)); }
  function db() { var d = read(); if (!d) { d = fresh(); write(d); return d; } return d; }
  function save(mut) { var d = db(); mut(d); write(d); return d; }
  function resetFloor() { var d = fresh(); write(d); return d; }

  /* -------------------------------------------------------------- canon */
  /* AICP budget structure — the real line-item shape. */
  var BUDGET_GROUPS = [
    { k:"ATL", name:"Above the Line", note:"Director, producer, writer, principal talent." },
    { k:"BTL", name:"Below the Line — Production", note:"Crew, gear, locations, catering, the shoot." },
    { k:"POST", name:"Post-Production", note:"Editorial, color, sound, VFX, delivery." },
    { k:"OTHER", name:"Other / Wrap", note:"Insurance, legal, contingency, wrap." }
  ];
  /* Clearance types — the rights-gate vocabulary. */
  var CLEAR_TYPES = ["Talent Release","Location Release","Appearance Waiver","Music License","Artwork/Brand License","Crew Deal Memo","Minor/Guardian Consent"];
  var CREW_ROLES = ["Director","DP","Gaffer","Sound Mixer","Makeup","Production Designer","1st AC","Editor","Colorist","PA"];
  /* Wrap Book — the items a producer must compile at wrap. */
  var WRAP_ITEMS = ["Signed releases","Receipts & petty cash","Call sheets","Camera & sound logs","Final delivery assets"];

  var BENCH = {
    grossMargin:{ target:[25,45], median:32, unit:"%", src:"AICP / boutique studio margin bands (estimate — verify per studio)" },
    bidWin:{ target:[20,35], median:25, unit:"%", src:"Commercial production bid-win rate (estimate)" }
  };
  var REPLACES = [
    { tool:"Movie Magic Budgeting / Scheduling", job:"AICP budget top sheet, estimated vs actual", cost:"$$ per-seat license" },
    { tool:"DocuSign + a binder", job:"Releases, NDAs, deal memos, the wrap book", cost:"Per-envelope + weeks of a producer's time" },
    { tool:"Frame.io + Dropbox", job:"Client review, the delivery vault", cost:"$$/user/mo" },
    { tool:"StudioBinder / call-sheet tools", job:"Breakdowns, call sheets, crew CRM", cost:"$$/user/mo" }
  ];

  /* -------------------------------------------------------------- seed
     A believable boutique studio. Deliberately imperfect: one production over
     budget, one blocked on an unsigned music license, one wrap incomplete. */
  var SEED = {
    productions: [
      { id:"p1", name:"Cascade Outdoors — Brand Film", number:"25-011", client:"Cascade Outdoors", type:"Commercial", stage:"Post", fee:185000, budget:132000, actual:141200, dueDate:"2026-08-05",
        clearPct:78, delivered:false, wrap:{ releases:[14,18], receipts:[31,34], callsheets:[4,4], logs:[6,6], assets:[2,3] },
        note:"Over budget (weather day). Delivery blocked — 4 talent releases + a music license still open." },
      { id:"p2", name:"Northshore Bank — Anthem Spot :60", number:"25-004", client:"Northshore Bank", type:"Commercial", stage:"Production", fee:240000, budget:210000, actual:96000, dueDate:"2026-09-12",
        clearPct:52, delivered:false, wrap:{ releases:[22,40], receipts:[48,60], callsheets:[3,5], logs:[9,12], assets:[0,4] },
        note:"Mid-shoot. Two more shoot days; the set-kiosk is capturing extra releases." },
      { id:"p3", name:"'Hollow' — Indie Short", number:"25-019", client:"In-house / festival", type:"Short Film", stage:"Development", fee:0, budget:64000, actual:6800, dueDate:"2027-01-15",
        clearPct:12, delivered:false, wrap:{ releases:[2,26], receipts:[3,40], callsheets:[0,6], logs:[0,8], assets:[0,2] },
        note:"Financing pitch out to two investors. Not greenlit — costs are pre-production only." },
      { id:"p4", name:"Selkirk Ford — Dealer Campaign", number:"24-088", client:"Selkirk Ford", type:"Commercial", stage:"Delivered", fee:96000, budget:74000, actual:71400, dueDate:"2026-06-20",
        clearPct:100, delivered:true, wrap:{ releases:[16,16], receipts:[28,28], callsheets:[3,3], logs:[5,5], assets:[3,3] },
        note:"Delivered and paid. Wrap book compiled and handed to the client. Under budget." },
      { id:"p5", name:"Timberline Resort — Winter Sizzle", number:"25-030", client:"Timberline Resort", type:"Branded Content", stage:"Pre-Production", fee:78000, budget:61000, actual:9200, dueDate:"2026-11-01",
        clearPct:20, delivered:false, wrap:{ releases:[0,20], receipts:[2,30], callsheets:[1,4], logs:[0,6], assets:[0,3] },
        note:"Breakdown done, call sheets drafting. Location releases out to the resort." }
    ],
    /* Clearance register — the rights-gate. `signed` gates delivery. */
    clearances: [
      { id:"cl1", production:"Cascade Outdoors — Brand Film", type:"Music License", subject:"Needle-drop — 'Ridgeline' (indie license)", signed:false, party:"Marmoset", note:"Sync license quote in; not countersigned. Blocks delivery." },
      { id:"cl2", production:"Cascade Outdoors — Brand Film", type:"Talent Release", subject:"4 background extras (river scene)", signed:false, party:"Extras", note:"Set-kiosk captured 14/18; 4 walk-ups never finished signing." },
      { id:"cl3", production:"Cascade Outdoors — Brand Film", type:"Location Release", subject:"Riverside county park", signed:true, party:"County Parks", note:"Filed." },
      { id:"cl4", production:"Northshore Bank — Anthem Spot :60", type:"Artwork/Brand License", subject:"Stock artwork in the set dressing", signed:false, party:"Getty", note:"Editorial-only license — needs a commercial upgrade before air." },
      { id:"cl5", production:"Northshore Bank — Anthem Spot :60", type:"Talent Release", subject:"Principal — on-camera spokesperson", signed:true, party:"Talent (SAG-AFTRA)", note:"Countersigned. Union paperwork clean." },
      { id:"cl6", production:"'Hollow' — Indie Short", type:"Minor/Guardian Consent", subject:"Child actor (lead)", signed:false, party:"Guardian", note:"Needed before any principal photography. Not greenlit yet." },
      { id:"cl7", production:"Selkirk Ford — Dealer Campaign", type:"Music License", subject:"Library track (commercial, in perpetuity)", signed:true, party:"Musicbed", note:"Filed with the wrap book." }
    ],
    crew: [
      { id:"cr1", name:"Dana Whitfield", role:"Director", rate:"$3,500/day", union:"DGA", gear:"—", status:"On 'Northshore'", note:"Studio principal / director." },
      { id:"cr2", name:"Marcus Lang", role:"DP", rate:"$1,800/day", union:"IATSE 600", gear:"Owns: ARRI Alexa Mini, prime set", status:"On 'Northshore'", note:"Camera package rents with him." },
      { id:"cr3", name:"Priya Anand", role:"Producer", rate:"$1,400/day", union:"—", status:"Across all", note:"Runs the board and the wrap." },
      { id:"cr4", name:"Theo Barnes", role:"Gaffer", rate:"$850/day", union:"IATSE 728", gear:"Owns: lighting truck", status:"On 'Northshore'", note:"" },
      { id:"cr5", name:"Ines Okafor", role:"Editor", rate:"$650/day", union:"—", status:"On 'Cascade' (post)", note:"Cutting the brand film." },
      { id:"cr6", name:"Ray Mendel", role:"Sound Mixer", rate:"$800/day", union:"IATSE 695", gear:"Owns: sound cart", status:"Available", note:"" }
    ],
    gear: [
      { id:"g1", item:"ARRI Alexa Mini LF (body)", tag:"CAM-01", status:"Out", to:"Northshore Bank", note:"Scanned out to the shoot." },
      { id:"g2", item:"DZO Vespid prime set (7)", tag:"LENS-03", status:"Out", to:"Northshore Bank", note:"With the A-cam." },
      { id:"g3", item:"Aputure 600d x4", tag:"LT-11", status:"Out", to:"Northshore Bank", note:"Gaffer package." },
      { id:"g4", item:"Sound cart — 8ch + lav kit", tag:"AUD-02", status:"In", to:"—", note:"Available." },
      { id:"g5", item:"DJI Ronin 4D", tag:"CAM-04", status:"Repair", to:"Service", note:"Gimbal motor — back Friday." }
    ],
    /* Budget line items feed the money spine (estimated vs actual). */
    budget: [
      { id:"b1", production:"Cascade Outdoors — Brand Film", group:"ATL", line:"Director + Producer", est:26000, act:26000 },
      { id:"b2", production:"Cascade Outdoors — Brand Film", group:"BTL", line:"Crew (4 days)", est:52000, act:61200 },
      { id:"b3", production:"Cascade Outdoors — Brand Film", group:"BTL", line:"Gear + Locations", est:28000, act:29000 },
      { id:"b4", production:"Cascade Outdoors — Brand Film", group:"POST", line:"Edit + Color + Sound", est:22000, act:21000 },
      { id:"b5", production:"Cascade Outdoors — Brand Film", group:"OTHER", line:"Insurance + Contingency", est:4000, act:4000 },
      { id:"b6", production:"Northshore Bank — Anthem Spot :60", group:"ATL", line:"Director + Talent (SAG)", est:64000, act:32000 },
      { id:"b7", production:"Northshore Bank — Anthem Spot :60", group:"BTL", line:"Crew + Gear (5 days)", est:98000, act:52000 },
      { id:"b8", production:"Northshore Bank — Anthem Spot :60", group:"POST", line:"Editorial + VFX", est:40000, act:8000 },
      { id:"b9", production:"Northshore Bank — Anthem Spot :60", group:"OTHER", line:"Insurance + Wrap", est:8000, act:4000 }
    ],
    /* Development pipeline — pitches to clients/investors. */
    pitches: [
      { id:"pi1", name:"Kootenai Health — Patient Stories (3-part)", client:"Kootenai Health", type:"Docu-series", stage:"Treatment sent", value:220000, prob:45, decision:"GO", views:"Investor viewed 3×", note:"Warm. Mux-hosted lookbook opened three times." },
      { id:"pi2", name:"Local Brewery — Launch Spot", client:"Panhandle Brewing", type:"Commercial", stage:"Bid out", value:48000, prob:70, decision:"GO", views:"Client viewed 2×", note:"Fast, in our lane." },
      { id:"pi3", name:"Feature 'Hollow' — equity raise", client:"Two angel investors", type:"Feature", stage:"Pitching", value:640000, prob:15, decision:"HOLD", views:"1 viewed, 1 pending", note:"Long shot; deck out, financing uncertain." },
      { id:"pi4", name:"National QSR — Regional Campaign", client:"via agency partner", type:"Commercial", stage:"Lead", value:900000, prob:10, decision:"NO-GO", views:"—", note:"Agency wants full union crew + insurance we'd have to staff up for. Out of depth this quarter." }
    ],
    team: [
      { id:"h1", name:"Dana Whitfield", role:"Founder / Director", type:"Human", status:"Active", dept:"Principal", note:"Signs, directs, seals the client relationship." },
      { id:"h2", name:"Priya Anand", role:"Head Producer", type:"Human", status:"Active", dept:"Production", note:"Owns the board, the budget, and the wrap." },
      { id:"h3", name:"Marcus Lang", role:"DP / Post Supervisor", type:"Human", status:"Active", dept:"Production", note:"Owns image + the delivery vault." },
      { id:"h4", name:"Vera", role:"Chief Operating Officer", type:"AI · DeepSeek", status:"Active", dept:"Command", note:"The interface machine to the principal." },
      { id:"h5", name:"Warrant", role:"Head of Clearances & Legal", type:"AI · DeepSeek", status:"Active", dept:"Clearances", note:"Owns the release vault and the rights-gate." },
      { id:"h6", name:"Ines Okafor", role:"Editor", type:"Human", status:"Active", dept:"Post", note:"Cutting 'Cascade'." }
    ],
    systems: [
      { id:"sy1", name:"Media store (RAID + LTO)", state:"CLEAR", metric:"96 TB · nightly + LTO archive verified" },
      { id:"sy2", name:"Delivery vault (S3)", state:"CLEAR", metric:"expiring links armed · paid-gate on" },
      { id:"sy3", name:"Review portal (frame-accurate)", state:"WATCH", metric:"storage 81% — 'Cascade' review stack is large" },
      { id:"sy4", name:"Set-kiosk release capture", state:"CLEAR", metric:"synced · 0 unsigned in queue" },
      { id:"sy5", name:"Auth / client portal", state:"CLEAR", metric:"99.98% uptime · 180ms" }
    ],
    matters: [
      { id:"mt1", title:"Cascade — music license not countersigned before air date", state:"Open", risk:"High", ref:"Sync license", note:"Airing without a countersigned sync license is direct copyright exposure. Hold delivery; route to counsel." },
      { id:"mt2", title:"Northshore — editorial-only stock used commercially", state:"Open", risk:"High", ref:"Getty license terms", note:"Editorial-license artwork appears in a paid spot. Upgrade the license or replace the dressing before air." },
      { id:"mt3", title:"'Hollow' — minor on set, consent + hours", state:"Open", risk:"Medium", ref:"Child labor / SAG", note:"A minor lead triggers guardian consent, tutoring and hour limits. Confirm before any photography." },
      { id:"mt4", title:"QSR pursuit — union signatory question", state:"Open", risk:"Medium", ref:"SAG-AFTRA signatory", note:"Becoming a signatory has lasting obligations. Advisory only; route to entertainment counsel." }
    ],
    approvals: [
      { id:"ap1", kind:"deliver", title:"Deliver 'Cascade Outdoors' final master to client", by:"Warrant (Clearances AE)", summary:"Client is asking for the master. Clearance is at 78% — a music license and 4 releases are unsigned.", state:"Pending", why:"The rights-gate: delivering before clearances are signed is a copyright and liability event. Blocked to a human." },
      { id:"ap2", kind:"pricing", title:"Bid — Kootenai Health docu-series", by:"Slate (Development AE)", summary:"Submit the 3-part series at $220,000 with a 32% target margin.", state:"Pending", why:"A number that goes to a client is the principal's call." },
      { id:"ap3", kind:"wrap", title:"Compile & release the wrap book — 'Cascade'", by:"Priya (Production)", summary:"One-click wrap: 14/18 releases, 31/34 receipts, all call sheets & logs, 2/3 assets. Not yet complete.", state:"Pending", why:"The wrap book only ships complete — the missing releases must be signed first." }
    ]
  };

  /* -------------------------------------------------------------- money + wrap spine */
  function prodActual(d, name) { d = d||db(); return d.budget.filter(function(b){return b.production===name;}).reduce(function(s,b){return s+(Number(b.act)||0);},0); }
  function totalBudget(d) { d=d||db(); return d.productions.reduce(function(s,p){return s+(Number(p.budget)||0);},0); }
  function totalActual(d) { d=d||db(); return d.productions.reduce(function(s,p){return s+(Number(p.actual)||0);},0); }
  function activeProds(d) { d=d||db(); return d.productions.filter(function(p){return !p.delivered && p.stage!=="Development";}); }
  function grossMargin(d) { d=d||db(); var fee=d.productions.reduce(function(s,p){return s+(Number(p.fee)||0);},0); var act=totalActual(d); return fee? ((fee-act)/fee)*100 : 0; }
  function overBudget(d) { d=d||db(); return d.productions.filter(function(p){return (Number(p.actual)||0) > (Number(p.budget)||0);}); }

  /* Wrap readiness: fraction of required wrap items collected. */
  function wrapReadiness(p) {
    var w = p.wrap || {}, keys = ["releases","receipts","callsheets","logs","assets"];
    var got=0, need=0;
    keys.forEach(function(k){ if (w[k]) { got += Number(w[k][0])||0; need += Number(w[k][1])||0; } });
    return need ? Math.round(got/need*100) : 0;
  }
  function wrapComplete(p) { return wrapReadiness(p) >= 100; }

  /* Clearance gate: a production can be delivered only when 100% cleared. */
  function unsignedClearances(d, name) { d=d||db(); return d.clearances.filter(function(c){ return (!name || c.production===name) && !c.signed; }); }
  function canDeliver(d, name) { return unsignedClearances(d, name).length === 0; }
  function signClearance(id) { return save(function(d){ d.clearances.forEach(function(c){ if(c.id===id) c.signed=true; }); }); }

  /* -------------------------------------------------------------- price book */
  var ROOMS = {
    develop:   { label:"Development & Pitch", mo:75, build:550, why:"Interactive treatment/lookbook builder (Mux-hosted refs) + the B2B and investor pipeline." },
    clearances:{ label:"Clearances & Vault", mo:95, build:750, why:"The release/NDA vault + the rights-gate. Nothing delivers until every release and license is signed. Set-kiosk capture." },
    preprod:   { label:"Pre-Production", mo:80, build:600, why:"Script breakdown & tagging, storyboards, and the call-sheet generator (weather + hospital + maps)." },
    crew:      { label:"Crew & Gear", mo:75, build:550, why:"Freelance crew CRM by day-rate/union, and the QR gear tracker in and out of the warehouse." },
    post:      { label:"Post & Review", mo:85, build:650, why:"Frame-accurate client review with time-stamped comments, and the delivery vault (paid-gate)." },
    budget:    { label:"Budget & Accounting", mo:95, build:800, why:"The AICP top sheet — estimated vs actual, POs & petty cash, timecards. Kills Movie Magic." },
    wrap:      { label:"Wrap Book", mo:110, build:900, why:"One click compiles every release, receipt, call sheet, log and asset for a project into a white-labeled client portal." },
    books:     { label:"Studio Metrics", mo:80, build:600, why:"Margin by production, budget variance, bid-win rate, utilization — computed, not reconstructed." },
    hr:        { label:"HR · People Ops", mo:65, build:400, why:"Roster, onboarding, union status, deal memos." },
    it:        { label:"IT · System Health", mo:60, build:400, why:"CLEAR / WATCH / INTERVENE on the media store, the vault, the review portal and backups." },
    law:       { label:"Law · Counsel", mo:110, build:800, why:"SAG-AFTRA, sync licenses, minors, signatory questions — advisory, with a hard fence to a real attorney." },
    org:       { label:"Agent Org · Bus", mo:150, build:1300, why:"The ten AI department chains, the event bus, and the confidence gates. The studio's brain." }
  };
  var TIERS = {
    lite: { key:"lite", name:"Single / Twin", rank:1, mo:500, build:3000, desc:"The working studio. Development, clearances, pre-pro, crew & gear, and the budget.", base:"Single studio · up to 8 crew seats", includes:["develop","clearances","preprod","crew","budget"] },
    standard: { key:"standard", name:"Multiplex", rank:2, mo:1200, build:7600, desc:"Adds post & review, the Wrap Book, studio metrics, HR, IT — and the agent org.", base:"Single studio · up to 25 seats", includes:["develop","clearances","preprod","crew","budget","post","wrap","books","hr","it","org"] },
    grandsuite: { key:"grandsuite", name:"Circuit", rank:3, mo:2800, build:12200, desc:"The whole studio, nothing held back. Every department, the full agent org, and counsel.", base:"Multi-project · unlimited seats · dedicated environment", includes:["develop","clearances","preprod","crew","budget","post","wrap","books","hr","it","law","org"] }
  };
  var DEPTS = [
    { group:"Command", items:[ { href:"dashboard.html", label:"Command Center", ic:"◎" }, { href:"calendar.html", label:"Calendar", ic:"▤" }, { href:"contacts.html", label:"Contacts", ic:"☎" }, { href:"connect.html", label:"Connect · Video", ic:"◉" }, { href:"records.html", label:"Records · Filing", ic:"▤" }, { href:"approvals.html", label:"Approval Desk", ic:"✓", accent:"ops" } ]},
    { group:"Development", items:[ { href:"develop.html", label:"Development & Pitch", ic:"◆", room:"develop", accent:"develop" } ]},
    { group:"The Production", items:[ { href:"preprod.html", label:"Pre-Production", ic:"▦", room:"preprod", accent:"preprod" }, { href:"crew.html", label:"Crew & Gear", ic:"⚙", room:"crew", accent:"crew" }, { href:"post.html", label:"Post & Review", ic:"⧉", room:"post", accent:"post" } ]},
    { group:"Compliance", items:[ { href:"clearances.html", label:"Clearances & Vault", ic:"⊛", room:"clearances", accent:"clear" }, { href:"wrap.html", label:"Wrap Book", ic:"❖", room:"wrap", accent:"wrap" } ]},
    { group:"Money", items:[ { href:"budget.html", label:"Budget & Accounting", ic:"◧", room:"budget", accent:"budget" }, { href:"books.html", label:"Studio Metrics", ic:"◭", room:"books", accent:"books" } ]},
    { group:"People & Systems", items:[ { href:"hr.html", label:"HR · People Ops", ic:"☷", room:"hr", accent:"hr" }, { href:"it.html", label:"IT · System Health", ic:"♥", room:"it", accent:"it" } ]},
    { group:"Governance", items:[ { href:"law.html", label:"Law · Counsel", ic:"⚖", room:"law", accent:"law" }, { href:"org.html", label:"Agent Org · Bus", ic:"❖", room:"org", accent:"ops" } ]}
  ];

  var SEATS = {
    coo: { id:"coo", name:"Vera", role:"Chief Operating Officer", tier:"COO", dept:"Command", gate:null, line:"Apex seat. Makes the ordinary call; defers to the principal only behind a Fence." },
    depts: [
      { key:"develop", name:"Development & Pitch", accent:"develop", gate:80, dh:{name:"Locke",line:"Owns which pitches are real — the go/no-go and why."}, ae:{name:"Slate",line:"Packages the treatment, the lookbook, the bid."}, pace:{name:"Compass",line:"Only voice out of the triad. GO at ≥80%; below that a HOLD with reasons."}, lensA:{name:"Reach",line:"Opportunity lens — does this win and build the body of work we want?"}, lensB:{name:"Filter",line:"Qualification lens — funded, in our lane, and can we crew and clear it?"} },
      { key:"production", name:"Production · The Board", accent:"preprod", gate:80, dh:{name:"Marek",line:"Owns the shoot — the schedule, the call sheet, the day."}, ae:{name:"Pell",line:"Packages the breakdown, the call sheets, every hand-off."}, pace:{name:"Trueline",line:"Releases the shoot plan at ≥80%; below the bar it holds and asks."}, lensA:{name:"Setup",line:"Coverage lens — do we have the shots and the day to get them?"}, lensB:{name:"Logistics",line:"Feasibility lens — weather, hours, gear, and the money to do it."} },
      { key:"clearances", name:"Clearances & Legal", accent:"clear", gate:85, dh:{name:"Warrant",line:"Owns the release vault and the rights-gate. Nothing delivers uncleared."}, ae:{name:"Vault",line:"Packages every release, license and NDA; flags what's unsigned."}, pace:{name:"Chain",line:"High bar (85%). An uncleared asset never releases — it routes to a human."}, lensA:{name:"Enable",line:"Delivery lens — what gets the client their master cleanly?"}, lensB:{name:"Exposure",line:"Liability lens — is every frame and note actually licensed and signed?"} },
      { key:"crew", name:"Crew & Gear", accent:"crew", gate:80, dh:{name:"Lattice",line:"Owns the freelance roster and the gear cage."}, ae:{name:"Relay",line:"Packages day-rates, union status, and the QR pull-list."}, pace:{name:"Interlock",line:"Releases a crew/gear plan at ≥80%; a conflict escalates."}, lensA:{name:"Bench",line:"Talent lens — who and what do we need for this shoot?"}, lensB:{name:"Clash",line:"Availability lens — is the crew and the gear actually free?"} },
      { key:"post", name:"Post & Review", accent:"post", gate:80, dh:{name:"Cutter",line:"Owns image and the delivery vault."}, ae:{name:"Frame",line:"Packages the review cut, the notes, the deliverables."}, pace:{name:"Master",line:"Releases a cut at ≥80%; delivery is gated on clearance regardless."}, lensA:{name:"Craft",line:"Story lens — is the cut the strongest version?"}, lensB:{name:"Deliver",line:"Spec lens — does the master meet the delivery spec and the paid-gate?"} },
      { key:"money", name:"Budget & Accounting", accent:"budget", gate:85, dh:{name:"Sterling",line:"Owns the integrity of every number. A wrong figure sinks a bid."}, ae:{name:"Ledger",line:"Packages the AICP top sheet, POs, timecards, margin."}, pace:{name:"Baseline",line:"High bar (85%). A bluffed budget loses money on the day."}, lensA:{name:"Actual",line:"Spend lens — what actually cleared, tagged LIVE only."}, lensB:{name:"Margin",line:"Profit lens — does this production clear the target margin?"} },
      { key:"hr", name:"HR · People Ops", accent:"hr", gate:80, dh:{name:"Hale",line:"Owns the team's health — hiring, deal memos, union status."}, ae:{name:"Roster",line:"Packages offers, onboarding, and the paperwork map."}, pace:{name:"Balance",line:"Releases people decisions at ≥80%; a termination routes to a human."}, lensA:{name:"Crewup",line:"Talent lens — who do we need across the slate?"}, lensB:{name:"Record",line:"Compliance lens — union, W-9s, deal memos current?"} },
      { key:"it", name:"IT · System Health", accent:"it", gate:80, dh:{name:"Ward",line:"Owns uptime — the media store, the vault, the review portal."}, ae:{name:"Cache",line:"Packages incidents, the watch list, backup + LTO verification."}, pace:{name:"Steady",line:"Calls system health; a real outage or lost media escalates immediately."}, lensA:{name:"Access",line:"Availability lens — is the store and the vault reachable?"}, lensB:{name:"Loss",line:"Risk lens — which footage isn't backed up to LTO yet?"} },
      { key:"law", name:"Law · Counsel", accent:"law", gate:85, dh:{name:"Barrow",line:"Owns the contract + rights read — SAG, sync, minors. NOT a lawyer; advisory only."}, ae:{name:"File",line:"Packages the matter, the risk, the sources; flags what needs a real attorney."}, pace:{name:"Care",line:"High bar (85%). Anything with real exposure routes to entertainment counsel."}, lensA:{name:"Terms",line:"Enablement lens — how do we get to signed and delivered cleanly?"}, lensB:{name:"Claim",line:"Exposure lens — what claim could arise, and does E&O respond?"} },
      { key:"ops", name:"Operations", accent:"ops", gate:80, dh:{name:"Keystone",line:"Owns the connective tissue — the desk that keeps the studio running."}, ae:{name:"Index",line:"Owns the project filing cabinet and the wrap calendar."}, pace:{name:"Meter",line:"Releases at ≥80%; a cross-department conflict escalates to the COO."}, lensA:{name:"Method",line:"Process lens — the cleanest repeatable way to run the slate?"}, lensB:{name:"Choke",line:"Throughput lens — where's the bottleneck on the board?"} }
    ]
  };

  /* -------------------------------------------------------------- brain */
  var BRAIN = {
    develop: { match:["pitch","develop","treatment","lookbook","bid","pipeline","investor","client","win","go","no-go"], build:function(d){ var go=d.pitches.filter(function(p){return p.decision==="GO";}); var val=go.reduce(function(s,p){return s+p.value;},0); return { stance: go.length?"Chase the "+go.length+" GO pitches ($"+val.toLocaleString()+") and formally NO-GO the National QSR — becoming a full-union signatory this quarter is out of our depth.":"Nothing is a clean GO — qualify before spending a producer's week.", conf: go.length>=2?84:66, reasons:[{t:"data",s:go.length+" pitches marked GO worth $"+val.toLocaleString()+"; Kootenai's investor opened the lookbook 3×."},{t:"data",s:"Bid-win target band is "+BENCH.bidWin.target[0]+"–"+BENCH.bidWin.target[1]+"% ("+BENCH.bidWin.src+")."},{t:"assumption",s:"Assumes the Kootenai margin holds at 32% — un-negotiated, so treat as an estimate."}] }; } },
    production: { match:["shoot","production","call sheet","schedule","breakdown","day","crew","gear","weather","board"], build:function(d){ var active=activeProds(d); return { stance:"Protect the Northshore shoot days — two left, and the set-kiosk is closing the release gap in real time. Hold 'Hollow' until it's greenlit.", conf:82, reasons:[{t:"data",s:active.length+" active production(s); Northshore is mid-shoot with releases at 52%."},{t:"data",s:"Gear CAM-01 + LENS-03 are out to Northshore; the Ronin is in repair back Friday."},{t:"assumption",s:"Assumes no added weather day — Cascade already took one and went over."}] }; } },
    clearances: { match:["clear","release","license","rights","deliver","vault","sign","nda","music","talent","sag"], build:function(d){ var open=unsignedClearances(d); var casc=unsignedClearances(d,"Cascade Outdoors — Brand Film"); return { stance:"Do NOT deliver Cascade — "+casc.length+" clearance(s) are unsigned, including the music license. Delivering uncleared is a copyright event, not a scheduling call.", conf:88, reasons:[{t:"data",s:open.length+" unsigned clearance(s) across the slate; "+casc.length+" on Cascade block its delivery."},{t:"data",s:"The rights-gate holds: the delivery vault stays locked until clearance hits 100%."},{t:"assumption",s:"Assumes the sync license countersigns as quoted — until it does, the track can't air."}] }; } },
    money: { match:["budget","money","margin","actual","estimate","po","petty","timecard","cost","aicp","over"], build:function(d){ var over=overBudget(d); var gm=grossMargin(d); return { stance:"Cascade is over budget on the weather day — margin across the slate is "+gm.toFixed(0)+"%. Bill Cascade the moment it clears, and hold the line on Northshore's remaining days.", conf:79, reasons:[{t:"data",s:over.length+" production(s) over budget; total actual $"+totalActual(d).toLocaleString()+" against $"+totalBudget(d).toLocaleString()+" budgeted."},{t:"data",s:"Blended gross margin is "+gm.toFixed(0)+"% against a "+BENCH.grossMargin.target[0]+"–"+BENCH.grossMargin.target[1]+"% band ("+BENCH.grossMargin.src+")."},{t:"assumption",s:"Assumes no fee dispute on Cascade — un-audited, so this holds under the 85% Money bar."}] }; } },
    post: { match:["post","edit","color","review","cut","deliver","master","vault","frame","note"], build:function(d){ var casc=d.productions.filter(function(p){return p.name.indexOf("Cascade")>=0;})[0]; return { stance:"Cascade's cut is ready for the client review round, but the master cannot leave the vault until clearance clears — post is done, rights are not.", conf:83, reasons:[{t:"data",s:"Cascade is in Post at "+ (casc?casc.clearPct:0) +"% clearance; the delivery vault is paid-gated AND clearance-gated."},{t:"data",s:"Frame-accurate review notes are the record of what the client approved — kept per version."},{t:"assumption",s:"Assumes the client signs off on the current cut; a re-edit reopens the timeline."}] }; } },
    hr: { match:["hire","crew","onboard","union","deal memo","staff","team","people","w-9","payroll"], build:function(d){ return { stance:"Roster is healthy for the current slate. Before the QSR pursuit, decide the signatory question — it changes who we can crew.", conf:85, reasons:[{t:"data",s:d.crew.length+" freelance crew tracked by day-rate and union; "+d.crew.filter(function(c){return c.status==="Available";}).length+" available now."},{t:"data",s:"Two department heads own image and the wrap — the bottleneck seats."},{t:"assumption",s:"A termination or a signatory commitment always routes to a human."}] }; } },
    it: { match:["system","health","uptime","backup","lto","media","store","vault","portal","outage","storage"], build:function(d){ var watch=d.systems.filter(function(s){return s.state!=="CLEAR";}); return { stance: watch.length?"WATCH: "+watch.map(function(s){return s.name;}).join(", ")+". Nothing needs a human INTERVENE, but the review portal is at 81% during a delivery push.":"System is CLEAR — media store, vault and portal reachable, LTO verified.", conf: watch.length?84:89, reasons:[{t:"data",s:d.systems.length+" service(s) monitored; "+watch.length+" on WATCH, 0 INTERVENE."},{t:"data",s:"Nightly backup + LTO archive verified — verified, not assumed. An unverified backup isn't a backup."},{t:"assumption",s:"Assumes the showroom checks mirror production; a true media-loss event pages a person."}] }; } },
    law: { match:["legal","law","contract","sag","aftra","sync","license","minor","signatory","rights","e&o","liability"], build:function(d){ var open=d.matters.filter(function(m){return m.state==="Open";}); var high=open.filter(function(m){return m.risk==="High";}); return { stance:"Two matters need a real attorney before anything airs: Cascade's uncountersigned sync license, and Northshore's editorial-only stock used commercially.", conf:66, reasons:[{t:"data",s:open.length+" open matter(s); "+high.length+" rated High risk."},{t:"assumption",s:"This is an advisory read, NOT legal advice. Entertainment counsel owns the sign-off — that caps confidence under the 85% bar by design."},{t:"assumption",s:"Airing with an editorial-only license or an uncountersigned sync is direct copyright exposure; needs counsel to clear."}] }; } },
    ops: { match:["operations","process","filing","calendar","wrap","bottleneck","handoff","board","running","admin"], build:function(d){ var open=d.productions.filter(function(p){return !p.delivered && !wrapComplete(p);}); return { stance:"The bottleneck is the wrap on Cascade — the cut is done and the client is waiting, but the wrap book can't compile until the last releases sign.", conf:81, reasons:[{t:"data",s:open.length+" production(s) with an incomplete wrap; Cascade is "+wrapReadiness(d.productions.filter(function(p){return p.name.indexOf('Cascade')>=0;})[0])+"% wrapped."},{t:"data",s:"Every released conclusion is filed to the project record with a wrap-calendar follow-up."},{t:"assumption",s:"Assumes current staffing; winning Kootenai needs a capacity review before it overlaps Northshore post."}] }; } }
  };

  function consult(deptKey, question) {
    var d = db();
    var dept = SEATS.depts.filter(function (x){ return x.key===deptKey; })[0];
    var brain = BRAIN[deptKey];
    if (!dept || !brain) return null;
    var verdict = brain.build(d, question||"");
    var passed = verdict.conf >= dept.gate;
    var topic = dept.key;
    var stamp = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    var events = [
      { topic:topic+".sot.read", kind:"route", from:dept.dh.name, to:"Filing · SSOT", body:dept.dh.name+" is called to the Source of Truth and reads it before acting. SSOT loaded ✓ — canon, fences, and this project's record in hand.", stamp:stamp },
      { topic:topic+".ae.packaged", kind:"route", from:dept.ae.name, to:dept.pace.name, body:dept.ae.name+" (Administrative Executive) packages the ask, files it, and routes it down the bus to the triad: \""+(question||"(department review)")+"\"", stamp:stamp },
      { topic:topic+".triad.finding", kind:"deliberate", from:dept.lensA.name, to:dept.pace.name, body:"["+dept.lensA.name+"] "+lensTake(verdict,"A"), stamp:stamp },
      { topic:topic+".triad.finding", kind:"deliberate", from:dept.lensB.name, to:dept.pace.name, body:"["+dept.lensB.name+"] "+lensTake(verdict,"B"), stamp:stamp }
    ];
    var COORD = { develop:{to:"money",why:"confirm the bid clears the target margin before it goes out"}, money:{to:"develop",why:"flag which pitches are actually funded before they're forecast"}, production:{to:"crew",why:"lock the crew and gear against the shoot days"}, crew:{to:"production",why:"hand the pull-list to the board"}, clearances:{to:"post",why:"tell post which assets are cleared to leave the vault"}, post:{to:"clearances",why:"pull the clearance status before the master ships"}, hr:{to:"ops",why:"get new crew onto the filing and wrap calendar"}, it:{to:"ops",why:"put the storage watch on the ops calendar"}, law:{to:"clearances",why:"confirm the license read against the release vault"}, ops:{to:"hr",why:"raise the wrap bottleneck as a capacity question"} };
    var co = COORD[dept.key];
    if (co) { var peer = SEATS.depts.filter(function (x){ return x.key===co.to; })[0]; if (peer) events.push({ topic:topic+".ae.lateral", kind:"route", from:dept.ae.name, to:peer.ae.name+" ("+peer.name+" AE)", body:dept.ae.name+" coordinates laterally with "+peer.ae.name+" to "+co.why+" — AE↔AE, same position, no chain needed.", stamp:stamp }); }
    if (passed) {
      events.push({ topic:topic+".pacemaker.released", kind:"conclude", from:dept.pace.name, to:dept.ae.name, body:verdict.stance, conclusion:true, verdict:verdict, gate:dept.gate, stamp:stamp });
      events.push({ topic:topic+".ae.filed", kind:"route", from:dept.ae.name, to:dept.dh.name, body:dept.ae.name+" files the released conclusion to the project record and sets a follow-up, then hands it to "+dept.dh.name+".", stamp:stamp });
      events.push({ topic:"coo.decision", kind:"route", from:dept.dh.name, to:SEATS.coo.name+" (COO)", body:dept.dh.name+" carries it up to "+SEATS.coo.name+", the interface to the principal: cleared the "+dept.gate+"% bar.", stamp:stamp });
    } else {
      events.push({ topic:"escalation.below_bar", kind:"reject", from:dept.pace.name, to:SEATS.coo.name+" → the Principal", body:"Held below the "+dept.gate+"% bar ("+verdict.conf+"%). Needs a human — not enough live data. "+dept.ae.name+" files the hold; "+SEATS.coo.name+" routes it up with reasons attached.", conclusion:true, verdict:verdict, gate:dept.gate, escalate:true, stamp:stamp });
    }
    save(function (x){ events.forEach(function (e){ e.id="e"+(x.seq++); e.dept=dept.key; x.bus.push(e); }); if (x.bus.length>60) x.bus=x.bus.slice(-60); });
    return { dept:dept, verdict:verdict, passed:passed, events:events };
  }
  function lensTake(v, which) { var pro=v.reasons.filter(function(r){return r.t==="data";})[0]; var con=v.reasons.filter(function(r){return r.t==="assumption";})[0]; if (which==="A") return "Argues FOR: "+(pro?pro.s:"the evidence supports moving."); return "Pushes back: "+(con?con.s:"the evidence isn't fully sourced yet."); }
  function routeDept(question) { var q=String(question||"").toLowerCase(),best=null,bs=0; Object.keys(BRAIN).forEach(function (k){ var sc=BRAIN[k].match.reduce(function(s,w){return s+(q.indexOf(w)>=0?1:0);},0); if (sc>bs){bs=sc;best=k;} }); return best||"production"; }
  function askVera(question) {
    var deptKey = routeDept(question);
    var dept = SEATS.depts.filter(function (x){ return x.key===deptKey; })[0];
    var stamp = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    save(function (x){ x.bus.push({ id:"e"+(x.seq++), dept:"coo", topic:"coo.route", kind:"route", from:SEATS.coo.name+" (COO)", to:dept.dh.name+" ("+dept.name+")", body:SEATS.coo.name+" takes the ask off the principal's desk and routes it to "+dept.name+" — she gates and packages, she doesn't do the work herself.", stamp:stamp }); });
    var r = consult(deptKey, question);
    var packaged = r.passed ? (SEATS.coo.name+": On track. "+dept.name+" cleared its "+dept.gate+"% bar — I'm releasing this to you. "+r.verdict.stance) : (SEATS.coo.name+": Holding this off your desk. "+dept.name+" came in at "+r.verdict.conf+"%, under its "+dept.gate+"% bar — it needs a human. Here's what I have, and I've set a follow-up. "+r.verdict.stance);
    return { deptKey:deptKey, dept:dept, result:r, packaged:packaged, on_track:r.passed };
  }

  function approvals() { return db().approvals || []; }
  function stage(kind, title, summary, why, by) { var item = { id:"ap"+now(), kind:kind||"general", title:title||"Untitled", summary:summary||"", why:why||"Behind a fence — needs the principal.", by:by||"The org", state:"Pending" }; save(function (d){ (d.approvals=d.approvals||[]).push(item); }); return item; }
  function decideApproval(id, decision) { save(function (d){ (d.approvals||[]).forEach(function (a){ if (a.id===id) a.state=decision; }); }); return approvals(); }

  /* -------------------------------------------------------------- configurator */
  function tier() { return db().tier || "grandsuite"; }
  function tierRank() { return TIERS[tier()].rank; }
  function setTier(k) { save(function (d){ d.tier=k; d.adds=[]; d.offs=[]; }); }
  function activeRooms() { var d=db(); var inc=(TIERS[d.tier]||TIERS.grandsuite).includes.slice(); (d.offs||[]).forEach(function(k){var i=inc.indexOf(k);if(i>=0)inc.splice(i,1);}); (d.adds||[]).forEach(function(k){if(inc.indexOf(k)<0&&ROOMS[k])inc.push(k);}); return inc; }
  function hasRoom(k) { return !k || activeRooms().indexOf(k)>=0; }
  function toggleRoom(k) { if (!ROOMS[k]) return; save(function (d){ var inc=(TIERS[d.tier]||TIERS.grandsuite).includes; d.adds=d.adds||[]; d.offs=d.offs||[]; var inP=inc.indexOf(k)>=0,iA=d.adds.indexOf(k),iO=d.offs.indexOf(k); if (inP){ if(iO>=0)d.offs.splice(iO,1); else d.offs.push(k); } else { if(iA>=0)d.adds.splice(iA,1); else d.adds.push(k); } }); }
  function priceNow() {
    var d=db(), t=TIERS[d.tier]||TIERS.grandsuite;
    var adds=(d.adds||[]).filter(function(k){return ROOMS[k];}), offs=(d.offs||[]).filter(function(k){return ROOMS[k];});
    var addMo=adds.reduce(function(s,k){return s+ROOMS[k].mo;},0), addBuild=adds.reduce(function(s,k){return s+ROOMS[k].build;},0);
    var offMo=offs.reduce(function(s,k){return s+ROOMS[k].mo;},0), offBuild=offs.reduce(function(s,k){return s+ROOMS[k].build;},0);
    var rooms=activeRooms();
    var alaMo=rooms.reduce(function(s,k){return s+(ROOMS[k]?ROOMS[k].mo:0);},0), alaBuild=rooms.reduce(function(s,k){return s+(ROOMS[k]?ROOMS[k].build:0);},0);
    var mo=Math.max(0,t.mo+addMo-offMo), build=Math.max(0,t.build+addBuild-offBuild);
    return { tier:t, rooms:rooms, adds:adds, offs:offs, mo:mo, build:build, addMo:addMo, offMo:offMo, addBuild:addBuild, offBuild:offBuild, alaMo:alaMo, alaBuild:alaBuild, platformMo:Math.max(0,mo-alaMo), savingMo:Math.max(0,alaMo-mo), changed:adds.length>0||offs.length>0 };
  }
  function priceLabel() { var p=priceNow(); return money(p.mo)+"/mo licensed"; }

  /* -------------------------------------------------------------- view helpers */
  function el(html) { var t=document.createElement("template"); t.innerHTML=String(html).trim(); return t.content.firstChild; }
  function esc(s) { return String(s==null?"":s).replace(/[&<>"']/g, function (c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function money(n){ return "$"+(Math.round(Number(n)||0)).toLocaleString(); }
  function pct(n, dp){ return (Number(n)||0).toFixed(dp===undefined?0:dp)+"%"; }
  function brandMark() {
    return '<img src="https://www.aexperiences.com/8mm_OS.png" alt="8mm OS" onerror="this.style.display=\'none\';this.parentNode.classList.add(\'fallback\')">' +
      '<svg class="fallback-mark" viewBox="0 0 32 32" width="24" height="24" style="display:none" aria-hidden="true"><g fill="none" stroke="#1a1710" stroke-width="1.7"><rect x="6" y="7" width="20" height="18" rx="2"/><circle cx="16" cy="16" r="4"/><path d="M6 11h3M6 21h3M23 11h3M23 21h3"/></g></svg>';
  }

  function renderShell(active) {
    var side = document.createElement("aside"); side.className = "sidebar";
    side.appendChild(el('<a href="dashboard.html" class="brand"><div class="bmark" aria-hidden="true">'+brandMark()+'</div><div><div class="bt">8mm OS</div><div class="bs">Film Studio OS</div></div></a>'));
    var nav = document.createElement("nav"); nav.className = "nav"; var on = activeRooms();
    DEPTS.forEach(function (grp) {
      nav.appendChild(el('<div class="nav-group">'+esc(grp.group)+'</div>'));
      grp.items.forEach(function (it) {
        var off = it.room && on.indexOf(it.room)<0;
        var a = el('<a href="'+(off?"javascript:void(0)":it.href)+'" class="navlink '+(it.href===active?"active":"")+(off?" locked":"")+'"><span class="ic">'+it.ic+'</span><span class="lb">'+esc(it.label)+'</span>'+(off?'<span class="tier-tag">+'+money(ROOMS[it.room].mo)+'</span>':'')+'</a>');
        if (off) { a.title="Add "+ROOMS[it.room].label+" for "+money(ROOMS[it.room].mo)+"/mo + "+money(ROOMS[it.room].build)+" build"; a.addEventListener("click", function (){ toggleRoom(it.room); toast(ROOMS[it.room].label+" added — "+priceLabel(),"ok"); setTimeout(function(){location.reload();},500); }); }
        nav.appendChild(a);
      });
    });
    side.appendChild(nav);
    return side;
  }
  function renderTopbar(crumb) {
    var p = priceNow();
    var bar = document.createElement("div"); bar.className = "topbar";
    bar.innerHTML = '<button class="navtoggle" id="navToggle" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button><div class="crumbs">8mm OS · <b>'+esc(crumb)+'</b></div><div class="spacer"></div><div class="tierpill" id="tierPillStatic"><span class="dot"></span><div><b>'+esc(p.tier.name)+(p.changed?' <i class="cfg">configured</i>':'')+'</b> <span class="price">'+money(p.mo)+'/mo licensed</span></div><span class="chev">▾</span></div><div class="who"><div class="av">DW</div><div>Dana Whitfield<br><span class="muted small">Founder · Director</span></div></div>';
    var menu = document.createElement("div"); menu.className = "tiermenu"; menu.id = "tierMenu";
    menu.appendChild(el('<div class="tm-head">Start from a package, then <b>add or take off any department</b>. Every one is priced on its own, so the build fits the studio instead of the studio fitting the build.</div>'));
    Object.keys(TIERS).sort(function (a,b){ return TIERS[b].rank-TIERS[a].rank; }).forEach(function (k) {
      var tt = TIERS[k];
      var opt = el('<div class="tieropt '+(k===tier()?"on":"")+'"><div class="to-top"><span class="to-name">'+esc(tt.name)+'</span><span class="to-price">'+money(tt.mo)+'/mo licensed</span></div><div class="to-desc">'+esc(tt.desc)+'</div><div class="to-base">'+esc(tt.base)+' · '+tt.includes.length+' departments</div></div>');
      opt.addEventListener("click", function (e){ e.stopPropagation(); setTier(k); location.reload(); });
      menu.appendChild(opt);
    });
    menu.appendChild(el('<div class="tm-sub">Departments — toggle any one on or off</div>'));
    var on = activeRooms(); var list = document.createElement("div"); list.className = "roomlist";
    Object.keys(ROOMS).forEach(function (k) {
      var r = ROOMS[k], isOn = on.indexOf(k)>=0, inPack = p.tier.includes.indexOf(k)>=0;
      var row = el('<div class="roomrow '+(isOn?"on":"")+'"><span class="rr-box">'+(isOn?"✓":"+")+'</span><span class="rr-name">'+esc(r.label)+(isOn&&!inPack?' <i class="rr-flag add">added</i>':'')+(!isOn&&inPack?' <i class="rr-flag off">removed</i>':'')+'</span><span class="rr-price">'+money(r.mo)+'/mo</span><span class="rr-why">'+esc(r.why)+'</span></div>');
      row.addEventListener("click", function (e){ e.stopPropagation(); toggleRoom(k); toast(r.label+(activeRooms().indexOf(k)>=0?" added — ":" removed — ")+priceLabel(),"ok"); setTimeout(function(){location.reload();},500); });
      list.appendChild(row);
    });
    menu.appendChild(list);
    var total = '<div class="tm-total"><div class="tt-line"><span>'+esc(p.tier.name)+' package</span><b>'+money(p.tier.mo)+'/mo</b></div>'+(p.adds.length?'<div class="tt-line add"><span>+ '+p.adds.length+' department'+(p.adds.length>1?"s":"")+' added</span><b>+'+money(p.addMo)+'/mo</b></div>':'')+(p.offs.length?'<div class="tt-line off"><span>− '+p.offs.length+' department'+(p.offs.length>1?"s":"")+' removed</span><b>−'+money(p.offMo)+'/mo</b></div>':'')+'<div class="tt-line grand"><span>Configured</span><b>'+money(p.mo)+'/mo licensed</b></div><div class="tt-save">'+p.rooms.length+' department'+(p.rooms.length===1?"":"s")+' at '+money(p.alaMo)+'/mo, plus '+money(p.platformMo)+'/mo platform — '+esc(p.tier.base.toLowerCase())+'.</div><div class="tt-draft">Draft pricing — Accelerated Experiences LLC sets every live price.</div></div>';
    menu.appendChild(el(total));
    menu.addEventListener("click", function (e){ e.stopPropagation(); });
    setTimeout(function () { var pill=document.getElementById("tierPill"); if (pill) pill.addEventListener("click", function (e){ e.stopPropagation(); menu.classList.toggle("open"); }); document.addEventListener("click", function (){ menu.classList.remove("open"); }); }, 0);
    var frag = document.createDocumentFragment(); frag.appendChild(bar); frag.appendChild(menu); return frag;
  }
  function ribbon() { return el('<div class="ribbon"><span class="live">LIVE SHOWROOM</span> — this is the real OS, not a slideshow. Everything you type stays in your browser and resets when you leave. <a href="javascript:void(0)" id="resetFloor">Reset the floor</a></div>'); }
  function footer() { return el('<div class="ae-credit">Powered by <b>Accelerated Experiences LLC</b> · 8mm OS is a white-label build. Demo data is a fictional studio; benchmark figures are estimates and tagged.</div>'); }
  /* The fleet-wide Command Center polish layer. One file on the store, loaded by
     every product, so a change lands everywhere at once instead of fourteen times. */
  function loadFlava(){
    if(document.getElementById("aeFlavaCss")) return;
    var l=document.createElement("link"); l.id="aeFlavaCss"; l.rel="stylesheet";
    l.href="https://www.aexperiences.com/ae-flava.css"; document.head.appendChild(l);
    var j=document.createElement("script"); j.src="https://www.aexperiences.com/ae-flava.js";
    j.defer=true; document.head.appendChild(j);
  }
  function mount(opts) {
    try{ loadFlava(); }catch(e){}
    opts = opts || {}; db();
    var app = document.createElement("div"); app.className = "app";
    var scrim = document.createElement("div"); scrim.className = "navscrim"; scrim.id = "navScrim";
    var side = renderShell(opts.active);
    var main = document.createElement("div"); main.className = "main";
    main.appendChild(ribbon()); main.appendChild(renderTopbar(opts.crumb || "Command Center"));
    var content = document.createElement("div"); content.className = "content"; content.id = "content";
    main.appendChild(content); main.appendChild(footer());
    app.appendChild(scrim); app.appendChild(side); app.appendChild(main);
    document.body.innerHTML = ""; document.body.appendChild(app);
    document.body.appendChild(el('<div id="toast-wrap"></div>'));
    setTimeout(function () {
      var r = document.getElementById("resetFloor");
      if (r) r.addEventListener("click", function (){ resetFloor(); toast("Showroom reset to a fresh floor.","ok"); setTimeout(function(){location.reload();},450); });
      var t = document.getElementById("navToggle");
      if (t) t.addEventListener("click", function (){ app.classList.toggle("nav-open"); });
      if (scrim) scrim.addEventListener("click", function (){ app.classList.remove("nav-open"); });
    }, 0);
    return content;
  }
  function toast(msg, kind) { var w=document.getElementById("toast-wrap"); if (!w) return; var t=el('<div class="toast '+(kind||"")+'">'+esc(msg)+'</div>'); w.appendChild(t); setTimeout(function (){ t.style.opacity="0"; setTimeout(function(){t.remove();},250); }, 2600); }
  function page(title, sub, actionsHTML) { return el('<div class="pagehead"><div><h1>'+esc(title)+'</h1>'+(sub?'<p class="sub">'+sub+'</p>':"")+'</div><div class="pagehead-actions">'+(actionsHTML||"")+'</div></div>'); }
  function card(inner, cls) { return el('<section class="card '+(cls||"")+'">'+inner+'</section>'); }
  function stat(label, value, note, band) { return '<div class="stat '+(band||"")+'"><div class="s-l">'+esc(label)+'</div><div class="s-v">'+value+'</div>'+(note?'<div class="s-n">'+note+'</div>':"")+'</div>'; }
  function tag(text, kind) { return '<span class="tag '+(kind||"")+'">'+esc(text)+'</span>'; }
  function srcNote(text) { return '<div class="srcnote">Source: '+esc(text)+'</div>'; }

  document.addEventListener("visibilitychange", function (){ if (!document.hidden) db(); });

  global.EightMM = {
    db:db, save:save, resetFloor:resetFloor, fresh:fresh, SEED:SEED,
    BUDGET_GROUPS:BUDGET_GROUPS, CLEAR_TYPES:CLEAR_TYPES, CREW_ROLES:CREW_ROLES, WRAP_ITEMS:WRAP_ITEMS, BENCH:BENCH, REPLACES:REPLACES,
    TIERS:TIERS, ROOMS:ROOMS, DEPTS:DEPTS, SEATS:SEATS, BRAIN:BRAIN,
    tier:tier, tierRank:tierRank, setTier:setTier, activeRooms:activeRooms, hasRoom:hasRoom, toggleRoom:toggleRoom, priceNow:priceNow, priceLabel:priceLabel,
    consult:consult, askVera:askVera, routeDept:routeDept,
    prodActual:prodActual, totalBudget:totalBudget, totalActual:totalActual, activeProds:activeProds, grossMargin:grossMargin, overBudget:overBudget,
    wrapReadiness:wrapReadiness, wrapComplete:wrapComplete, unsignedClearances:unsignedClearances, canDeliver:canDeliver, signClearance:signClearance,
    approvals:approvals, stage:stage, decideApproval:decideApproval,
    mount:mount, toast:toast, el:el, esc:esc, money:money, pct:pct, page:page, card:card, stat:stat, tag:tag, srcNote:srcNote
  };
})(window);

/* ============================================================================
   AE in-flow COO assistant (Jul 28 2026) — "Ask the COO" on every page.
   Self-contained. Auto-detects the OS engine and drops a floating assistant
   into every room. Two jobs:
     1) CONCIERGE — explains the agent organization, how the system works,
        customization/white-label, and live pricing (pulled from the OS's own
        TIERS/ROOMS/SEATS).
     2) OPERATOR — business/operational questions route through the real agent
        org (routeDept -> consult -> gated verdict), same as the Org page.
   Ghost Mode: it answers, it never acts.
   ============================================================================ */
(function(){
  function findENG(){
    var names=['FB','Amph','EightMM','Truss','Abode','LilNinja','Buttress','Musical','Showroom'];
    for(var i=0;i<names.length;i++){ var g=window[names[i]]; if(g&&g.routeDept&&g.consult&&g.SEATS&&g.SEATS.coo&&g.SEATS.depts) return g; }
    return null;
  }
  function init(){
    if(document.getElementById('aeCooFab')) return;
    if(!document.querySelector('.app')) return;           // inside the OS only, not the gate
    var ENG=findENG(); if(!ENG) return;
    var isTg=(window.Showroom&&ENG===window.Showroom);
    var esc=ENG.esc||function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
    var money=ENG.money||function(n){return '$'+(Math.round(n||0)).toLocaleString();};
    var coo=ENG.SEATS.coo, nd=ENG.SEATS.depts.length;
    var v=isTg
      ?{surface:'var(--panel,#181E2A)',surf2:'var(--panel-2,#1F2634)',text:'var(--text,#EAEDF4)',mut:'var(--muted,#8B95A9)',line:'var(--line,#2C3547)',prim:'var(--brand,#FF6A2C)',onprim:'#160a04',good:'var(--ok,#4ADE80)',warn:'var(--warn,#FBBF24)'}
      :{surface:'var(--card,#fff)',surf2:'var(--sunk,#efe9df)',text:'var(--ink,#1a1a1a)',mut:'var(--mut,#888)',line:'var(--line,#ddd)',prim:'var(--mag,#c8501e)',onprim:'#fff',good:'var(--good,#4a8a5a)',warn:'var(--watch,#d19a2b)'};
    var st=document.createElement('style'); st.id='aeCooStyle';
    st.textContent=
      '#aeCooFab{position:fixed;right:18px;bottom:18px;z-index:95;width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;background:'+v.prim+';color:'+v.onprim+';box-shadow:0 12px 30px -8px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;transition:transform .15s}'+
      '#aeCooFab:hover{transform:translateY(-2px)}'+
      '#aeCooFab .lbl{position:absolute;right:62px;white-space:nowrap;background:'+v.surface+';color:'+v.text+';border:1px solid '+v.line+';border-radius:999px;padding:5px 11px;font-size:11.5px;font-weight:700;box-shadow:0 8px 22px -12px rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .15s}'+
      '#aeCooFab:hover .lbl{opacity:1}'+
      '#aeCooPanel{position:fixed;right:18px;bottom:82px;z-index:130;width:346px;max-width:calc(100vw - 30px);height:486px;max-height:calc(100dvh - 120px);border-radius:16px;background:'+v.surface+';border:1px solid '+v.line+';box-shadow:0 26px 64px -20px rgba(0,0,0,.6);display:none;flex-direction:column;overflow:hidden}'+
      '#aeCooPanel.open{display:flex}'+
      '.aecoo-head{padding:12px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid '+v.line+'}'+
      '.aecoo-head .av{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:13px;background:'+v.prim+';color:'+v.onprim+'}'+
      '.aecoo-head b{font-size:13.5px;color:'+v.text+'} .aecoo-head .r{font-size:10.5px;color:'+v.mut+'}'+
      '.aecoo-x{margin-left:auto;background:transparent;border:none;color:'+v.mut+';cursor:pointer;font-size:19px;line-height:1}'+
      '.aecoo-msgs{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:11px}'+
      '.aecoo-b{max-width:88%;padding:9px 12px;border-radius:13px;font-size:12.6px;line-height:1.5;white-space:pre-wrap}'+
      '.aecoo-b.you{align-self:flex-end;background:'+v.prim+';color:'+v.onprim+';border-bottom-right-radius:4px}'+
      '.aecoo-b.coo{align-self:flex-start;background:'+v.surf2+';color:'+v.text+';border-bottom-left-radius:4px}'+
      '.aecoo-b.coo.held{border:1px solid '+v.warn+'}'+
      '.aecoo-meta{font-size:10px;font-family:monospace;margin-top:7px;color:'+v.mut+'}'+
      '.aecoo-reasons{margin:8px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px}'+
      '.aecoo-reasons li{font-size:11px;line-height:1.45;display:flex;gap:6px;color:'+v.text+'}'+
      '.aecoo-rtag{font-family:monospace;font-size:8px;letter-spacing:.04em;padding:1px 4px;border-radius:3px;height:fit-content;margin-top:2px;font-weight:700;flex:none}'+
      '.aecoo-rtag.data{background:'+v.good+';color:#fff} .aecoo-rtag.assumption{background:'+v.warn+';color:#2a2000}'+
      '.aecoo-foot{padding:10px 12px;border-top:1px solid '+v.line+'}'+
      '.aecoo-samples{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}'+
      '.aecoo-chip{font-size:10.5px;padding:4px 9px;border-radius:999px;cursor:pointer;border:1px solid '+v.line+';background:'+v.surf2+';color:'+v.text+'}'+
      '.aecoo-inrow{display:flex;gap:7px}'+
      '.aecoo-in{flex:1;border-radius:9px;padding:9px 10px;font-size:12.5px;border:1px solid '+v.line+';background:'+v.surface+';color:'+v.text+'}'+
      '.aecoo-in:focus{outline:none;border-color:'+v.prim+'}'+
      '.aecoo-send{border:none;border-radius:9px;padding:0 14px;font-weight:800;cursor:pointer;background:'+v.prim+';color:'+v.onprim+'}';
    document.head.appendChild(st);

    /* ---------- concierge knowledge (about the system itself) ---------- */
    function kb(q){
      q=(q||'').toLowerCase();
      function m(){for(var i=0;i<arguments.length;i++){if(q.indexOf(arguments[i])>=0)return true;}return false;}
      if(m('agent org','organization','who runs','who is','the seats','how the org','the org','deliberat','confidence bar','ghost mode','deepseek','ai org','how does the ai','the departments do'))
        return 'This OS runs on a '+nd+'-department AI agent organization, and I’m '+coo.name+', the COO. You ask; I route it to exactly one department, let its five-seat chain — a head, an admin exec, a pacemaker, and two opposing lenses that never confer — work it under its own confidence bar, then bring you one clean answer with its reasons. Money and compliance calls hold a higher 85% bar and come to you if they aren’t certain. Nothing here acts on its own — that’s Ghost Mode; anything that would send, spend or sign is staged on the Approval Desk. The real engine runs server-side on DeepSeek; this showroom is a faithful local stand-in.';
      if(m('price','pricing','cost','how much','what do you charge','tier','plan','package','per month','/mo','subscription','quote','expensive')){
        var ts=Object.keys(ENG.TIERS).map(function(k){return ENG.TIERS[k];}).sort(function(a,b){return (a.mo||0)-(b.mo||0);});
        var lines=ts.map(function(t){return '• '+t.name+' — '+money(t.mo)+'/mo licensed'+(t.desc?': '+t.desc:'');}).join('\n');
        return 'Here are the packages:\n\n'+lines+'\n\nEvery department is also priced on its own, so you can add or drop any one and the price moves with it — tap the tier chip at the top to configure it live. Draft pricing; Accelerated Experiences LLC sets the final number.';
      }
      if(m('custom','white label','white-label','brand','skin','tailor','our own','add a department','add department','remove a','turn off','turn on','configure','make it fit','our data')){
        var rs=Object.keys(ENG.ROOMS).slice(0,4).map(function(k){return ENG.ROOMS[k].label;}).join(', ');
        return 'It’s fully white-label: your brand, your colors, your departments, and your own data seeded in. Start from a package, then add or take off any department — like '+rs+' — so the build fits your business instead of the other way around. Tap the tier chip at the top to switch departments on and off and watch the price move in real time.';
      }
      if(m('what is this','what does it do','what can you do','what can it do','how does it work','is this real','is it real','showroom','slideshow','a demo','real app'))
        return 'This is the real OS, running right here in your browser — not a slideshow. Everything you type stays in this tab and resets when you leave. It’s your whole operation as one system, with a '+nd+'-department AI org underneath it. In the live product it runs on a server with your real data; nothing in this showroom sends, spends or signs — anything that would is staged on the Approval Desk for you. Ask me about the org, pricing, or how to customize it — or ask an operational question and I’ll route it to the right department.';
      if(m('who are you','your name','what are you'))
        return 'I’m '+coo.name+' — the Chief Operating Officer of this OS. I’m the one seat between you and a '+nd+'-department AI org: I take your question, route it, and bring back a clean answer. Ask me how the system works, what it costs, how to customize it, or anything operational.';
      return null;
    }

    var fab=document.createElement('button'); fab.id='aeCooFab'; fab.setAttribute('aria-label','Ask '+coo.name);
    fab.innerHTML='<span class="lbl">Ask '+esc(coo.name)+'</span>◎';
    document.body.appendChild(fab);

    var samples=['What’s the agent org?','How much does it cost?','Can I customize it?','What needs my attention?'];
    var panel=document.createElement('div'); panel.id='aeCooPanel';
    panel.innerHTML=
      '<div class="aecoo-head"><div class="av">'+esc(coo.name.charAt(0))+'</div><div><b>'+esc(coo.name)+'</b><div class="r">'+esc(coo.role)+' · agent org + concierge</div></div><button class="aecoo-x" aria-label="Close">×</button></div>'+
      '<div class="aecoo-msgs" id="aeCooMsgs"></div>'+
      '<div class="aecoo-foot"><div class="aecoo-samples">'+samples.map(function(s){return '<span class="aecoo-chip">'+esc(s)+'</span>';}).join('')+'</div>'+
      '<div class="aecoo-inrow"><input class="aecoo-in" id="aeCooIn" placeholder="Ask '+esc(coo.name)+' anything…"><button class="aecoo-send" id="aeCooSend">Ask</button></div></div>';
    document.body.appendChild(panel);

    var msgs=panel.querySelector('#aeCooMsgs'), input=panel.querySelector('#aeCooIn');
    function bubble(cls,html){ var b=document.createElement('div'); b.className='aecoo-b '+cls; b.innerHTML=html; msgs.appendChild(b); msgs.scrollTop=msgs.scrollHeight; return b; }
    bubble('coo','Hi — I’m '+esc(coo.name)+', your COO. I can explain the agent org, what the system does, how to customize it and what it costs — or take an operational question and route it to the right department. What do you need?');
    function ask(q){
      q=(q||'').trim(); if(!q){ input.focus(); return; }
      bubble('you',esc(q)); input.value='';
      var k=kb(q);
      if(k){ bubble('coo', esc(k).replace(/\n/g,'<br>')); return; }        // concierge answer
      var dk=ENG.routeDept(q), r=ENG.consult(dk,q);                         // else route to the org
      if(!r){ bubble('coo','I couldn’t route that one — try rephrasing, or ask me about the org, pricing or customization.'); return; }
      var dept=ENG.SEATS.depts.filter(function(x){return x.key===dk;})[0]||{name:dk,gate:80};
      var vd=r.verdict, passed=r.passed;
      var reasons=(vd.reasons||[]).map(function(x){return '<li><span class="aecoo-rtag '+esc(x.t)+'">'+esc((x.t||'').toUpperCase())+'</span><span>'+esc(x.s)+'</span></li>';}).join('');
      var head=passed?esc(vd.stance):(esc(coo.name)+': Holding this for you — '+esc(dept.name)+' came in at '+vd.conf+'%, under its '+dept.gate+'% bar, so it needs a human. '+esc(vd.stance));
      bubble('coo'+(passed?'':' held'), head+
        '<ul class="aecoo-reasons">'+reasons+'</ul>'+
        '<div class="aecoo-meta">'+esc(dept.name)+' · '+vd.conf+'% vs '+dept.gate+'% bar · '+(passed?'released':'held — needs you')+'</div>');
    }
    fab.onclick=function(){ panel.classList.toggle('open'); if(panel.classList.contains('open')) setTimeout(function(){input.focus();},50); };
    panel.querySelector('.aecoo-x').onclick=function(){ panel.classList.remove('open'); };
    panel.querySelector('#aeCooSend').onclick=function(){ ask(input.value); };
    input.addEventListener('keydown',function(e){ if(e.key==='Enter') ask(input.value); });
    Array.prototype.forEach.call(panel.querySelectorAll('.aecoo-chip'),function(c){ c.onclick=function(){ ask(c.textContent); }; });
  }
  function boot(){ init(); setTimeout(init,200); setTimeout(init,600); setTimeout(init,1400); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


/* ── AE Connect — hub-wide incoming-call watcher (ae-connect-watcher) ── */
(function(){
  if (typeof document==='undefined') return;
  var API=(window.AE8MM_API||'https://ae-connect-api.vercel.app')+'/api/connect', NS='8mm';
  function me(){ try{ return JSON.parse(sessionStorage.getItem('8mm_connect_me')); }catch(e){ return null; } }
  function post(p){ return fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(Object.assign({ns:NS},p))}).then(function(r){return r.json();}).catch(function(){return {ok:false};}); }
  var showing=false;
  function card(r){
    if(showing)return; showing=true;
    var d=document.createElement('div');
    d.style.cssText='position:fixed;right:18px;top:74px;z-index:9600;background:#161d24;color:#eaf1f6;border-radius:14px;padding:16px 18px;box-shadow:0 20px 60px rgba(0,0,0,.45);max-width:300px;font-family:system-ui,sans-serif;border-left:4px solid #e8a33d';
    d.innerHTML='<div style="font-weight:700;font-size:15px">\ud83d\udcf9 '+(r.name||'Someone')+' is calling</div>'+
      '<div style="font-size:12px;opacity:.7;margin:3px 0 12px">'+(r.subject||'Incoming video call')+'</div>'+
      '<button id="aeJoin" style="font:inherit;font-weight:700;background:#e8a33d;color:#241a08;border:none;border-radius:9px;padding:10px 16px;cursor:pointer">Join</button> '+
      '<button id="aeDis" style="font:inherit;background:none;border:1px solid #3f5468;color:#9fb2c2;border-radius:9px;padding:10px 14px;cursor:pointer">Dismiss</button>';
    document.body.appendChild(d);
    function done(){ try{document.body.removeChild(d);}catch(e){} showing=false; }
    d.querySelector('#aeDis').onclick=done;
    d.querySelector('#aeJoin').onclick=function(){ done(); var m=me();
      function go(){ window.EightMMMeet.open({room:r.room,displayName:m?m.name:'Guest',subject:r.subject||''}); }
      if(window.EightMMMeet) go(); else { var sc=document.createElement('script'); sc.src='8mm-rtc.js'; sc.onload=go; document.head.appendChild(sc); } };
  }
  function tick(){ var m=me(); if(!m) return;
    post({do:'poll',me:m.slug}).then(function(r){
      if(r&&r.ok&&r.ring&&r.ring.room) card(r.ring);
      if(r&&r.ok&&typeof r.unread==='number'){
        var a=document.querySelector('a[href="connect.html"]');
        if(a){ var b=a.querySelector('.ae-ub');
          if(r.unread>0){ if(!b){ b=document.createElement('span'); b.className='ae-ub';
            b.style.cssText='display:inline-block;min-width:17px;text-align:center;background:#e8a33d;color:#241a08;border-radius:999px;font-size:10.5px;font-weight:700;padding:1px 5px;margin-left:7px'; a.appendChild(b); }
            b.textContent=r.unread; } else if(b){ b.remove(); } } }
    }); }
  setInterval(tick,6000); setTimeout(tick,1500);
})();

/* ── AE Command Center charts (ae-charts) ─────────────────────────────────
   Adaptive: reads whatever this OS actually stores, finds the money series,
   and draws it. Appended to the engine so no dashboard edits are needed.
   Fails silent — if there's nothing numeric to draw, nothing renders.      */
(function(){
  if (typeof document==='undefined') return;
  if (!/dashboard/.test(location.pathname)) return;
  var NAMES=['FB','Fourbarrel','Amph','EightMM','Truss','Abode','LilNinja','Buttress','Musical','MusicalCore','Showroom'];
  function eng(){ for(var i=0;i<NAMES.length;i++){ var g=window[NAMES[i]]; if(g&&typeof g.db==='function') return g; } return null; }
  function cvar(list,fb){ try{ var cs=getComputedStyle(document.documentElement);
    for(var i=0;i<list.length;i++){ var v=(cs.getPropertyValue(list[i])||'').trim(); if(v) return v; } }catch(e){} return fb; }
  var MONEYRE=/fee|price|amount|total|revenue|cost|value|gross|net|tuition|billed|budget|earned|paid|guarantee|sale|msrp|acq/i;
  var LABELRE=/^(name|title|project|show|production|unit|family|account|client|customer|patron|vehicle|item|label|company|program|artist|address|make)$/i;
  var CATRE=/^(phase|status|stage|type|category|kind|dept|department|state|tier|track|discipline|genre)$/i;
  var BAD=/^(id|key|uid|number|vin|stock)$/i;
  function pick(r,f){ return f.indexOf('.')>0 ? ((r[f.split('.')[0]]||{})[f.split('.')[1]]) : r[f]; }

  function discover(d){
    var best=null;
    Object.keys(d||{}).forEach(function(k){
      var a=d[k];
      if(!Array.isArray(a)||a.length<2||typeof a[0]!=='object'||!a[0]) return;
      var fields=[];
      Object.keys(a[0]).forEach(function(f){ var v=a[0][f];
        if(v&&typeof v==='object'&&!Array.isArray(v)){ Object.keys(v).forEach(function(s){ if(typeof v[s]==='number') fields.push(f+'.'+s); }); }
        else fields.push(f); });
      fields.forEach(function(f){
        var vals=a.map(function(r){ return Number(pick(r,f)); }).filter(function(n){ return isFinite(n); });
        if(vals.length<Math.max(2,Math.floor(a.length*0.6))) return;
        var sum=vals.reduce(function(x,y){return x+y;},0); if(!(sum>0)) return;
        var money=MONEYRE.test(f.split('.').pop())||MONEYRE.test(f);
        var score=sum*(money?1000:1);
        if(!best||score>best.score) best={coll:k,rows:a,field:f,sum:sum,money:money,score:score};
      });
    });
    if(!best) return null;
    var k0=Object.keys(best.rows[0]||{});
    best.label=k0.filter(function(f){ return LABELRE.test(f)&&typeof best.rows[0][f]==='string'; })[0]
            || k0.filter(function(f){ return !BAD.test(f)&&typeof best.rows[0][f]==='string'&&String(best.rows[0][f]).length>2; })[0]
            || k0.filter(function(f){ return typeof best.rows[0][f]==='string'; })[0] || null;
    best.cat=k0.filter(function(f){ if(!CATRE.test(f)) return false;
      var set={}; best.rows.forEach(function(r){ if(typeof r[f]==='string') set[r[f]]=1; });
      var n=Object.keys(set).length; return n>=2&&n<=6; })[0]||null;
    return best;
  }

  function build(){
    var E=eng(); if(!E) return;
    var content=document.getElementById('content'); if(!content) return;
    if(document.getElementById('aeChartCard')) return;
    var d; try{ d=E.db(); }catch(e){ return; }
    var S=discover(d); if(!S) return;

    var ACC =cvar(['--blue','--accent','--primary','--brand','--a-money','--a-projects','--teal'],'#4a7fa5');
    var ACC2=cvar(['--blue-2','--brand-2','--a-books','--a-field'],ACC);
    var HI  =cvar(['--amber','--gold','--amber-3','--brand-glow'],'#c9871f');
    var TRK =cvar(['--sunk','--line-2','--line'],'rgba(128,128,128,.18)');
    var INK =cvar(['--ink'],'#1b1f22'), MUT=cvar(['--mut','--ink-2'],'#7b8288');

    function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
    function fmt(n){ n=Number(n)||0;
      if(!S.money) return String(Math.round(n));
      if(n>=1000000) return '$'+(n/1000000).toFixed(2).replace(/\.?0+$/,'')+'M';
      if(n>=1000) return '$'+Math.round(n/1000)+'k';
      return '$'+Math.round(n); }
    function words(s){ s=String(s==null?'':s); return s.length>26?s.slice(0,25)+'…':s; }
    function title(s){ return String(s).replace(/[._-]/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}); }

    /* --- bars: top rows by value --- */
    var rows=S.rows.slice().map(function(r){ return {l:S.label?r[S.label]:'—', v:Number(pick(r,S.field))||0}; })
                   .filter(function(r){ return r.v>0; })
                   .sort(function(a,b){ return b.v-a.v; }).slice(0,6);
    var max=Math.max.apply(null,rows.map(function(r){return r.v;}).concat([1]));
    var W=760,labW=190,valW=76,barW=W-labW-valW,rowH=32,H=rows.length*rowH+6,g1='';
    rows.forEach(function(r,i){
      var y=i*rowH+4, w=Math.max(2,(r.v/max)*barW);
      g1+='<text x="0" y="'+(y+15)+'" font-size="11.5" fill="'+MUT+'" font-family="system-ui,sans-serif">'+esc(words(r.l))+'</text>'
        +'<rect x="'+labW+'" y="'+(y+4)+'" width="'+barW+'" height="14" rx="4" fill="'+TRK+'"/>'
        +'<rect x="'+labW+'" y="'+(y+4)+'" width="'+w+'" height="14" rx="4" fill="'+(i===0?HI:ACC)+'"/>'
        +'<text x="'+W+'" y="'+(y+15)+'" text-anchor="end" font-size="11" font-weight="600" fill="'+INK+'" font-family="ui-monospace,Menlo,monospace">'+fmt(r.v)+'</text>';
    });

    /* --- donut by category --- */
    var g2='',leg='';
    if(S.cat){
      var by={},tot=0;
      S.rows.forEach(function(r){ var c=r[S.cat]; if(typeof c!=='string')return;
        var v=Number(pick(r,S.field))||0; if(!(v>0))return; by[c]=(by[c]||0)+v; tot+=v; });
      var keys=Object.keys(by).sort(function(a,b){return by[b]-by[a];});
      var PAL=[ACC,HI,ACC2,'#6a8f7a','#8a7fa8','#a8865f'];
      var R=52,CX=68,CY=68,C=2*Math.PI*R,off=0;
      keys.forEach(function(k,i){ var fr=tot?by[k]/tot:0; if(fr<=0)return;
        g2+='<circle cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="none" stroke="'+PAL[i%PAL.length]+'" stroke-width="19" stroke-dasharray="'+(fr*C)+' '+C+'" stroke-dashoffset="'+(-off*C)+'" transform="rotate(-90 '+CX+' '+CY+')"/>';
        leg+='<span style="display:inline-flex;align-items:center;gap:6px;margin:0 12px 7px 0;font-size:12px;color:'+MUT+'"><i style="width:10px;height:10px;border-radius:3px;background:'+PAL[i%PAL.length]+';display:inline-block"></i>'+esc(k)+' · '+fmt(by[k])+'</span>';
        off+=fr; });
      g2+='<text x="'+CX+'" y="'+(CY-1)+'" text-anchor="middle" font-size="14" font-weight="700" fill="'+INK+'" font-family="system-ui,sans-serif">'+fmt(tot)+'</text>'
        +'<text x="'+CX+'" y="'+(CY+13)+'" text-anchor="middle" font-size="8.5" fill="'+MUT+'" font-family="ui-monospace,Menlo,monospace">TOTAL</text>';
    }

    /* --- KPI bullets vs target bands (only if this engine publishes them) --- */
    var g3='';
    try{
      if(typeof E.kpis==='function'){
        var ks=E.kpis().filter(function(k){ return k.bench&&k.bench.target&&typeof k.value==='number'; }).slice(0,3);
        ks.forEach(function(k,i){
          var lo=k.bench.target[0],hi=k.bench.target[1],mx=Math.max(hi*1.35,k.value*1.1),bw=400,x0=132,y0=i*34+12;
          var vx=Math.min(bw,(k.value/mx)*bw),lx=(lo/mx)*bw,hx=(hi/mx)*bw,inb=k.value>=lo&&k.value<=hi;
          var val=(k.fmt==='pct')?Math.round(k.value)+'%':(k.fmt==='x')?k.value.toFixed(2)+'x':Math.round(k.value);
          g3+='<text x="0" y="'+(y0+11)+'" font-size="11.5" fill="'+MUT+'" font-family="system-ui,sans-serif">'+esc(k.label||k.k)+'</text>'
            +'<rect x="'+x0+'" y="'+y0+'" width="'+bw+'" height="13" rx="4" fill="'+TRK+'"/>'
            +'<rect x="'+(x0+lx)+'" y="'+y0+'" width="'+Math.max(2,hx-lx)+'" height="13" fill="none" stroke="'+ACC+'" stroke-dasharray="3 3"/>'
            +'<rect x="'+x0+'" y="'+(y0+3)+'" width="'+vx+'" height="7" rx="3" fill="'+(inb?ACC:HI)+'"/>'
            +'<text x="'+(x0+bw+8)+'" y="'+(y0+11)+'" font-size="11" font-weight="700" fill="'+(inb?ACC:HI)+'" font-family="ui-monospace,Menlo,monospace">'+val+'</text>';
        });
      }
    }catch(e){}

    var card=document.createElement('div');
    card.className='card'; card.id='aeChartCard';
    var heading=(S.money?'The money, drawn':'The numbers, drawn');
    card.innerHTML='<h2 style="margin:0 0 4px">'+heading+'</h2>'+
      '<div class="card-sub" style="margin-bottom:14px">Same figures as the tables below, as pictures — computed live from this system\'s own data, nothing hand-entered.</div>'+
      '<div style="border:1px solid '+TRK+';border-radius:12px;padding:14px 16px 10px;margin-bottom:14px">'+
        '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:'+MUT+';margin-bottom:8px">Top '+esc(title(S.coll))+' by '+esc(title(S.field.split('.').pop()))+'</div>'+
        '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block">'+g1+'</svg></div>'+
      (g2?'<div style="display:grid;grid-template-columns:1fr 1.15fr;gap:14px">'+
        '<div style="border:1px solid '+TRK+';border-radius:12px;padding:14px 16px">'+
          '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:'+MUT+';margin-bottom:8px">By '+esc(title(S.cat))+'</div>'+
          '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><svg viewBox="0 0 136 136" style="max-width:136px;width:100%;height:auto">'+g2+'</svg>'+
          '<div style="flex:1;min-width:120px">'+leg+'</div></div></div>'+
        (g3?'<div style="border:1px solid '+TRK+';border-radius:12px;padding:14px 16px"><div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:'+MUT+';margin-bottom:8px">Health vs. target band</div><svg viewBox="0 0 560 '+(Math.max(1,Math.min(3,3))*34+14)+'" style="width:100%;height:auto">'+g3+'</svg></div>':'<div></div>')+
      '</div>':(g3?'<div style="border:1px solid '+TRK+';border-radius:12px;padding:14px 16px"><div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:'+MUT+';margin-bottom:8px">Health vs. target band</div><svg viewBox="0 0 560 116" style="width:100%;height:auto">'+g3+'</svg></div>':''));

    var first=content.querySelector('.card');
    if(first&&first.nextSibling) content.insertBefore(card,first.nextSibling);
    else content.appendChild(card);
  }
  function boot(){ build(); setTimeout(build,300); setTimeout(build,1200); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


/* ------------------------------------------------------------------ pricebook
   This showroom no longer trusts its own copy of the price book.

   Every demo used to hard-code its tier names and prices independent of the
   store, and they drifted: on Aug 8 2026 nine of twelve showrooms were quoting
   money that contradicted the store on the same afternoon. Re-syncing twelve
   files by hand every time a price moves isn't a fix, it's a chore that will
   eventually get skipped.

   So the demo now READS the store at runtime. catalog.js on aexperiences.com is
   the one price book; this pulls it, finds this product, and corrects the tier
   name, monthly, and build fee in place — on the same objects the UI renders
   from, so a correction that lands before first paint is simply what shows.

   Three rules, in order:
     1. Never break the demo. Offline, CORS, a catalog rewrite that breaks the
        parse — any failure and it does nothing at all. The baked numbers stay,
        and they are correct as of the Aug 8 2026 sync.
     2. Never invent a number. It only ever copies what the store publishes.
     3. Say something when it corrects. A silent correction hides the drift that
        caused it; the console note is how the next person finds the stale file.

   Read the result any time via: await window.AE_PRICEBOOK                    */

(function (global) {
  "use strict";

  var ID      = "8mm";                        /* this product, in the store catalog */
  var STORE   = "https://www.aexperiences.com";
  var CATALOG = STORE + "/catalog.js";
  var API     = STORE + "/api/pricing";   /* preferred the day the store ships it */

  /* Pull ['Name', mo, build] rows out of the catalog's tiers:[ ... ] block for
     one product. Bracket-balanced and string-aware rather than regex-greedy, so
     a description containing a bracket can't run the match past the block end. */
  function parseCatalog(src, id) {
    var at = src.indexOf("id:'" + id + "'");
    if (at < 0) at = src.indexOf('id:"' + id + '"');
    if (at < 0) return null;

    var key = src.indexOf("tiers:", at); if (key < 0) return null;
    var open = src.indexOf("[", key);    if (open < 0) return null;

    var depth = 0, end = -1, inStr = null, i, c;
    for (i = open; i < src.length; i++) {
      c = src[i];
      if (inStr) { if (c === "\\") i++; else if (c === inStr) inStr = null; continue; }
      if (c === "'" || c === '"') { inStr = c; continue; }
      if (c === "[") depth++;
      else if (c === "]") { depth--; if (!depth) { end = i; break; } }
    }
    if (end < 0) return null;

    var block = src.slice(open + 1, end), rows = [], m;
    var re = /\[\s*(['"])((?:\\.|(?!\1).)*)\1\s*,\s*(\d+)\s*,\s*(\d+)/g;
    while ((m = re.exec(block))) {
      rows.push({ name: m[2].replace(/\\(.)/g, "$1"), mo: +m[3], build: +m[4] });
    }
    return rows.length ? rows : null;
  }

  /* Find the app's live TIERS object. Each showroom exports under its own name,
     so match on shape — an object whose entries carry mo + build — rather than on
     a name that could be renamed out from under this. */
  function findTiers() {
    var seen = Object.keys(global), i, o, k, first;
    for (i = 0; i < seen.length; i++) {
      try { o = global[seen[i]]; } catch (e) { continue; }
      if (!o || typeof o !== "object" || !o.TIERS) continue;
      first = null;
      for (k in o.TIERS) { first = o.TIERS[k]; break; }
      if (first && typeof first.mo === "number" && typeof first.build === "number") return o.TIERS;
    }
    return null;
  }

  /* Put the app's tiers in store order. Most showrooms carry an explicit rank and
     that is authoritative. A few (Moments) don't, and there we fall back to the
     declaration order of the object — but only when the counts match exactly, so
     a tier added on one side can never silently shift prices onto the wrong one. */
  function ordered(tiers, expected) {
    var k, list = [], ranked = true;
    for (k in tiers) {
      if (!tiers[k] || typeof tiers[k].mo !== "number") continue;
      if (typeof tiers[k].rank !== "number") ranked = false;
      list.push(tiers[k]);
    }
    if (ranked) return list.sort(function (a, b) { return a.rank - b.rank; });
    return list.length === expected ? list : null;
  }

  /* Never match on the object key. The internal keys (lite/standard/…) are ours
     and can be renamed; the tier's position in the store's list is what a price
     actually belongs to. */
  function reconcile(list, book) {
    var fixes = [];
    book.forEach(function (row, i) {
      var t = list[i];
      if (!t) return;
      if (t.name === row.name && t.mo === row.mo && t.build === row.build) return;
      fixes.push("tier " + (i + 1) + ": " + t.name + " $" + t.mo + "/" + t.build +
                 "  ->  " + row.name + " $" + row.mo + "/" + row.build);
      t.name = row.name; t.mo = row.mo; t.build = row.build;
    });
    return fixes;
  }

  global.AE_PRICEBOOK = (async function () {
    var book = null, r, j, rows, res, tiers = null, tries;

    try {
      r = await fetch(API + "?product=" + encodeURIComponent(ID), { cache: "no-store" });
      if (r.ok) {
        j = await r.json();
        rows = j.tiers || j.data || j;
        if (Array.isArray(rows) && rows.length) {
          book = rows.map(function (t) {
            return Array.isArray(t) ? { name: t[0], mo: +t[1], build: +t[2] }
                                    : { name: t.name, mo: +t.mo, build: +t.build };
          });
        }
      }
    } catch (e) { /* endpoint absent — expected today, not an error */ }

    if (!book) {
      try {
        res = await fetch(CATALOG, { cache: "no-store" });
        if (res.ok) book = parseCatalog(await res.text(), ID);
      } catch (e) { return { ok: false, why: "store unreachable", id: ID }; }
    }
    if (!book) return { ok: false, why: "product not found in catalog", id: ID };

    /* The app may still be booting. Wait briefly, then give up quietly — a demo
       rendering its own correct baked numbers is a fine outcome. */
    for (tries = 0; tries < 60 && !(tiers = findTiers()); tries++) {
      await new Promise(function (done) { setTimeout(done, 50); });
    }
    if (!tiers) return { ok: false, why: "app tiers not exposed", id: ID };

    var list = ordered(tiers, book.length);
    if (!list) return { ok: false, why: "tier count disagrees with the catalog", id: ID };

    var fixes = reconcile(list, book);
    if (fixes.length) {
      console.info("[pricebook] " + ID + " — corrected " + fixes.length +
        " tier(s) against the store catalog. The copy baked into this repo has " +
        "drifted and should be re-synced:\n  " + fixes.join("\n  "));
    }
    return { ok: true, id: ID, tiers: book.length, corrected: fixes.length, fixes: fixes };
  })();

})(window);


/* --------------------------------------------------------------- scope note
   The showroom always opens at the TOP tier on purpose — Art. X: show the
   ceiling, take departments off to fit, never build up from a stripped base.
   That is deliberate and it is right. What was missing is that nobody ever
   SAID so, so a visitor who stepped the tier down had no way to tell whether
   the numbers still on screen were meant to be theirs. They are not. On a
   mystery-shop of Abode the reviewer put it as not being able to picture
   themselves in it, and this is a large part of why.

   So: when you are not on the top tier, the floor says out loud that the
   figures are still seeded at full scale, and tells you what your tier
   actually changes — the departments. No number is altered, invented or
   shrunk to flatter a smaller buyer (Art. IV).

   Appended rather than surgically inserted so it works identically across
   eleven engines that differ inside. It reads the live TIERS, never a copy. */

(function (global) {
  "use strict";

  function engine() {
    var k, o;
    for (k in global) {
      try { o = global[k]; } catch (e) { continue; }
      if (o && typeof o === "object" && o.TIERS && typeof o.tier === "function") return o;
    }
    return null;
  }

  function line(A) {
    var here, top = null, k;
    try { here = A.TIERS[A.tier()]; } catch (e) { return ""; }
    for (k in A.TIERS) if (!top || (A.TIERS[k].rank || 0) > (top.rank || 0)) top = A.TIERS[k];
    if (!here || !top || here.rank === top.rank) return "";          /* top tier: nothing to explain */
    var mine = (here.includes || []).length, all = (top.includes || []).length;
    var s = "This floor stays seeded at full " + top.name + " scale so you can see the ceiling — "
          + "the figures below are not resized down to " + here.name + ".";
    if (mine && all) s += " What your tier changes is the departments: " + mine + " of " + all + " switched on.";
    return s;
  }

  function paint() {
    var A = engine(); if (!A) return;
    var bar = document.querySelector(".topbar"); if (!bar || !bar.parentNode) return;
    var msg = line(A), el = document.getElementById("aeScopeNote");
    if (!msg) { if (el && el.parentNode) el.parentNode.removeChild(el); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "aeScopeNote";
      el.className = "scopenote";
      /* styled inline so this needs no stylesheet edit in any of the eleven,
         and inherits whatever chrome the product already uses */
      el.style.cssText = "padding:7px 14px;font-size:11.5px;line-height:1.45;opacity:.72;" +
        "border-bottom:1px solid rgba(128,128,128,.22)";
      bar.parentNode.insertBefore(el, bar.nextSibling);
    }
    if (el.textContent !== msg) el.textContent = msg;
  }

  function boot() {
    paint();
    [200, 600, 1400, 2600].forEach(function (ms) { setTimeout(paint, ms); });
    /* tier changes re-render the chrome; some engines reload, some do not */
    setInterval(paint, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

})(window);
