import React, { useRef, useEffect, useState } from 'react'
import { Flex, Input, Text, Button, useToast } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { bk1, bk2, btnScheme } from '../localVars';
import { Icon } from '@iconify/react';
export default function Register() {
    const dispatch = useDispatch();
    const { respRegister, isLoading, isLogged } = useSelector((state) => state.auth)
    const usernameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const rePasswordRef = useRef('');
    const toast = useToast();

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

    const handleRegister = () => {
        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const rePassword = rePasswordRef.current.value;

        if (username === '' || email === '' || password === '' || rePassword === '') {
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
        if (password !== rePassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        if (password.length < 8) {
            toast({
                title: 'Error',
                description: 'Password must be at least 8 characters long',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
        }
        const data = { username, email, password, csrf: token }
        dispatch(register(data));
    }
    console.log(typeof respRegister)
    useEffect(() => {
        if (respRegister !== null) {
            try {
                if (respRegister.username === usernameRef.current.value.toLowerCase()) {
                    window.location.href = '/login';
                }
                else {
                    toast({
                        title: respRegister,
                        status: 'error',
                        duration: 1500,
                        isClosable: true,
                        position: 'top',
                    })
                }
            } catch (error) {
                toast({
                    title: respRegister,
                    status: 'error',
                    duration: 1500,
                    isClosable: true,
                    position: 'top',
                })
            }



        }

    }, [respRegister, dispatch])
    useEffect(() => {
        if (isLogged) {
            window.location.href = '/';
        }
    }, [isLogged])
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
                Register
            </Text>
            <Input
                placeholder='Email'
                bgColor={bk1}
                borderColor={bk1}
                width={'80%'}
                mt={6}
                ref={emailRef}
            />
            <Input
                placeholder='Username'
                bgColor={bk1}
                borderColor={bk1}
                width={'80%'}
                mt={4}
                ref={usernameRef}
            />
            <Input
                placeholder='Password'
                bgColor={bk1}
                borderColor={bk1}
                width={'80%'}
                mt={4}
                ref={passwordRef}
                type='password'
            />
            <Input
                placeholder='Re-Password'
                bgColor={bk1}
                borderColor={bk1}
                width={'80%'}
                mt={4}
                ref={rePasswordRef}
                type='password'
            />
            <Button
                colorScheme={btnScheme}

                width={'80%'}
                mt={6}
                onClick={handleRegister}
                _active={{ transform: 'scale(0.95)', }}
            >
                {isLoading ? <Icon icon={'svg-spinners:pulse-3'} width={40} /> : 'Create Account'}
            </Button>
            <ChakraLink
                as={ReactRouterLink}
                to={'/login'}
                fontSize={14}
                width={'80%'}
            >
                <Text
                    mt={3}
                    fontSize={14}
                    textDecoration={'underline'}
                    fontWeight={'bold'}
                >
                    You have an account ? Sign In
                </Text>
            </ChakraLink>


        </Flex>
    )
}
