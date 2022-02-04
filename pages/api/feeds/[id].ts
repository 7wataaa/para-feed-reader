import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../prisma/PrismaClient';
import { ResponseBodyBase, ResponseError } from './_ResponseBase';

const uuidRegExp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

interface FeedIdApiResponseBody extends ResponseBodyBase {
  data: {
    feedId: string;
    url: string;
    cache: string;
  };
}

const feedIdApi = async (
  req: NextApiRequest,
  res: NextApiResponse<FeedIdApiResponseBody | ResponseError>
) => {
  const id = req.query.id;

  if (req.method !== 'GET' || typeof id !== 'string') {
    res.status(404).json({
      code: 404,
      message: 'Not Found',
    });
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

  // idがUUIDの形式でない場合400を返す
  if (!uuidRegExp.test(id)) {
    res.status(404).json({
      code: 404,
      message: 'Not Found',
    });
    return;
  }

  // DBからフィードのキャッシュを取得
  const feed = await prisma.feedCaches
    .findUnique({
      where: {
        id: id,
      },
    })
    .catch((e) => {
      console.error(e);

      return null;
    });

  // データが存在しない場合弾く
  if (!feed) {
    res.statusMessage = 'Feed data not found';
    res.status(404).json({
      code: 404,
      message: 'Feed data not found',
    });

    return;
  }

  // 取得完了、データを返す
  res.statusMessage = 'Completed fetching feed data';
  res.status(200).json({
    code: 200,
    message: 'Completed fetching feed data',
    data: {
      feedId: feed.id,
      url: feed.url,
      cache: feed.cache,
    },
  });
};

export default feedIdApi;
export type { FeedIdApiResponseBody };
