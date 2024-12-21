import React from 'react'
import { ThemeProvider, CssBaseline, createTheme, Button } from '@mui/material';
const theme = createTheme();
export default function Btn1({ txt, mt = 0, ml = 0, mb = 0, mr = 0, onClick }) {
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

                }}
                onClick={onClick}

            >{txt}</Button>
        </ThemeProvider>
    )
}
