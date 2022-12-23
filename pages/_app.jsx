import Head from 'next/head';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import clannadTheme from '../utils/theme';

import '../styles/globals.css';
import '@fontsource/quicksand';
import '@fontsource/work-sans';
import '@fontsource/public-sans';


export default function App({ Component, pageProps }) {

	const title = (Component.title || '') && Component.title + ' | ';

	return (

		<CssVarsProvider theme={ clannadTheme }>
			<CssBaseline />
			<Head>
				<title>
					{ `${ title }Clannad - Family Tree Maker` }
				</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Component {...pageProps} />
		</CssVarsProvider>
	);
}