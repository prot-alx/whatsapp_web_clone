interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-red-600">{error}</div>
  </div>
);
