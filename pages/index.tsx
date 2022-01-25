import { styled } from 'linaria/lib/react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Parser from 'rss-parser';
import { CenterContainer } from '../components/CenterContainer';
import { DnDFeedColumns, FeedColumData } from '../components/DnDFeedColumns';
import { LoadingTypography } from '../components/LoadingTypography';

const rssParser = new Parser();

const Root = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  background-color: #f2f2f2;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
`;

const Home: NextPage = () => {
  // カラムで表示するフィードのデータ
  const [feedsData, setFeedsData] = useState<null | FeedColumData[]>(null);

  useEffect(() => {
    const readRawFeed = async () => {
      // ユーザーのフィードをDBから持ってきて表示するモック
      const rawFeedData = await fetchFeedStrs();

      // すべてのフィードをパース
      const parsedFeeds = await Promise.all([
        ...rawFeedData.map((e) => rssParser.parseString(e.xml)),
      ]);

      // indexとuuidとパースされたデータを結合
      const allFeedData = rawFeedData.map((e, i) => ({
        index: i,
        uuid: e.uuid,
        feedData: parsedFeeds[i],
      }));

      setFeedsData(allFeedData);
    };

    readRawFeed();
  }, []);

  if (!feedsData) {
    return (
      <CenterContainer>
        <LoadingTypography />
      </CenterContainer>
    );
  }

  if (feedsData.length === 0) {
    return (
      <CenterContainer>
        <h1>Feedを追加してください...</h1>
      </CenterContainer>
    );
  }

  return (
    <Root>
      <DnDFeedColumns feedsData={feedsData} />
    </Root>
  );
};

export default Home;

// フィード取得のモックアップ
const fetchFeedStrs = async (): Promise<{ uuid: string; xml: string }[]> => {
  // 2秒待つ
  await new Promise<void>((res, _) => {
    setTimeout(() => {
      res();
    }, 2000);
  });

  const feedMock = (uuid: string, feed: string) => {
    return {
      uuid: uuid,
      xml: feed.replace(/&/g, '&amp;').replace(/-/g, '&#45;'),
    };
  };

  return [
    feedMock('News-One', _rawFeedStr1),
    feedMock('News-Two', _rawFeedStr2),
    feedMock('News-Three', _rawFeedStr3),
  ];
};

const _rawFeedStr1 = `<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>News-One</title>
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
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者A</dc:creator>
</item>
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
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者A</dc:creator>
</item>
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
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者A</dc:creator>
</item>
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
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者A</dc:creator>
</item>
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
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者A</dc:creator>
</item>
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
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者A</dc:creator>
</item>
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
<title>記事1のタイトル</title>
<link>https://example.com/</link>
<description>記事1の説明文</description>
<pubDate>Fri, 14 Jan 2022 21:45:00 +0900</pubDate>
<guid>記事1</guid>
<enclosure length="0" type="image/png" url="https://placehold.jp/740x417.png"/>
<dc:creator>著者A</dc:creator>
</item>
</channel>
</rss>`;

const _rawFeedStr2 = `<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>News-Two</title>
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
</channel>
</rss>`;

const _rawFeedStr3 = `<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>News-Three</title>
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
</channel>
</rss>`;
