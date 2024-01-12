import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import { useColorScheme } from '@mui/joy/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ThemeToggleButton = () => {

    const { mode, setMode } = useColorScheme();
    const isDark = mode === 'dark';
    return (

        <Tooltip
            title={`${isDark ? 'Light' : 'Dark'} Mode`}
            variant="soft"
        >
            <IconButton
                variant="soft"
                color={isDark ? 'warning' : 'primary'}
                onClick={() => setMode(isDark ? 'light' : 'dark')}
                sx={{ borderRadius: '50%' }}
            >
                {isDark ? (
                    <LightModeIcon />
                ) : (
                    <DarkModeIcon />
                )}
            </IconButton>
        </Tooltip>
    );
}

export default ThemeToggleButton;