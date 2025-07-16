import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import HomePage from './pages/HomePage';

const theme = createTheme({
    breakpoints: {
        xs: '30em',
        sm: '48em',
        md: '64em',
        lg: '74em',
        xl: '90em',
    },
    colors: {
        primary: ['#f0f4ff', '#dbe4ff', '#bac8ff', '#91a7ff', '#748ffc', '#5c7cfa', '#4c6ef5', '#4263eb', '#3b5bdb', '#364fc7']
    }
});

function App() {
    return (
        <MantineProvider theme={theme}>
            <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <HomePage />
            </div>
        </MantineProvider>
    );
}

export default App;
