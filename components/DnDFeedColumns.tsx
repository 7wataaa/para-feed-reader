import { styled } from 'linaria/lib/react';
import { useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import { reorder } from '../util/reorder';
import { Feed, FeedColumn } from './FeedColumn';

interface FeedColumData {
  uuid: string;
  feedData: Feed;
}

const FeedsArea = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: scroll;
`;

// 参考: https://codesandbox.io/s/mmrp44okvj

const DnDFeedColumns = ({ feedsData }: { feedsData: FeedColumData[] }) => {
  const [feedColumnsData, setFeedColumnsData] = useState(feedsData);

  const dragEndHandler = (result: DropResult, _: ResponderProvided) => {
    // エリアの外に落とされたときには何もしない
    if (!result.destination) {
      return;
    }

    // 要素を移動させたリストを生成
    const items = reorder(
      feedColumnsData,
      result.source.index,
      result.destination.index
    );

    setFeedColumnsData(items);
  };

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <Droppable droppableId="feed-columns" direction="horizontal">
        {(provided, _) => (
          <FeedsArea ref={provided.innerRef} {...provided.droppableProps}>
            {feedColumnsData.map((e, i) => (
              <Draggable key={e.uuid} index={i} draggableId={e.uuid}>
                {(provided, _) => (
                  <FeedColumn
                    feedData={e.feedData}
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
export type { FeedColumData };
