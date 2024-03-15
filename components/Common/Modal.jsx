import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import JoyModal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalOverflow from '@mui/joy/ModalOverflow';
import Typography from '@mui/joy/Typography';

const Modal = ({
    isOpen,
    onClose,
    title,
    maxWidth,
    contentScrollX = false,
    contentScrollY = false,
    children,
}) => {

    const content = (
        <ModalDialog
            variant="outlined"
            sx={{
                width: '95%',
                maxWidth,
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
                outline: 'none',
            }}
        >
            {onClose && (
                <ModalClose
                    variant="outlined"
                    sx={{
                        top: 'calc(-1/4 * var(--IconButton-size))',
                        right: 'calc(-1/4 * var(--IconButton-size))',
                        boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                        borderRadius: '50%',
                        bgcolor: 'background.body',
                    }}
                />
            )}

            {title && (
                <>
                    <Typography level="title-lg">
                        {title}
                    </Typography>

                    <Divider />
                </>
            )}

            <Box
                sx={{
                    overflowX: contentScrollX ? 'scroll' : 'initial',
                    overflowY: contentScrollY ? 'scroll' : 'initial',
                }}
            >
                {children}
            </Box>
        </ModalDialog>
    );

    return (

        <JoyModal
            open={isOpen}
            onClose={onClose}
        >
            {contentScrollY ? content : (
                <ModalOverflow>
                    {content}
                </ModalOverflow>
            )}
        </JoyModal>
    );
}

export default Modal;