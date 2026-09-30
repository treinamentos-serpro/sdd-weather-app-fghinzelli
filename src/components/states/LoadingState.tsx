interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando dados...' }: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex min-w-0 items-center gap-3 border-y border-white/10 bg-white/5 px-4 py-5 text-white backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border-2 border-white/30 border-t-accent-400 motion-safe:animate-spin"
      />
      <p className="min-w-0 break-words text-sm">{message}</p>
    </div>
  );
}
