import { Title, Text } from '@mantine/core';
import { useState } from 'react';
import useStyles from './Header.styles';

const generateFormattedTime = (showSeconds = false) => {
  const date = new Date();
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}${showSeconds ? `:${date.getSeconds().toString().padStart(2, '0')}` : ''}`;
};

const Header = () => {
  const { classes } = useStyles();
  const [currentTime, setCurrentTime] = useState(generateFormattedTime());
  setInterval(() => {
    setCurrentTime(generateFormattedTime());
  }, 1000);
  return (
    <Title className={classes.title} align="center" mt={100}>
      <Text inherit variant="gradient" component="span">
        {currentTime}
      </Text>
    </Title>
  );
};

export default Header;
