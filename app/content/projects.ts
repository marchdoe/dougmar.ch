import type { Project, Client } from './types'

// Re-exported so `import type { Project } from '../content/projects'` works
// alongside the value imports above — see #432. No caller uses this path
// yet; it exists for the engineer, which every failed run this week got
// wrong by importing Project from here before it was re-exported.
// fallow-ignore-next-line unused-type
export type { Project, Client } from './types'

const spacemanClients: Client[] = [
  { name: 'Jeffrey Zeldman', url: 'https://studio.zeldman.com' },
  { name: 'Rolex', logo: '/clients/rolex.svg', url: 'https://rolex.com' },
  {
    name: 'The Nature Conservancy',
    logo: '/clients/nature-conservancy.svg',
    url: 'https://nature.org',
  },
  {
    name: 'Sapient Razorfish',
    logo: '/clients/sapient-razorfish.svg',
    url: 'https://publicissapient.com',
  },
  { name: 'bswift', logo: '/clients/bswift.svg', url: 'https://bswift.com' },
  { name: 'RTIC Coolers', logo: '/clients/rtic.svg', url: 'https://rticoutdoors.com' },
  { name: 'Framebridge', logo: '/clients/framebridge.png', url: 'https://framebridge.com' },
  { name: 'Intuit', logo: '/clients/intuit.svg', url: 'https://intuit.com' },
  { name: 'LastPass', logo: '/clients/lastpass.svg', url: 'https://lastpass.com' },
  { name: 'WorkAround', url: 'https://joinworkaround.com' }, // logo: provide file → public/clients/workaround.svg
]

export const projects: Project[] = [
  {
    slug: 'spaceman',
    title: 'Spaceman',
    type: 'Founder',
    year: 2018,
    depth: 'full',
    featured: true,
    role: 'Founder',
    timeline: '2018 — Present',
    status: 'Active',
    problem:
      "Independent design and engineering work doesn't always fit neatly inside a company. Some of the best work happens at the edges — between studios, between disciplines, between what a client thinks they need and what they actually need.",
    approach:
      "Spaceman is the LLC I've operated under for the past decade, partnering with companies and studios across industries. The work spans product design, frontend engineering, design systems, and brand — sometimes as a solo contributor, sometimes embedded in a larger team. Clients have included Jeffrey Zeldman, Rolex, The Nature Conservancy, Sapient Razorfish, bswift, RTIC Coolers, Framebridge, Intuit, LastPass, and WorkAround, among others.",
    outcome:
      'Ten years in, Spaceman is still the vehicle for independent work and new experiments. The practice has shaped how I think about the gap between design and engineering — and made me better at closing it.',
    liveUrl: 'https://spaceman.llc',
    clients: spacemanClients,
  },
  {
    slug: 'fishsticks',
    title: 'FishSticks',
    type: 'SaaS',
    year: 2025,
    depth: 'full',
    role: 'Founder & Builder',
    timeline: 'Ongoing',
    status: 'Live',
    problem:
      "Kids struggle to practice spelling lists from school — the tools that exist are either boring, require a parent to quiz them, or don't work with the actual word lists teachers send home.",
    approach:
      'Built a simple import flow that reads PDFs from school (automatically finding the bold words teachers typically use), paired with voice pronunciation and adaptive quiz modes so kids can practice independently.',
    outcome:
      'Live product with free and one-time $10 premium tier. Thousands of kids practicing daily.',
    stack: ['SvelteKit', 'TypeScript', 'Vercel'],
    liveUrl: 'https://getfishsticks.com',
  },
  {
    slug: '15th-club',
    title: '15th Club',
    type: 'AI',
    year: 2025,
    depth: 'full',
    role: 'Founder & Builder',
    timeline: 'Ongoing',
    status: 'In Development',
    problem:
      'Golf is full of data, ritual, and decision-making — and almost none of it has been meaningfully touched by AI. Most golf apps are just digital scorecards.',
    approach:
      'A platform for AI experiments through the lens of golf. The scorecard is the first experiment — shareable, real-time, no app install required. More experiments to follow.',
    outcome: 'In active development.',
    stack: ['React', 'TypeScript', 'Supabase', 'Vercel'],
    liveUrl: 'https://15th.club',
  },
  {
    slug: 'dougmar-ch',
    title: 'dougmar.ch',
    type: 'AI',
    year: 2026,
    depth: 'full',
    role: 'Designer & Builder',
    timeline: 'Ongoing',
    status: 'Live',
    context:
      'Chad Fowler argues that once a machine writes the implementation, the architecture is whatever you cannot delete. He is writing about code. I wanted to know whether the argument holds when the thing being regenerated is visual design, where correct is a judgement rather than a test result.',
    problem:
      'A portfolio argues that you can design and build things, then sits unchanged for years, which quietly undercuts the argument. The decisions behind it are invisible, the process is hidden, and none of it is falsifiable.',
    constraints: [
      'It redesigns itself unattended. Nothing may wait on me approving it before it ships.',
      'A visitor arriving on a bad morning still has to be able to read the page and find the work.',
      'Every past design has to survive exactly as it shipped, including the ones I would rather forget.',
      'Every run costs tokens, so anything decidable by arithmetic should not be decided by a model.',
    ],
    approach:
      "Each morning a pipeline of Claude agents rebuilds the site from nothing. An art director reads the day's signals and writes a specification: a composition drawn from eight independent axes, a type and colour scale, the hero line, and whether the page carries a shell at all. A mockup designer renders that specification at full fidelity, an engineer rebuilds it as the real site, and two separate critics can send any of it back. What the agents may touch is enumerated in a list. The content files, this sentence included, are refused at the write layer.",
    process: [
      {
        phase: 'Signals',
        does: 'Reads nineteen sources: weather, air quality, the golf leaderboard, Hacker News, markets, the lunar phase, what I have been listening to.',
        produces: "The day's raw material",
      },
      {
        phase: 'Art Director',
        does: 'Picks a composition from eight axes rather than a named layout, sets the tokens, writes the hero line, declares the shell.',
        produces: 'A specification',
      },
      {
        phase: 'Mockup Designer',
        does: "Builds the day's design as one self-contained HTML file, at full fidelity, before any React exists.",
        produces: 'A mockup',
      },
      {
        phase: 'Mockup critic',
        does: 'Judges the mockup on its own terms and can demand a revision.',
        produces: 'A verdict',
      },
      {
        phase: 'React Engineer',
        does: 'Rebuilds the mockup as the real site: routes, components and tokens, bound to the content files.',
        produces: 'The site',
      },
      {
        phase: 'Build validation',
        does: 'Scans the generated code, builds it, then smoke-checks the output for pages that compile and render blank.',
        produces: 'A shippable build, or a retry',
      },
      {
        phase: 'Screenshot critic',
        does: 'Looks at the rendered page and judges what a visitor would actually see.',
        produces: 'The last gate',
      },
      {
        phase: 'Archive',
        does: 'Seals the day into the wayback machine, writes its record, and scores it against the previous seven builds.',
        produces: 'Provenance',
      },
    ],
    decisions: [
      {
        decision: 'A composition grammar instead of named layouts',
        why: 'Eight named archetypes became a cage. The model kept reaching for the same three. Replacing the names with eight independent axes removed the vocabulary that was causing the repetition.',
      },
      {
        decision: 'The uniqueness score is arithmetic, not a model',
        why: 'Asking a model whether today resembles last Tuesday costs tokens and answers differently each time. Hue distance, composition distance and shell novelty are cheap, deterministic, and do not flatter.',
      },
      {
        decision: 'The archive is sealed, not re-rendered',
        why: "A preserved design wearing tonight's stylesheet is a record of nothing. Each day is frozen as it shipped, with its outbound links rewritten so a visitor cannot leak out of the past.",
      },
      {
        decision: 'The line between disposable and durable is a list, not a convention',
        why: 'One file enumerates what the pipeline may rewrite. Everything else is refused when it tries to write, rather than asked politely not to.',
      },
    ],
    outcome:
      'Every design it has made is preserved exactly as it shipped, each with the brief that produced it and a score for how far it strays from the week before. The site is its own archive and its own evidence. The stack is TanStack Start in SPA mode, PandaCSS for tokens, and Vercel for hosting and CI.',
    references: [
      {
        title: 'The Phoenix Primitives',
        url: 'https://chadfowler.com/regenerative-software/3mjfruwwuck2d/',
        note: 'Specification, evaluation, context boundary, provenance. Where this project started.',
      },
      {
        title: 'The Deletion Test',
        url: 'https://chadfowler.com/regenerative-software/3md5ftetaes2e/',
        note: 'On architecture being defined by what you cannot remove.',
      },
      {
        title: 'Evaluations Are the Real Codebase',
        url: 'https://chadfowler.com/regenerative-software/3mb526js42k26/',
        note: 'Why the critics outlast every design they judge.',
      },
    ],
    stack: ['TanStack Start', 'PandaCSS', 'TypeScript', 'Claude', 'GitHub Actions', 'Vercel'],
    liveUrl: 'https://dougmar.ch',
  },
  {
    slug: 'teeturn',
    title: 'TeeTurn',
    type: 'Experiment',
    year: 2020,
    depth: 'lightweight',
    description:
      'A mobile-first cross-platform golf app that lets players track the progress of a round in real-time. Responsible for product direction and strategy.',
  },
  {
    slug: 'politweets',
    title: 'Politweets',
    type: 'Experiment',
    year: 2008,
    depth: 'lightweight',
    description:
      "Built over a weekend with the Character140 collective — a group of DC-area developers and designers. Politweets scraped Twitter's public timeline for presidential candidate mentions and displayed them in real time, homepage styled like a digital newspaper. Went live just before the New Hampshire primaries. Covered by HuffPost, Mashable, ZDNet, and ReadWriteWeb. Six to nine months later, Twitter shipped their own version at election.twitter.com.",
  },
  {
    slug: 'twittertale',
    title: 'Twittertale',
    type: 'Experiment',
    year: 2008,
    depth: 'lightweight',
    description:
      'One of the earliest experiments using the Twitter API to track keywords across the public timeline — built with Jason Garber and the Character140 crew initially just to entertain friends. Twittertale scanned every public tweet for swear words and ranked which users had the biggest potty mouth. Covered by Mashable. The same keyword-tracking mechanic became the foundation for Politweets a few weeks later.',
  },
]

export const featuredProject = projects.find((p) => p.featured)
export const selectedWork = projects.filter((p) => !p.featured && p.depth === 'full')
export const experiments = projects.filter((p) => p.depth === 'lightweight')
