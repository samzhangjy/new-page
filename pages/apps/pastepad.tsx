import { Box, Button, Center, Container, Space, Text, ThemeIcon } from '@mantine/core';
import { IconTruckDelivery } from '@tabler/icons';
import { useRouter } from 'next/router';

const PastepadPage = () => {
  const router = useRouter();

  return (
    <Container>
      <Center style={{ width: '100%', height: '100vh' }}>
        <Box>
          <ThemeIcon variant="light" size={300} sx={{ borderRadius: 50 }}>
            <IconTruckDelivery size={250} stroke={1} />
          </ThemeIcon>
          <Space h={20} />
          <Center>
            <Text weight={700} inline>
              Pastepad
            </Text>
            <Text>&nbsp;- Work in progress.</Text>
          </Center>
          <Space h={20} />
          <Center>
            <Button variant="default" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </Center>
        </Box>
      </Center>
    </Container>
  );
};

export default PastepadPage;
