/**
 * @jest-environment jsdom
 */

import { getByText, render, screen } from '@testing-library/react';
import { debug } from 'console';
import React from 'react';
import Parser from 'rss-parser';
import { FeedColumn } from '../components/FeedColumn';

beforeAll(() => {
  // react-beautiful-dndをモック化
  jest.mock('react-beautiful-dnd', () => ({
    Droppable: ({ children }: any) =>
      children(
        {
          draggableProps: {
            style: {},
          },
          innerRef: jest.fn(),
        },
        {}
      ),
    Draggable: ({ children }: any) =>
      children(
        {
          draggableProps: {
            style: {},
          },
          innerRef: jest.fn(),
        },
        {}
      ),
    DragDropContext: ({ children }: any) => children,
  }));
});
describe('FeedColumn', () => {
  test('render', async () => {
    const mockFeedData = await new Parser().parseString(mockFeedStr);

    const { getByText, getAllByText } = render(
      <FeedColumn
        feedData={mockFeedData}
        dragRef={undefined}
        style={undefined}
        draggableProps={undefined}
        dragHandleProps={undefined}
      />
    );

    expect(getByText('Mock Feed')).toBeInTheDocument();

    const dateStr = new Date(
      'Fri, 14 Jan 2022 21:45:00 +0900'
    ).toLocaleDateString();

    const allDateStrElement = getAllByText(dateStr);

    expect(allDateStrElement.length).toBe(3);

    expect(getByText('記事1のタイトル')).toBeInTheDocument();
    expect(getByText('記事1の説明文')).toBeInTheDocument();
    expect(getByText('By 著者A')).toBeInTheDocument();

    expect(getByText('記事2のタイトル')).toBeInTheDocument();
    expect(getByText('記事2の説明文')).toBeInTheDocument();
    expect(getByText('By 著者B')).toBeInTheDocument();

    expect(getByText('記事3のタイトル')).toBeInTheDocument();
    expect(getByText('記事3の説明文')).toBeInTheDocument();
    expect(getByText('By 著者C')).toBeInTheDocument();
  });

  test('記者名がなかったときに表示されないか', async () => {
    const mockFeedData = await new Parser().parseString(
      mockFeedStrNoWriterName
    );

    const { getByText, queryByText } = render(
      <FeedColumn
        feedData={mockFeedData}
        dragRef={undefined}
        style={undefined}
        draggableProps={undefined}
        dragHandleProps={undefined}
      />
    );

    expect(getByText('Mock Feed')).toBeInTheDocument();

    expect(getByText('記事1のタイトル')).toBeInTheDocument();
    expect(getByText('記事1の説明文')).toBeInTheDocument();
    // ↓この部分が表示されなかったらOK
    expect(queryByText('By 著者A')).toBeNull();
  });
});

const mockFeedStr = `<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Mock Feed</title>
<link>https://example.com/</link>
<description>テストコード用の形式だけ同じフィードです。</description>
<language>ja</language>
<item>
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者A</dc:creator>
</item>
<item>
<title>記事2のタイトル</title>
<link>https://example.com/</link>
<description>記事2の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事2</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者B</dc:creator>
</item>
<item>
<title>記事3のタイトル</title>
<link>https://example.com/</link>
<description>記事3の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事3</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者C</dc:creator>
</item>
</channel>
</rss>`;

const mockFeedStrNoWriterName = `<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Mock Feed</title>
<link>https://example.com/</link>
<description>テストコード用の形式だけ同じフィードです。</description>
<language>ja</language>
<item>
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
</item>
</channel>
</rss>`;
