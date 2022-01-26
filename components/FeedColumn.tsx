import { styled } from 'linaria/react';
import Link from 'next/link';
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd';
import Parser from 'rss-parser';
import { decodeHTMLEscape } from '../util/decodeHTMLEscape';

type Feed = {
  [key: string]: any;
} & Parser.Output<{
  [key: string]: any;
}>;

const ColumnBlock = styled.div`
  display: block;
  width: 400px;
  min-width: 400px;
  height: 100vh;
  margin: 0px 20px;
  overflow-y: scroll;
  background-color: #ffffff;
`;

const ColumnHeader = styled.div`
  position: sticky;
  top: 0;
  padding: 13px 0;
  padding-left: 1.6rem;
  font-weight: lighter;
  font-size: large;
  background-color: #f7f7f7;
`;

const ColumnNewsEntities = styled.div`
  padding: 0 1.6rem;
`;

const NewsEntity = styled.div`
  width: 100%;
`;

const NewsTitle = styled.a`
  margin-bottom: 100px;
  font-weight: bold;
  word-break: break-word;
  text-decoration: none;
  color: black;

  :visited {
    color: #9d71a8;
  }

  :hover {
    text-decoration: underline;
  }
`;

const NewsContent = styled.div`
  font-size: 0.9rem;
  word-break: break-word;
`;

const NewsDate = styled.div`
  font-size: 0.7rem;
  text-align: right;
`;

const NewsWriter = styled.div`
  font-size: 0.7rem;
  text-align: right;
`;

interface FeedColumnProps {
  feedData: Feed;
  dragRef: React.LegacyRef<HTMLDivElement> | undefined;
  style: React.CSSProperties | undefined;
  draggableProps: DraggableProvidedDraggableProps | undefined;
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
}

const FeedColumn = ({
  feedData,
  dragRef,
  style,
  draggableProps,
  dragHandleProps,
}: FeedColumnProps) => {
  const items = feedData.items;

  return (
    <ColumnBlock ref={dragRef} style={style} {...draggableProps}>
      <ColumnHeader {...dragHandleProps}>{feedData.title}</ColumnHeader>
      <ColumnNewsEntities>
        {items.map((e, i) => {
          const date = new Date(e.isoDate ?? '').toLocaleDateString();
          const title = decodeHTMLEscape(e.title ?? '');
          const content = decodeHTMLEscape(e.content ?? '');
          const writer: string | null = e.creator ?? e.author;
          const url = e.link ?? '';

          return (
            <NewsEntity key={i}>
              <NewsDate>{date}</NewsDate>
              <Link href={url} passHref>
                <NewsTitle target="_blank" rel="noopener noreferrer">
                  {title}
                </NewsTitle>
              </Link>
              <NewsContent>{content}</NewsContent>
              {/* ↓creatorまたはauthorのデータが有れば表示 */}
              {writer && <NewsWriter>By {writer}</NewsWriter>}
            </NewsEntity>
          );
        })}
      </ColumnNewsEntities>
    </ColumnBlock>
  );
};

export { FeedColumn };
export type { Feed };
