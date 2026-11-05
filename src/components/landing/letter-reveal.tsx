export default function LetterReveal({
  text,
  start = 0,
  gradient = false,
}: {
  text: string;
  start?: number;
  gradient?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-block align-top [font-kerning:none] [font-variant-ligatures:none]"
    >
      <span
        data-letter-layer={gradient ? "" : undefined}
        className="block whitespace-nowrap"
      >
        {Array.from(text).map((letter, index) => (
          <span
            key={index}
            className="-my-[0.25em] inline-block overflow-hidden py-[0.25em] align-top"
          >
            <span data-letter={start + index} className="inline-block">
              {letter === " " ? "\u00a0" : letter}
            </span>
          </span>
        ))}
      </span>
      {gradient && (
        <span
          data-gradient-word
          className="pointer-events-none absolute inset-x-0 -inset-y-[0.25em] whitespace-nowrap bg-[linear-gradient(45deg,#268c52,#b77514,#d65439)] bg-[length:200%_200%] bg-clip-text py-[0.25em] text-transparent opacity-0"
        >
          {text}
        </span>
      )}
    </span>
  );
}
