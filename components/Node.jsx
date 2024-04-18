import { useSelector } from 'react-redux';
import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/joy/AvatarGroup';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { selectMember, selectSpouse } from 'features/family/familySlice';
import settings from '../mocks/settings';

const Node = ({ id, onClick }) => {

	const avatarSize = settings.avatarSize;
	const member = useSelector(selectMember(id));
	const spouse = useSelector(selectSpouse(id));

	return (

		<foreignObject
			width={avatarSize}
			height={avatarSize}
			style={{
				x: -avatarSize / 2,
				y: -avatarSize / 2,
				overflow: 'visible',
				cursor: 'grab',
				// ! doesn't work hehe
				'&:active': {
					cursor: 'grabbing',
				}
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 0.75,
				}}
			>
				<AvatarGroup sx={{ flexDirection: 'row-reverse' }}>
					{spouse && (

						<Avatar
							src={spouse.image ?? (spouse.gender === 'male'
								? '/members/images/default-male.png'
								: '/members/images/default-female.png'
							)}
							alt={spouse.name}
							onClick={() => onClick(spouse._id)}
							sx={{
								height: avatarSize,
								width: avatarSize,
								border: '1px solid',
								cursor: 'pointer',
							}}
						/>
					)}

					<Avatar
						src={member.image ?? (member.gender === 'male'
							? '/members/images/default-male.png'
							: '/members/images/default-female.png'
						)}
						alt={member.name}
						onClick={() => onClick(id)}
						sx={{
							height: avatarSize,
							width: avatarSize,
							border: '1px solid',
							cursor: 'pointer',
						}}
					/>
				</AvatarGroup>

				<Box
					display="flex"
					gap={0.25}
				>
					<Typography
						fontSize="small"
						textAlign="center"
						lineHeight={1}
					>
						{member.name}
					</Typography>

					{spouse && (

						<>
							<Typography
								fontSize="small"
								textAlign="center"
								lineHeight={1}
							>
								❤
							</Typography>

							<Typography
								fontSize="small"
								textAlign="center"
								lineHeight={1}
							>
								{spouse.name}
							</Typography>
						</>
					)}
				</Box>
			</Box>
		</foreignObject>
	);
};

export default Node;