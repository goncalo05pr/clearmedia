import type { Module } from "@/lib/formation-content";

type FormationCurriculumProps = {
  modules: Module[];
};

export function FormationCurriculum({ modules }: FormationCurriculumProps) {
  return (
    <div className="space-y-8">
      {modules.map((mod) => (
        <section
          key={mod.id}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
        >
          <h2 className="font-heading text-lg font-semibold text-white">{mod.title}</h2>
          <ul className="mt-6 space-y-8">
            {mod.lessons.map((lesson) => (
              <li key={lesson.id} id={`lesson-${lesson.id}`} className="scroll-mt-28">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3">
                  <h3 className="font-medium text-neutral-200">{lesson.title}</h3>
                  <span className="text-xs tabular-nums text-neutral-500">
                    {lesson.durationMinutes} min
                  </span>
                </div>
                {lesson.videoEmbedUrl ? (
                  <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-black">
                    <iframe
                      title={lesson.title}
                      src={lesson.videoEmbedUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="mt-4 flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#0a0a0a] text-sm text-neutral-500">
                    Video a configurer (URL embed dans le code source)
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
