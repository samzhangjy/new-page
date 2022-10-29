import {
  Button,
  Modal,
  PasswordInput,
  Space,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { NextLink } from '@mantine/next';
import { showNotification } from '@mantine/notifications';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import useApi from '../../hooks/useApi';
import { LoginResponse } from '../../pages/api/auth/login';
import { updateUser } from '../../reducers/user';

export type LoginModalProps = {
  isOpened: boolean;
  onClose: () => void;
  onRegister: () => void;
};

type LoginForm = {
  email: string;
  password: string;
};

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .min(1, { message: 'Please enter your email' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

const LoginModal = ({ isOpened, onClose, onRegister }: LoginModalProps) => {
  const dispatch = useDispatch();
  const theme = useMantineTheme();
  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
    validateInputOnBlur: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async ({ email, password }: LoginForm) => {
    setIsSubmitting(true);
    const api = await useApi('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const res: LoginResponse = await api.json();
    setIsSubmitting(false);
    if (res.status === 'error') {
      showNotification({
        message: res.msg,
        title: 'Failed to login',
        color: 'red',
      });
      return;
    }
    dispatch(updateUser({ ...res.user, token: res.token }));
    showNotification({
      message: 'Logged in',
    });
    setCookie('ACCESS_TOKEN', res.token);
  };

  return (
    <Modal opened={isOpened} onClose={onClose} title="Login to New Page">
      <Text color="dimmed" size="sm">
        Don&apos;t have an account?{' '}
        <Text
          variant="link"
          inline
          component={NextLink}
          href=""
          onClick={() => {
            onRegister();
          }}
        >
          Register one
        </Text>
        .
      </Text>
      <Space mt={theme.spacing.md} />
      <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
        <TextInput placeholder="johndoe@foo.com" label="Email" {...form.getInputProps('email')} />
        <Space mt={theme.spacing.md} />
        <PasswordInput
          id="password"
          placeholder="Your password"
          label="Password"
          {...form.getInputProps('password')}
        />
        <Space mt={theme.spacing.xl} />
        <Button fullWidth type="submit" loading={isSubmitting} loaderProps={{ variant: 'dots' }}>
          Login
        </Button>
      </form>
    </Modal>
  );
};

export default LoginModal;
