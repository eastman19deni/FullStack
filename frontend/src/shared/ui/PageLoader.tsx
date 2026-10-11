import { Box, Skeleton } from '@mui/material';

export default function PageLoader() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={220} />
      ))}
    </Box>
  );
}
