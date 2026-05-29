const projects = [
  {
    num: '001',
    title: 'Project Alpha',
    desc: 'A full-stack web application built with Next.js and Tailwind CSS. Focused on clean UI and smooth user experience.',
    tags: ['Next.js', 'Tailwind', 'Vercel'],
    link: '#',
  },
  {
    num: '002',
    title: 'Project Beta',
    desc: 'Interactive dashboard with data visualization. Built to solve a real school problem using modern web technologies.',
    tags: ['React', 'JavaScript', 'CSS'],
    link: '#',
  },
  {
    num: '003',
    title: 'Project Gamma',
    desc: 'Landing page with modern animations and responsive design. Deployed on GitHub Pages for easy access.',
    tags: ['HTML', 'CSS', 'GSAP'],
    link: '#',
  },
  {
    num: '004',
    title: 'Coming Soon',
    desc: 'Next project in progress. Stay tuned for something new.',
    tags: ['TBA'],
    link: '#',
    disabled: true,
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative z-10 flex min-h-screen items-center px-8 py-24 md:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p
          data-scroll-effect="fade"
          className="mb-12 text-[10px] uppercase tracking-[0.4em] text-white/30"
        >
          &mdash; Projects
        </p>

        <div className="projects-grid grid grid-cols-1 gap-[1px] bg-white/8 md:grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={project.num}
              data-scroll-effect={index % 2 === 0 ? 'rotate' : 'slide-up'}
              data-scroll-delay={index * 0.06}
              className={`project-card group relative flex flex-col gap-4 bg-black p-8 transition-colors duration-300 ${
                project.disabled ? 'cursor-default opacity-40' : 'cursor-pointer hover:bg-white/5'
              }`}
            >
              {!project.disabled && (
                <span className="absolute right-6 top-6 text-lg text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white">
                  &rarr;
                </span>
              )}
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                {project.num}
              </p>
              <h3 className="heading-md text-white">{project.title}</h3>
              <p className="text-sm leading-relaxed text-white/45">
                {project.desc}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
