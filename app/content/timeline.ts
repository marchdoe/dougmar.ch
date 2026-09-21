// The About page's view of the résumé. Every entry, the education block and
// the capabilities list come from resume.ts, the one canonical source (#638);
// this file only reshapes them into the fields the engineer's contract names
// (react-engineer.md, "Content data shapes"). Change a role, a date or a
// skill in resume.ts and it shows up here.
import { resumeEducation, resumeExperience, resumeSkills } from './resume'

export type TimelineEntry = {
  year: string
  role: string
  company: string
  description: string
  current?: boolean
  bullets?: string[]
  technologies?: string[]
}

export type Education = {
  school: string
  degree: string
  concentration: string
  years: string
}

// Year-only dates, written out: "2018", "2022 to 2025", "2025 to present". No
// dash of any kind, so a range copied into rendered copy never trips the copy
// gate, and a single year reads the same as a range in a fixed-width column.
function yearRange({ startDate, endDate, current }: (typeof resumeExperience)[number]): string {
  if (current || endDate === 'Present') return `${startDate} to present`
  if (startDate === endDate) return startDate
  return `${startDate} to ${endDate}`
}

export const timeline: TimelineEntry[] = resumeExperience.map((entry) => ({
  year: yearRange(entry),
  role: entry.title,
  company: entry.company,
  description: entry.note ?? '',
  ...(entry.current ? { current: true } : {}),
  bullets: entry.bullets,
  ...(entry.technologies ? { technologies: entry.technologies } : {}),
}))

export const education: Education = {
  school: resumeEducation.school,
  degree: resumeEducation.degree,
  concentration: resumeEducation.concentration,
  years: resumeEducation.years ?? '',
}

export const capabilities: string[] = resumeSkills.flatMap((group) => group.items)
