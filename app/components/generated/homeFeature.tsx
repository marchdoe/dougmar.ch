import { featuredProject, projects, selectedWork } from '../../content/projects'

/* The approved mockup leads the home page with FishSticks, which is not the
   content file's featured project, so the page names its lead here. The other
   full-depth projects, the content file's featured one included, go in the index. */
export const homeFeature =
  projects.find((project) => project.slug === 'fishsticks') ?? featuredProject

const fullDepthWork = featuredProject ? [featuredProject, ...selectedWork] : selectedWork

export const homeSelectedWork = fullDepthWork.filter(
  (project) => project.slug !== homeFeature?.slug
)
