// components/FollowButton.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// import { useFetchFollow, useFollowUser, useUnfollowUser } from ''
// import { useFetchFollow, useFollowUser, useUnfollowUser } from '~/utils/follow';

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
}

