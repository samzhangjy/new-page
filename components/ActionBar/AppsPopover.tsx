import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Popover,
  Space,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconApps, IconChevronRight, IconClipboard } from '@tabler/icons';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  name: string;
  desc: string;
  icon: React.ReactNode;
  link: string;
}

const AppButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ name, desc, icon, link, ...others }: UserButtonProps, ref) => {
    const router = useRouter();

    return (
      <UnstyledButton
        ref={ref}
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: `${theme.spacing.sm}px ${theme.spacing.xs}px`,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          borderRadius: theme.radius.md,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
          },
        })}
        onClick={() => router.push(link)}
        {...others}
      >
        <Group>
          <Avatar>{icon}</Avatar>

          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name}
            </Text>

            <Text color="dimmed" size="xs">
              {desc}
            </Text>
          </div>

          <IconChevronRight size={16} />
        </Group>
      </UnstyledButton>
    );
  }
);

const AppsPopover = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Popover width={300} shadow="md" position="bottom">
      <Popover.Target>
        <ActionIcon variant="light" size="lg">
          <IconApps />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Box>
          <Text>Apps</Text>
          {!user && (
            <Text size="xs" color="dimmed">
              Login to use these apps across devices.
            </Text>
          )}
          <Space h={10} />
          <AppButton
            name="Pastepad"
            desc="A simple pastepad."
            icon={<IconClipboard />}
            link="/apps/pastepad"
          />
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};

export default AppsPopover;
