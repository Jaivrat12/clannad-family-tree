import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

const BasicProfileInfo = ({ name, image, gender, dob, dod, avatarProps }) => {

    const formatter = Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium'
    });
    const formateDate = (date) => formatter.format(new Date(date));

    const getAge = (dob, dod) => {
        const birthYear = new Date(dob).getFullYear();
        const deathYear = new Date(dod).getFullYear();
        const presentYear = new Date().getFullYear();
        if (!dod) {
            return presentYear - birthYear;
        }
        return deathYear - birthYear;
    };

    const formatAgeAndBirthDate = (dob, dod) => {

        if (!dob) {
            return;
        }

        const age = `${getAge(dob, dod)} years old`;
        const birthDate = `🎂 ${formateDate(dob)}`;
        return `${age} | ${birthDate}`;
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
        >
            <Avatar
                src={image ?? (gender === 'male'
                    ? '/members/images/default-male.png'
                    : '/members/images/default-female.png'
                )}
                {...avatarProps}
            />

            <Box>
                <Typography
                    level="title-lg"
                    endDecorator={gender === 'male' ? (
                        <MaleIcon
                            color="primary"
                            sx={{ fontSize: '1.35rem' }}
                        />
                    ) : (
                        <FemaleIcon
                            sx={{
                                color: 'hotpink',
                                fontSize: '1.35rem',
                            }}
                        />
                    )}
                >
                    {name}
                </Typography>

                {/* <Typography
                    textColor="text.tertiary"
                    fontSize="small"
                    fontWeight="lg"
                >
                    {`#${_id}`}
                </Typography> */}

                <Typography
                    textColor="text.tertiary"
                    fontSize="small"
                >
                    {formatAgeAndBirthDate(dob, dod)}
                    <br />
                    {dod && (
                        <Typography textColor="text.tertiary">
                            🪦 Died on {formateDate(dod)} {/* 💐 */}
                        </Typography>
                    )}
                </Typography>
            </Box>
        </Box>
    )
};

export default BasicProfileInfo;