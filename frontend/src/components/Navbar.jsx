import React, { useState } from 'react'
import { Button, Flex, Text, useDisclosure, Avatar, Image, Box, MenuItem, Menu, MenuButton, MenuList, useStatStyles } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import shopular from '../Images/IG STORE-2.png'
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
import { bk2, bk1, btnScheme, gr2 } from '../localVars';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
const MotionBox = motion(Box);
export default function Navbar() {
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

    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        setLng(lng);
        i18n.changeLanguage(lng);
    };
    const [lng, setLng] = useState('EN')
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
                        height={'52px'}
                        pb={4}
                        ml={1}
                        onClick={() => pathname === '/' ? window.location.href = '/' : ''}
                    />
                </Flex>
            </ChakraLink>

            <Flex>
                {/* <Menu>
                    {({ isOpen }) => (
                        <>
                            <MenuButton
                                as={Button}
                                rightIcon={<Icon icon={'mingcute:arrow-down-fill'} height={20} width={20} />}
                                colorScheme={btnScheme}
                                borderRadius={40}
                                ml={3}
                                flexShrink={0}
                                _active={{ transform: 'scale(0.95)', }}
                            >
                                {lng}
                            </MenuButton>
                            <AnimatePresence>
                                {isOpen && (
                                    <MenuList bgColor={bk2} borderColor={bk2}>
                                        <MenuItem
                                            bgColor={bk2}
                                            _hover={{ backgroundColor: '#DDE6ED', color: '#31363F' }}
                                            fontWeight={'bold'}
                                            onClick={() => changeLanguage('ar')}
                                        >
                                            <MotionBox
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: 0.1, duration: 0.3 }}
                                            >
                                                AR
                                            </MotionBox>
                                        </MenuItem>
                                        <MenuItem
                                            bgColor={bk2}
                                            _hover={{ backgroundColor: '#DDE6ED', color: '#31363F' }}
                                            fontWeight={'bold'}
                                            onClick={() => changeLanguage('en')}
                                        >
                                            <MotionBox
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: 0.1, duration: 0.3 }}
                                            >
                                                EN
                                            </MotionBox>
                                        </MenuItem>

                                    </MenuList>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </Menu> */}
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


                        <Button
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
                        </Button>

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