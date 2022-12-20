import Head from 'next/head';
import Typography from '@mui/joy/Typography';


export default function Home() {

	return (

		<>
			<Head>
				<title>Home | Clannad - Family Tree Maker</title>
				<meta name="description" content="Clannad - Family Tree Maker" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Typography
				level="h2"
				textAlign="center"
				marginTop={ 2 }
			>
				Clannad
			</Typography>

			<Typography
				level="subtitle"
				textAlign="center"
			>
				{ '(Family Tree Maker)' }
			</Typography>
		</>
	);
}