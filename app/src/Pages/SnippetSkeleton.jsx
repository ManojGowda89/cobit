// components/SnippetSkeleton.jsx

import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

const SnippetSkeleton = () => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Title and Actions Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="text" width="40%" height={30} />
          <Box>
            <Skeleton variant="circular" width={30} height={30} sx={{ ml: 1 }} />
            <Skeleton variant="circular" width={30} height={30} sx={{ ml: 1 }} />
          </Box>
        </Box>

        {/* Description Skeleton */}
        <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />

        {/* Code Block Skeleton */}
        <Box sx={{ backgroundColor: '#282c34', p: 2, borderRadius: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SnippetSkeleton;