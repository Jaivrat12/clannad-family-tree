import { useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Modal from './Modal';

const DeleteConfirmButton = ({
    title,
    itemName,
    onConfirm,
    isLoading,
    preventDefault = false,
    stopPropagation = false,
}) => {

    const onClickEvent = (e) => {
        preventDefault && e.preventDefault();
        stopPropagation && e.stopPropagation();
    };

    const [showModal, setShowModal] = useState(false);
    const closeModal = (e) => {
        onClickEvent(e);
        setShowModal(false)
    };

    return (

        <>
            <Tooltip title={title}>
                <IconButton
                    size="sm"
                    color="danger"
                    variant="soft"
                    onClick={(e) => {
                        onClickEvent(e);
                        setShowModal(true);
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <Modal
                maxWidth="320px"
                title={title}
                isOpen={showModal}
                onClose={!isLoading ? closeModal : undefined}
            >
                <Typography
                    sx={{ wordWrap: 'break-word' }}
                >
                    Are you sure you want to delete{' '}
                    <Typography fontWeight="bold">
                        {itemName}
                    </Typography>?
                </Typography>

                <Box
                    display="flex"
                    justifyContent="end"
                    gap={1}
                    mt={2}
                >
                    <Button
                        color="danger"
                        variant="soft"
                        onClick={(e) => {
                            onClickEvent(e);
                            onConfirm();
                        }}
                        loading={isLoading}
                        startDecorator={<DeleteIcon />}
                        loadingPosition="start"
                    >
                        Delete
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={closeModal}
                        startDecorator={<CloseIcon />}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default DeleteConfirmButton;