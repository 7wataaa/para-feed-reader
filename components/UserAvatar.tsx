import { styled } from 'linaria/lib/react';
import { SyntheticEvent } from 'react';
import Avatar from 'react-avatar';

const UserAvatarWrapper = styled.div`
  margin: 25px;
`;

interface UserAvatarProps {
  userId: string;
  photoUrl: string;
  provider: 'google';
  onClick?: (e: SyntheticEvent<any, Event>) => any;
}

const UserAvatar = ({
  userId,
  photoUrl,
  provider,
  onClick,
}: UserAvatarProps) => {
  if (provider != 'google') {
    // 現段階ではGoogleしかサポートしない
    throw Error('not supported');
  }

  return (
    <UserAvatarWrapper>
      <Avatar
        googleId={userId}
        round={true}
        size="36"
        alt="Picture of the author"
        src={photoUrl}
        onClick={onClick}
      />
    </UserAvatarWrapper>
  );
};

export { UserAvatar };
export type { UserAvatarProps };
