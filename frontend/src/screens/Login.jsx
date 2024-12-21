import React, { useRef, useEffect, useState } from 'react'
import { Flex, Input, Text, Button, useToast } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { bk1, bk2, btnScheme } from '../localVars';

export default function Login() {

    const [token, setToken] = useState(null)
    useEffect(() => {
        if (token === null) {
            fetch('https://api.igstore.io/get-token/')
                .then((response) => response.json())
                .then((data) => {
                    const CryptoJS = require('crypto-js');
                    const key = CryptoJS.enc.Utf8.parse('mytsurgikey12345');
                    const pad = (str) => str + ' '.repeat(16 - str.length % 16);
                    const paddedData = pad(data.token);
                    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(paddedData), key, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.NoPadding
                    });
                    setToken(encrypted.ciphertext.toString(CryptoJS.enc.Base64))
                })
        }
    }, [token])

    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const toast = useToast();
    const dispatch = useDispatch();
    const { isLogged, wrongLogin, isLoading, respLogin } = useSelector((state) => state.auth)

    const handleLogin = () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        if (username === '' || password === '') {
            toast({
                title: 'Error',
                description: 'Please fill out all fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        const data = { username, password, csrf: token }
        dispatch(login(data));
    }

    useEffect(() => {
        if (wrongLogin === true) {
            if (respLogin !== null) {
                toast({
                    title: respLogin,
                    status: 'error',
                    duration: 1500,
                    isClosable: true,
                    position: 'top',
                })
            }
            else {
                toast({
                    title: 'Wrong username or password',
                    status: 'error',
                    duration: 1500,
                    isClosable: true,
                    position: 'top',
                })
            }
        }
        else if (isLogged) {
            toast({
                title: 'Logged in successfully',
                status: 'success',
                duration: 1500,
                isClosable: true,
                position: 'top',
            })
            const timer = setTimeout(() => {
                window.location.href = '/';
            }, 2000);
            return () => clearTimeout(timer);
        }

    }, [isLogged, wrongLogin])

    // useEffect(() => {
    //     if (isLogged) {
    //         window.location.href = '/';
    //     }
    // }, [isLogged])
    const handleKeyDownPassword = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };
    const handleKeyDownUsername = (e) => {
        if (e.key === 'Enter') {
            passwordRef.current.focus();
        }
    }

    return (
        <Flex
            width={{ base: '90%', md: '30%' }}
            height={'fit'}
            flexDir={'column'}
            bgColor={bk2}
            borderRadius={8}
            alignItems={'center'}
            pb={10}

        >
            <Text
                fontFamily={'JetBrainsMono'}
                fontSize={32}
                width={'80%'}

                mt={8}
                fontWeight={'Bold'}
            >
                Login
            </Text>
            <Input
                placeholder='Username'
                bgColor={bk1}
                borderColor={bk1}
                width={'80%'}
                mt={6}
                ref={usernameRef}
                onKeyDown={handleKeyDownUsername}
            />
            <Input
                placeholder='Password'
                bgColor={bk1}
                borderColor={bk1}
                width={'80%'}
                mt={4}
                ref={passwordRef}
                type={'password'}
                onKeyDown={handleKeyDownPassword}
            />
            <Button
                colorScheme={btnScheme}
                _active={{ transform: 'scale(0.95)', }}
                width={'80%'}
                mt={6}
                onClick={handleLogin}
            >
                {isLoading ? <Icon icon={'svg-spinners:pulse-3'} width={40} /> : isLogged ? <Icon icon={'line-md:confirm'} width={40} /> : 'Sign In'}
            </Button>
            <ChakraLink
                as={ReactRouterLink}
                to={'/register'}
                fontSize={14}
                width={'80%'}
            >
                <Text
                    mt={3}
                    fontSize={14}
                    textDecoration={'underline'}
                    fontWeight={'bold'}
                >
                    You don't have an account ? Create One
                </Text>
            </ChakraLink>


        </Flex>
    )
}
