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
    // TODO ログインできているときの処理を実装
    console.log(session);
    return (
      <>
        <h1>authenticated.</h1>
        <button onClick={() => signOut()}>ログアウト</button>
      </>
    );
  }

  return (
    <>
      <h1>Para Feed Reader</h1>
      <br />
      <button onClick={() => signIn('google')}>サインインして始める</button>
    </>
  );
};

export default SignInPage;
