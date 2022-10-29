import { ActionIcon, Group } from '@mantine/core';
import { IconUser } from '@tabler/icons';
import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const LoginButton = () => {
  const [isLoginOpened, setIsLoginOpened] = useState(false);
  const [isRegisterOpened, setIsRegisterOpened] = useState(false);

  return (
    <>
      <RegisterModal isOpened={isRegisterOpened} onClose={() => setIsRegisterOpened(false)} />
      <LoginModal
        isOpened={isLoginOpened}
        onClose={() => {
          setIsLoginOpened(false);
        }}
        onRegister={() => {
          setIsLoginOpened(false);
          setIsRegisterOpened(true);
        }}
      />
      <Group>
        <ActionIcon onClick={() => setIsLoginOpened(true)} variant="light" size="lg">
          <IconUser />
        </ActionIcon>
      </Group>
    </>
  );
};

export default LoginButton;
