import { styled } from 'linaria/lib/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { ColumnCreationModal } from './modals/ColumnCreationModal';
import { UserModal } from './modals/UserModal';
import { UserAvatar } from './UserAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const SideBarArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 50px;
  height: 100vh;
  background-color: #ececec;
  box-shadow: 6px 0 5px -3px #c0c0c0;
  align-items: center;
  justify-content: space-between;
`;

const ModalDisplayButton = styled.button`
  margin: 16px auto;
  padding: 0.6rem 0.8rem;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  background-color: #ecf383;
  box-shadow: 0 2px 0 #aaaaaa;
  transition: 0.3s;
  border-radius: 0.4rem;

  ::after {
    content: '';
    width: 50px;
    height: 5px;
    transform: rotate(45deg);
  }

  :hover {
    transform: translateY(2px);
    text-decoration: none;
    box-shadow: 0 0px 0 #aaaaaa;
  }
`;

const SideBar = () => {
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);

  const [isUserModalOpen, setUserModalOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <SideBarArea>
      <ModalDisplayButton onClick={() => setCreationModalOpen(true)}>
        <FontAwesomeIcon icon={faPlus} />
      </ModalDisplayButton>
      {session?.user?.id && session.user.image && (
        <UserAvatar
          provider="google"
          userId={session.user.id}
          photoUrl={session.user.image}
          onClick={() => setUserModalOpen(true)}
        />
      )}
      <ColumnCreationModal
        isOpen={isCreationModalOpen}
        modalClose={() => setCreationModalOpen(false)}
        onRequestClose={() => setCreationModalOpen(false)}
        contentLabel="Modal for creating a new column"
      />
      <UserModal
        isOpen={isUserModalOpen}
        modalClose={() => setUserModalOpen(false)}
        onRequestClose={() => setUserModalOpen(false)}
        contentLabel="Modal for displaying user details"
      />
    </SideBarArea>
  );
};

export { SideBar };
