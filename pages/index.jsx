import Typography from '@mui/joy/Typography';

/**
 * ! THIS PROJECT DOESN'T SUPPORT THESE CONCEPTS ATM:
 * 		! POLYGAMY 👀
*/

Home.title = 'Home';
export default function Home() {

	return (

		<>
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