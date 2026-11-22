import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import DecisionChallenge from "@/components/spend/DecisionChallenge";
import AllocationChallenge from "@/components/spend/AllocationChallenge";
import NumberChallenge from "@/components/spend/NumberChallenge";

export default function ChallengeCard({ challenge, completed, onComplete }) {
  const [lessonOpen, setLessonOpen] = useState(completed);

  const finish = (answer) => {
    setLessonOpen(true);
    onComplete(challenge, answer);
  };

  return (
    <article className="ss-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
            completed ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
          }`}
        >
          {completed ? <Check className="h-4 w-4" strokeWidth={3} /> : challenge.number}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[15px] font-semibold leading-snug text-foreground">
              {challenge.title}
            </h3>
            {completed ? (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">
                Completed
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {challenge.scenario}
          </p>
          <p className="mt-3 text-[13px] font-semibold text-foreground">{challenge.question}</p>

          <div className="mt-2.5">
            {challenge.type === "decision" ? (
              <DecisionChallenge
                challenge={challenge}
                completed={completed}
                onComplete={finish}
              />
            ) : null}
            {challenge.type === "allocation" ? (
              <AllocationChallenge
                challenge={challenge}
                completed={completed}
                onComplete={finish}
              />
            ) : null}
            {challenge.type === "number" ? (
              <NumberChallenge challenge={challenge} completed={completed} onComplete={finish} />
            ) : null}
          </div>

          {(completed || lessonOpen) && challenge.lesson ? (
            <div className="mt-3 rounded-md bg-secondary p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                What this teaches
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-foreground">{challenge.lesson}</p>
              {challenge.type === "decision" ? (
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  The best choice can depend on your own situation. What matters is deciding on
                  purpose instead of by accident.
                </p>
              ) : null}
            </div>
          ) : null}

          {!completed && !lessonOpen ? null : null}
        </div>
      </div>
    </article>
  );
}
