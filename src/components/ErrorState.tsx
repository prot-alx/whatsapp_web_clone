interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className="error-state">
    <div>{error}</div>
  </div>
);
