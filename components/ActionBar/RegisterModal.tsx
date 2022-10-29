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
import { showNotification } from '@mantine/notifications';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import useApi from '../../hooks/useApi';
import { RegisterUserResponse } from '../../pages/api/auth/register';
import { updateUser } from '../../reducers/user';

export type RegisterModalProps = {
  isOpened: boolean;
  onClose: () => void;
};

type RegisterForm = {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
};

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: 'Please enter your username' })
      .max(20, { message: 'Username cannot be longer than 20 characters' }),
    email: z
      .string()
      .email({ message: 'Invalid email' })
      .min(1, { message: 'Please enter your email' }),
    password: z
      .string()
      .min(8, { message: 'Password must be longer than 8 characters' })
      .max(50, { message: 'Password cannot be longer than 50 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please retype your password to confirm' }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: "Passwords didn't match",
        path: ['confirmPassword'],
      });
    }
  });

const RegisterModal = ({ isOpened, onClose }: RegisterModalProps) => {
  const dispatch = useDispatch();
  const theme = useMantineTheme();
  const form = useForm<RegisterForm>({
    initialValues: {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
    },
    validate: zodResolver(registerSchema),
    validateInputOnBlur: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async ({ email, password, username }: RegisterForm) => {
    setIsSubmitting(true);
    const api = await useApi('/api/auth/register', {
      method: 'POST',
      body: { email, password, username },
    });
    const res: RegisterUserResponse = await api.json();
    setIsSubmitting(false);
    if (res.status === 'error') {
      showNotification({
        message: res.msg,
        title: 'Failed to register',
        color: 'red',
      });
      return;
    }
    dispatch(updateUser({ ...res.user, token: res.token }));
    showNotification({
      message: 'Account registered successfully',
    });
    setCookie('ACCESS_TOKEN', res.token);
  };

  return (
    <Modal opened={isOpened} onClose={onClose} title="Register">
      <Text color="dimmed" size="sm">
        Register a New Page account.
      </Text>
      <Space mt={theme.spacing.md} />
      <form onSubmit={form.onSubmit(handleRegister)}>
        <TextInput placeholder="johndoe" {...form.getInputProps('username')} label="Username" />
        <Space mt={theme.spacing.md} />
        <TextInput placeholder="johndoe@foo.com" {...form.getInputProps('email')} label="Email" />
        <Space mt={theme.spacing.md} />
        <PasswordInput
          placeholder="Your password"
          {...form.getInputProps('password')}
          label="Password"
        />
        <Space mt={theme.spacing.md} />
        <PasswordInput
          placeholder="Confirm password"
          {...form.getInputProps('confirmPassword')}
          label="Confirm password"
        />
        <Space mt={theme.spacing.xl} />
        <Button fullWidth type="submit" loading={isSubmitting} loaderProps={{ variant: 'dots' }}>
          Register
        </Button>
      </form>
    </Modal>
  );
};

export default RegisterModal;
