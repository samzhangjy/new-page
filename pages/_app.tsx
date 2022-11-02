import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function App(props: AppProps & { colorScheme: 'auto' | 'light' | 'dark' }) {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme === 'auto' ? 'light' : props.colorScheme
  );

  useEffect(() => {
    if (props.colorScheme === 'auto') {
      setColorScheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, []);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  return (
    <>
      <Head>
        <title>New Tab</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        {colorScheme === 'dark' && <style>{':root { color-scheme: dark; }'}</style>}
      </Head>

      <Provider store={store}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </Provider>
    </>
  );
}

App.getInitialProps = () => ({
  colorScheme: 'auto',
});
