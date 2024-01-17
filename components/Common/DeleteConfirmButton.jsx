import { useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import JoyModal from './JoyModal';

const DeleteConfirmButton = ({ title, itemName, onConfirm, isLoading }) => {

    const [showModal, setShowModal] = useState(false);
    const closeModal = () => setShowModal(false);

    return (

        <>
            <Tooltip title={title}>
                <IconButton
                    size="sm"
                    color="danger"
                    variant="soft"
                    onClick={() => setShowModal(true)}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <JoyModal
                maxWidth="320px"
                title={title}
                isOpen={showModal}
                onClose={!isLoading ? closeModal : undefined}
            >
                <Typography>
                    Are you sure you want to delete{' '}
                    <Typography fontWeight="bold">
                        {itemName}
                    </Typography>?
                </Typography>

                <Box
                    display="flex"
                    justifyContent="end"
                    gap={1}
                >
                    <Button
                        color="danger"
                        variant="soft"
                        onClick={onConfirm}
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
            </JoyModal>
        </>
    );
}

export default DeleteConfirmButton;