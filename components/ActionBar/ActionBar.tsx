import { Box, Group } from '@mantine/core';
import { getCookie } from 'cookies-next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../hooks/useApi';
import { GetCurrentUserResponse } from '../../pages/api/auth/current';
import { updateUser } from '../../reducers/user';
import { RootState } from '../../store';
import AppsPopover from './AppsPopover';
import LoginButton from './LoginButton';
import UserAvatar from './UserAvatar';

const ActionBar = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    const token = getCookie('ACCESS_TOKEN') as string;
    if (!token) return;
    const api = await useApi('/api/auth/current', { method: 'GET', token });
    const res: GetCurrentUserResponse = await api.json();
    if (res.status !== 'success') return;
    dispatch(updateUser({ ...res.user, token }));
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={(theme) => ({
          top: -(100 - theme.spacing.lg),
          right: theme.spacing.lg,
          position: 'absolute',
        })}
      >
        <Group>
          <AppsPopover />
          {!user ? <LoginButton /> : <UserAvatar />}
        </Group>
      </Box>
    </Box>
  );
};

export default ActionBar;
