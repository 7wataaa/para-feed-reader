import axios from 'axios';
import { styled } from 'linaria/lib/react';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CenterContainer } from '../components/CenterContainer';
import { DnDFeedColumns } from '../components/DnDFeedColumns';
import { LoadingTypography } from '../components/LoadingTypography';
import { RedirectingTypography } from '../components/RedirectingTypography';
import { SideBar } from '../components/SideBar';
import { FeedIdOrderContext } from '../provider/FeedIdOrderProvider';
import { FeedSubscribingGETApiResponseBody } from './api/feeds/subscribing';

const Root = styled.div`
  display: flex;
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
  const [feedIdOrder, setFeedIdOrder] = useContext(FeedIdOrderContext);

  const router = useRouter();

  const { status } = useSession();

  useEffect(() => {
    const fetchAllFeedIds = async () => {
      if (status !== 'authenticated') {
        router.push('/signin');
        return;
      }

      console.log('Fetch subscribing FeedIds');

      // ユーザーが購読しているフィード一覧の取得を試みる
      const subscribingFeedIdsRes = await axios
        .get<FeedSubscribingGETApiResponseBody>('/api/feeds/subscribing')
        .catch((e) => {
          console.error(e);
          return null;
        });

      if (!subscribingFeedIdsRes || subscribingFeedIdsRes.status !== 200) {
        throw Error('Failed to get FeedIds');
      }

      // 購読しているフィードのIDたち
      const { subscribingFeedIdOrder } = subscribingFeedIdsRes.data.data;

      console.log(subscribingFeedIdOrder);

      setFeedIdOrder(subscribingFeedIdOrder);
    };

    fetchAllFeedIds();
  }, []);

  if (status !== 'authenticated') {
    return (
      <CenterContainer>
        <RedirectingTypography />
      </CenterContainer>
    );
  }

  if (!feedIdOrder) {
    return (
      <CenterContainer>
        <LoadingTypography />
      </CenterContainer>
    );
  }

  return (
    <Root>
      <SideBar />
      <DnDFeedColumns />
    </Root>
  );
};

export default Home;
