'use client';
import Button from './ui/Button';
import useMe from '@/hooks/me';
import DotIcon from './ui/icons/DotIcon';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { PulseLoader } from 'react-spinners';

type Props = {
  username: string;
  id: string;
  type: 'text' | 'box';
};

export default function FollowButton({ username, id, type }: Props) {
  const { user: loggedInUser, toggleFollow } = useMe();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isUpdating = isPending || isFetching;

  const showButton = loggedInUser && loggedInUser.username !== username;
  const following =
    loggedInUser &&
    loggedInUser.following.find((item) => item.username === username);

  const text = following ? 'Unfollow' : 'Follow';

  const handleFollow = async () => {
    setIsFetching(true);
    await toggleFollow(id, !following);
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="relative">
      {isUpdating && (
        <div className="absolute z-20 inset-0 flex justify-center items-center">
          <PulseLoader size={6} />
        </div>
      )}
      {showButton && type === 'text' ? (
        <>
          <DotIcon />
          <Button
            buttonDisabled={isUpdating}
            text={text}
            onClick={handleFollow}
            red={text === 'Unfollow'}
            type={'text'}
          />
        </>
      ) : (
        showButton && (
          <Button
            buttonDisabled={isUpdating}
            text={text}
            onClick={handleFollow}
            red={text === 'Unfollow'}
            type={'box'}
          />
        )
      )}
    </div>
  );
}
