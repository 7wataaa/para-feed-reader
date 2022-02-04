import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Parser from 'rss-parser';
import { prisma } from '../../../prisma/PrismaClient';
import { ResponseBodyBase, ResponseError } from './_ResponseBase';

const rssParser = new Parser();

const urlRegExp = new RegExp(/^https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+$/);

interface FeedCreateResponseBody extends ResponseBodyBase {
  data: {
    feedId: string;
    url: string;
    cache: string;
  };
}

const feedCreateApi = async (
  req: NextApiRequest,
  res: NextApiResponse<FeedCreateResponseBody | ResponseError>
) => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  // ユーザーの情報
  const session = await getSession({ req });

  if (!session || !session.user?.id) {
    res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });

    return;
  }

  const url = req.query.url;

  // urlが不正な場合弾く
  if (typeof url !== 'string' || !urlRegExp.test(url)) {
    res.statusMessage = 'Invalid url query';
    res.status(400).json({
      code: 400,
      message: 'Invalid url query',
    });

    return;
  }

  const alreadyFeedCache = await prisma.feedCaches.findUnique({
    where: {
      url: url,
    },
  });

  if (alreadyFeedCache) {
    // すでに同じURLで登録されているキャッシュがあればそのIDを返す
    res.statusMessage = 'Already created';
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

  console.log(`(${url})のキャッシュを作成 by ${session.user.id}`);

  const getRes = await axios.get(url).catch((e: AxiosError) => {
    console.error(e);

    return { errorDetails: e };
  });

  // ユーザーが指定したURLへのリクエストが失敗した場合
  if ('errorDetails' in getRes) {
    res.statusMessage = 'Fetch failed';
    res.status(500).json({
      code: 500,
      message: 'Fetch failed',
      data: {
        details: getRes.errorDetails.toJSON(),
      },
    });

    return;
  }

  // 取得した文字列のパースを試みる
  const parsedFeed = await rssParser.parseString(getRes.data).catch((e) => {
    console.error(e);

    return null;
  });

  // データのパースが失敗したとき
  if (!parsedFeed) {
    res.statusMessage = 'Data parsing failed';
    res.status(400).json({
      code: 400,
      message: 'Data parsing failed',
    });

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
  res.statusMessage = 'Creation complete';
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
