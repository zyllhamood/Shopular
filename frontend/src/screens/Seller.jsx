import React, { useEffect, useState } from 'react';
import { Flex, Text, Input, Button, Grid, GridItem, Image, Box, IconButton, Tooltip, Fade, Skeleton } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useParams, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Tilt } from 'react-tilt';
import { bk1, bk2, btnScheme, borderPulse } from '../localVars';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Error from './Error'
const MotionBox = motion(Box);
export default function Seller() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [showSocials, setShowSocials] = useState(false);
    const toggleSocials = () => setShowSocials(!showSocials);
    const [resp, setResp] = useState(null);
    const [respProducts, setRespProducts] = useState(null);
    const [products, setProducts] = useState(null);
    const [response, setResponse] = useState(null);
    const [categories, setCategories] = useState(null);
    const [categoryText, setCategoryText] = useState('Categories');

    useEffect(() => {
        if (resp === null && username.includes('@')) {
            if (username === '@admin') {
                window.location.href = '/';
            }
            fetch(`https://api.igstore.io/${username}/`)
                .then((response) => {
                    if (response.ok) {
                        response.json().then((data) => setResp(data));
                    } else {
                        window.location.href = '/';
                    }
                });
        }
    }, [resp, username]);

    useEffect(() => {
        if (respProducts === null && username.includes('@')) {
            fetch(`https://api.igstore.io/products/${username.split('@')[1]}/`)
                .then((response) => response.json())
                .then((data) => {
                    setRespProducts(data.results);
                    setResponse(data);
                });
        }
    }, [respProducts, username]);

    useEffect(() => {
        if (respProducts !== null && products === null) {
            setProducts(respProducts);
        }
    }, [products, respProducts]);

    useEffect(() => {
        if (categories === null && products !== null) {
            const uniqueCategories = Array.from(new Set(products
                .map(product => product.category)
                .filter(category => category && category.trim() !== '')
            ));
            setCategories(uniqueCategories);
        }
    }, [products, categories]);

    const handleSearch = (word) => {
        if (word.length >= 1) {
            let filterProducts = respProducts.filter(prd => (
                prd.name.toLowerCase().includes(word.toLowerCase())
            ));
            setProducts(filterProducts);
        } else {
            setProducts(respProducts);
        }
    };

    const handleCategories = (category) => {
        setCategoryText(category);
        if (category === 'Categories') {
            setProducts(respProducts);
        } else {
            let filterProducts = respProducts.filter(prd => prd.category === category);
            setProducts(filterProducts);
        }
    };

    const handleNextPage = (link) => {
        fetch(link)
            .then((response) => response.json())
            .then((data) => {
                setProducts(null);
                setRespProducts(data.results);
                setResponse(data);
            });
    };
    function discount(originalPrice, discountPercentage) {
        const discountAmount = (originalPrice * discountPercentage) / 100;
        const discountedPrice = originalPrice - discountAmount;
        return discountedPrice;
    }

    if (username.includes('@')) {
        return (
            <>
                <Flex bgColor={bk2} height={'100%'} width={'100%'} justifyContent={'center'} alignItems={'center'} flexDir={'column'} p={2}>
                    <Flex width={'94%'} flexDir={{ base: 'column', md: 'row' }}>
                        <Flex width={{ base: '100%', md: '50%' }}>
                            {resp !== null ? (
                                <Image
                                    src={resp.avatar === '' ? `https://ui-avatars.com/api/?name=${username.split('@')[1]}` : resp.avatar}
                                    height={20}
                                    width={20}
                                    alignSelf={'start'}
                                    mt={{ base: 1, md: 0 }}
                                    borderRadius={8}
                                />
                            ) : <Skeleton width={20} height={20} />}
                            <Flex flexDir={'column'} height={'80px'} justifyContent={'space-between'}>
                                <Text fontSize={22} fontWeight={'bold'} ml={4} fontFamily={'K2D'}>
                                    {resp !== null ? resp.full_name : <Skeleton width={'200px'} height={'20px'} />}
                                </Text>
                                <Text fontSize={18} fontWeight={'bold'} ml={4} fontFamily={'K2D'}>
                                    {resp !== null ? resp.bio : <Skeleton width={'300px'} height={'16px'} />}
                                </Text>
                            </Flex>
                        </Flex>

                        <Flex flexDir={{ base: 'row', md: 'column' }} height={{ base: 'auto', md: '80px' }} justifyContent={{ base: 'start', md: 'space-between' }} width={{ base: '100%', md: '20%' }} mt={{ base: 4, md: 0 }} ml={{ base: 0, md: 10 }} alignItems={'center'}>
                            <Text fontSize={20} fontWeight={'bold'} fontFamily={'K2D'}>
                                Products Sold
                            </Text>
                            <Text fontSize={18} fontWeight={'bold'} ml={{ base: 4, md: 0 }} fontFamily={'K2D'}>
                                {resp !== null ? resp.sold : <Skeleton width={'20px'} height={'16px'} />}
                            </Text>
                        </Flex>

                        <Flex flexDir={{ base: 'row', md: 'column' }} height={{ base: 'auto', md: '80px' }} justifyContent={{ base: 'start', md: 'space-between' }} width={{ base: '100%', md: '20%' }} mt={{ base: 4, md: 0 }} ml={{ base: 0, md: 10 }} alignItems={{ base: 'center' }}>
                            <Flex mt={{ base: 0, md: 2 }}>
                                {resp !== null ? [1, 2, 3, 4, 5].map((star) => (
                                    <Box key={star} color={star <= resp.reviews ? 'yellow.400' : 'gray.300'}>
                                        <Icon width={20} height={20} icon={'mdi:star'} />
                                    </Box>
                                )) : <Skeleton width={'100px'} height={'20px'} />}
                            </Flex>
                            {resp !== null ? (
                                <Text fontSize={18} fontWeight={'bold'} ml={{ base: 4, md: 0 }} fontFamily={'K2D'}>
                                    {resp.all_reviews} Reviews
                                </Text>
                            ) : <Skeleton width={'100px'} height={'20px'} />}
                        </Flex>
                    </Flex>
                </Flex>
                <Flex width={'94%'} overflowX={'auto'} whiteSpace={'nowrap'} mt={6}>
                    <Input
                        placeholder='Search for products ...'
                        bgColor={bk2}
                        borderColor={bk2}
                        width={{ base: '60%', md: '30%' }}
                        flexShrink={0}
                        onChange={(e) => handleSearch(e.target.value)}
                        borderRadius={40}
                    />
                    <Menu>
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
                                    {categoryText}
                                </MenuButton>
                                <AnimatePresence>
                                    {isOpen && (
                                        <MenuList bgColor={bk2} borderColor={bk2}>
                                            {categories !== null &&
                                                categories.map((category, index) => (
                                                    <MenuItem
                                                        key={category}
                                                        bgColor={bk2}
                                                        _hover={{ backgroundColor: '#DDE6ED', color: '#31363F' }}
                                                        fontWeight={'bold'}
                                                        onClick={() => handleCategories(category)}
                                                    >
                                                        <MotionBox
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                                        >
                                                            {category}
                                                        </MotionBox>
                                                    </MenuItem>
                                                ))}
                                        </MenuList>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </Menu>
                </Flex>

                {products !== null ? (
                    <>
                        <Grid p={4} width={{ base: 'fit', md: '96%' }} templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }} columnGap={{ base: 1, md: 2, lg: 4, xl: 8 }} rowGap={{ base: 10, md: 8, lg: 8, xl: 8 }} mt={2}>
                            {products.map((item, index) => (
                                <AnimatePresence>
                                    <MotionBox
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                    >
                                        <Tilt className="Tilt" options={{ max: 25, scale: 1.05 }} key={item.id}>

                                            <GridItem
                                                width={{ base: 'fit', md: '230px' }}
                                                bgColor={bk2}
                                                borderRadius={8}
                                                borderTopRadius={2}
                                                className="Tilt-inner"
                                                m={{ base: 1, md: 0 }}
                                                animation={item.discount > 0 && `${borderPulse} 2s infinite`}
                                            >
                                                <Flex flexDir={'column'} borderRadius={8} onClick={() => navigate(`/product/${item.id}`)} cursor={'pointer'} pb={3}>
                                                    <Box width={'100%'} height={'170px'}>
                                                        <Image src={item.image_url === '' ? `https://ui-avatars.com/api/?name=${item.name}` : item.image_url} borderTopRadius={2} width={'100%'} height={'170px'} alignSelf={'center'} objectFit='fit' />
                                                    </Box>
                                                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                                                        <Flex flexDir={'column'} width={'100%'}>
                                                            <Flex>
                                                                <Text bgColor={'#00a3c4'} color={'#000'} borderRadius={4} p={0.5} pl={2} pr={2} fontSize={14} mt={2} ml={2}>
                                                                    {item.category}
                                                                </Text>
                                                            </Flex>
                                                            <Text
                                                                ml={3}
                                                                fontSize={20}
                                                                fontWeight={'bold'}
                                                                mt={1}
                                                                display={{ base: 'none', md: 'block' }}

                                                            >
                                                                {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
                                                            </Text>
                                                            <Text
                                                                ml={3}
                                                                fontSize={20}
                                                                fontWeight={'bold'}
                                                                mt={1}
                                                                display={{ base: 'block', md: 'none' }}

                                                            >
                                                                {item.name.length > 24 ? `${item.name.slice(0, 24)}...` : item.name}
                                                            </Text>
                                                            <Text
                                                                ml={3}
                                                                mr={3}
                                                                mt={2}
                                                                fontSize={14}
                                                                fontWeight={'bold'}
                                                                height={{ base: '60px', md: '40px' }}
                                                                display={{ base: 'none', md: 'block' }}
                                                            >
                                                                {item.simple_description.length > 50 ? `${item.simple_description.slice(0, 50)}...` : item.simple_description}
                                                            </Text>
                                                            <Text
                                                                ml={3}
                                                                mr={3}
                                                                mt={2}
                                                                fontSize={14}
                                                                fontWeight={'bold'}
                                                                height={{ base: '60px', md: '40px' }}
                                                                display={{ base: 'block', md: 'none' }}
                                                            >
                                                                {item.simple_description.length > 40 ? `${item.simple_description.slice(0, 40)}...` : item.simple_description}
                                                            </Text>
                                                            <Box height={'1px'} width={'100%'} bgColor={'#C0C0C0'} mt={2}></Box>
                                                            <Flex justifyContent={'space-between'} ml={3} mr={3} mt={2}>
                                                                {item.discount > 0 ? (
                                                                    <Flex alignItems={'center'}>
                                                                        <Text
                                                                            fontSize={16}
                                                                            fontWeight={'bold'}
                                                                        >{discount(item.price, item.discount)}$</Text>

                                                                        <Text
                                                                            fontSize={14}
                                                                            ml={2}
                                                                            color={'silver'}
                                                                            textDecoration={'line-through'}
                                                                        >{item.price}$</Text>
                                                                    </Flex>
                                                                ) : (
                                                                    <Text
                                                                        fontSize={16}
                                                                        fontWeight={'bold'}
                                                                    >{item.price}$</Text>
                                                                )}
                                                                <Flex alignItems={'center'}>
                                                                    <Text fontSize={14} fontWeight={'bold'}>Sold</Text>
                                                                    <Text ml={1}>{item.sales}</Text>
                                                                </Flex>
                                                            </Flex>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </GridItem>
                                        </Tilt>
                                    </MotionBox>
                                </AnimatePresence>

                            ))}
                        </Grid>
                        <Box position="fixed" bottom={4} right={4} zIndex={1000} mr={{ base: 4, md: 10 }}>
                            {showSocials && (
                                <Flex direction="column" alignItems="center" mt={2}>
                                    {resp.instagram !== '' && (
                                        <Tooltip label="Instagram" aria-label="Instagram">
                                            <IconButton icon={<Icon icon="mdi:instagram" width={30} height={30} />} colorScheme="cyan" variant="outline" aria-label="Instagram" mb={2} onClick={() => window.location.href = `https://instagram.com/${resp.instagram}`} />
                                        </Tooltip>
                                    )}
                                    {resp.telegram !== '' && (
                                        <Tooltip label="Telegram" aria-label="Telegram">
                                            <IconButton icon={<Icon icon="mdi:telegram" width={30} height={30} />} colorScheme="cyan" variant="outline" aria-label="Telegram" mb={2} onClick={() => window.location.href = `https://t.me/${resp.telegram}`} />
                                        </Tooltip>
                                    )}
                                    {resp.discord !== '' && (
                                        <Tooltip label="Discord" aria-label="Discord">
                                            <IconButton icon={<Icon icon="mdi:discord" width={30} height={30} />} colorScheme="cyan" variant="outline" aria-label="Discord" />
                                        </Tooltip>
                                    )}
                                </Flex>
                            )}
                            <Tooltip label="Scroll to top" aria-label="Scroll to top">
                                <IconButton icon={<Icon icon={'material-symbols:contact-support-outline'} width={30} height={30} />} colorScheme="cyan" onClick={toggleSocials} aria-label="Scroll to top" mt={2} borderRadius={40} />
                            </Tooltip>
                        </Box>
                    </>
                ) : <Icon color='#0dc5ea' icon={'svg-spinners:blocks-shuffle-3'} width={'200px'} style={{ marginTop: 60, marginBottom: 160 }} />}
                {response !== null && (
                    <Flex mt={2} mb={4}>
                        {response.links.previous !== null && response.current_page !== 1 && <Button onClick={() => handleNextPage(response.links.previous)}>{response.current_page - 1}</Button>}
                        <Button colorScheme='cyan' ml={1} mr={1}>{response.current_page}</Button>
                        {response.links.next !== null && <Button onClick={() => handleNextPage(response.links.next)}>{response.current_page + 1}</Button>}
                    </Flex>
                )}
            </>
        );
    }
    else {
        return (
            <Error />
        )
    }

    return null;
}
