import { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { CenterContainer } from '../components/CenterContainer';
import { LoadingTypography } from '../components/LoadingTypography';

const SignInPage: NextPage = () => {
  const { data: session, status } = useSession();

  if (status == 'loading') {
    return (
      <CenterContainer>
        <LoadingTypography />
      </CenterContainer>
    );
  }

  if (status == 'authenticated') {
    // ログイン時はルートディレクトリにリダイレクトされるのでここには来ないはず
    throw Error('Not redirected after sign-in.');
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
