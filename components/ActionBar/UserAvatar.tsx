import { ActionIcon, Box, Menu } from '@mantine/core';
import { IconLogout, IconSettings } from '@tabler/icons';
import { setCookie } from 'cookies-next';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../reducers/user';
import { RootState } from '../../store';

const UserAvatar = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  if (!user) return <></>;

  const handleLogout = () => {
    dispatch(logoutUser({}));
    setCookie('ACCESS_TOKEN', undefined);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Menu width={200} shadow="md" position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="light" sx={{ fontWeight: 600 }} size="lg">
            {user.username![0].toUpperCase()}
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{user.email}</Menu.Label>
          <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
          <Menu.Divider />
          <Menu.Item icon={<IconLogout size={14} />} color="red" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
};

export default UserAvatar;
