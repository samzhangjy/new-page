import {
  ActionIcon,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Title,
  Tooltip,
} from '@mantine/core';
import { Paste } from '@prisma/client';
import { IconHome } from '@tabler/icons';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AddPaste, PasteCard } from '../../components/Paste';
import useApi from '../../hooks/useApi';
import { GetPastesResponse } from '../api/pastepad';

const PastepadPage = () => {
  const router = useRouter();
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(false);

  const getPastes = async () => {
    setLoading(true);
    const api = await useApi('/api/pastepad', {
      method: 'GET',
      token: getCookie('ACCESS_TOKEN') as string,
    });
    const res: GetPastesResponse = await api.json();
    setPastes(res.pastes);
    setLoading(false);
  };

  useEffect(() => {
    getPastes();
  }, []);

  return (
    <>
      <Tooltip label="Home page">
        <ActionIcon
          onClick={() => router.push('/')}
          size="xl"
          sx={{ position: 'absolute', top: 10, left: 10 }}
          variant="light"
        >
          <IconHome />
        </ActionIcon>
      </Tooltip>
      <Container my={70}>
        <Group position="apart">
          <Title>Pastepad</Title>
          <AddPaste onReload={getPastes} />
        </Group>
        <Divider my={20} />
        <Center>{loading && <Loader my="xl" variant="dots" />}</Center>
        <Grid gutter="lg">
          {pastes.map((paste, index) => (
            <Grid.Col key={index} sm={6} xs={12}>
              <PasteCard {...paste} onReload={getPastes} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default PastepadPage;
