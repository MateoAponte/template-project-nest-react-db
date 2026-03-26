import './spinner.scss';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  fullScreen?: boolean;
}

export function Spinner({
  size = 'md',
  label = 'Loading...',
  fullScreen = false,
}: SpinnerProps) {
  const spinner = (
    <div
      className={`spinner spinner--${size}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="spinner__circle" />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="spinner-overlay">{spinner}</div>;
  }

  return spinner;
}
