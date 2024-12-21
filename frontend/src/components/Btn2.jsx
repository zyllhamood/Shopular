import React from 'react'
import { ThemeProvider, CssBaseline, createTheme, Button } from '@mui/material';
import { Icon } from '@iconify/react';
const theme = createTheme();
export default function Btn2({ txt, mt = 0, ml = 0, mb = 0, mr = 0, icon, onClick }) {
    return (
        <ThemeProvider theme={theme}>
            <Button
                variant="contained"
                color="primary"
                style={{
                    margin: `${mt}px ${ml}px ${mb}px ${mr}px`,
                    backgroundColor: '#0dc5ea',
                    color: '#000',
                    fontWeight: 'bold',
                    borderRadius: 40

                }}
                onClick={onClick}
                endIcon={<Icon icon={icon} />}

            >{txt}</Button>
        </ThemeProvider>
    )
}
