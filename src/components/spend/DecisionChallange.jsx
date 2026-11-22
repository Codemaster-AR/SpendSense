import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DecisionChallenge({ challenge, completed, onComplete }) {
  const [choice, setChoice] = useState(null);
  const [result, setResult] = useState(null);

  const submit = () => {
    const option = challenge.options.find((item) => item.id === choice);
    if (!option) return;
    setResult(option);
    if (option.correct) onComplete(option.label);
  };

  const solved = Boolean(result?.correct) || completed;

  return (
    <div>
      <div className="space-y-2">
        {challenge.options.map((option) => {
          const selected = choice === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={solved}
              onClick={() => setChoice(option.id)}
              className={`ss-focus flex w-full items-start gap-2.5 rounded-md border p-3 text-left text-[13px] leading-relaxed transition-colors ${
                selected
                  ? "border-primary bg-secondary text-foreground"
                  : "border-[rgba(18,107,88,0.14)] bg-white text-foreground hover:bg-muted"
              } ${solved ? "opacity-80" : ""}`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                }`}
              >
                {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>

      {!solved ? (
        <Button size="sm" className="mt-2.5" disabled={!choice} onClick={submit}>
          Check my decision
        </Button>
      ) : null}

      {result ? (
        <div
          className={`mt-2.5 rounded-md p-3 text-[12px] leading-relaxed ${
            result.correct ? "bg-secondary text-primary" : "bg-warning/10 text-warning-foreground"
          }`}
        >
          <p className="font-semibold">{result.correct ? "Good decision" : "Think again"}</p>
          <p className="mt-1">{result.feedback}</p>
          {!result.correct ? (
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setChoice(null);
              }}
              className="ss-focus mt-2 font-semibold underline"
            >
              Try another answer
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
