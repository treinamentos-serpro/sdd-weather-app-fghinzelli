import { type FormEvent, type Ref, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

export default function SearchBar({ onSearch, disabled = false, inputRef }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;

    const query = city.trim();
    if (!query) {
      setHasError(true);
      return;
    }

    setHasError(false);
    onSearch(query);
  }

  return (
    <form
      role="search"
      aria-label="Buscar cidade"
      onSubmit={handleSubmit}
      className="w-full min-w-0"
    >
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white">
        Cidade
      </label>
      <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-3 shadow-glass backdrop-blur-md sm:flex-row">
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setHasError(false);
          }}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          placeholder="Digite uma cidade"
          className="min-w-0 flex-1 rounded border border-white/10 bg-night-800 px-3 py-2 text-white placeholder:text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded bg-accent-600 px-5 py-2 font-medium text-white hover:bg-accent-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buscar
        </button>
      </div>
      {hasError && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-sun">
          Digite o nome de uma cidade.
        </p>
      )}
    </form>
  );
}
