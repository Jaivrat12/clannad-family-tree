import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {

	return (

		<Html lang="en">
			<Head>
				<meta name="description" content="Clannad - Family Tree Maker" />
				<link rel="icon" href="/favicon.ico" />
				<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}