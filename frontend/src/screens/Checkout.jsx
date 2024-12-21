import React, { useState, useRef, useEffect } from 'react'
import { Box, Flex, Image, Text, Button, Input, useToast } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import instagram from '../Images/instagram.png'
import telegram from '../Images/telegram.png'
import discord from '../Images/discord.png'
import x from '../Images/xxx.png'
import snapchat from '../Images/snapchat.png'
import ltc from '../Images/ltc.png'
import usdt from '../Images/usdt.png'
import btc from '../Images/btc.png'
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { bk1, bk2, btnScheme } from '../localVars';
import { Button as MUIButton } from '@mui/material'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Btn1 from '../components/Btn1';
const theme = createTheme();
export default function Checkout() {
    const navigate = useNavigate()
    const location = useLocation();
    const { id_product, id_seller, name, price, discount } = location.state || {};
    const [social, setSocial] = useState('instagram')
    const [crypto, setCrypto] = useState('ltc');
    const toast = useToast()
    const socialUserRef = useRef('');
    const emailRef = useRef('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
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
    const handleButton = () => {
        if (socialUserRef.current.value === '' || emailRef.current.value === '') {
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
        const socialUser = socialUserRef.current.value;
        const email = emailRef.current.value;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //handler click
        const data = {
            username_buyer: socialUser,
            email_buyer: email,
            social_user: social,
            crypto,
            timezone,
            id: id_product,
            seller: id_seller


        }
        setLoading(true);
        fetch('https://api.igstore.io/create-payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((resp) => {
                const code = resp.url;
                if (code !== '' && code !== undefined) {
                    navigate(`/payment/${code}`);
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error While Creating Payment',
                        text: 'Please try again!',
                        confirmButtonColor: '#f27474'
                    })
                }
                setLoading(false);
            })
    }
    function discount_fun(originalPrice, discountPercentage) {
        const discountAmount = (originalPrice * discountPercentage) / 100;
        const discountedPrice = originalPrice - discountAmount;
        return discountedPrice;
    }
    return (
        <Flex
            bgColor={bk2}
            width={{ base: '94%', md: '56%' }}
            height={'500px'}
            borderRadius={8}
            flexDir={'column'}
            p={3}
            alignItems={'center'}
        >
            <Text
                fontSize={26}
                textAlign={'center'}
                fontWeight={'bold'}
            >Contact Info</Text>
            <Input
                placeholder='Enter Your Email'
                mt={4}
                width={{ base: '90%', md: '60%' }}
                bgColor={bk1}
                borderColor={bk1}
                ref={emailRef}
            />

            <Flex justifyContent={'space-between'} mt={4} width={{ base: '90%', md: '60%' }}>
                <Image opacity={social === 'instagram' ? 1 : 0.4} src={instagram} height={50} width={50} onClick={() => setSocial('instagram')} cursor={'pointer'} />
                <Image opacity={social === 'telegram' ? 1 : 0.4} src={telegram} height={50} width={50} onClick={() => setSocial('telegram')} cursor={'pointer'} />
                <Image opacity={social === 'discord' ? 1 : 0.4} src={discord} height={50} width={50} onClick={() => setSocial('discord')} cursor={'pointer'} />
                <Image opacity={social === 'x' ? 1 : 0.4} src={x} height={50} width={50} onClick={() => setSocial('x')} cursor={'pointer'} />
                <Image opacity={social === 'snapchat' ? 1 : 0.4} src={snapchat} height={50} width={50} onClick={() => setSocial('snapchat')} cursor={'pointer'} />

            </Flex>

            <Input
                placeholder='Enter Your Username'
                mt={4}
                width={{ base: '90%', md: '60%' }}
                bgColor={bk1}
                borderColor={bk1}
                ref={socialUserRef}
            />
            <Text
                fontSize={22}
                textAlign={'center'}
                fontWeight={'bold'}
                mt={6}
            >Choose Crypto</Text>

            <Flex justifyContent={'space-between'} mt={4} width={{ base: '90%', md: '40%' }} >
                <Image opacity={crypto === 'ltc' ? 1 : 0.4} src={ltc} height={50} width={50} onClick={() => setCrypto('ltc')} cursor={'pointer'} />
                <Image opacity={crypto === 'usdt' ? 1 : 0.4} src={usdt} height={50} width={50} onClick={() => setCrypto('usdt')} cursor={'pointer'} />
                <Image opacity={crypto === 'btc' ? 1 : 0.4} src={btc} height={50} width={50} onClick={() => setCrypto('btc')} cursor={'pointer'} />
            </Flex>
            <Text
                textAlign={'center'}
                fontSize={22}
                mt={2}
            >Amount {discount > 0 ? discount_fun(price, discount) : price}$</Text>
            <Button
                colorScheme={btnScheme}
                width={{ base: '90%', md: '60%' }}
                mt={4}
                _active={{ transform: 'scale(0.95)', }}
                onClick={handleButton}
            >{loading ? <Icon width={40} icon={'svg-spinners:pulse-3'} /> : 'Create Payment'}</Button>
            {/* <Btn1 txt={'Create Payment'} mt={10} onClick={handleButton} /> */}

        </Flex>
    )
}
