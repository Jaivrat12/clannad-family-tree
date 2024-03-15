import { useState } from 'react';
import IconButton from '@mui/joy/IconButton';
import Snackbar from '@mui/joy/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const Alert = ({
    msg,
    severity,
    autoHide = false,
    endDecoratorIcon = <CloseIcon />,
    onEndDecoratorClick,
}) => {

    const severityToColor = {
        success: 'success',
        error: 'danger',
        info: 'primary',
    }
    const severityToIcon = {
        success: <TaskAltIcon />,
        error: <ErrorOutlineIcon />,
        info: <InfoOutlinedIcon />,
    }
    const { color, startIcon } = {
        color: severityToColor[severity],
        startIcon: severityToIcon[severity],
    };

    const [isOpen, setIsOpen] = useState(true);
    const onEndDecoratorBtnClick = onEndDecoratorClick ?? (() => setIsOpen(false));

    return (

        <Snackbar
            color={color}
            variant="soft"
            open={isOpen}
            onClose={(_, reason) => {
                if (autoHide && reason === 'timeout') {
                    setIsOpen(false);
                }
            }}
            autoHideDuration={autoHide ? 3000 : null}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            startDecorator={startIcon}
            endDecorator={(
                <IconButton
                    color={color}
                    onClick={onEndDecoratorBtnClick}
                    sx={{ borderRadius: '50%' }}
                >
                    {endDecoratorIcon}
                </IconButton>
            )}
        >
            {msg}
        </Snackbar>
    );
};

export default Alert;