import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Parser from 'rss-parser';
import { prisma } from '../../../prisma/PrismaClient';
import { ResponseBodyBase } from './_ResponseBodyBase';

const rssParser = new Parser();

const urlRegExp =
  /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;

interface FeedCreateResponseBody extends ResponseBodyBase {
  data: {
    feedId: string;
    url: string;
    cache: string;
  };
}

const feedCreateApi = async (
  req: NextApiRequest,
  res: NextApiResponse<FeedCreateResponseBody>
) => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  // ユーザーの情報
  const session = await getSession({ req });

  if (!session || !session.user?.id) {
    res.statusCode = 401;
    res.statusMessage = 'Unauthorized';
    res.end();

    return;
  }

  const { url } = req.query;

  // urlが不正な場合弾く
  if (!url || typeof url != 'string' || !urlRegExp.test(url)) {
    res.statusCode = 400;
    res.statusMessage = 'Invalid url query';
    res.end();

    return;
  }

  const alreadyFeedCache = await prisma.feedCaches.findUnique({
    where: {
      url: url,
    },
  });

  if (alreadyFeedCache) {
    // すでに同じURLで登録されているキャッシュがあればそのIDを返す
    res.status(200).json({
      code: 200,
      message: 'Already created',
      data: {
        feedId: alreadyFeedCache.id,
        url: alreadyFeedCache.url,
        cache: alreadyFeedCache.cache,
      },
    });

    return;
  }

  const getRes = await axios.get(url).catch((e: AxiosError) => {
    console.error(e);

    return { errorDetails: e };
  });

  // ユーザーが指定したURLへのリクエストが失敗した場合
  if ('errorDetails' in getRes) {
    res.statusCode = 500;
    res.statusMessage = 'Fetch failed';
    res.write(getRes.errorDetails);
    res.end();

    return;
  }

  // 取得した文字列のパースを試みる
  const parsedFeed = await rssParser.parseString(getRes.data).catch((e) => {
    console.error(e);

    return null;
  });

  // データのパースが失敗したとき
  if (!parsedFeed) {
    res.statusCode = 400;
    res.statusMessage = 'Data parsing failed';
    res.end();

    return;
  }

  const createdFeedCache = await prisma.feedCaches.create({
    data: {
      userId: session.user?.id,
      url: url,
      cache: getRes.data,
    },
  });

  // 作成完了、IDとURLとデータを返す
  res.status(200).json({
    code: 200,
    message: 'Creation complete',
    data: {
      feedId: createdFeedCache.id,
      url: createdFeedCache.url,
      cache: createdFeedCache.cache,
    },
  });
};

export default feedCreateApi;
export type { FeedCreateResponseBody };
