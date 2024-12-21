import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Button, Input, Image, useToast, Td, Tr, Tfoot, Th, Table, TableContainer, TableCaption, Thead, Tbody, Skeleton } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { bk1, bk2, btnScheme } from '../localVars';
export default function ProductsAdmin() {
    const navigate = useNavigate()
    const toast = useToast();
    const [filterdSearch, setFilterdSearch] = useState(null);
    const [products, setProducts] = useState(null);
    const access_token = Cookies.get('access_token');
    const { userAuth, isAdmin } = useSelector((state) => state.auth)

    useEffect(() => {
        if (products === null && isAdmin === true) {
            fetch(`https://api.igstore.io/admin-products/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(response => response.json())
                .then(data => setProducts(data))
                .catch(error => console.error('Error:', error))
        }
    }, [products, access_token, userAuth])

    useEffect(() => {
        if (products !== null && filterdSearch === null) {
            const sortedProducts = [...products].sort((a, b) => {
                if (a.place === 0) return 1;
                if (b.place === 0) return -1;
                return a.place - b.place;
            });
            setFilterdSearch(sortedProducts)
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
    const handleSetTop = (item, new_place) => {


        fetch(`https://api.igstore.io/edit-place/${item.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                place: new_place
            })
        })
            .then((response) => {
                if (response.ok) {
                    toast({
                        title: 'Success',
                        status: 'success',
                        duration: 1500,
                        isClosable: true,
                        position: 'top'
                    })
                    const timer = setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    return () => clearTimeout(timer);
                }
                else {
                    toast({
                        title: 'Error',
                        status: 'error',
                        duration: 1500,
                        isClosable: true,
                        position: 'top'
                    })
                }
            })
    }
    const handleHide = (id, name) => {
        Swal.fire({
            title: `Are you sure you want to hide ${name}`,
            showCancelButton: true,
            confirmButtonText: "Confirm Hide",

        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://api.igstore.io/hide-product/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                    body: JSON.stringify({ id })
                })
                    .then((response) => {
                        if (response.ok) {
                            toast({
                                title: 'Success',
                                status: 'success',
                                duration: 1500,
                                isClosable: true,
                                position: 'top'
                            })
                            const timer = setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                            return () => clearTimeout(timer);
                        }
                        else {
                            toast({
                                title: 'Error',
                                status: 'error',
                                duration: 1500,
                                isClosable: true,
                                position: 'top'
                            })
                        }
                    })

            }
        });
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
            <Input
                placeholder='Search'
                width={'100%'}
                bgColor={bk1}
                borderColor={bk1}
                onChange={(e) => handleSearch(e.target.value)}
                height={'50px'}
            />

            <Flex
                width={'100%'}
                justifyContent={'center'}
                overflowY={'scroll'}
            >
                <TableContainer width={'98%'} overflowY={'scroll'}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th color={'#000'}>Image</Th>
                                <Th color={'#000'}>Name</Th>
                                <Th color={'#000'}>User</Th>
                                <Th color={'#000'}>Place</Th>
                                <Th color={'#000'}>Hide</Th>
                                <Th color={'#000'}>Set Top</Th>

                            </Tr>
                        </Thead>

                        <Tbody>
                            {filterdSearch !== null ? filterdSearch.map((item) => (
                                <Tr>
                                    <Td>
                                        <Image
                                            src={item.image_url === '' ? `https://ui-avatars.com/api/?name=${item.name}` : item.image_url}
                                            height={30}
                                            width={30}
                                        />
                                    </Td>
                                    <Td>{item.name}</Td>
                                    <Td fontWeight={'bold'}>{item.username}</Td>
                                    <Td>{item.place}</Td>
                                    <Td><Icon cursor={'pointer'} icon={'mdi:show'} width={26} height={26} onClick={() => handleHide(item.id, item.name)} /></Td>
                                    <Td>
                                        <Flex>
                                            <Icon
                                                icon={'mdi:number-0-box'}
                                                width={26}
                                                height={26}
                                                color={item.place === 0 && 'green'}
                                                onClick={() => handleSetTop(item, 0)}
                                                cursor={'pointer'}
                                            />
                                            <Icon
                                                icon={'mdi:number-1-box'}
                                                width={26}
                                                height={26}
                                                style={{ marginLeft: 2 }}
                                                color={item.place === 1 && 'green'}
                                                onClick={() => handleSetTop(item, 1)}
                                                cursor={'pointer'}
                                            />
                                            <Icon
                                                icon={'mdi:number-2-box'}
                                                width={26}
                                                height={26}
                                                style={{ marginLeft: 2 }}
                                                color={item.place === 2 && 'green'}
                                                onClick={() => handleSetTop(item, 2)}
                                                cursor={'pointer'}
                                            />
                                            <Icon
                                                icon={'mdi:number-3-box'}
                                                width={26}
                                                height={26}
                                                style={{ marginLeft: 2 }}
                                                color={item.place === 3 && 'green'}
                                                onClick={() => handleSetTop(item, 3)}
                                                cursor={'pointer'}
                                            />
                                            <Icon
                                                icon={'mdi:number-4-box'}
                                                width={26}
                                                height={26}
                                                style={{ marginLeft: 2 }}
                                                color={item.place === 4 && 'green'}
                                                onClick={() => handleSetTop(item, 4)}
                                                cursor={'pointer'}
                                            />
                                            <Icon
                                                icon={'mdi:number-5-box'}
                                                width={26}
                                                height={26}
                                                style={{ marginLeft: 2 }}
                                                color={item.place === 5 && 'green'}
                                                onClick={() => handleSetTop(item, 5)}
                                                cursor={'pointer'}
                                            />
                                        </Flex>
                                    </Td>





                                </Tr>
                            )) : (
                                <Tr>
                                    <Td><Skeleton width={'30px'} height={'30px'} /></Td>
                                    <Td><Skeleton width={'100px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'80px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'10px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'160px'} height={'20px'} /></Td>
                                </Tr>
                            )}


                        </Tbody>

                    </Table>
                </TableContainer>
            </Flex>
        </Flex>
    )
}
