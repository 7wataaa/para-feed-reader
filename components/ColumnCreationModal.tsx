import { styled } from 'linaria/lib/react';
import { Controller, useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { ErrorMessage } from '@hookform/error-message';

// https://reactcommunity.org/react-modal/examples/set_app_element/
Modal.setAppElement('#__next');

const urlRegExp =
  /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  width: 80%;
  max-width: 500px;
  margin-right: -50%;
  padding: 20px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 0.4rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormLabel = styled.div`
  margin: 4px auto;
  font-size: 1.1rem;
  font-weight: 300;
`;

const FeedURLForm = styled.input`
  font-size: 1.1rem;
  height: 2.4em;
  width: 100%;
  margin: 16px auto;
  padding: 0 16px;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 0 1px #ccc inset;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px rgb(33, 150, 243) inset;
  }

  ::placeholder {
    color: rgba(0, 0, 0, 20%);
  }
`;

const FormErrorMessage = styled.div`
  color: tomato;
`;

const FeedCreationButton = styled.button`
  display: block;
  margin: 16px auto;
  padding: 0.8rem 1rem;
  width: 200px;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  background-color: #ecf383;
  box-shadow: 0 5px 0 #aaaaaa;
  transition: 0.3s;
  border-radius: 0.4rem;

  ::after {
    content: '';
    width: 5px;
    height: 5px;
    transform: rotate(45deg);
  }

  :hover {
    transform: translateY(3px);
    text-decoration: none;
    box-shadow: 0 2px 0 #aaaaaa;
  }
`;

const ColumnCreationModal = ({
  isOpen,
  onRequestClose,
  modalClose,
  ...props
}: ReactModal.Props & { modalClose: () => void }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    // TODO DBへの登録
    console.log(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose ?? modalClose}
      contentElement={(props, children) => (
        <ModalContent {...props}>{children}</ModalContent>
      )}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
      }}
      {...props}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel>追加したいフィードのURLを入力してください…</FormLabel>
        <Controller
          name="feedURLForm"
          rules={{
            required: 'フォームが未入力です',
            pattern: {
              value: urlRegExp,
              message: '正しいURLを入力してください',
            },
          }}
          control={control}
          render={({ field }) => (
            <FeedURLForm {...field} placeholder="Your Favorite Feed URL" />
          )}
        />
        <ErrorMessage
          name="feedURLForm"
          errors={errors}
          render={({ message }) => (
            <FormErrorMessage>{message}</FormErrorMessage>
          )}
        />
        <FeedCreationButton type="submit">追加</FeedCreationButton>
      </form>
    </Modal>
  );
};

export { ColumnCreationModal };
