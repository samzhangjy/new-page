import { Center, Group, Text } from '@mantine/core';

const Footer = () => (
  <Group sx={{ bottom: '10px', position: 'absolute', width: '100%' }}>
    <Center sx={{ height: '30px', width: '100%' }}>
      <Text color="dimmed" size="sm">
        &copy; {new Date().getFullYear()} Sam Zhang. All rights reserved.{' '}
        <Text
          variant="link"
          component="a"
          target="_blank"
          href="https://github.com/samzhangjy/start-page"
        >
          GitHub
        </Text>
        .
      </Text>
    </Center>
  </Group>
);

export default Footer;
