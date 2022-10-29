import { ActionIcon, Avatar } from '@mantine/core';
import { forwardRef, MouseEventHandler, ReactNode } from 'react';

export type IconButtonProps = {
  children?: ReactNode | ReactNode[];
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, onClick }: IconButtonProps, ref) => (
    <Avatar
      component={(props: any) => (
        <ActionIcon onClick={onClick} sx={{ padding: 'none' }} size="lg"
      ref={ref}>
          {props.children}
        </ActionIcon>
      )}
    >
      {children}
    </Avatar>
  )
);

export default IconButton;
