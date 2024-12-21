import React, { useRef, useState, useEffect } from 'react'
import { Flex, Box, Text, Input, Button, useToast, Checkbox } from '@chakra-ui/react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react';
import axios from 'axios';
import TextField from '../components/TextField';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { bk1, bk2, btnScheme } from '../localVars';
const categories = ['User', 'Account', 'Tool', 'Activation', 'Service', 'Key', 'Code']
export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const access_token = Cookies.get('access_token');

    const [valueHide, setValueHide] = useState(false);

    const [resp, setResp] = useState(null);
    const [description, setDescription] = useState("");
    const handleDescription = (content, delta, source, editor) => {
        setDescription(content);
    }
    const [deliveryMessage, setDeliveryMessage] = useState("");
    const handleDeliveryMessage = (content, delta, source, editor) => {
        setDeliveryMessage(content);
    }
    const [categoryText, setCategoryText] = useState('');
    useEffect(() => {
        if (resp === null) {
            fetch(`https://api.igstore.io/edit-product/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`

                },
            })
                .then((response) => response.json())
                .then(data => {
                    setResp(data);
                    setValueHide(data.hide)
                    setDescription(data.description)
                    setDeliveryMessage(data.delivery_message)
                    setImageUrl(data.image_url)
                    setCategoryText(data.category)

                    //setDescription(data.description)
                })
        }
    }, [resp])
    const toast = useToast();
    const nameRef = useRef('');
    const priceRef = useRef(0.0);
    const simpleDescriptionRef = useRef('');
    const platformRef = useRef('');
    const hideRef = useRef(false);


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
    const handleEdit = () => {
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
            showError('Category')
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

        fetch(`https://api.igstore.io/edit-product/${id}/`, {
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
                        description: 'Product edited successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    })
                    navigate('/manage-products')
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
        resp !== null && (
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
                                color={'silver'}
                            >Name Product</Text>
                            <Input
                                placeholder='Name'
                                bgColor={bk1}
                                borderColor={bk1}
                                width={'100%'}
                                ref={nameRef}
                                mt={1}
                                defaultValue={resp.name}
                            />
                        </Flex>
                        <Flex flexDir={'column'} width={'32%'}>
                            <Text
                                fontWeight={'bold'}
                                fontStyle={'italic'}
                                color={'silver'}
                            >Price</Text>
                            <Input
                                placeholder='Price'
                                bgColor={bk1}
                                borderColor={bk1}
                                width={'100%%'}
                                ref={priceRef}
                                mt={1}
                                defaultValue={resp.price}
                            />
                        </Flex>
                    </Flex>
                    <Text
                        fontWeight={'bold'}
                        fontStyle={'italic'}
                        alignSelf={'start'}
                        mt={3}
                        color={'silver'}

                    >Simple Description</Text>
                    <Input
                        placeholder='Simple Description'
                        bgColor={bk1}
                        borderColor={bk1}
                        mt={1}
                        ref={simpleDescriptionRef}
                        defaultValue={resp.simple_description}
                    />
                    <Flex width={'100%'} mt={3} pt={6} height={'30px'} pb={10} alignItems={'center'} mb={-3}>
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
                            _active={{ transform: 'scale(0.95)', }}
                            variant={'outline'}
                            onClick={handleImageClick}
                        >{imageUrl === '' ? 'Upload' : 'Update'} Image</Button>


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
                            color={'silver'}
                            pb={1}
                        >Description</Text>
                        <TextField description={description} handleProcedureContentChange={handleDescription} placeholder={'Product Description'} />
                    </Flex>

                    <Flex width={'100%'} justifyContent={'space-between'} mt={{ base: 20, md: 8 }}>
                        <Flex flexDir={'column'} width={'48%'}>
                            <Text
                                fontWeight={'bold'}
                                fontStyle={'italic'}
                                color={'silver'}
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
                                            key={category}
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
                                color={'silver'}
                                mt={3}
                            >Platform</Text>
                            <Input
                                placeholder='Platform'
                                bgColor={bk1}
                                borderColor={bk1}
                                mt={1}
                                ref={platformRef}
                                width={'100%'}
                                defaultValue={resp.platform}
                            />
                        </Flex>
                    </Flex>
                    <Text
                        fontWeight={'bold'}
                        fontStyle={'italic'}
                        color={'silver'}
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
                        <Checkbox
                            colorScheme={btnScheme}
                            ref={hideRef}
                            isChecked={valueHide}
                            onChange={(e) => setValueHide(e.target.checked)}
                        >Hide</Checkbox>
                        <Button
                            colorScheme={btnScheme}
                            width={'120px'}
                            onClick={handleEdit}
                            _active={{ transform: 'scale(0.95)', }}
                        >Edit Product</Button>
                    </Flex>

                </Flex>

            </Flex>
        )
    )
}
