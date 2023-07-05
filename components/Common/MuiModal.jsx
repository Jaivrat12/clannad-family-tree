import { Divider, Modal, ModalClose, ModalDialog, ModalOverflow, Typography } from '@mui/joy';

const MuiModal = ({ isOpen, onClose, title, maxWidth, children }) => {

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

                    <Typography
                        level="h6"
                        fontWeight={600}
                    >
                        {title}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {children}
                </ModalDialog>
            </ModalOverflow>
        </Modal>
    );
}

export default MuiModal;