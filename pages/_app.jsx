import Head from 'next/head';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import clannadTheme from '../utils/theme';
import { store } from '../app/store';

import '../styles/globals.css';
import '@fontsource/quicksand';
import '@fontsource/work-sans';
import '@fontsource/public-sans';

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }) {

	const title = (Component.title || '') && Component.title + ' | ';

	useEffect(() => {

		const preventCtrlWheelZoom = (e) => {
			if (e.ctrlKey) {
				e.preventDefault();
			}
		};
		const preventTouchZoom = (e) => {
			if (e.touches.length > 1) {
				e.preventDefault();
			}
		};
		const options = { passive: false };

		document.addEventListener('wheel', preventCtrlWheelZoom, options);
		document.addEventListener('touchstart', preventTouchZoom, options);

		return () => {
			document.removeEventListener('wheel', preventCtrlWheelZoom, options);
			document.removeEventListener('touchstart', preventTouchZoom, options);
		};
	}, []);

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
					<QueryClientProvider client={queryClient}>
						<Component {...pageProps} />
					</QueryClientProvider>
				</SessionProvider>
			</Provider>
		</CssVarsProvider>
	);
}