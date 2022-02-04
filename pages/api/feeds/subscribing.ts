import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { SUBSCRIPTION_LIMIT } from '../../../config';
import { prisma } from '../../../prisma/PrismaClient';
import { ResponseBodyBase, ResponseError } from './_ResponseBase';

const uuidRegExp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const feedsSubscibingApi = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET':
      await feedsSubscibingGETApi(req, res);
      break;

    case 'POST':
      await feedsSubscibingPOSTApi(req, res);
      break;

    default:
      res.status(404).json({
        code: 404,
        message: 'Not Found',
      });
      break;
  }
};

interface FeedSubscribingGETApiResponseBody extends ResponseBodyBase {
  data: {
    subscriptionlimit: number;
    subscribingFeedIdOrder: string[];
  };
}

const feedsSubscibingGETApi = async (
  req: NextApiRequest,
  res: NextApiResponse<FeedSubscribingGETApiResponseBody | ResponseError>
) => {
  // ユーザーの情報
  const session = await getSession({ req });

  if (!session || !session.user?.id) {
    res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
    return;
  }

  const subscribingFeeds = await prisma.feedOrder
    .upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        // もしsession.userのfeedIdOrderがまだ存在していなかったら作成する
        userId: session.user.id,
        feedIdOrder: [],
      },
      update: {
        // すでにあったら何もしない
      },
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  console.log(`(${subscribingFeeds?.id})を取得 by ${session.user.id}`);

  if (!subscribingFeeds) {
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
    return;
  }

  res.statusMessage = 'Completed fetching subscribing feed ids';
  res.status(200).json({
    code: 200,
    message: 'Completed fetching subscribing feed ids',
    data: {
      subscriptionlimit: SUBSCRIPTION_LIMIT,
      subscribingFeedIdOrder: subscribingFeeds.feedIdOrder,
    },
  });
};

interface FeedSubscribingPOSTBody {
  subscribingFeedIdOrder: string[];
}

interface FeedSubscribingPOSTApiResponseBody extends ResponseBodyBase {
  data: {
    subscriptionlimit: number;
    subscribingFeedIdOrder: string[];
  };
}

const feedsSubscibingPOSTApi = async (
  req: NextApiRequest,
  res: NextApiResponse<FeedSubscribingPOSTApiResponseBody | ResponseError>
) => {
  // ユーザーの情報
  const session = await getSession({ req });

  if (!session || !session.user?.id) {
    res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
    return;
  }

  console.log(session.user.id);

  const body = req.body as FeedSubscribingPOSTBody | null;

  // すべての要素がUUIDの形式かどうか
  const testAll =
    body?.subscribingFeedIdOrder.every(uuidRegExp.test.bind(uuidRegExp)) ??
    false;

  if (!body || !('subscribingFeedIdOrder' in body) || !testAll) {
    res.status(400).json({
      code: 400,
      message: 'Bad Request',
    });
    return;
  }

  // 購読している数がSUBSCRIPTION_LIMITより大きければ受け付けない
  if (body.subscribingFeedIdOrder.length > SUBSCRIPTION_LIMIT) {
    res.statusMessage = `Exceeds SUBSCRIPTION_LIMIT (${SUBSCRIPTION_LIMIT})`;
    res.status(400).json({
      code: 400,
      message: `Exceeds SUBSCRIPTION_LIMIT (${SUBSCRIPTION_LIMIT})`,
    });
    return;
  }

  const newFeedOrder = await prisma.feedOrder.upsert({
    where: {
      userId: session.user.id,
    },
    create: {
      // もしsession.userのfeedIdOrderがまだ存在していなかったら作成する
      userId: session.user.id,
      feedIdOrder: body.subscribingFeedIdOrder,
    },
    update: {
      // すでにあったらそれを更新する
      feedIdOrder: body.subscribingFeedIdOrder,
    },
  });

  res.statusMessage = 'Update to new order';
  res.status(200).json({
    code: 200,
    message: 'Update to new order',
    data: {
      subscriptionlimit: SUBSCRIPTION_LIMIT,
      subscribingFeedIdOrder: newFeedOrder.feedIdOrder,
    },
  });
};

export default feedsSubscibingApi;
export type {
  FeedSubscribingPOSTApiResponseBody,
  FeedSubscribingGETApiResponseBody,
};
