import React, { useState, useEffect, useRef } from 'react'
import { Flex, Box, Button, Text, Image, Input, IconButton, useToast, Skeleton } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import ltc from '../Images/ltc.png';
import usdt from '../Images/usdt.png';
import btc from '../Images/btc.png';
import QRCode from 'qrcode.react';
import { Icon } from '@iconify/react';
import SafeHTMLContent from '../components/SafeHTMLContent';
import { bk1, bk2, btnScheme } from '../localVars';
export default function Payment() {
    const { code } = useParams();
    const good_resp = ['confirmed', 'finished', 'sending']
    const reviewRef = useRef('');
    const [resp, setResp] = useState(null);
    const [rating, setRating] = useState(0);
    const toast = useToast();
    const [paymentStatus, setPaymentStatus] = useState('waiting');

    useEffect(() => {
        if (resp === null && code !== undefined) {
            fetch(`https://api.igstore.io/payment/${code}/`)
                .then((response) => response.json())
                .then((data) => {
                    setResp(data)
                    setPaymentStatus(data.status)
                    try {
                        if (data.review_stars) {
                            setRating(data.review_stars);

                        }
                    } catch (error) {

                    }
                })
        }


    }, [code, paymentStatus]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(paymentStatus)
            if (paymentStatus === 'waiting') {
                fetch(`https://api.igstore.io/payment/${code}/`)
                    .then((response) => response.json())
                    .then((data) => {
                        setResp(data);
                        setPaymentStatus(data.status)
                        try {
                            if (data.review_stars) {
                                setRating(data.review_stars);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }, 10000); // 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [code]);


    const handleRating = (rate) => {
        setRating(rate);
    };
    const handleReview = () => {
        const message = reviewRef.current.value;
        const data = {
            message,
            stars: rating
        }
        fetch(`https://api.igstore.io/review/${code}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (response.ok) {
                    toast({
                        title: 'Success',
                        description: 'Review submitted successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    const timer = setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    return () => clearTimeout(timer);
                }
                else {
                    toast({
                        title: 'Error',
                        description: 'Failed to submit review',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }

            })
    }

    return (
        <Flex width={'100%'} flexDir={{ base: 'column', md: 'row' }} justifyContent={'center'} alignItems={'center'}>
            <Flex
                bgColor={bk2}
                width={{ base: '94%', md: '40%' }}
                height={'400px'}
                borderRadius={8}
                flexDir={'column'}
                p={6}
                alignItems={'center'}

            >
                <Flex width={'100%'} alignItems={'center'} justifyContent={'center'}>
                    <Text
                        fontSize={26}
                        fontWeight={'bold'}
                        display={{ base: 'none', md: 'block' }}
                    >Product : </Text>
                    <Text
                        fontSize={26}
                        fontWeight={'bold'}
                        ml={2}
                    >{resp !== null ? resp.name : <Skeleton width={'200px'} height={'22px'} />}</Text>
                </Flex>

                <Flex width={'100%'} alignItems={'center'} mt={2} flexDir={{ base: 'column', md: 'row' }}>
                    <Flex width={{ base: '100%', md: '60%' }} flexDir={'column'} justifyContent={'space-between'} height={'70%'}>
                        <Flex width={'100%'} alignItems={'center'} justifyContent={'center'}>
                            {resp !== null ? <Image src={resp.crypto === 'ltc' ? ltc : resp.crypto === 'btc' ? btc : usdt} width={70} height={70} /> : (
                                <Skeleton width={'100px'} height={'100px'} borderRadius={90} />
                            )}
                            <Text
                                fontSize={26}
                                fontWeight={'bold'}
                                ml={4}
                            >{resp !== null ? resp.amount : <Skeleton width={'100px'} height={'22px'} />}</Text>
                        </Flex>
                        <Flex width={'100%'} alignItems={'center'} justifyContent={'center'} mt={{ base: 2, md: 0 }}>
                            <Text
                                fontSize={26}
                                fontWeight={'bold'}

                            >Status : </Text>
                            {resp !== null ? (
                                <Text
                                    fontSize={26}
                                    fontWeight={'bold'}
                                    ml={2}
                                    color={good_resp.includes(resp.status) ? 'lime' : 'orange'}
                                >{resp.status}</Text>
                            ) : <Skeleton ml={2} width={'100px'} height={'22px'} />}
                        </Flex>

                    </Flex>
                    <Flex width={'44%'} alignItems={'start'} justifyContent={'center'}>
                        <Box mt={5}>
                            {resp !== null ? resp.address !== undefined && <QRCode value={resp.address} size={180} /> : <Skeleton width={'180px'} height={'180px'} />}
                        </Box>

                    </Flex>
                </Flex>

            </Flex>
            {resp !== null && resp.message && (
                <Flex
                    bgColor={bk2}
                    width={{ base: '94%', md: '40%' }}
                    height={'400px'}
                    borderRadius={8}
                    flexDir={'column'}
                    p={6}
                    alignItems={'center'}
                    mt={{ base: 3, md: 0 }}
                    ml={{ base: 0, md: 3 }}
                    overflowY={'scroll'}

                >
                    <Text fontSize={24} fontWeight={'bold'}>
                        Your Purchase
                    </Text>
                    <Flex pb={4} overflowY={'scroll'} mt={2} borderWidth={'1px'} p={2}>
                        <SafeHTMLContent description={resp.message} />
                    </Flex>
                    <Flex flexDir={'column'} width={'90%'} alignItems={'center'}>
                        <Flex flexDir={{ base: 'column', md: 'row' }} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                            <Text fontSize={26} fontWeight={'bold'}>Review</Text>
                            {resp.review_stars ? (
                                <Flex mb={2} mt={2}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <IconButton
                                            key={star}
                                            icon={<Icon icon="mdi:star" />}
                                            variant="ghost"
                                            color={star <= rating ? 'yellow.400' : 'gray.300'}
                                            //onClick={() => onRate(star)}
                                            _hover={{ bgColor: '#31363F' }}
                                            aria-label={`Rate ${star} stars`}
                                            fontSize="2xl"
                                        />
                                    ))}
                                </Flex>
                            ) : (
                                <Flex mb={2} mt={2}>
                                    {[1, 2, 3, 4, 5].map((star) => (

                                        <IconButton
                                            key={star}
                                            icon={<Icon icon="mdi:star" />}
                                            variant="ghost"
                                            color={star <= rating ? 'yellow.400' : 'gray.300'}
                                            onClick={() => handleRating(star)}
                                            aria-label={`Rate ${star} stars`}
                                            fontSize="2xl"
                                        />
                                    ))}
                                </Flex>
                            )}
                        </Flex>
                        {resp.review_message ? (
                            <Text fontSize={20}>{resp.review_message}</Text>
                        ) : (
                            <Input
                                placeholder='Message Review'
                                bgColor={bk1}
                                borderColor={bk1}
                                mt={2}
                                ref={reviewRef}
                            />
                        )}


                        {!resp.review_message && !resp.resp_stars && (
                            <Button
                                mt={4}
                                colorScheme={btnScheme}
                                onClick={handleReview}
                                _active={{ transform: 'scale(0.95)', }}

                            >Send Review</Button>
                        )}
                    </Flex>

                </Flex>
            )}
        </Flex>
    )
}
