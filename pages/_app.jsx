import Head from 'next/head';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import clannadTheme from '../utils/theme';
import { store } from '../app/store';

import '../styles/globals.css';

import '@fontsource/quicksand';
import '@fontsource/work-sans';
import '@fontsource/public-sans';

export default function App({ Component, pageProps: { session, ...pageProps } }) {

	const title = (Component.title || '') && Component.title + ' | ';

	return (

		<CssVarsProvider
			defaultMode="system"
			theme={clannadTheme}
		>
			<CssBaseline />

			<Head>
				<title>
					{`${title}Clannad - Family Tree Maker`}
				</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>

			<Provider store={store}>
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</Provider>
		</CssVarsProvider>
	);
}