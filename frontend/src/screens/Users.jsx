import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Button, Input, useToast, Td, Tr, Tfoot, Th, Table, TableContainer, TableCaption, Thead, Tbody, Skeleton } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';
import { bk1, bk2, btnScheme } from '../localVars';
export default function Users() {
    const toast = useToast();
    const [filterdSearch, setFilterdSearch] = useState(null);
    const [users, setUsers] = useState(null);
    const access_token = Cookies.get('access_token')

    useEffect(() => {
        if (users === null) {
            fetch('https://api.igstore.io/users/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(response => response.json())
                .then(data => setUsers(data))
                .catch(error => console.error('Error:', error))
        }
    }, [users, access_token])

    useEffect(() => {
        if (users !== null && filterdSearch === null) {
            setFilterdSearch(users)
        }
    }, [users, filterdSearch])
    const handleSearch = (word) => {
        if (word.length >= 1) {
            let filterUsers = users.filter(prd => (
                prd.username.toLowerCase().includes(word.toLowerCase()) ||
                prd.full_name.toLowerCase().includes(word.toLowerCase())
            ));
            setFilterdSearch(filterUsers);
        } else {
            setFilterdSearch(users);
        }


    }
    const handleLock = (item) => {


        fetch(`https://api.igstore.io/locked/${item.id}/?lock=${!item.lock}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
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
                    window.location.reload();
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
    return (
        <Flex
            bgColor={bk2}
            width={'90%'}
            height={'600px'}
            borderRadius={8}
            p={5}
            flexDir={'column'}

        >
            <Flex height={'40px'}>
                <Input
                    placeholder='Search'
                    bgColor={bk1}
                    borderColor={bk1}
                    onChange={(e) => handleSearch(e.target.value)}

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
                                <Th color={'#000'}>Name</Th>
                                <Th color={'#000'}>User</Th>
                                <Th color={'#000'}>Reviews</Th>
                                <Th color={'#000'}>Lock</Th>

                            </Tr>
                        </Thead>

                        <Tbody>
                            {filterdSearch !== null ? filterdSearch.map((item) => (
                                <Tr>
                                    <Td>{item.full_name}</Td>
                                    <Td fontWeight={'bold'}>{item.username}</Td>
                                    <Td>{item.reviews}</Td>
                                    <Td cursor={'pointer'} onClick={() => handleLock(item)}>
                                        {item.lock === true ? (
                                            <Icon
                                                icon={'ic:twotone-lock'}
                                                height={26}
                                                width={26}
                                                color='red'
                                            />
                                        ) : (
                                            <Icon
                                                icon={'ant-design:unlock-twotone'}
                                                height={26}
                                                width={26}
                                            />
                                        )}
                                    </Td>


                                </Tr>
                            )) : (
                                <Tr>
                                    <Td><Skeleton width={'100px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'80px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'100px'} height={'20px'} /></Td>
                                    <Td><Skeleton width={'30px'} height={'20px'} /></Td>



                                </Tr>
                            )}


                        </Tbody>

                    </Table>
                </TableContainer>
            </Flex>
        </Flex>
    )
}
