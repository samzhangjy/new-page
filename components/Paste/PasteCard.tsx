import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  CopyButton,
  Group,
  Image,
  Popover,
  Space,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { PasteType } from '@prisma/client';
import { IconCheck, IconCopy, IconFile, IconTrash } from '@tabler/icons';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import Moment from 'react-moment';
import useApi from '../../hooks/useApi';
import { truncate } from '../../utils/truncate';

export type PasteProps = {
  updatedAt: Date;
  contents: string;
  type: PasteType;
  filename: string | null;
  filesize: number | null;
  id: number;
  onReload: () => void;
};

const getContentDetails = (contents: string) => ({
  filename: contents.split(';')[0],
  url: contents.split(';')[1],
});

const getDownloadUrl = (url: string) => {
  const splitted = url.split('/upload/', 2);
  return `${splitted[0]}/upload/fl_attachment/${splitted[1]}`;
};

const deletePaste = async (id: number) => {
  const api = await useApi(`/api/pastepad/${id}`, {
    method: 'DELETE',
    token: getCookie('ACCESS_TOKEN') as string,
  });
  const res = await api.json();
  if (res.status !== 'success') {
    showNotification({
      message: 'Failed to delete paste.',
    });
  }
};

const Paste = ({
  updatedAt,
  contents,
  type,
  filename,
  filesize,
  id,
  onReload: refreshPastes,
}: PasteProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder sx={{ height: '100%' }}>
      <Group mb="xs" position="apart">
        <Group>
          <Badge color="blue" variant="light">
            {type}
          </Badge>
          {type !== 'TEXT' && (
            <Text size="xs" color="dimmed">
              {(filesize! / 1000).toFixed(2)}kb
            </Text>
          )}
        </Group>
        <Group>
          <Text size="sm" color="dimmed">
            Last updated on <Moment format="YYYY-MM-DD">{updatedAt}</Moment>
          </Text>
          {type === 'TEXT' && (
            <CopyButton value={contents} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'}>
                  <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          )}
          <Popover
            width={300}
            shadow="md"
            opened={showDeleteConfirm}
            onChange={setShowDeleteConfirm}
            withArrow
          >
            <Popover.Target>
              <ActionIcon color="red" onClick={() => setShowDeleteConfirm(true)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text>Are you sure to delete this paste?</Text>
              <Space h="sm" />
              <Button
                size="xs"
                variant="light"
                color="gray"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                variant="light"
                color="red"
                ml="xs"
                onClick={async () => {
                  setShowDeleteConfirm(false);
                  await deletePaste(id);
                  refreshPastes();
                }}
              >
                Delete
              </Button>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Group>
      <Space h="lg" />
      {type === 'TEXT' ? (
        <Text color="dimmed">{truncate(contents, 500)}</Text>
      ) : (
        <>
          {type === 'IMAGE' ? (
            <Center>
              <Image
                src={getContentDetails(contents).filename}
                radius="md"
                sx={{ height: '100%', width: '100%' }}
                caption={filename}
              />
            </Center>
          ) : (
            <>
              <Text>Unsupported raw file.</Text>
              <Space h="lg" />
              <Group>
                <div>
                  <ThemeIcon variant="light" size={150} radius="lg" mb="sm">
                    <IconFile size={130} stroke={1} />
                  </ThemeIcon>
                  <Center>
                    <Text color="dimmed" size="sm">
                      {filename}
                    </Text>
                  </Center>
                </div>
              </Group>
            </>
          )}
          <Button component="a" href={getDownloadUrl(contents)} fullWidth variant="light" mt="lg">
            Download
          </Button>
        </>
      )}
    </Card>
  );
};

export default Paste;
