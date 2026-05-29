const stats = [
  { num: '3+', label: 'Years learning to code' },
  { num: '10+', label: 'Projects completed' },
  { num: '\u221e', label: 'Lines of code written' },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 flex min-h-screen items-center px-8 py-24 md:px-16"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-16 md:grid-cols-2">
        <div
          data-scroll-effect="slide-right"
          data-parallax="0.08"
          className="about-left flex flex-col gap-6"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
            &mdash; About
          </p>
          <h2 className="heading-lg text-white">
            Curious
            <br />
            Mind,
            <br />
            Clean
            <br />
            Code.
          </h2>
          <p className="text-sm leading-relaxed text-white/50">
            A dedicated student developer passionate about crafting digital experiences.
            Currently learning and building at SMKN 1 Kota Bekasi, focused on web
            technologies and software engineering.
          </p>
          <p className="text-sm leading-relaxed text-white/50">
            Every project is an opportunity to grow, learn, and push the boundaries
            of what I know.
          </p>
        </div>

        <div
          data-scroll-effect="slide-left"
          data-parallax="0.04"
          className="about-right flex flex-col gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              data-scroll-effect="zoom"
              data-scroll-delay={index * 0.08}
              className="group relative overflow-hidden border border-white/10 p-6"
            >
              <div className="absolute left-0 top-0 h-0 w-[3px] bg-white transition-all duration-500 group-hover:h-full" />
              <p className="heading-md text-white">{stat.num}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
