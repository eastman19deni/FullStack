import { useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../../entities/project/api';
import { useAuth } from '../../auth/model/AuthContext';

export default function ApplyButton({ projectId }: { projectId: number }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <Button variant="outlined" onClick={() => navigate('/login')}>
        Войдите, чтобы откликнуться
      </Button>
    );
  }

  const apply = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await projectApi.apply(projectId);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось отправить отклик');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={apply} disabled={sent || submitting}>
        {sent ? 'Отклик отправлен' : 'Откликнуться'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
