import { Alert, Button } from '@mui/material';

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button size="small" color="inherit" onClick={onRetry}>
            Повторить
          </Button>
        )
      }
    >
      {message}
    </Alert>
  );
}
