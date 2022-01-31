import { styled } from 'linaria/lib/react';
import { signOut, useSession } from 'next-auth/react';
import Modal from 'react-modal';

const ModalContent = styled.div`
  width: 80%;
  max-width: 500px;
  height: 50%;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 0.4rem;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const EmailDiv = styled.div`
  width: 80%;
  margin: 10px 0;
  padding: 12px;
  font-size: 1.2rem;
  text-align: center;
`;

const SignOutButton = styled.button`
  width: 80%;
  margin: 16px 10px;
  padding: 12px;
  background-color: #fff;
  color: red;
  font-size: 1.2rem;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 0 1px #ccc inset;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: 0.3s;

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px rgb(33, 150, 243) inset;
  }

  :hover {
    background-color: #fd5454;
    color: #fff;
  }
`;

const UserModal = ({
  isOpen,
  onRequestClose,
  modalClose,
  ...props
}: ReactModal.Props & { modalClose: () => void }) => {
  const { data: session } = useSession();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose ?? modalClose}
      contentElement={(props, children) => (
        <ModalContent {...props}>{children}</ModalContent>
      )}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          position: 'relative',
          width: '100vw',
          height: '100vh',
        },
      }}
      {...props}
    >
      <EmailDiv>{session?.user?.email ?? ''}</EmailDiv>
      <SignOutButton onClick={async () => await signOut()}>
        Sign out
      </SignOutButton>
    </Modal>
  );
};

export { UserModal };
