interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="min-w-0 border-y border-white/10 bg-white/5 px-4 py-5 text-white backdrop-blur-md"
    >
      <p className="break-words text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded bg-accent-600 px-4 py-2 font-medium text-white hover:bg-accent-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
      >
        Tentar novamente
      </button>
    </div>
  );
}
