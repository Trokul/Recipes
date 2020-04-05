import React from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { createMuiTheme } from '@material-ui/core/styles';
import { StylesProvider, ThemeProvider, jssPreset } from '@material-ui/styles';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const theme = createMuiTheme({
    direction: 'rtl'
});

function RTL(props) {
    return (
        <StylesProvider jss={jss}>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
        </StylesProvider>
    );
}

export default RTL;
