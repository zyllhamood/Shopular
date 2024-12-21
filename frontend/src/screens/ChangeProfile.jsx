import React, { useRef, useState, useEffect } from 'react'
import { Flex, Box, Text, Input, Button, useToast, Avatar } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { bk1, bk2, btnScheme } from '../localVars';
export default function ChangeProfile() {
    const navigate = useNavigate();
    const { userAuth, avatar } = useSelector((state) => state.auth)
    const access_token = Cookies.get('access_token')

    const toast = useToast();
    const nameRef = useRef('');
    const emailRef = useRef('');
    const bioRef = useRef('');
    const instagramRef = useRef('');
    const emailContactRef = useRef('');
    const telegramRef = useRef('');
    const discordRef = useRef('');
    const apiKeyRef = useRef('');
    const idTeleRef = useRef('');
    const tokenTeleRef = useRef('');
    const discordWebhookRef = useRef('');

    const [otherPayment, setOtherPayment] = useState('');
    const handleOtherPayment = (content, delta, source, editor) => {
        setOtherPayment(content);
    }
    const [resp, setResp] = useState(null)
    const [imageUrl, setImageUrl] = useState('');
    const [loadingImage, setLoadingImage] = useState(false);
    const showError = (field) => {
        toast({
            title: 'Error',
            description: `Please fill out ${field}`,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top'
        })
    }
    useEffect(() => {
        if (resp === null && userAuth !== null) {
            fetch(`https://api.igstore.io/profile/${userAuth}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }).then((response) => response.json())
                .then((data) => {
                    setResp(data)
                    setOtherPayment(data.other_payment)
                    if (data.avatar !== '') {
                        setImageUrl(data.avatar)
                    }
                    else {
                        setImageUrl(avatar)
                    }
                })
        }
    }, [resp, userAuth])
    const handleChange = () => {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const bio = bioRef.current.value;
        const instagram = instagramRef.current.value;
        const emailContact = emailContactRef.current.value;
        const telegram = telegramRef.current.value;
        const discord = discordRef.current.value;
        const apiKey = apiKeyRef.current.value;
        const idTele = idTeleRef.current.value;
        const tokenTele = tokenTeleRef.current.value;
        const discordWebhook = discordWebhookRef.current.value;
        if (name === '') {
            showError('Name')
            return;
        }
        if (email === '') {
            showError('Email')
            return;
        }
        if (bio === '') {
            showError('Bio')
            return;
        }
        if (emailContact === '') {
            showError('Email Contact')
            return;
        }
        const data = {
            email, bio, instagram, telegram, discord,
            username: userAuth,
            full_name: name,
            email_contact: emailContact,
            api_key: apiKey,
            other_payment: otherPayment,
            tele_id: idTele,
            tele_token: tokenTele,
            discord_webhook: discordWebhook,
            avatar: imageUrl,
            message: ""
        }
        fetch(`https://api.igstore.io/profile/${userAuth}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (response.ok) {
                    toast({
                        title: 'Success',
                        description: 'Profile Updated',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    })
                    window.location.href = '/'
                }
                else {
                    return response.text().then(errorText => {
                        toast({
                            title: 'Error',
                            description: errorText,
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                            position: 'top'
                        });
                    });
                }
            })

    }

    const handleAvatarClick = () => {
        document.getElementById('image-upload-input').click();
    };
    const handleFileChange = async (event) => {
        setLoadingImage(true);
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);


            try {
                const response = await axios.post('https://api.igstore.io/upload-image/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setImageUrl(response.data.url);
                setLoadingImage(false)

            } catch (error) {
                toast({
                    title: 'Error uploading the image.',
                    description: 'There was an error uploading your image.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };
    return (
        resp !== null ? (
            <Flex
                flexDir={'column'}
                width={'100%'}
                alignItems={'center'}

            >
                <Flex
                    flexDir={{ base: 'column', md: 'row' }}
                    width={'94%'}
                    alignItems={{ base: 'center', md: 'start' }}
                    pb={5}
                    justifyContent={{ base: 'center', md: 'space-between' }}

                >
                    <Flex
                        flexDir={'column'}
                        bgColor={bk2}
                        width={{ base: '90%', md: '65%' }}
                        borderRadius={8}
                        p={4}

                    >
                        <Flex width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                            <Text
                                fontSize={26}
                                fontWeight={'bold'}
                                textAlign={'center'}
                                fontFamily={'K2D'}
                            >Profile</Text>

                            <Flex height={'30px'} alignItems={'center'} mb={-3}>

                                <Input
                                    type="file"
                                    id="image-upload-input"
                                    onChange={handleFileChange}
                                    display="none"
                                />
                                {loadingImage ? (
                                    <Flex justifyContent={'center'} alignItems={'center'} bgColor={bk1} p={3} borderRadius={40}>
                                        <Icon icon={'svg-spinners:bars-rotate-fade'} width={20} />
                                    </Flex>
                                ) : (
                                    <Avatar
                                        size="md"
                                        name="Avatar"
                                        src={imageUrl}
                                        cursor="pointer"
                                        onClick={handleAvatarClick}
                                        _hover={{ opacity: 0.7 }}
                                    />
                                )}



                            </Flex>
                        </Flex>


                        <Text fontSize={18} fontWeight={'bold'} m={2}>Name</Text>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            ref={nameRef}
                            defaultValue={resp.full_name}
                        />

                        <Text fontSize={18} fontWeight={'bold'} m={2}>Email</Text>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            ref={emailRef}
                            defaultValue={resp.email}
                        />

                        <Text fontSize={18} fontWeight={'bold'} m={2}>What You Provide (bio)</Text>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            ref={bioRef}
                            defaultValue={resp.bio}
                        />

                        <Text
                            fontSize={16}
                            fontWeight={'bold'}
                            m={2}
                            textDecoration={'underline'}
                            cursor={'pointer'}
                            onClick={() => navigate('/change-password')}

                        >Change Password</Text>
                        <Button
                            m={1}
                            fontWeight={'bold'}
                            colorScheme={btnScheme}
                            onClick={handleChange}
                            _active={{ transform: 'scale(0.95)', }}
                        >
                            Save All Changes
                        </Button>
                    </Flex>
                    <Flex
                        flexDir={'column'}
                        bgColor={bk2}
                        width={{ base: '90%', md: '30%' }}
                        borderRadius={8}
                        p={4}
                        mt={{ base: 4, md: 0 }}
                    >
                        <Text
                            fontSize={26}
                            fontWeight={'bold'}
                            textAlign={'center'}
                            fontFamily={'K2D'}
                        >Contact Info</Text>

                        <Text fontSize={18} fontWeight={'bold'} m={2}>Instagram</Text>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            ref={instagramRef}
                            defaultValue={resp.instagram}
                        />

                        <Text fontSize={18} fontWeight={'bold'} m={2}>Email Contact</Text>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            ref={emailContactRef}
                            defaultValue={resp.email_contact}
                        />

                        <Text fontSize={18} fontWeight={'bold'} m={2}>Telegram</Text>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            ref={telegramRef}
                            defaultValue={resp.telegram}
                        />
                        <Text fontSize={18} fontWeight={'bold'} m={2}>Discord</Text>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            ref={discordRef}
                            defaultValue={resp.discord}
                        />
                    </Flex>
                </Flex>
                <Flex
                    flexDir={{ base: 'column', md: 'row' }}
                    width={'94%'}
                    alignItems={{ base: 'center', md: 'start' }}
                    pb={5}
                    justifyContent={{ base: 'center', md: 'space-between' }}
                >
                    <Flex
                        flexDir={'column'}
                        bgColor={bk2}
                        width={{ base: '90%', md: '65%' }}
                        borderRadius={8}
                        p={4}

                    >
                        <Text
                            fontSize={26}
                            fontWeight={'bold'}
                            textAlign={'center'}
                            fontFamily={'K2D'}
                        >Payment</Text>

                        <Flex flexDir={{ base: 'column', md: 'row' }}>
                            <Text fontSize={18} fontWeight={'bold'} m={2}>API Key NOWPayments</Text>
                            <Text fontSize={16} m={2} mt={{ base: -2, md: 2 }}
                                textDecoration={'underline'}
                                color={'lightblue'}
                                cursor={'pointer'}
                                onClick={() => window.open('https://youtu.be/nRD7ZzzSHlg', '_blank')}
                            >How to get it</Text>
                        </Flex>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            ref={apiKeyRef}
                            defaultValue={resp.api_key}
                        />

                        <Text fontSize={18} fontWeight={'bold'} m={2}>Message For Other Payment Method</Text>
                        <Flex
                            height={'200px'}
                            width={'100%'}
                            mt={3}
                            mb={{ base: 10, md: -4 }}

                        >
                            <TextField description={otherPayment} handleProcedureContentChange={handleOtherPayment} placeholder={'Message Other Payment'} />

                        </Flex>


                    </Flex>
                    <Flex
                        flexDir={'column'}
                        bgColor={bk2}
                        width={{ base: '90%', md: '30%' }}
                        borderRadius={8}
                        p={4}
                        mt={{ base: 4, md: 0 }}
                    >
                        <Text
                            fontSize={26}
                            fontWeight={'bold'}
                            textAlign={'center'}
                            fontFamily={'K2D'}
                        >Notifications</Text>

                        <Text fontSize={18} fontWeight={'bold'} m={2}>Telegram</Text>
                        <Flex justifyContent={'space-between'}>
                            <Input
                                bgColor={bk1}
                                borderColor={bk1}
                                mb={1}
                                placeholder='ID'
                                width={'40%'}
                                ref={idTeleRef}
                                defaultValue={resp.tele_id}
                            />
                            <Input
                                bgColor={bk1}
                                borderColor={bk1}
                                mb={1}
                                width={'56%'}
                                placeholder='Token'
                                ref={tokenTeleRef}
                                defaultValue={resp.tele_token}
                            />
                        </Flex>

                        <Text fontSize={18} fontWeight={'bold'} m={2}>Discord</Text>
                        <Input
                            bgColor={bk1}
                            borderColor={bk1}
                            mb={1}
                            placeholder='Webhook'
                            ref={discordWebhookRef}
                            defaultValue={resp.discord_webhook}
                        />


                    </Flex>
                </Flex>
            </Flex >
        ) : (
            <Flex width={'100%'} height={'400px'} justifyContent={'center'}>
                <Icon icon={'svg-spinners:bars-scale-middle'} width={'200px'} style={{ marginTop: 120 }} />
            </Flex>
        )
    )
}
