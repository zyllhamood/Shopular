import React, { useRef, useState } from 'react'
import { Flex, Text, Input, Button, useToast, Checkbox } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import TextField from '../components/TextField';
import axios from 'axios';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react';
import { bk1, bk2, btnScheme, categories } from '../localVars';
export default function AddProduct() {
    const access_token = Cookies.get('access_token');
    const [categoryText, setCategoryText] = useState('');
    const toast = useToast();
    const nameRef = useRef('');
    const priceRef = useRef(0.0);
    const simpleDescriptionRef = useRef('');
    const platformRef = useRef('');
    const hideRef = useRef(false);
    const [description, setDescription] = useState("");
    const handleDescription = (content, delta, source, editor) => {
        setDescription(content);
    }
    const [deliveryMessage, setDeliveryMessage] = useState("");
    const handleDeliveryMessage = (content, delta, source, editor) => {
        setDeliveryMessage(content);
    }
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
    const handleAdd = () => {
        const name = nameRef.current.value;
        const price = priceRef.current.value;
        const simpleDescription = simpleDescriptionRef.current.value;
        const category = categoryText;
        const platform = platformRef.current.value;
        const hide = hideRef.current.checked;
        if (name === '') {
            showError('Name');
            return;
        }
        if (price === '') {
            showError('Price');
            return;
        }
        if (deliveryMessage === '') {
            showError('Delivery Details');
            return;
        }
        if (category === '') {
            showError('Category');
            return;
        }
        const data = {
            name,
            price,
            simple_description: simpleDescription,
            image_url: imageUrl,
            description,
            delivery_message: deliveryMessage,
            category,
            platform,
            hide,
        }

        fetch('https://api.igstore.io/add-product/', {
            method: 'POST',
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
                        description: 'Product added successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    })
                    window.location.href = '/manage-products'
                } else {
                    toast({
                        title: 'Error',
                        description: response.text(),
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    })
                }
            })


    }
    const [imageUrl, setImageUrl] = useState('');
    const [loadingImage, setLoadingImage] = useState('false');
    const handleFileChange = async (event) => {
        setLoadingImage('true');
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
                setLoadingImage('done');
                setImageUrl(response.data.url);

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
    const handleCategories = (category) => {
        setCategoryText(category)

    }
    const handleImageClick = () => {
        document.getElementById('image-upload-input').click();
    };
    return (
        <Flex
            width={{ base: '94%', md: '70%' }}
            bgColor={bk2}
            borderRadius={8}
            p={6}
            overflowY={'scroll'}
        >
            <Flex
                flexDir={'column'}
                alignItems={'center'}
                width={'100%'}
            >
                <Flex
                    justifyContent={'space-between'}
                    width={'100%'}
                >
                    <Flex flexDir={'column'} width={'65%'}>
                        <Text
                            fontWeight={'bold'}
                            fontStyle={'italic'}
                        >Name Product</Text>
                        <Input
                            placeholder='Name'
                            bgColor={bk1}
                            borderColor={bk1}
                            width={'100%'}
                            ref={nameRef}
                            mt={1}
                        />
                    </Flex>
                    <Flex flexDir={'column'} width={'32%'}>
                        <Text
                            fontWeight={'bold'}
                            fontStyle={'italic'}
                        >Price</Text>
                        <Input
                            placeholder='Price'
                            bgColor={bk1}
                            borderColor={bk1}
                            width={'100%%'}
                            ref={priceRef}
                            mt={1}
                        />
                    </Flex>
                </Flex>
                <Text
                    fontWeight={'bold'}
                    fontStyle={'italic'}
                    alignSelf={'start'}
                    mt={3}
                >Simple Description</Text>
                <Input
                    placeholder='Simple Description'
                    bgColor={bk1}
                    borderColor={bk1}
                    mt={1}
                    ref={simpleDescriptionRef}
                />
                <Flex width={'100%'} mt={{ base: 6, md: 3 }} pt={6} height={'30px'} pb={10} alignItems={'center'} mb={-3}>
                    <Text mr={6} fontWeight={'bold'}>Product Image : </Text>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        pt={1}
                        placeholder='Image'
                        width={'fit'}
                        id="image-upload-input"
                        display={'none'}
                    />
                    <Button
                        rightIcon={loadingImage === 'false' ? <Icon icon={'ci:cloud-upload'} width={20} /> : loadingImage === 'true' ? <Icon icon={'svg-spinners:bars-rotate-fade'} width={20} /> : <Icon icon={'mdi:success'} width={20} />}
                        colorScheme='cyan'
                        variant={'outline'}
                        onClick={handleImageClick}
                        _active={{ transform: 'scale(0.95)', }}
                    >Upload Image</Button>
                </Flex>
                <Flex
                    height={'200px'}
                    width={'100%'}
                    mt={3}
                    mb={-4}
                    flexDir={'column'}
                >
                    <Text
                        fontWeight={'bold'}
                        fontStyle={'italic'}
                        pb={1}
                    >Description</Text>
                    <TextField description={description} handleProcedureContentChange={handleDescription} placeholder={'Product Description'} />
                </Flex>
                <Flex width={'100%'} justifyContent={'space-between'} mt={{ base: 20, md: 8 }}>
                    <Flex flexDir={'column'} width={'48%'}>
                        <Text
                            fontWeight={'bold'}
                            fontStyle={'italic'}
                            mt={3}
                        >Select Category</Text>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<Icon icon={'mingcute:arrow-down-fill'} height={20} width={20} />}
                                mt={1}
                                bgColor={bk1}
                                color={'#fff'}
                                width={'100%%'}

                                flexShrink={0}>
                                {categoryText}
                            </MenuButton>
                            <MenuList bgColor={bk1} borderColor={bk1}>
                                {categories !== null && categories.map((category) => (
                                    <MenuItem
                                        bgColor={bk1}
                                        _hover={{ backgroundColor: '#DDE6ED', color: '#31363F' }}
                                        fontWeight={'bold'}
                                        onClick={() => handleCategories(category)}
                                    >{category}</MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Flex>
                    <Flex flexDir={'column'} width={'48%'}>
                        <Text
                            fontWeight={'bold'}
                            fontStyle={'italic'}
                            mt={3}
                        >Platform</Text>
                        <Input
                            placeholder='Platform'
                            bgColor={bk1}
                            borderColor={bk1}
                            mt={1}
                            ref={platformRef}
                            width={'100%'}
                        />
                    </Flex>
                </Flex>
                <Text
                    fontWeight={'bold'}
                    fontStyle={'italic'}
                    alignSelf={'start'}
                    mt={3}
                >Delivery Message</Text>
                <Flex
                    height={'200px'}
                    width={'100%'}
                    mt={1}
                    mb={-4}

                >
                    <TextField description={deliveryMessage} handleProcedureContentChange={handleDeliveryMessage} placeholder={'Delivery Message'} />
                </Flex>
                <Flex width={'100%'} justifyContent={'space-between'} alignItems={'center'} mt={{ base: 16, md: 6 }}>
                    <Checkbox colorScheme={btnScheme} ref={hideRef}>Hide</Checkbox>
                    <Button
                        colorScheme={btnScheme}
                        _active={{ transform: 'scale(0.95)', }}
                        width={'120px'}
                        onClick={handleAdd}
                    >Create</Button>
                </Flex>
            </Flex>
        </Flex >
    )
}
