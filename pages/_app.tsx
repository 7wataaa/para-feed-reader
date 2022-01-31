import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { FeedIdOrderProvider } from '../state/FeedIdOrderProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <FeedIdOrderProvider>
        <Component {...pageProps} />
      </FeedIdOrderProvider>
    </SessionProvider>
  );
}

export default MyApp;
