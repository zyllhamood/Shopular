import React from 'react';
import { Box, Text, Link, Flex } from '@chakra-ui/react';
import { Icon } from '@iconify/react';


const Footer = () => {
    return (
        <Box
            as="footer"

            color="white"
            py={4}
            px={8}
            width="100%"
            mt={8}
            textAlign="center"
        >
            <Flex
                justifyContent="space-between"
                alignItems="center"

                width="97%"

                mx={{ base: '0px', md: '18px' }}
            >

                <Text fontSize="sm" mb={{ base: 2, md: 0 }}>
                    © 2024 IGStore.io by Zyll
                </Text>

                {/* Social Media Icons */}
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    mb={{ base: 2, md: 0 }}
                    cursor={'pointer'}
                    onClick={() => window.open('https://instagram.com/zyll', '_blank')}

                >
                    <Icon icon={'mdi:instagram'} width={26} />
                </Flex>


            </Flex>
        </Box>
    );
};

export default Footer;
