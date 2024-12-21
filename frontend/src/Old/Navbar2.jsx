import React from 'react'
import { Button, Flex, Text, useDisclosure, Avatar, Image, Box, useColorModeValue } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import shopular from '../Images/Shopular-3.png'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
export default function Navbar2() {
    const navigate = useNavigate();
    const customColor2 = "#27374D";
    const customColor = "#27374D";

    // Create a brighter version of your color

    // Optionally, you can lighten the color using a CSS function
    const lightenColor = (color, percent) => {
        const num = parseInt(color.slice(1), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = ((num >> 8) & 0x00ff) + amt,
            B = (num & 0x0000ff) + amt;
        return (
            "#" +
            (0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255))
                .toString(16)
                .slice(1)
        );
    };
    const brightenedColor = lightenColor(customColor, 2); // Increase the percentage to make it brighter
    const { isLogged, isAdmin, userAuth, avatar } = useSelector((state) => state.auth);
    const access_token = Cookies.get('access_token');
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const pathname = window.location.pathname;
    const handleClearTokens = () => {
        fetch('https://api.igstore.io/clear-tokens/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
    }

    return (
        <Flex
            width={{ base: '94%', md: '44%' }}
            justifyContent={'center'}
            height={'100px'}
            pt={4}
            pb={4}

        >
            <Flex
                height={'54px'}
                bgColor={brightenedColor}
                borderColor={brightenedColor}
                borderWidth={'1px'}
                borderRadius={36}
                width={'100%'}
                alignItems={'center'}
                justifyContent={'space-between'}
                pl={4}
                pr={4}
            >
                <ChakraLink as={ReactRouterLink} to='/'>
                    <Flex>
                        <Image
                            src={shopular}
                            height={'30px'}

                        />
                    </Flex>
                </ChakraLink>

                <Flex>
                    <ChakraLink as={ReactRouterLink} to='/register'>
                        {!isLogged && (
                            <Button
                                fontFamily={'KumbhSans'}
                                //bgColor={'#C0C0C0'}
                                borderRadius={40}
                                paddingLeft={7}
                                paddingRight={7}
                                colorScheme='cyan'

                            //rightIcon={<Icon icon={'tabler:login-2'} height={30} width={30} />}
                            >
                                GET STARTED
                            </Button>
                        )}


                    </ChakraLink>
                    {isLogged && (
                        <>

                            <Button
                                fontFamily={'KumbhSans'}
                                //bgColor={'#C0C0C0'}
                                borderRadius={40}
                                paddingLeft={7}
                                paddingRight={7}
                                colorScheme='cyan'
                                ref={btnRef} onClick={onOpen}

                            //rightIcon={<Icon icon={'tabler:login-2'} height={30} width={30} />}
                            >
                                MENU
                            </Button>

                            <Drawer
                                isOpen={isOpen}
                                placement='right'
                                onClose={onClose}
                                finalFocusRef={btnRef}

                            >
                                <DrawerOverlay />
                                <DrawerContent bgColor={'#DDE6ED'} color={'black'} >

                                    <DrawerCloseButton mt={{ base: 4, md: 0 }} />
                                    <DrawerHeader>
                                        <Flex alignItems={'center'}>
                                            <Avatar name='Dan Abrahmov' src={avatar} />
                                            <Text ml={4}>{userAuth}</Text>
                                        </Flex>
                                    </DrawerHeader>

                                    <DrawerBody>

                                        {isAdmin ? (
                                            <>
                                                <BtnNav text={'Users'} path={'/users'} icon={'mdi:users-group'} onClose={onClose} bg={pathname === '/users' && true} />
                                                <BtnNav text={'Top Products'} path={'/admin-products'} icon={'lucide:layout-panel-top'} onClose={onClose} bg={pathname === '/admin-products' && true} />
                                                <BtnNav text={'All Orders'} path={'/all-orders'} icon={'lets-icons:order'} onClose={onClose} bg={pathname === '/all-orders' && true} />
                                                <Box onClick={handleClearTokens}>
                                                    <BtnNav text={'Clear Tokens'} path={'/'} icon={'material-symbols:layers-clear-outline'} onClose={onClose} />
                                                </Box>

                                            </>
                                        ) : (
                                            <>
                                                <BtnNav text={'Profile'} path={`/@${userAuth}`} icon={'iconamoon:profile-fill'} onClose={onClose} bg={pathname === `/@${userAuth}` && true} />
                                                <BtnNav text={'Orders'} path={'/orders'} icon={'lets-icons:order'} onClose={onClose} bg={pathname === '/orders' && true} />
                                                <BtnNav text={'Manage Products'} path={'/manage-products'} icon={'ant-design:product-outlined'} onClose={onClose} bg={pathname === '/manage-products' && true} />
                                                <BtnNav text={'Change Profile'} path={'/change-profile'} icon={'lucide:user-cog'} onClose={onClose} bg={pathname === '/change-profile' && true} />
                                                <BtnNav text={'Change Password'} path={'/change-password'} icon={'carbon:password'} onClose={onClose} bg={pathname === '/change-password' && true} />
                                            </>
                                        )}

                                        <BtnNav text={'Logout'} path={'/logout'} icon={'material-symbols:logout'} onClose={onClose} />

                                    </DrawerBody>

                                    <DrawerFooter>

                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </>
                    )}



                </Flex>
            </Flex>

        </Flex>
    )
}

const BtnNav = ({ text, path, icon, onClose, bg = false }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        Cookies.remove('access_token');
        window.location.href = '/login'
    }
    const handleNavigate = () => {
        if (path === '/logout') {
            handleLogout();
            return;
        }
        navigate(path);
        onClose();
    }

    return (
        <Button
            bgColor={bg === true ? '#222831' : '#DDE6ED'}
            color={bg === true ? '#DDE6ED' : '#000'}
            width={'100%'}
            justifyContent={'flex-start'}
            leftIcon={<Icon icon={icon} width={20} height={20} />}
            _hover={{ bgColor: '#222831', color: '#DDE6ED' }}
            onClick={handleNavigate}
            mt={2}
            borderBottomColor={'black'}
            borderBottomWidth={'1px'}
        >
            {text}
        </Button>
    )
}