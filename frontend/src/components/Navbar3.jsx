import React from 'react'
import { Button, Flex, Text, useDisclosure, Avatar, Image, Box } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import shopular from '../Images/Shopular-3.png'
import { css } from "@emotion/react";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion';
const MotionBox = motion(Box);
export default function Navbar3() {
    const navigate = useNavigate();
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
            width={'94%'}
            justifyContent={'space-between'}
            height={'100px'}
            pt={10}
            pb={10}
        >
            <ChakraLink as={ReactRouterLink} to='/' >
                <Flex>
                    <Image
                        src={shopular}
                        height={'50px'}
                        pb={4}
                        onClick={() => pathname === '/' ? window.location.href = '/' : ''}
                    />
                </Flex>
            </ChakraLink>

            <Flex>
                <ChakraLink as={ReactRouterLink} to='/register'>
                    {!isLogged && (
                        <Button

                            css={css`
                        background: linear-gradient(to right, #00a3c4, #4a79a7d3);
                        color: #fff;
                        border-radius: 9999px;
                        padding: 16px 32px;
                        font-weight: bold;
                        font-size: 16px;
                        border: none;
                        
                        
                      `}
                            _hover={{ opacity: 0.7 }}
                            _active={{ transform: 'scale(0.95)', }}
                        //rightIcon={<Icon icon={'tabler:login-2'} height={30} width={30} />}
                        >
                            GET STARTED
                        </Button>
                    )}


                </ChakraLink>
                {isLogged && (
                    <>


                        {/* <Button
                            fontFamily={'KumbhSans'}
                            //bgColor={'#C0C0C0'}
                            borderRadius={40}
                            paddingLeft={7}
                            paddingRight={7}
                            colorScheme='cyan'
                            _active={{ transform: 'scale(0.95)', }}
                            ref={btnRef} onClick={onOpen}
                            rightIcon={<Icon icon={'line-md:menu-fold-right'} width={20} />}

                        //rightIcon={<Icon icon={'tabler:login-2'} height={30} width={30} />}
                        >
                            MENU
                        </Button> */}
                        <Flex _hover={{ opacity: 0.7 }} cursor={'pointer'}
                            _active={{ transform: 'scale(0.95)', }} bgColor={'#00a3c4'} width={'fit'} pl={4} pr={4} pt={2} pb={2} height={'46px'} alignItems={'center'} borderRadius={8}>
                            <Text color={'black'} fontWeight={'bold'}>{userAuth}</Text>
                            <Avatar src={avatar} width={30} height={30} ml={3} />
                        </Flex>

                        <Drawer
                            isOpen={isOpen}
                            placement='right'
                            onClose={onClose}
                            finalFocusRef={btnRef}

                        >
                            <DrawerOverlay />
                            <DrawerContent bgColor={'#DDE6ED'} color={'black'} >


                                {/* <DrawerCloseButton  mt={{ base: 4, md: 0 }} /> */}
                                <DrawerCloseButton mt={{ base: 4, md: 0 }} />
                                <DrawerHeader>
                                    <Flex alignItems={'center'}>
                                        <Avatar name='Dan Abrahmov' src={avatar} />
                                        <Text ml={4}>{userAuth}</Text>
                                    </Flex>
                                    {/* <Flex onClick={onClose} color={'gray'} cursor={'pointer'} _hover={{ color: 'black' }}>
                                            <Icon icon={'line-md:close'} width={24} />
                                        </Flex> */}
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
                                            <BtnNav text={'Settings'} path={'/settings'} icon={'lucide:user-cog'} onClose={onClose} bg={pathname === '/settings' && true} />
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
            _active={{ transform: 'scale(0.95)', }}
        >
            <AnimatePresence>
                <MotionBox
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    {text}
                </MotionBox>

            </AnimatePresence>

        </Button>


    )
}