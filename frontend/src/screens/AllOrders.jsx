import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Button, Input, Checkbox, Image, IconButton, useToast, Td, Tr, Tfoot, Th, Table, TableContainer, TableCaption, Thead, Tbody, Skeleton } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import instagram from '../Images/instagram.png'
import telegram from '../Images/telegram.png'
import discord from '../Images/discord.png'
import snapchat from '../Images/snapchat.png'
import x from '../Images/x.png'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react'
import { bk1, bk2, btnScheme } from '../localVars';
export default function AllOrders() {
    const navigate = useNavigate()

    const toast = useToast();
    const [filterdSearch, setFilterdSearch] = useState(null);
    const [orders, setOrders] = useState(null);
    const access_token = Cookies.get('access_token');
    const [status, setStatus] = useState('confirmed')
    const { userAuth } = useSelector((state) => state.auth)

    useEffect(() => {
        if (orders === null && userAuth !== null) {
            fetch(`https://api.igstore.io/all-orders/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(response => response.json())
                .then(data => setOrders(data))
                .catch(error => console.error('Error:', error))
        }
    }, [orders, access_token, userAuth])

    useEffect(() => {
        if (orders !== null && filterdSearch === null) {
            setFilterdSearch(orders)
        }
    }, [orders, filterdSearch])
    const handleSearch = (word) => {
        if (word.length >= 1) {
            let filterOrders = orders.filter(prd => (
                prd.product_name.toLowerCase().includes(word.toLowerCase()) ||
                prd.username_buyer.toLowerCase().includes(word.toLowerCase()) ||
                prd.email_buyer.toLowerCase().includes(word.toLowerCase()) ||
                prd.code_url.toLowerCase().includes(word.toLowerCase()) ||
                prd.payment_id.toLowerCase().includes(word.toLowerCase())

            ));
            setFilterdSearch(filterOrders);
        } else {
            setFilterdSearch(orders);
        }


    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedItem, setSelectedItem] = useState(null);
    const handleRowClick = (item) => {
        setSelectedItem(item);
        onOpen();
    };

    const handleStatus = () => {
        if (status === 'confirmed') {
            setStatus('waiting')
        }
        else {
            setStatus('confirmed')
        }

    }
    return (
        <Flex
            bgColor={bk2}
            width={'90%'}
            height={'600px'}
            borderRadius={8}
            p={5}
            flexDir={'column'}
        >
            <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
                <Input
                    placeholder='Search'
                    width={'100%'}
                    bgColor={bk1}
                    borderColor={bk1}
                    onChange={(e) => handleSearch(e.target.value)}
                />

            </Flex>

            <Flex
                width={'100%'}
                justifyContent={'center'}
                overflowY={'scroll'}
                flexDir={'column'}
            >
                <Checkbox
                    defaultChecked
                    onChange={handleStatus}
                    alignSelf={'start'}
                    m={4}

                    onClick={() => handleStatus}
                    colorScheme={btnScheme}
                >Confirmed</Checkbox>
                <TableContainer width={'98%'} overflowY={'scroll'}>
                    <Table variant='simple' >
                        <Thead>
                            <Tr>
                                <Th color={'#000'}>Code</Th>
                                <Th color={'#000'}>Seller</Th>
                                <Th color={'#000'}>Username</Th>
                                <Th color={'#000'}>Status</Th>
                                <Th color={'#000'}>Product</Th>
                                <Th color={'#000'}>Review</Th>
                            </Tr>
                        </Thead>

                        <Tbody >
                            {filterdSearch !== null ? filterdSearch.filter((prd) => status === 'confirmed' ? prd.status === status : true).map((item) => (
                                <Tr
                                    key={item.id}
                                    _hover={{ bgColor: '#26374d' }}
                                    cursor={'pointer'}
                                    onClick={() => handleRowClick(item)}
                                >

                                    <Td>{item.code_url}</Td>
                                    <Td fontWeight={'bold'}>{item.seller_username}</Td>
                                    <Td >
                                        <Flex alignItems={'center'}>
                                            <Text fontWeight={'bold'} mr={2}>{item.username_buyer}</Text>
                                            <Image
                                                src={item.social_user === 'instagram' ? instagram : item.social_user === 'telegram' ? telegram : item.social_user === 'discord' ? discord : item.social_user === 'snapchat' ? snapchat : item.social_user === 'x' ? x : ''}
                                                width={26}
                                                height={26}
                                            />
                                        </Flex>
                                    </Td>
                                    <Td>
                                        <Flex>
                                            <Text
                                                bgColor={item.status === 'confirmed' ? '#c5f1db' : '#bbbfc2'}
                                                color={item.status === 'confirmed' ? '#103725' : '#111920'}
                                                borderRadius={40}
                                                p={1}
                                                pl={3}
                                                pr={3}
                                                fontSize={14}
                                                fontWeight={'bold'}
                                            >{item.status}</Text>
                                        </Flex>
                                    </Td>

                                    <Td>{item.product_name}</Td>
                                    <Td>
                                        <Flex flexDir={'column'}>
                                            <Flex >
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Box key={star} color={star <= item.review_stars ? 'yellow.400' : 'gray.300'}>
                                                        <Icon


                                                            icon={'mdi:star'}
                                                        />
                                                    </Box>

                                                ))}
                                            </Flex>
                                            <Text>{item.review_message}</Text>
                                        </Flex>
                                    </Td>


                                </Tr>

                            )) : (
                                <Tr>
                                    <Td><Skeleton width={'240px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'80px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'110px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'100px'} height={'26px'} borderRadius={40} /></Td>
                                    <Td><Skeleton width={'130px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'100px'} height={'20px'} /></Td>
                                </Tr>
                            )}


                        </Tbody>

                    </Table>
                    {selectedItem && (
                        <ModalMessage item={selectedItem} isOpen={isOpen} onClose={onClose} />
                    )}
                </TableContainer>
            </Flex>

        </Flex>
    )
}
const ModalMessage = ({ item, isOpen, onClose }) => {
    function formatDateString(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}:${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bgColor={bk1}>
                <ModalHeader>{item.code_url}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex flexDir={'column'}>
                        <Text>Payment ID : {item.payment_id}</Text>
                        <Text>Product : {item.product_name}</Text>
                        <Text>Amount : {item.amount}</Text>
                        <Text>Crypto : {item.crypto}</Text>
                        <Text>Address : {item.address}</Text>
                        <Box height={'1px'} bgColor={'silver'} width={'100%'} mt={4} mb={4}></Box>
                        <Text>Email : {item.email_buyer}</Text>
                        <Text>Username : {item.username_buyer}</Text>
                        <Text mr={2} >Review : {item.review_message}</Text>
                        <Flex alignItems={'center'} >

                            {[1, 2, 3, 4, 5].map((star) => (
                                <Box key={star} color={star <= item.review_stars ? 'yellow.400' : 'gray.300'}>
                                    <Icon


                                        icon={'mdi:star'}
                                    />
                                </Box>

                            ))}
                        </Flex>
                        <Box height={'1px'} bgColor={'silver'} width={'100%'} mt={4} mb={4}></Box>
                        <Text>Created At : {formatDateString(item.created_at)}</Text>
                        <Text>Expiers At : {formatDateString(item.expiers)}</Text>
                        <Text fontWeight={'bold'}>Status : {item.status}</Text>

                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}