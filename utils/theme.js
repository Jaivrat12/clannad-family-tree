import { extendTheme } from '@mui/joy/styles';

const clannadTheme = extendTheme({
    components: {
        JoySkeleton: {
            defaultProps: {
                animation: 'wave',
            },
        },
    },
    fontFamily: {
        body: '"Quicksand", var(--joy-fontFamily-fallback)',
        display: '"Quicksand", var(--joy-fontFamily-fallback)',
        code: 'Source Code Pro,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
        fallback:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    typography: {
        body1: {
            fontWeight: 500
        },
    },
});

export default clannadTheme;