import { styled } from 'linaria/lib/react';
import { useContext } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import { FeedIdOrderContext } from '../provider/FeedIdOrderProvider';
import { reorder } from '../util/reorder';
import { CenterContainer } from './CenterContainer';
import { FeedColumn } from './FeedColumn';

const FeedsArea = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: scroll;
`;

// 参考: https://codesandbox.io/s/mmrp44okvj

const DnDFeedColumns = () => {
  const [feedIdOrder, setFeedIdOrder] = useContext(FeedIdOrderContext);

  const dragEndHandler = async (result: DropResult, _: ResponderProvided) => {
    // エリアの外に落とされたときには何もしない
    if (!result.destination) {
      return;
    }

    // 要素を移動させたリストを生成
    const items = reorder(
      feedIdOrder ?? [],
      result.source.index,
      result.destination.index
    );

    setFeedIdOrder(items, { isSend: true });
  };

  if (feedIdOrder?.length === 0 ?? true) {
    return (
      <CenterContainer>
        <h1>Feedを追加してください</h1>
      </CenterContainer>
    );
  }

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <Droppable droppableId="feed-columns" direction="horizontal">
        {(provided, _) => (
          <FeedsArea ref={provided.innerRef} {...provided.droppableProps}>
            {(feedIdOrder ?? []).map((e, i) => (
              <Draggable key={e} index={i} draggableId={e}>
                {(provided, _) => (
                  <FeedColumn
                    feedId={e}
                    dragRef={provided.innerRef}
                    style={provided.draggableProps.style}
                    dragHandleProps={provided.dragHandleProps}
                    draggableProps={provided.draggableProps}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </FeedsArea>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export { DnDFeedColumns };
