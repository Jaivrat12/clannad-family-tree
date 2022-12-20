import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import clannadTheme from '../utils/theme';

import '../styles/globals.css';
import '@fontsource/quicksand';
import '@fontsource/work-sans';
import '@fontsource/public-sans';


export default function App({ Component, pageProps }) {

	return (

		<CssVarsProvider theme={ clannadTheme }>
			<CssBaseline />
			<Component {...pageProps} />
		</CssVarsProvider>
	);
}