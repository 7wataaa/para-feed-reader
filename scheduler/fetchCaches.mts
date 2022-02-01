import { prisma } from '../prisma/PrismaClient';
import { sleep } from '../util/sleep';
import axios from 'axios';
import Parser from 'rss-parser';

type ParseResult =
  | ({
      [key: string]: any;
    } & Parser.Output<{
      [key: string]: any;
    }>)
  | null;

const rssParser = new Parser();

const sleep3s = () => sleep(3000);

// Heroku Schedulerによって定期実行される関数
(async () => {
  // キャッシュするURLの一覧
  const urls = (
    await prisma.feedCaches.findMany({
      select: {
        url: true,
      },
    })
  ).map((e) => e.url);

  for (const url of urls) {
    // url先のデータを取得
    const getRes = await axios.get<string>(url).catch((e) => {
      console.error(e);

      return null;
    });

    if (!getRes) {
      continue;
    }

    // 取得した文字列のパースを試みる
    const parsedFeed: ParseResult = await rssParser
      .parseString(getRes.data)
      .catch((e) => {
        console.error(e);

        return null;
      });

    // データのパースが失敗したとき
    if (!parsedFeed) {
      continue;
    }

    // DBのデータを更新
    const updatedFeedCache = await prisma.feedCaches.update({
      where: {
        url: url,
      },
      data: {
        updatedAt: new Date(),
        cache: getRes.data,
      },
      select: {
        url: true,
      },
    });

    console.log(`Fetching completed: ${updatedFeedCache.url}`);

    await sleep3s();
  }
})();
