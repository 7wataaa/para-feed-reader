import { styled } from 'linaria/lib/react';
import { useContext } from 'react';
import Modal from 'react-modal';
import { FeedIdOrderContext } from '../../provider/FeedIdOrderProvider';

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

const ColumnDeleteButton = styled.button`
  width: 80%;
  margin: 16px 10px;
  padding: 12px;
  background-color: #fff;
  color: #e5534b;
  font-size: 1.2rem;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 0 1px #c54d47 inset;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: 0.3s;

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px rgb(33, 150, 243) inset;
  }

  :hover {
    background-color: #e5534b;
    color: #fff;
  }
`;

const FeedDetailModal = ({
  isOpen,
  onRequestClose,
  modalClose,
  feedId,
  ...props
}: ReactModal.Props & { modalClose: () => void; feedId: string }) => {
  const [feedIdOrder, setFeedIdOrder] = useContext(FeedIdOrderContext);

  const onClickHandler = async () => {
    // feedIdOrderから引数で受け取るフィードのIDを削除した配列
    const newFeedIdOrder = (feedIdOrder ?? []).filter((e) => e !== feedId);

    // DBにも保存
    setFeedIdOrder(newFeedIdOrder, { isSend: true });
  };

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
      <ColumnDeleteButton onClick={async () => await onClickHandler()}>
        フィードを削除
      </ColumnDeleteButton>
    </Modal>
  );
};

export { FeedDetailModal };
