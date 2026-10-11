import { Box, Typography } from '@mui/material';

export default function EmptyState({ text }: { text: string }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
}
