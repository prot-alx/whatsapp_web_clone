interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => (
  <div className="error-state">
    <div>{error}</div>
  </div>
);

export default ErrorState;
