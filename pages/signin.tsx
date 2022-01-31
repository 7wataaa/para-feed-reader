import { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CenterContainer } from '../components/CenterContainer';
import { LoadingTypography } from '../components/LoadingTypography';
import { RedirectingTypography } from '../components/RedirectingTypography';

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

  return (
    <>
      <h1>Para Feed Reader</h1>
      <br />
      <button onClick={() => signIn('google', { callbackUrl: '/' })}>
        サインインして始める
      </button>
    </>
  );
};

export default SignInPage;
