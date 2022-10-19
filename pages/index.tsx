import { Container } from '@mantine/core';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';

export default function HomePage() {
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
