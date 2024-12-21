import React, { useState, useEffect } from 'react'
import { Button, Flex } from '@chakra-ui/react';

export default function TestCsrf() {
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
    console.log(token)
    const handleRequest = () => {

        fetch('https://api.igstore.io/tested/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
        })
    };
    return (
        <Flex width={'100%'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>
            <Button onClick={handleRequest}>Try</Button>
        </Flex>
    )
}
