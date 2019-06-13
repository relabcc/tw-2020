import React from 'react'
import Box from '../components/Box';
import Flex from '../components/Flex';
import Text from '../components/Text';
import Link from '../components/Link';

const links = [
  { label: '首頁', link: '/' },
  { label: '主計處資料', link: '/bas' },
];

const Header = ({ siteTitle, ...props }) => (
  <Flex
    position="fixed"
    bg="primary"
    top={0}
    left={0}
    right={0}
    alignItems="center"
    zOrder={2}
    px="1em"
    is="header"
    {...props}
  >
    <Box flex={1}>
      <Text.h1>
        <Link to="/" color="white">
          {siteTitle}
        </Link>
      </Text.h1>
    </Box>
    <Flex>
      {links.map(({ label, link }) => (
        <Box key={link} mx="1em">
          <Link color="white" to={link}>{label}</Link>
        </Box>
      ))}
    </Flex>
  </Flex>
)

export default Header
