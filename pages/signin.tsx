import { styled } from 'linaria/lib/react';
import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CenterContainer } from '../components/CenterContainer';
import { LightGoogleSigninBtn } from '../components/GoogleSigninBtn';
import { LoadingTypography } from '../components/LoadingTypography';
import { RedirectingTypography } from '../components/RedirectingTypography';
import { TitleImage } from '../components/TitleImage';

const SigninPageStyle = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #f2f2f2;
`;

const SigninPageHeader = styled.div`
  width: 70%;
  max-width: 650px;
  min-width: 400px;
  margin: auto;
  padding: 13px 0;
  padding-left: 1.6rem;
  font-weight: lighter;
  font-size: 1.8rem;
  background-color: #f7f7f7;
`;

const SigninPageDescriptionsStyle = styled.div`
  display: flex;
  width: 70%;
  max-width: 650px;
  min-width: 400px;
  margin: auto;
  padding: 0 30px;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
`;

const Description = styled.div`
  width: 100%;
  margin: 3rem 0;
  text-align: center;
  font-family: 'ヒラギノ角ゴ ProN', 'Hiragino Kaku Gothic ProN', '游ゴシック',
    '游ゴシック体', YuGothic, 'Yu Gothic', 'メイリオ', Meiryo, 'ＭＳ ゴシック',
    'MS Gothic', HiraKakuProN-W3, 'TakaoExゴシック', TakaoExGothic,
    'MotoyaLCedar', 'Droid Sans Japanese', sans-serif;
  font-size: 1.1rem;
  font-weight: lighter;
`;

const SigninDescription = styled.div`
  width: 100%;
  margin: 10px 0;
  padding: 0 25px;
  text-align: left;
  font-family: 'ヒラギノ角ゴ ProN', 'Hiragino Kaku Gothic ProN', '游ゴシック',
    '游ゴシック体', YuGothic, 'Yu Gothic', 'メイリオ', Meiryo, 'ＭＳ ゴシック',
    'MS Gothic', HiraKakuProN-W3, 'TakaoExゴシック', TakaoExGothic,
    'MotoyaLCedar', 'Droid Sans Japanese', sans-serif;
  font-size: 1.1rem;
  font-weight: lighter;
`;

const SignInPage: NextPage = () => {
  const router = useRouter();

  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  });

  if (status == 'loading') {
    return (
      <CenterContainer>
        <LoadingTypography />
      </CenterContainer>
    );
  }

  if (status == 'authenticated') {
    return (
      <CenterContainer>
        <RedirectingTypography />
      </CenterContainer>
    );
  }

  const googleSigninBtnOnClickHandler = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <SigninPageStyle>
      <SigninPageHeader>Para Feed Reader</SigninPageHeader>
      <SigninPageDescriptionsStyle>
        <TitleImage />
        <Description>
          複数のRSSフィードを表示できるRSSフィードリーダー
        </Description>
        <SigninDescription>サインインして始める:</SigninDescription>
        <LightGoogleSigninBtn
          onClickHandler={() => googleSigninBtnOnClickHandler()}
        />
      </SigninPageDescriptionsStyle>
    </SigninPageStyle>
  );
};

export default SignInPage;
