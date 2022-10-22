import { Container } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';
import { Header } from '../components/Header';
import { SearchBox } from '../components/SearchBox';

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
    <>
      <Header />
      <Container>
        <SearchBox />
      </Container>
      <ColorSchemeToggle />
    </>
  );
}
