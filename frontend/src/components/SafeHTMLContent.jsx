import React from 'react';
import { Flex } from '@chakra-ui/react';
import DOMPurify from 'dompurify';

const SafeHTMLContent = ({ description }) => {
    const sanitizedDescription = DOMPurify.sanitize(description);

    return (
        <Flex

            sx={{
                a: {
                    color: 'darkblue',
                    textDecoration: 'underline',
                },
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            flexDir={'column'}
        />
    );
};

export default SafeHTMLContent;
