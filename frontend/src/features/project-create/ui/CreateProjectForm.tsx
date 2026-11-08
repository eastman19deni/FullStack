import { useState } from 'react';
import { Alert, Box, Button, MenuItem, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../../entities/project/api';
import { tagApi } from '../../../entities/tag/api';
import { useAsync } from '../../../shared/lib/useAsync';

export default function CreateProjectForm() {
  const navigate = useNavigate();
  const { data: tags, loading: tagsLoading, error: tagsError } = useAsync(() => tagApi.list(), []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (title.trim().length < 3) e.title = 'Минимум 3 символа';
    if (description.trim().length < 20) e.description = 'Минимум 20 символов';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const created = await projectApi.create({
        title: title.trim(),
        description: description.trim(),
        tagIds,
      });
      navigate(`/projects/${created.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Не удалось создать проект');
    } finally {
      setSubmitting(false);
    }
  };

  const allTags = tags ?? [];

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        {tagsError && <Alert severity="warning">Не удалось загрузить теги: {tagsError}</Alert>}

        <TextField
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
        />
        <TextField
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          multiline
          minRows={4}
          fullWidth
        />
        <TextField
          select
          label="Теги"
          value={tagIds}
          disabled={tagsLoading}
          onChange={(e) => setTagIds(e.target.value as number[])}
          slotProps={{
            select: {
              multiple: true,
              renderValue: (selected) =>
                allTags
                  .filter((t) => (selected as number[]).includes(t.id))
                  .map((t) => t.name)
                  .join(', '),
            },
          }}
          fullWidth
        >
          {allTags.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={() => navigate('/projects')}>Отмена</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Создание...' : 'Создать'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
