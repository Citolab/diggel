interface AdvanceButtonProps {
  loading: boolean;
  label: string;
  onClick: () => void;
  className?: string;
  showChevron?: boolean;
}

/** Post / Continue / Next with in-button spinner while advancing (old app UX). */
export function AdvanceButton({
  loading,
  label,
  onClick,
  className = 'btn btn-primary',
  showChevron = true,
}: AdvanceButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
    >
      {label}
      {' '}
      {loading ? (
        <span className="advance-button__spinner mdi mdi-loading mdi-spin" aria-hidden />
      ) : showChevron ? (
        <span aria-hidden>›</span>
      ) : null}
    </button>
  );
}
