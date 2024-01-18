import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import { useColorScheme } from '@mui/joy/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ThemeToggleButton = () => {

	const { mode, systemMode, setMode} = useColorScheme();
	const isDarkMode = [mode, systemMode].includes('dark');
    return (

        <Tooltip title={`${isDarkMode ? 'Light' : 'Dark'} Mode`}>
            <IconButton
                variant="soft"
                color={isDarkMode ? 'warning' : 'primary'}
                onClick={() => setMode(isDarkMode ? 'light' : 'dark')}
                sx={{ borderRadius: '50%' }}
            >
                {isDarkMode ? (
                    <LightModeIcon />
                ) : (
                    <DarkModeIcon />
                )}
            </IconButton>
        </Tooltip>
    );
}

export default ThemeToggleButton;