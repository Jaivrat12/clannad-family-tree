import { useState } from 'react';
import IconButton from '@mui/joy/IconButton';
import Snackbar from '@mui/joy/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const Alert = ({
    msg,
    severity,
    autoHide = false,
}) => {

    const isSuccess = severity === 'success';
    const { color, startIcon } = {
        color: isSuccess ? 'success' : 'danger',
        startIcon: isSuccess ? <TaskAltIcon /> : <ErrorOutlineIcon />,
    };

    const [isOpen, setIsOpen] = useState(true);
    const onClose = () => setIsOpen(false);

    return (

        <Snackbar
            color={color}
            variant="soft"
            open={isOpen}
            onClose={onClose}
            autoHideDuration={autoHide ? 3000 : null}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            startDecorator={startIcon}
            endDecorator={(
                <IconButton
                    color={color}
                    onClick={onClose}
                    sx={{ borderRadius: '50%' }}
                >
                    <CloseIcon />
                </IconButton>
            )}
        >
            {msg}
        </Snackbar>
    );
};

export default Alert;