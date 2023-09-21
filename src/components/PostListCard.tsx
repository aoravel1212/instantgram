'use client';
import { Comment, SimplePost } from '@/model/post';
import Image from 'next/image';
import ActionBar from './ActionBar';
import { useState } from 'react';
import ModalPortal from './ui/ModalPortal';
import PostModal from './PostModal';
import PostDetail from './PostDetail';
import PostUserAvatar from './PostUserAvatar';
import usePosts from '@/hooks/posts';
import { parseDate } from '@/util/date';
import DotIcon from './ui/icons/DotIcon';

type Props = {
  post: SimplePost;
  priority?: boolean;
};

export default function PostListCard({ post, priority = false }: Props) {
  const { userImage, username, image, text, comments, createdAt, author } =
    post;
  const [openModal, setOpenModal] = useState(false);
  const { postComment } = usePosts();

  const handlePostComment = (comment: Comment) => {
    postComment(post, comment);
  };

  return (
    <article className="rounded-lg shadow-md border border-gray-200">
      <PostUserAvatar
        image={userImage}
        username={username}
        authorId={author._ref}
      >
        <DotIcon />
        <p className=" text-neutral-500 uppercase my-2">
          {parseDate(createdAt)}
        </p>
      </PostUserAvatar>
      <Image
        className="w-full object-cover aspect-square"
        src={image}
        alt={`photo by ${username}`}
        width={500}
        height={500}
        priority={priority}
        onClick={() => setOpenModal(true)}
      />
      <ActionBar post={post} onComment={handlePostComment}>
        <p>
          <span className="font-bold mr-1">{username}</span>
          {text}
        </p>
        {comments > 0 && (
          <button
            className="font-bold my-2 text-sky-500"
            onClick={() => setOpenModal(true)}
          >
            {comments === 1
              ? `댓글 ${comments}개 보기`
              : `댓글 ${comments}개 모두 보기`}
          </button>
        )}
      </ActionBar>
      {openModal && (
        <ModalPortal>
          <PostModal onClose={() => setOpenModal(false)}>
            <PostDetail post={post} />
          </PostModal>
        </ModalPortal>
      )}
    </article>
  );
}
