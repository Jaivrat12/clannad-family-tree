import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalOverflow from '@mui/joy/ModalOverflow';
import Typography from '@mui/joy/Typography';

const JoyModal = ({ isOpen, onClose, title, maxWidth, children }) => {

    return (

        <Modal
            open={isOpen}
            onClose={onClose}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ModalOverflow>
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

                    <Typography level="title-lg">
                        {title}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {children}
                </ModalDialog>
            </ModalOverflow>
        </Modal>
    );
}

export default JoyModal;