interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export default function EmptyState({
  title = 'Nenhuma cidade encontrada.',
  hint = 'Tente buscar por outra cidade.',
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="min-w-0 border-y border-white/10 bg-white/5 px-4 py-5 text-white backdrop-blur-md"
    >
      <h2 className="break-words text-base font-semibold">{title}</h2>
      <p className="mt-1 break-words text-sm text-white/80">{hint}</p>
    </div>
  );
}
