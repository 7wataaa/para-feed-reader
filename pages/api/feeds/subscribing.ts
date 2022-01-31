import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { SUBSCRIPTION_LIMIT } from '../../../config';
import { prisma } from '../../../prisma/PrismaClient';
import { ResponseBodyBase } from './_ResponseBodyBase';

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
      res.statusCode = 404;
      res.end();
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
  res: NextApiResponse<FeedSubscribingGETApiResponseBody>
) => {
  // ユーザーの情報
  const session = await getSession({ req });

  if (!session || !session.user?.id) {
    res.statusCode = 401;
    res.statusMessage = 'Unauthorized';
    res.end();
    return;
  }

  const subscribingFeeds = await prisma.feedOrder
    .findUnique({
      where: {
        userId: session.user.id,
      },
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  if (!subscribingFeeds) {
    res.statusCode = 500;
    res.end();
    return;
  }

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
  res: NextApiResponse<FeedSubscribingPOSTApiResponseBody>
) => {
  // ユーザーの情報
  const session = await getSession({ req });

  if (!session || !session.user?.id) {
    res.statusCode = 401;
    res.statusMessage = 'Unauthorized';
    res.end();
    return;
  }

  const body = req.body as FeedSubscribingPOSTBody | null;

  // すべての要素がUUIDの形式かどうか
  const testAll = body?.subscribingFeedIdOrder.every(uuidRegExp.test) ?? false;

  if (!body || !('subscribingFeedIdOrder' in body) || !testAll) {
    res.statusCode = 400;
    res.end();
    return;
  }

  // 購読している数がSUBSCRIPTION_LIMITより大きければ受け付けない
  if (body.subscribingFeedIdOrder.length > SUBSCRIPTION_LIMIT) {
    res.statusCode = 400;
    res.statusMessage = `Exceeds SUBSCRIPTION_LIMIT (${SUBSCRIPTION_LIMIT})`;
    res.end();
    return;
  }

  const newFeedOrder = await prisma.feedOrder.update({
    where: {
      userId: session.user.id,
    },
    data: {
      feedIdOrder: body.subscribingFeedIdOrder,
    },
  });

  res.json({
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
