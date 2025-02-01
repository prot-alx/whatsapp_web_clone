interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className="error-state">
    <div>{error}</div>
  </div>
);

export default ErrorState;
