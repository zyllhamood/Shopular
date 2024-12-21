import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Flex, Text, Button, Image, Avatar, Grid, GridItem } from '@chakra-ui/react';
import { Tilt } from 'react-tilt';
import { Icon } from '@iconify/react';
import SafeHTMLContent from '../components/SafeHTMLContent';
import { bk1, bk2, borderPulse, btnScheme } from '../localVars';
import { motion, AnimatePresence } from 'framer-motion';
const MotionBox = motion(Box);
const description = '<h1><strong>List (two options)</strong></h1><ol><li>Load File List</li><li>Generate Random Users By Length</li></ol><h1><strong>Proxies (two options)</strong></h1><ol><li>Load File</li><li>Get free proxies&nbsp;<strong><em>NOTIC :</em></strong>&nbsp;Renewed proxies every hour randomly</li></ol><p><strong>Typy Proxy</strong>&nbsp;: --HTTP/S-- / --SOCKS4-- / --SOCKS5--</p><p><br></p><h1><strong>Quick Explanation</strong></h1><ul><li>The tool checks for all chooses you select.</li><li>The options (14Days, Banned, AlreadyExists, Verified, Business, Posts, Followers, Following, Url, Name, Private)</li><li>So any option you will check it will checked and if the user has all the options you choose it will save it.</li><li>True and False it means for example in Banned option it you select True it will check if the user banned and if you select False it will check if the user not banned.</li><li>Save it will save the file valid.txt that has all the conditions and Folder named All Chooses so any user has checked for every option it will saved alone.</li><li>Send valid Telegram Bot and Discord.</li><li><strong>The Red Check</strong>&nbsp;==&gt; to return check bad proxy with a good one(<strong><em>Good Option</em></strong>)</li></ul><p><br></p>'
export default function InfoProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [resp, setResp] = useState(null);

    useEffect(() => {
        if (resp === null && id !== undefined) {
            fetch(`https://api.igstore.io/product/${id}/`)
                .then((response) => response.json())
                .then((data) => setResp(data))
        }
    }, [resp])

    const handleCheckout = () => {
        const id_seller = resp.user;
        const id_product = resp.id;
        const name = resp.name;
        const price = resp.price;
        const discount = resp.discount;
        navigate('/checkout', { state: { id_product, id_seller, name, price, discount } });
    }
    function discount(originalPrice, discountPercentage) {
        const discountAmount = (originalPrice * discountPercentage) / 100;
        const discountedPrice = originalPrice - discountAmount;
        return discountedPrice;
    }
    return (
        resp !== null ? (
            <Flex flexDir={'column'} width={'100%'}>
                <Flex
                    flexDir={{ base: 'column', md: 'row' }}
                    width={'100%'}
                    justifyContent={'center'}

                >

                    <Flex
                        width={{ base: '94%', md: '65%' }}
                        height={{ base: 'fit', md: '500px' }}
                        bgColor={bk2}
                        m={2}
                        borderRadius={8}
                        flexDir={'column'}
                        pb={4}
                    >
                        <Flex
                            flexDir={{ base: 'column', md: 'row' }}
                            width={'100%'}
                            p={6}
                            justifyContent={'space-between'}
                        >
                            <Flex flexDir={'column'} p={2} width={{ base: '100%', md: '50%' }} >

                                <Text
                                    fontSize={22}
                                    fontWeight={'bold'}
                                    mt={-4}
                                >
                                    {resp.name}

                                </Text>
                                <Text
                                    fontSize={16}

                                    mt={1}
                                >
                                    {resp.simple_description}

                                </Text>
                                <Flex
                                    alignSelf={'center'}
                                    justifyContent={'space-between'}
                                    mt={1}
                                    flexDir={{ base: 'row', md: 'row' }}
                                    alignItems={'center'}

                                    width={'100%'}
                                >

                                    <Flex
                                        mt={4}
                                        borderWidth={'1px'}
                                        borderColor={'#e4e9f180'}
                                        p={2}
                                        flexDir={'column'}
                                        borderRadius={8}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        width={'48%'}
                                        height={'60px'}

                                    >

                                        <Text color={'#e4e9f180'}>Sold</Text>
                                        <Text
                                            fontWeight={'bold'}
                                        >{resp.sales}</Text>
                                    </Flex>
                                    <Flex
                                        mt={4}
                                        borderWidth={'1px'}
                                        borderColor={'#e4e9f180'}
                                        p={2}
                                        flexDir={'column'}
                                        borderRadius={8}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        width={'48%'}
                                        height={'60px'}

                                    >
                                        <Text color={'#e4e9f180'}>{resp.reviews} Reviews</Text>
                                        <Text fontWeight={'bold'}><Flex >
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Box key={star} color={star <= resp.stars ? 'yellow.400' : 'gray.300'}>
                                                    <Icon
                                                        width={20}
                                                        height={20}

                                                        icon={'mdi:star'}
                                                    />
                                                </Box>

                                            ))}
                                        </Flex></Text>
                                    </Flex>




                                </Flex>
                                <Flex

                                    mt={4}
                                    borderWidth={'1px'}
                                    borderColor={'#e4e9f180'}
                                    p={1}
                                    flexDir={'column'}
                                    borderRadius={8}
                                // onClick={() => navigate(`/@${resp.username}`)}
                                // cursor={'pointer'}

                                >

                                    <Flex
                                        mt={2}
                                        mb={2}
                                        ml={2}

                                        justifyContent={'space-between'}
                                        flexDir={'column'}
                                    >
                                        <Flex alignItems={'center'}>
                                            <Avatar src={resp.username_avatar} />
                                            <Flex flexDir={'column'} ml={2} width={'100%'}>
                                                <Flex alignItems={'center'} justifyContent={'center'} >

                                                    <Flex justifyContent={'space-between'} width={'100%'}>
                                                        <Text
                                                            color={'#e4e9f180'}


                                                        > Seller</Text>
                                                        <Text
                                                            color={'#e4e9f180'}
                                                            mr={2}

                                                        > Rating</Text>
                                                    </Flex>

                                                </Flex>
                                                <Flex alignItems={'center'} justifyContent={'space-between'}>
                                                    <Flex alignItems={'center'}>
                                                        <Text
                                                            fontWeight={'bold'}


                                                        > @</Text>
                                                        <Text
                                                            fontWeight={'bold'}
                                                            textDecoration={'underline'}
                                                            onClick={() => navigate(`/@${resp.username}`)}
                                                            cursor={'pointer'}
                                                            ml={0}
                                                            _hover={{ color: '#0dc5ea' }}
                                                        >{resp.username}</Text>
                                                    </Flex>
                                                    <Text mr={5.5} fontWeight={'bold'}>
                                                        <Flex alignItems={'center'}>
                                                            <Text>{resp.username_rating}</Text>
                                                            <Box color={resp.username_rating > 0 ? 'yellow.400' : 'gray.300'}>

                                                                <Icon
                                                                    width={20}
                                                                    height={20}

                                                                    icon={'mdi:star'}
                                                                />
                                                            </Box>
                                                        </Flex>
                                                    </Text>

                                                </Flex>
                                            </Flex>
                                        </Flex>

                                    </Flex>
                                </Flex>

                            </Flex>


                            <Flex width={{ base: '100%', md: '36%' }} mt={{ base: 2, md: 14 }}>
                                <Image src={resp.image_url === '' ? `https://ui-avatars.com/api/?name=${resp.name}` : resp.image_url} borderTopRadius={2}
                                    width={'100%'}
                                    height={'170px'}
                                />
                            </Flex>

                        </Flex>
                        <Flex
                            flexDir={'column'}
                            width={'94%'}
                            alignSelf={'center'}
                            overflowY={'scroll'}
                        >
                            <Text
                                fontSize={22}
                                textAlign={'center'}
                                fontWeight={'bold'}
                            >Product Description</Text>
                            <SafeHTMLContent description={resp.description} />
                        </Flex>

                    </Flex>
                    {/* CHECKOUT */}
                    <Flex
                        width={{ base: '94%', md: '28%' }}
                        height={{ base: 'fit', md: '500px' }}
                        bgColor={bk2}
                        m={2}
                        borderRadius={8}
                        flexDir={'column'}
                        alignItems={'center'}
                        pb={4}
                    >
                        <Text
                            fontSize={22}
                            fontWeight={'bold'}
                            textAlign={'center'}
                            width={'100%'}
                            mt={4}
                        >CHECKOUT : {resp.discount > 0 ? discount(resp.price, resp.discount) : resp.price}$</Text>
                        {resp.accepting_crypto && <><Button
                            colorScheme={btnScheme}
                            onClick={handleCheckout}
                            width={'90%'}
                            mt={10}
                            _active={{ transform: 'scale(0.95)', }}
                        >Pay With Crypto</Button>
                            <Text fontWeight={'bold'} mt={10} fontSize={20}>Other Payment Methods</Text>
                        </>}

                        <SafeHTMLContent description={resp.other_payment} />
                    </Flex>
                </Flex>
                <Flex mt={4} flexDir={'column'} alignItems={'center'} width={'100%'}>
                    <Text
                        fontSize={26}
                        fontWeight={'bold'}
                    >Recommended for you</Text>
                    <Grid
                        p={4}
                        width={{ base: 'fit', md: '96%' }}
                        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }}
                        columnGap={{ base: 1, md: 2, lg: 4, xl: 8 }}
                        rowGap={{ base: 10, md: 8, lg: 8, xl: 8 }}
                        mt={2}


                    >
                        {resp.recommended.map((item) => (
                            <Tilt className="Tilt" options={{ max: 25, scale: 1.05 }} key={item.id} >
                                <GridItem

                                    width={{ base: 'fit', md: '230px' }}
                                    bgColor={bk2}
                                    borderRadius={8}
                                    borderTopRadius={2}

                                    animation={item.discount > 0 && `${borderPulse} 2s infinite`}
                                    className="Tilt-inner"
                                    m={{ base: 1, md: 0 }}
                                >
                                    <Flex
                                        flexDir={'column'}
                                        borderRadius={8}
                                        onClick={() => window.location.href = `/product/${item.id}`}
                                        cursor={'pointer'}


                                    >
                                        <Box width={'100%'} height={'170px'}>
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

                        ))}
                    </Grid >
                </Flex>
            </Flex>
        ) : <Icon icon={'svg-spinners:blocks-shuffle-3'} height={'300px'} style={{ marginTop: 100 }} color='#0dc5ea' />
    )
}
