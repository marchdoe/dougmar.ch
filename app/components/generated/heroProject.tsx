import { featuredProject, projects } from '../../content/projects'

// The mockup's artifact is 15th Club. Fall back to the featured project only if it is absent.
export const heroProject =
  projects.find((p) => p.title.toLowerCase().includes('15th')) ?? featuredProject
