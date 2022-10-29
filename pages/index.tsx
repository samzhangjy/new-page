import { Box, Container } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { ActionBar } from '../components/ActionBar';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';
import { Header } from '../components/Header';
import { SearchBox } from '../components/SearchBox';
import { Footer } from '../components/Footer';

export default function HomePage() {
  const onOffline = () => {
    showNotification({
      title: "You're offline",
      message:
        'While you can use NTP just fine, you will not be able to search for anything until you connect to the Internet.',
      color: 'red',
    });
  };

  const onOnline = () => {
    showNotification({
      title: "You're back online!",
      message: "Hooray! You're now back online.",
      color: 'blue',
    });
  };

  useEffect(() => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    if (!window.navigator.onLine) {
      onOffline();
    }
  });

  return (
    <Box sx={{ height: 'calc(100vh - 100px)' }}>
      <ActionBar />
      <Header />
      <Container>
        <SearchBox />
      </Container>
      <ColorSchemeToggle />
      <Footer />
    </Box>
  );
}
