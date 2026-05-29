const skills = [
  { num: '01', name: 'HTML & CSS', level: 90 },
  { num: '02', name: 'JavaScript', level: 75 },
  { num: '03', name: 'React', level: 65 },
  { num: '04', name: 'Next.js', level: 55 },
  { num: '05', name: 'Git & GitHub', level: 70 },
  { num: '06', name: 'Tailwind CSS', level: 80 },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative z-10 flex min-h-screen items-center px-8 py-24 md:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p
          data-scroll-effect="fade"
          className="mb-12 text-[10px] uppercase tracking-[0.4em] text-white/30"
        >
          &mdash; Skills
        </p>

        <div className="skills-grid grid grid-cols-1 gap-[1px] bg-white/8 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <div
              key={skill.num}
              data-scroll-effect={index % 2 === 0 ? 'zoom' : 'slide-up'}
              data-scroll-delay={index * 0.05}
              className="skill-card group relative flex flex-col gap-4 overflow-hidden bg-black p-8 transition-colors duration-300 hover:bg-white/5"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[1px] origin-left scale-x-0 bg-white transition-transform duration-500 group-hover:scale-x-100" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                {skill.num}
              </p>
              <p className="heading-md text-white">{skill.name}</p>
              <div className="relative h-[1px] bg-white/10">
                <div
                  data-progress={skill.level}
                  className="absolute left-0 top-0 h-full bg-white"
                />
              </div>
              <p className="text-[11px] tracking-widest text-white/30">
                {skill.level}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
