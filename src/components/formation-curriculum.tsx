import type { Module } from "@/lib/formation-content";

type FormationCurriculumProps = {
  modules: Module[];
};

export function FormationCurriculum({ modules }: FormationCurriculumProps) {
  return (
    <div className="space-y-10">
      {modules.map((mod) => (
        <section key={mod.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-cyan-300">{mod.title}</h2>
          <ul className="mt-4 space-y-6">
            {mod.lessons.map((lesson) => (
              <li key={lesson.id} id={`lesson-${lesson.id}`} className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-slate-100">{lesson.title}</h3>
                  <span className="text-sm text-slate-500">{lesson.durationMinutes} min</span>
                </div>
                {lesson.videoEmbedUrl ? (
                  <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg border border-slate-800 bg-black">
                    <iframe
                      title={lesson.title}
                      src={lesson.videoEmbedUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="mt-3 flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/80 text-sm text-slate-500">
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
