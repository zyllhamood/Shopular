import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Input, Button, Grid, GridItem, Image, Box, keyframes, Fade, Skeleton, useDisclosure, Avatar } from '@chakra-ui/react'
import { Icon } from '@iconify/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { bk1, bk2, btnScheme, gr2 } from '../localVars';
import { Tilt } from 'react-tilt';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import {
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
} from '@chakra-ui/react'
import { textShadowPulse, borderPulse } from '../localVars';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import snapchat from '../Images/3.png'
import instagram from '../Images/1.png'
import tiktok from '../Images/2.png'
import img from '../Images/12.png'
import loading from '../Images/loading.gif'
const MotionBox = motion(Box);
const sorting = ['New', 'Best Reviews', 'Price : Low to High', 'Price : High to Low']

const moveTopDown = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

export default function Home() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const wordRef = useRef('');
    const [resp, setResp] = useState(null);
    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [categoryText, setCategoryText] = useState('Categories');
    const [token, setToken] = useState(null)
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [response, setResponse] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [filterCategories, setFilterCategories] = useState([]);
    const [filterPlatforms, setFilterPlatforms] = useState([]);
    const [rangeValues, setRangeValues] = useState([10, 30]);
    const [sortText, setSortText] = useState('Sort');

    const handleRangeChange = (values) => {
        setRangeValues(values);
    };
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
    useEffect(() => {
        if (resp === null && token !== null) {
            fetch(`https://api.igstore.io/products/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': token,
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    try {
                        if (data.detail === 'Authentication credentials were not provided.') {
                            window.location.reload();
                        }
                    } catch (error) {

                    }
                    setResp(data.results);
                    setResponse(data);

                })
        }
    }, [products, resp, token])

    useEffect(() => {
        if (resp !== null && products === null) {
            const sortedProducts = [...resp].sort((a, b) => {
                if (a.place === 0) return 1;
                if (b.place === 0) return -1;
                return a.place - b.place;
            });
            setProducts(sortedProducts);
        }
    }, [products, resp])

    useEffect(() => {
        if (categories === null && products !== null) {
            const uniqueCategories = Array.from(new Set(products
                .map(product => product.category)
                .filter(category => category && category.trim() !== '')
            ));
            setCategories(uniqueCategories);
        }
        if (platforms === null && products !== null) {
            const uniquePlatforms = Array.from(new Set(products
                .map(product => product.platform)
                .filter(platform => platform && platform.trim() !== '')
            ));
            setPlatforms(uniquePlatforms);
        }
    }, [products, categories, platforms]);

    const handleSearch = (word) => {
        if (word.length >= 1) {
            let filterProducts = resp.filter(prd => (
                prd.name.toLowerCase().includes(word.toLowerCase())
            ));
            setProducts(filterProducts);
        } else {
            setProducts(resp);
        }


    }
    const handleCategories = (category) => {
        setCategoryText(category)
        if (category === 'Categories') {
            setProducts(resp);
        } else {
            let filterProducts = resp.filter(prd => prd.category === category);
            setProducts(filterProducts);
        }
    }
    const handleAdvanceSearch = () => {
        setLoadingSearch(true);
        const word = wordRef.current.value;
        if (word.length >= 1) {
            fetch(`https://api.igstore.io/search/${word}/`)
                .then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            setProducts(data)
                            setLoadingSearch(false);
                        })
                    }
                })


        } else {
            setProducts(resp);
            setLoadingSearch(false);
        }
    }
    const handleNextPage = (link) => {
        fetch(link, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            }
        })
            .then((response) => response.json())
            .then((data) => {

                setProducts(null);
                setResp(data.results)
                setResponse(data);

            })
    }
    const handleFilterCategory = (e) => {
        const bgColor = e.target.style.backgroundColor;
        const text = e.target.textContent;
        if (bgColor !== 'rgb(13, 197, 234)') {
            e.target.style.backgroundColor = '#0dc5ea';
            filterCategories.push(text);
        }
        else {
            e.target.style.backgroundColor = '#DDE6ED';
            filterCategories.pop(text)
        }
    }
    const handleFilterPlatform = (e) => {
        const bgColor = e.target.style.backgroundColor;
        const text = e.target.textContent;
        if (bgColor !== 'rgb(13, 197, 234)') {
            e.target.style.backgroundColor = '#0dc5ea';
            filterPlatforms.push(text);
        }
        else {
            e.target.style.backgroundColor = '#DDE6ED';
            filterPlatforms.pop(text)
        }
        console.log(filterPlatforms);
    }
    const handleFilter = () => {
        const data = {
            platforms: filterPlatforms,
            categories: filterCategories,
            min_price: rangeValues[0],
            max_price: rangeValues[1]
        }
        fetch('https://api.igstore.io/products/filter/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                setProducts(null);
                setResp(data.results);
                setResponse(data);
                onClose();
            })
    }
    const handleSorting = (text) => {
        setSortText(text);
        const sortedProducts = [...products].sort((a, b) => {
            if (text === 'New') {
                if (a.id === 0) return 1;
                if (b.id === 0) return -1;
                return b.id - a.id;
            }
            if (text === 'Best Reviews') {
                if (a.reviews === 0) return 1;
                if (b.reviews === 0) return -1;
                return b.reviews.length - a.reviews.length;
            }
            if (text === 'Price : Low to High') {
                if (a.price === b.price) return 0;
                return a.price - b.price;
            }
            if (text === 'Price : High to Low') {
                if (a.price === b.price) return 0;
                return b.price - a.price;
            }
        })
        setProducts(sortedProducts);
    };
    function discount(originalPrice, discountPercentage) {
        const discountAmount = (originalPrice * discountPercentage) / 100;
        const discountedPrice = originalPrice - discountAmount;
        return discountedPrice;
    }

    const [animate2Second, setAnimate2Second] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate2Second(true);
        }, 2000); // Delay for 2 seconds

        return () => clearTimeout(timer);
    }, []);
    return (
        products !== null ? (
            <>
                <Flex
                    bgColor={bk2}
                    //bgGradient={gr2}
                    height={{ base: '200px', md: '140px' }}
                    width={'100%'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    position="relative"
                    p={2}
                    overflow="hidden" // Ensure content outside the container is hidden
                // bgImage={img}
                >
                    {/* Left icon */}

                    {/* <LeftAnimit img={snapchat} />
                    <LeftAnimit img={instagram} prc='10%' top='6' /> */}

                    {/* Right icon */}
                    {/* <RightAnimit img={tiktok} top='20' /> */}

                    <Flex flexDir={'column'} alignItems={'center'}>
                        <AnimatePresence>
                            <MotionBox
                                initial={{ opacity: 0, scale: 1.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ delay: 0, duration: 0.3 }}
                            >
                                <Text
                                    fontFamily={'KumbhSans'}
                                    fontSize={{ base: 28, md: 32 }}
                                    textAlign={'center'}
                                    p={2}
                                    fontWeight={'900'}
                                >
                                    Start{' '}
                                    <Box as="span" color="#0dc5ea" animation={`${textShadowPulse} 2s infinite`}>
                                        Selling
                                    </Box>{' '}
                                    Digital Products Now
                                </Text>
                            </MotionBox>
                        </AnimatePresence>
                        <AnimatePresence>
                            <MotionBox
                                initial={{ opacity: 0, scale: 2.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ delay: 0, duration: 0.3 }}
                            >
                                <Text
                                    fontFamily={'KumbhSans'}
                                    fontSize={{ base: 28, md: 32 }}
                                    textAlign={'center'}
                                    p={2}
                                    fontWeight={'bold'}
                                >
                                    <Box as="span" color="#0dc5ea" animation={`${textShadowPulse} 2s infinite`}>
                                        Explore
                                    </Box>{' '}
                                    Prime Users, Accounts and Tools
                                </Text>
                            </MotionBox>
                        </AnimatePresence>

                    </Flex>
                </Flex>
                <Flex
                    width={'94%'}
                    flexWrap={'wrap'}
                    mt={6}
                >
                    <Input
                        placeholder='Search for products ...'

                        bgColor={bk2}
                        borderColor={bk2}
                        width={{ base: '100%', md: '30%' }}  // Adjust width for small screens
                        flexShrink={0}  // Prevent shrinking
                        onChange={(e) => handleSearch(e.target.value)}
                        ref={wordRef}
                        borderRadius={40}
                        mb={3}  // Add margin bottom to separate from buttons
                    />
                    <Button
                        rightIcon={<Icon icon={'hugeicons:ai-search'} height={20} width={20} />}
                        colorScheme={btnScheme}
                        ml={{ base: 0, md: 3 }}  // Remove margin-left on small screens
                        mb={3}  // Add margin bottom to separate from other buttons
                        flexShrink={0}  // Prevent shrinking
                        onClick={handleAdvanceSearch}
                        borderRadius={40}
                        _active={{ transform: 'scale(0.95)', }}
                    >
                        {loadingSearch ? <Icon icon={'svg-spinners:bars-scale-middle'} width={120} height={40} /> : 'Advance Search'}
                    </Button>
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


                    <Button
                        rightIcon={<Icon icon={'mage:filter'} height={20} width={20} />}
                        colorScheme={btnScheme}
                        onClick={onOpen}
                        ml={{ base: 0, sm: 3 }}  // Remove margin-left on small screens
                        mb={3}  // Add margin bottom to separate from other buttons
                        borderRadius={40}
                        flexShrink={0}  // Prevent shrinking
                        _active={{ transform: 'scale(0.95)', }}
                    >
                        Filter
                    </Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent bgColor={bk1}>
                            <ModalHeader>Filter</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text fontWeight={'bold'}>Categories</Text>
                                <Flex wrap={'wrap'} h={'100px'} overflowY={'scroll'}>
                                    {categories !== null && categories.map((item) => (
                                        <AnimatePresence>
                                            <MotionBox
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ delay: 0, duration: 0.3 }}
                                            >
                                                <Button
                                                    key={item}
                                                    maxW={'300px'}
                                                    bgColor={'#DDE6ED'}
                                                    borderRadius={2}
                                                    m={0.5}
                                                    onClick={handleFilterCategory}
                                                >{item}</Button>
                                            </MotionBox>
                                        </AnimatePresence>

                                    ))}
                                </Flex>
                                <Text fontWeight={'bold'} mt={4}>Platforms</Text>
                                <Flex wrap={'wrap'} h={'100px'} overflowY={'scroll'}>
                                    {platforms !== null && platforms.map((item) => (
                                        <AnimatePresence>
                                            <MotionBox
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ delay: 0, duration: 0.3 }}
                                            >
                                                <Button
                                                    key={item}
                                                    maxW={'300px'}
                                                    bgColor={'#DDE6ED'}
                                                    borderRadius={2}
                                                    m={0.5}
                                                    onClick={handleFilterPlatform}
                                                >{item}</Button>
                                            </MotionBox>
                                        </AnimatePresence>

                                    ))}
                                </Flex>
                                <Text fontWeight={'bold'} mt={4}>Price : {rangeValues[0]}$ - {rangeValues[1]}$ +</Text>
                                <RangeSlider
                                    aria-label={['min', 'max']}
                                    defaultValue={[10, 30]}
                                    onChange={handleRangeChange}
                                    min={0}
                                    max={100}
                                >
                                    <RangeSliderTrack>
                                        <RangeSliderFilledTrack />
                                    </RangeSliderTrack>
                                    <RangeSliderThumb index={0} />
                                    <RangeSliderThumb index={1} />
                                </RangeSlider>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='cyan' variant={'outline'} mr={3} onClick={onClose}>
                                    Close
                                </Button>
                                <Button colorScheme='cyan' onClick={handleFilter}>Submit Filter</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>


                    <Menu>
                        {({ isOpen }) => (
                            <>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<Icon icon={'bx:sort'} height={20} width={20} />}
                                    colorScheme={btnScheme}
                                    borderRadius={40}
                                    ml={{ base: 3, md: 3 }}  // Remove margin-left on small screens
                                    mb={3}  // Add margin bottom to separate from other buttons
                                    flexShrink={0}
                                    _active={{ transform: 'scale(0.95)', }}
                                >
                                    {sortText}
                                </MenuButton>
                                <AnimatePresence>
                                    {isOpen && (
                                        <MenuList bgColor={bk2} borderColor={bk2}>
                                            {sorting !== null &&
                                                sorting.map((item, index) => (
                                                    <MenuItem
                                                        key={item}
                                                        bgColor={bk2}
                                                        _hover={{ backgroundColor: '#DDE6ED', color: '#31363F' }}
                                                        fontWeight={'bold'}
                                                        onClick={() => handleSorting(item)}
                                                    >
                                                        <MotionBox
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                                        >
                                                            {item}
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
                    <Grid
                        p={4}
                        width={{ base: 'fit', md: '96%' }}
                        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }}
                        columnGap={{ base: 1, md: 2, lg: 4, xl: 8 }}
                        rowGap={{ base: 10, md: 8, lg: 8, xl: 8 }}
                        mt={2}


                    >
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
                                            animation={item.discount > 0 ? `${borderPulse} 2s infinite` : item.place > 0 && `${borderPulse} 2s infinite`}

                                            width={{ base: 'fit', md: '230px' }}
                                            bgColor={bk2}
                                            borderRadius={8}
                                            borderTopRadius={2}


                                            className="Tilt-inner"
                                            m={{ base: 1, md: 0 }}
                                        >
                                            <Flex
                                                flexDir={'column'}
                                                borderRadius={8}
                                                onClick={() => navigate(`/product/${item.id}`)} cursor={'pointer'}


                                            >
                                                <Box width={'100%'} height={'170px'} onClick={() => navigate(`/product/${item.id}`)} cursor={'pointer'}>
                                                    <Image
                                                        src={item.image_url === '' ? `https://ui-avatars.com/api/?name=${item.name}` : item.image_url}
                                                        borderTopRadius={2}
                                                        width={'100%'}
                                                        height={'170px'}
                                                        alignSelf={'center'}
                                                        objectFit='fit'
                                                    />
                                                </Box>
                                                <Flex justifyContent={'space-between'} alignItems={'center'} >
                                                    <Flex flexDir={'column'} width={'100%'}>
                                                        <Flex>
                                                            <Text
                                                                bgColor={'#00a3c4'}
                                                                color={'#000'}
                                                                borderRadius={4}
                                                                p={0.5}
                                                                pl={2}
                                                                pr={2}
                                                                fontSize={14}
                                                                mt={2}
                                                                ml={2}


                                                            >{item.category}</Text>
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
                                                        <Flex
                                                            justifyContent={'space-between'}
                                                            ml={3}
                                                            mr={3}
                                                            mt={2}
                                                        >
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
                                                                <Text
                                                                    fontSize={14}
                                                                    fontWeight={'bold'}
                                                                >Sold</Text>
                                                                <Text ml={1}>{item.sales}</Text>

                                                            </Flex>
                                                        </Flex>


                                                    </Flex>
                                                </Flex>


                                            </Flex>
                                            <Flex
                                                justifyContent={'space-between'}
                                                ml={2}
                                                pb={3}

                                                flexDir={{ base: 'column' }}
                                            >

                                                <Flex alignItems={'center'} mt={2}>
                                                    <Avatar src={item.avatar} boxSize={'32px'} borderRadius={8} mr={2} />
                                                    <Text
                                                        fontWeight={'bold'}
                                                        _hover={{ color: '#0dc5ea' }}
                                                        cursor={'pointer'}
                                                        onClick={() => navigate(`/@${item.user}`)}
                                                    >@{item.user}</Text>
                                                </Flex>
                                            </Flex>
                                        </GridItem>


                                    </Tilt>
                                </MotionBox>
                            </AnimatePresence>


                        ))}
                    </Grid >
                ) : <Icon icon={'svg-spinners:blocks-shuffle-3'} width={'200px'} style={{ marginTop: 60, marginBottom: 160 }} color='#0dc5ea' />
                }

                {
                    response !== null && (
                        <Flex mt={2} mb={4}>
                            {response.links.previous !== null && response.current_page !== 1 && <Button onClick={() => handleNextPage(response.links.previous)}>{response.current_page - 1}</Button>}
                            <Button colorScheme='cyan' ml={1} mr={1} >{response.current_page}</Button>
                            {response.links.next !== null && <Button onClick={() => handleNextPage(response.links.next)}>{response.current_page + 1}</Button>}
                        </Flex>
                    )
                }
            </>
        ) : <Image src={loading} height={{ base: 260, md: 400 }} />
    )
}

const LeftAnimit = ({ seconds = 5, prc = "5%", img, top = "0" }) => {
    return (
        <Box
            position="absolute"
            display={{ base: 'none', md: 'block' }}
            left={prc}
            height={'100%'}
            top={top}
            animation={`${moveTopDown} ${seconds}s linear infinite`}
        >
            <Image src={img} height={'100%'} boxSize={50} transform={'rotate(-30deg)'} />
        </Box>
    )
}
const RightAnimit = ({ seconds = 5, prc = "5%", img, top = "0" }) => {
    return (
        <Box
            position="absolute"
            display={{ base: 'none', md: 'block' }}
            right={prc}
            height={'100%'}
            top={top}
            animation={`${moveTopDown} ${seconds}s linear infinite`}
        >
            <Image src={img} height={'100%'} boxSize={50} transform={'rotate(-30deg)'} />
        </Box>
    )
}

