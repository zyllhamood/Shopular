import React from 'react'
import { Flex, Image, Text, Button } from '@chakra-ui/react'
import error from '../Images/404.gif'
export default function Error() {
    return (
        <Flex justifyContent={'center'} alignItems={'center'} width={'100%'} flexDir={'column'}>

            <Image src={error} width={400} mt={50} />
            <Button colorScheme='red'
                onClick={() => window.location.href = '/'}
            >BACK HOME</Button>
        </Flex>
    )
}
