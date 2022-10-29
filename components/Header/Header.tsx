import { Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getFormattedTime } from '../../hooks/useTime';
import useStyles from './Header.styles';

const Header = () => {
  const { classes } = useStyles();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(getFormattedTime(new Date()));
    setInterval(() => {
      setCurrentTime(getFormattedTime(new Date()));
    }, 1000);
  }, []);

  return (
    <>
      <Title className={classes.title} align="center" mt={100}>
        <Text inherit variant="gradient" component="span">
          {currentTime}
        </Text>
      </Title>
    </>
  );
};

export default Header;
