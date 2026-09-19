// The canonical resume. A single source of truth independent of the
// narrative site copy in about.ts / timeline.ts / projects.ts. Written in
// resume voice (achievement-first, dense) rather than the site's story
// voice. Consumers: a future /resume route, an on-demand PDF export, and a
// future copy-paste export for LinkedIn.
//
// Nothing imports this file yet. The copy is being settled before any
// consumer is built. Drop the ignore below when the first one lands.
// fallow-ignore-file unused-file

export type ResumeContact = {
  name: string
  headline: string
  email: string
  location: string
  links?: { label: string; url: string }[]
}

export type ResumeExperience = {
  company: string
  title: string
  startDate: string
  endDate: string
  current?: boolean
  /** A short aside that doesn't belong in a bullet, e.g. an acquisition. */
  note?: string
  bullets: string[]
  technologies?: string[]
}

export type ResumeEducation = {
  school: string
  degree: string
  concentration: string
  years?: string
  note?: string
}

export type ResumeSkillGroup = {
  category: string
  items: string[]
}

export const resumeContact: ResumeContact = {
  name: 'Doug March',
  headline: 'Product Engineer & Designer',
  email: 'hello@dougmar.ch',
  location: 'Northern Virginia',
  links: [
    { label: 'dougmar.ch', url: 'https://dougmar.ch' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/dougmarch/' },
    { label: 'GitHub', url: 'https://github.com/marchdoe' },
  ],
}

export const resumeSummary =
  'Product engineer and designer with two decades building customer-facing platforms, most recently AML/KYC compliance software at iCapital and threat-intelligence tooling at Mandiant. Hands-on engineer and mentor who built an AI-assisted workflow that turns raw product inputs into shippable specs for the team.'

export const resumeExperience: ResumeExperience[] = [
  {
    company: 'iCapital',
    title: 'Vice President',
    startDate: '2025',
    endDate: 'Present',
    current: true,
    bullets: [
      'Own UX and frontend for Identity Solutions, an AML/KYC investor-onboarding platform used by asset managers, wealth managers, and platform operators across multiple jurisdictions',
      'Most senior frontend engineer on the team. Define and ship features with product, and mentor engineers newer to frontend',
      'Built /ui-brief, a Claude Code skill that turns designs, screenshots, transcripts, and PRDs into an interactive HTML brief covering the feature, before/after, rollout strategy, and open risks. The team starts feature discussions from these briefs, at about 80% of a solution',
      "Carried the product through iCapital's acquisition of Parallel Markets, leading the integration of iCapital's brand and design system into the platform",
    ],
    technologies: ['React', 'TypeScript', 'PandaCSS', 'Radix', 'GraphQL', 'Claude Code'],
  },
  {
    company: 'Parallel Markets',
    title: 'Senior Engineer',
    startDate: '2022',
    endDate: '2025',
    note: 'Acquired by iCapital, Jan 2025',
    bullets: [
      'Frontend contributor across four core product areas: Case Management, Identity Verification, Alert Monitoring for sanctions and AML screening, and Beneficial Ownership Structure visualization',
      "Joined full-time after building the company's original 1.0 product as a consultant through Spaceman LLC",
      'Mentored engineers newer to frontend in a flat, cross-functional engineering org',
    ],
    technologies: ['React', 'TypeScript', 'PandaCSS', 'Radix', 'GraphQL', 'Elixir', 'Phoenix'],
  },
  {
    company: 'Mandiant',
    title: 'Senior Engineer',
    startDate: '2020',
    endDate: '2022',
    bullets: [
      'Implemented user interfaces for the Mandiant Advantage XDR platform, used by internal and external customers to protect their organizations from cyber threats',
    ],
    technologies: ['React', 'Redux', 'JavaScript', 'Ruby on Rails', 'Webpack'],
  },
  {
    company: 'Spaceman LLC',
    title: 'Founder',
    startDate: '2018',
    endDate: 'Present',
    current: true,
    bullets: [
      'Independent design and engineering practice. Clients include Jeffrey Zeldman, Rolex, The Nature Conservancy, Sapient Razorfish, bswift, RTIC Coolers, Framebridge, Intuit, LastPass, Parallel Markets, and WorkAround',
      "Built Parallel Markets' original 1.0 product from the ground up, including a shared frontend component library",
    ],
  },
  {
    company: 'The Atlantic',
    title: 'Senior Engineer',
    startDate: '2018',
    endDate: '2018',
    bullets: [
      'Led the initiative to build a design system within the product team, so all Atlantic properties could share and reuse code',
      'Built and documented a component system via Fractal',
    ],
    technologies: ['Fractal', 'Nunjucks', 'SCSS', 'JavaScript', 'Python'],
  },
  {
    company: 'Territory Foods',
    title: 'Senior Engineer',
    startDate: '2017',
    endDate: '2017',
    bullets: [
      'Led the full site rebrand from Power Supply to Territory Foods',
      'Built a React component library shared across applications, documented via Storybook',
      'Added A/B testing capability via Google Optimize',
    ],
    technologies: ['React', 'Ruby on Rails', 'SCSS', 'Styled Components', 'Storybook', 'Figma'],
  },
  {
    company: 'WellMatch Health / Aetna',
    title: 'Senior Engineer',
    startDate: '2014',
    endDate: '2017',
    bullets: [
      'Led a React component library initiative shared across applications, documented via Storybook',
      'Worked with design and UX from concept to delivery on healthcare pricing-transparency tools',
      'Participated in the rewrite of an Ember app migrating to React',
    ],
    technologies: ['React', 'Ruby on Rails', 'SCSS', 'PostCSS', 'Storybook', 'Sketch'],
  },
  {
    company: 'Interfolio',
    title: 'Director of Engineering',
    startDate: '2014',
    endDate: '2014',
    bullets: [
      'Member of the leadership team. Managed and directed the engineering team',
      'Worked with leadership across multiple business units to initiate and complete new products, features, and infrastructure improvements',
      'Participated in sales meetings with prospects and clients as a technical consultant and subject matter expert',
    ],
  },
  {
    company: 'LivingSocial',
    title: 'Senior Engineer',
    startDate: '2010',
    endDate: '2014',
    bullets: [
      'Co-defined and built LivingSocial Escapes on a two-person team in two weeks. It made $1M in revenue in its first week',
      'Built a shared asset library across all LivingSocial consumer apps, removing 50,000 lines of code and reducing CSS payload on the most-trafficked page from 500KB to under 100KB',
      'Initiated a responsive redesign of the daily email template, which lifted click-throughs 22% and purchases 6%',
      'Recruited and hired 5 frontend developers and 2 interns',
      'First and only employee to win two internal hackathon "People\'s Choice" awards',
    ],
    technologies: ['Ruby on Rails', 'HTML5', 'CSS (SCSS)', 'JavaScript (jQuery)', 'Git'],
  },
  {
    company: 'Logik Systems',
    title: 'Senior Developer / UI Architect',
    startDate: '2009',
    endDate: '2010',
    bullets: [
      'Led development and revamp of the internal document processing engine for eDiscovery',
      'Managed 2 developers and 3 to 5 contractors',
      'Developed the user experience and front-end code for the project',
    ],
    technologies: [
      'Ruby on Rails',
      'Redis',
      'Resque',
      'HTML5',
      'CSS',
      'JavaScript (jQuery)',
      'Git',
    ],
  },
  {
    company: 'Mixx',
    title: 'Senior Web Developer',
    startDate: '2008',
    endDate: '2009',
    bullets: [
      "Concepted and defined Mixx's second product, tweetmixx, which unpacked shortened URLs for quick content preview",
      'Partnered with brands including the NBA, NHL, US Open, WWF, and the UN to launch partner channels',
      'Implemented SEO best practices to improve rank and user acquisition',
    ],
    technologies: ['Ruby on Rails', 'XHTML', 'CSS', 'JavaScript (jQuery)', 'Subversion'],
  },
  {
    company: 'Revolution Health Group',
    title: 'Developer / Web UI',
    startDate: '2006',
    endDate: '2008',
    bullets: [
      'Guided the Web UI team from concept through prototype to final build on revolutionhealth.com',
      'Implemented and maintained consistent markup standards across the site',
      'As an early front-end lead, helped build and manage a team that grew to 8 engineers, full-time and contract',
    ],
    technologies: [
      'Ruby on Rails',
      'XHTML',
      'CSS',
      'JavaScript (Prototype & Scriptaculous)',
      'Subversion',
    ],
  },
]

export const resumeEducation: ResumeEducation = {
  school: 'The University of Dayton',
  degree: 'Bachelor of Fine Arts',
  concentration: 'Visual Communication and Design',
  note: "NCAA Division I Men's Golf Team",
}

export const resumeSkills: ResumeSkillGroup[] = [
  {
    category: 'Product & Design Systems',
    items: [
      'Product Design',
      'Design Systems',
      'Component Libraries',
      'Prototyping',
      'Brand & Identity',
      'Accessibility (WCAG, Section 508)',
    ],
  },
  {
    category: 'Frontend Engineering',
    items: ['React', 'TypeScript', 'JavaScript', 'GraphQL', 'PandaCSS', 'Radix', 'SCSS'],
  },
  {
    category: 'Backend & Infrastructure',
    items: ['Ruby on Rails', 'Elixir / Phoenix', 'Webpack'],
  },
  {
    category: 'Domain',
    items: ['AML/KYC & Identity Verification', 'Threat Intelligence', 'Healthcare'],
  },
  {
    category: 'Leadership & Process',
    items: ['Mentoring', 'Technical Leadership', 'AI-Assisted Workflows (Claude Code)'],
  },
]
