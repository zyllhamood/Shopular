import React, { useState, useEffect, useRef } from 'react'
import { Box, Flex, Text, Input, Button, useToast } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';

import { Icon } from '@iconify/react';
import { changePassword } from '../store/authSlice';
import { bk1, bk2, btnScheme } from '../localVars';


export default function ChangePassword() {
    const dispatch = useDispatch();

    const toast = useToast();
    const { isLoading, isPasswordChanged, respChangePassword } = useSelector((state) => state.auth)
    const oldPasswordRef = useRef('');
    const newPasswordRef = useRef('');
    const reNewPasswordRef = useRef('');
    const handleLogout = () => {
        Cookies.remove('access_token');
        const timer = setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return () => clearTimeout(timer);
    }
    useEffect(() => {

        if (isPasswordChanged === false) {
            if (respChangePassword !== null) {
                toast({
                    title: respChangePassword !== null ? respChangePassword : 'Something went wrong, Make sure of the old password',
                    status: 'error',
                    duration: 1500,
                    isClosable: true,
                    position: 'top',
                })
            }
        }
        else if (isPasswordChanged === true) {
            toast({
                title: 'Password changed successfully',
                status: 'success',
                duration: 1500,
                isClosable: true,
                position: 'top',
            })
            handleLogout();

        }


    }, [isPasswordChanged, respChangePassword])

    const handleChangePassword = () => {
        const oldPassword = oldPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;
        const reNewPassword = reNewPasswordRef.current.value;
        if (oldPassword === '' || newPassword === '' || reNewPassword === '') {
            toast({
                title: 'Please fill all fields',
                status: 'error',
                duration: 1500,
                isClosable: true,
                position: 'top',
            })
            return;
        }
        if (newPassword !== reNewPassword) {
            toast({
                title: 'Passwords do not match',
                status: 'error',
                duration: 1500,
                isClosable: true,
                position: 'top',
            })
            return;
        }
        const data = {
            oldPassword,
            newPassword
        }
        dispatch(changePassword(data))
    }

    return (
        <Flex
            bgColor={bk2}
            height={'300px'}
            width={{ base: '80%', md: '30%' }}
            alignItems={'center'}
            borderRadius={8}
            flexDir={'column'}
            mt={10}
            color={'#fff'}
        >
            <Text
                fontSize={22}
                fontWeight={'bold'}
                color={'#fff'}
                m={5}
            >Change Password</Text>
            <Input
                placeholder='Old Password'
                width={'80%'}
                ref={oldPasswordRef}
                m={1}
                type='password'
                bgColor={bk1}
                borderColor={bk1}
            />
            <Input
                placeholder='New Password'
                width={'80%'}
                ref={newPasswordRef}
                m={1}
                type='password'
                bgColor={bk1}
                borderColor={bk1}
            />
            <Input
                placeholder='Re-New Password'
                width={'80%'}
                ref={reNewPasswordRef}
                m={1}
                type='password'
                bgColor={bk1}
                borderColor={bk1}
            />
            <Button
                colorScheme={btnScheme}
                width={'80%'}
                mt={6}
                _active={{ transform: 'scale(0.95)', }}
                fontWeight={'bold'}
                onClick={handleChangePassword}
            >{isLoading ? <Icon icon={'eos-icons:bubble-loading'} width={30} height={30} /> : 'Submit'}</Button>
        </Flex>
    )
}
