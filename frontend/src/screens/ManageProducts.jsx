import React, { useState, useEffect, useRef } from 'react'
import { Flex, Box, Text, Button, Input, Checkbox, Image, useToast, useDisclosure, Td, Tr, Tfoot, Th, Table, TableContainer, TableCaption, Thead, Tbody, Skeleton } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { bk1, bk2, btnScheme } from '../localVars';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
export default function ManageProducts() {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const percentageRef = useRef(0);
    const toast = useToast();
    const [filterdSearch, setFilterdSearch] = useState(null);
    const [products, setProducts] = useState(null);
    const access_token = Cookies.get('access_token');
    const { userAuth } = useSelector((state) => state.auth)
    const [disProducts, setDisProducts] = useState([]);
    useEffect(() => {
        if (products === null && userAuth !== null) {
            fetch(`https://api.igstore.io/my-products/${userAuth}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setProducts(data);
                    data.forEach(obj => {
                        if (obj.discount > 0) {
                            disProducts.push(obj.id);
                        }
                    });
                    console.log(disProducts)
                })
                .catch(error => console.error('Error:', error))
        }
    }, [products, access_token, userAuth])

    useEffect(() => {
        if (products !== null && filterdSearch === null) {
            setFilterdSearch(products)
        }
    }, [products, filterdSearch])
    const handleSearch = (word) => {
        if (word.length >= 1) {
            let filterProducts = products.filter(prd => (
                prd.name.toLowerCase().includes(word.toLowerCase())
            ));
            setFilterdSearch(filterProducts);
        } else {
            setFilterdSearch(products);
        }


    }
    const handleDelete = (id, name) => {
        Swal.fire({
            title: `Are you sure you want to delete ${name}`,
            showCancelButton: true,
            confirmButtonText: "Confirm Delete",

        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://api.igstore.io/delete-product/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                }).then((response) => {
                    window.location.reload();
                })

            }
        });
    }
    const handleChangeDis = (id) => {
        console.log(disProducts)
        if (!disProducts.includes(id)) {
            disProducts.push(id);
        }
        else if (disProducts.includes(id)) {
            disProducts.pop(id);
        }
        console.log(disProducts)
    }
    const handleDiscount = () => {
        const percentage = parseInt(percentageRef.current.value);
        if (percentage > 100) {
            toast({
                title: 'Error',
                description: 'Discount percentage should not exceed 100%',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }

        const ids = disProducts;
        const data = {
            ids,
            percentage
        }
        console.log('here')
        fetch('https://api.igstore.io/set-discount/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(data)

        }).then((response) => {
            if (response.ok) {
                toast({
                    title: 'Success',
                    status: 'success',
                    duration: 1500,
                    isClosable: true,
                    position: 'top'
                })

                onClose();
                window.location.reload();
            }
            else {
                console.log(response)
            }
        })
    }
    const handleClearDiscount = () => {
        const data = {
            ids: [],
            percentage: 0
        }
        fetch('https://api.igstore.io/set-discount/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(data)

        }).then((response) => {
            if (response.ok) {
                toast({
                    title: 'Success',
                    status: 'success',
                    duration: 1500,
                    isClosable: true,
                    position: 'top'
                })

                onClose();
                //window.location.reload();
            }
            else {
                console.log(response)
            }
        })
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
            <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'} flexDir={{ base: 'column', md: 'row' }}>
                <Input
                    placeholder='Search'
                    width={'94%'}
                    bgColor={bk1}
                    borderColor={bk1}
                    onChange={(e) => handleSearch(e.target.value)}
                    display={{ base: 'none', md: 'block' }}
                />
                <Flex pb={{ base: 4, md: 0 }} pl={{ base: 0, md: 10 }} justifyContent={'space-between'} width={{ base: '94%', md: 'auto' }}>
                    <Button
                        colorScheme={btnScheme}
                        mr={{ base: 0, md: 2 }}
                        rightIcon={<Icon icon={'material-symbols:add-ad'} width={18} />}
                        onClick={() => navigate('/add-product')}
                        _active={{ transform: 'scale(0.95)', }}
                    >New Product</Button>
                    <Button
                        colorScheme={btnScheme}
                        ml={{ base: 0, md: 2 }}
                        rightIcon={<Icon icon={'mdi:discount'} width={18} />}
                        variant={'outline'}
                        onClick={onOpen}
                        _active={{ transform: 'scale(0.95)', }}
                    >Discount</Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent bgColor={bk1}>
                            <ModalHeader>Manage Discount</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Flex alignItems={'center'}>
                                    <Text fontStyle={'italic'} mr={1}>Discount Percentage : 0 - 100 </Text>
                                    <Icon icon={'mdi:discount-outline'} />
                                </Flex>

                                <Input
                                    placeholder='0'
                                    mt={1}
                                    bgColor={bk2}
                                    borderColor={'silver'}
                                    ref={percentageRef}
                                    type='number'

                                />

                                <Text fontStyle={'italic'} mt={4}>Select Products</Text>
                                <Flex
                                    flexDir={'column'}
                                    width={'100%'}
                                    bgColor={bk2}
                                    height={'300px'}
                                    borderRadius={8}
                                    mt={1}
                                    overflowY={'scroll'}
                                >
                                    {filterdSearch !== null && filterdSearch.map((item, index) => (
                                        <Checkbox
                                            bgColor={bk2}
                                            width={'100%'}
                                            height={'50px'}
                                            color={'#fff'}
                                            fontWeight={'bold'}
                                            pl={5}
                                            p={3}
                                            borderTopRadius={index === 0 ? 8 : 0}
                                            borderColor={bk1}
                                            borderWidth={'1px'}
                                            colorScheme='cyan'
                                            defaultChecked={item.discount > 0 && true}
                                            onChange={() => handleChangeDis(item.id)}
                                        >{item.name}</Checkbox>

                                    ))}

                                </Flex>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='red' onClick={handleClearDiscount} mr={6}>Clear All Discounts</Button>
                                {/* <Button colorScheme='cyan' variant={'outline'} mr={3} onClick={onClose}>
                                    Close
                                </Button> */}
                                <Button colorScheme='cyan' onClick={handleDiscount}>Edit Discount</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
                <Input
                    placeholder='Search'
                    width={'94%'}
                    bgColor={bk1}
                    borderColor={bk1}
                    onChange={(e) => handleSearch(e.target.value)}
                    display={{ base: 'block', md: 'none' }}
                />

            </Flex>

            <Flex
                width={'100%'}
                justifyContent={'center'}
                overflowY={'scroll'}
            >
                <TableContainer width={'98%'} overflowY={'scroll'}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th color={'#fff'}>Image</Th>
                                <Th color={'#fff'}>Name</Th>
                                <Th color={'#fff'}>Category</Th>
                                <Th color={'#fff'}>Status</Th>
                                <Th color={'#fff'}>Edit</Th>

                            </Tr>
                        </Thead>

                        <Tbody>
                            {filterdSearch !== null ? filterdSearch.map((item) => (
                                <Tr key={item.id}>
                                    <Td><Image src={item.image_url} width={'40px'} height={'40px'} /></Td>
                                    <Td>{item.name}</Td>
                                    <Td fontWeight={'bold'}>{item.category}</Td>
                                    <Td>{item.hide ? (
                                        <Icon icon={'mdi:hide'} width={26} height={26} color='orange' />
                                    ) : (
                                        <Icon icon={'mdi:show'} width={26} height={26} />
                                    )}</Td>
                                    <Td><Flex>
                                        <Box
                                            cursor={'pointer'}
                                            sx={{
                                                transform: 'scale(0.95)',
                                                transition: 'box-shadow 0.5s, transform 0.5s',
                                                '&:hover': {
                                                    transform: 'scale(1.3)',
                                                },
                                            }}
                                            onClick={() => navigate(`/edit-product/${item.id}`)}
                                        >
                                            <Icon icon={'mingcute:edit-line'} width={30} height={30} />
                                        </Box>
                                        <Box color={'#f20000'}
                                            cursor={'pointer'}
                                            sx={{

                                                transform: 'scale(0.95)',

                                                transition: 'box-shadow 0.5s, transform 0.5s',
                                                '&:hover': {
                                                    transform: 'scale(1.3)',
                                                },
                                            }}
                                            onClick={() => handleDelete(item.id, item.name)}
                                        >
                                            <Icon icon={'ic:outline-delete'} width={30} height={30} />
                                        </Box>
                                    </Flex></Td>



                                </Tr>
                            )) : (
                                <Tr>
                                    <Td><Skeleton width={'40px'} height={'40px'} /></Td>
                                    <Td><Skeleton width={'100px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'50px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'20px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'60px'} height={'20px'} /></Td>
                                </Tr>
                            )}


                        </Tbody>

                    </Table>
                </TableContainer>
            </Flex>
        </Flex>
    )
}
