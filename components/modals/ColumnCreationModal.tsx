import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { styled } from 'linaria/lib/react';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { SUBSCRIPTION_LIMIT } from '../../config';
import { FeedCreateResponseBody } from '../../pages/api/feeds/create';
import { FeedIdOrderContext } from '../../provider/FeedIdOrderProvider';

// https://reactcommunity.org/react-modal/examples/set_app_element/
Modal.setAppElement('#__next');

const urlRegExp = new RegExp(/^https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+$/);

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
  color: #e5534b;
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
  const [feedIdOrder, setFeedIdOrder] = useContext(FeedIdOrderContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  const onSubmit = async (data: any) => {
    // 入力欄を空にする
    setValue('feedURLForm', '');

    const url = data.feedURLForm as string;

    if (!url) {
      console.error(url);
      return;
    }

    // urlからDBのfeedIdを取得する
    const feedIdRes = await axios
      .post<FeedCreateResponseBody>(`/api/feeds/create?url=${url}`)
      .catch((e) => {
        console.error(e);
        return null;
      });

    if (!feedIdRes || feedIdRes.status !== 200) {
      return;
    }

    const newFeedId = feedIdRes.data.data.feedId;

    // newFeedIDが登録済みであった場合、登録しない
    if ((feedIdOrder ?? []).includes(newFeedId)) {
      // エラー文を表示
      setError('feedURLForm', {
        type: 'manual',
        message: 'このフィードはすでに登録されています',
      });

      return;
    }

    setFeedIdOrder([...(feedIdOrder ?? []), newFeedId], { isSend: true });
  };

  const isSubscribingLimit = (feedIdOrder?.length ?? 0) == SUBSCRIPTION_LIMIT;

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel>追加したいRSSフィードのURLを入力してください…</FormLabel>
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
        <FeedCreationButton type="submit" disabled={isSubscribingLimit}>
          追加
        </FeedCreationButton>
      </form>
    </Modal>
  );
};

export { ColumnCreationModal };
