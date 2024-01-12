import Link from 'next/link';
import { useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import EditIcon from '@mui/icons-material/Edit';
import FamilyForm from './Family/FamilyForm';
import Alert from './Common/Alert';
import DeleteConfirmButton from './Common/DeleteConfirmButton';
import JoyModal from './Common/JoyModal';
import {
    useCreateFamilyMutation,
    useDeleteFamilyMutation,
    useUpdateFamilyMutation,
} from 'services/workspace';

const Workspace = ({ workspace, open, onClose }) => {

    const [family, setFamily] = useState(null);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const openFormModal = (family) => {
        setFormModalOpen(true);
        family && setFamily(family);
    };

    const closeFormModal = () => {
        setFormModalOpen(false);
        setFamily(null);
    };

    const [createFamily, {
        data: createFamilyData,
        error: createFamilyError,
        isLoading: isCreatingFamily,
    }] = useCreateFamilyMutation();
    const handleCreate = async (family) => {

        const result = await createFamily({
            workspaceId: workspace._id,
            family
        });
        try {
            if (result.data.success) {
                closeFormModal();
            }
        } catch (error) {
            console.log(error);
            console.log(createFamilyError);
        }
    };

    const [updateFamily, {
        data: updateFamilyData,
        error: updateFamilyError,
        isLoading: isUpdatingFamily,
    }] = useUpdateFamilyMutation();
    const handleUpdate = async (updates) => {

        const result = await updateFamily({
            id: family._id,
            updates,
        });
        try {
            if (result.data.success) {
                closeFormModal();
            }
        } catch (error) {
            console.log(error);
            console.log(updateFamilyError);
        }
    };

    const [deleteFamily, {
        data: deleteFamilyData,
        error: deleteFamilyError,
        isLoading: isDeletingFamily,
    }] = useDeleteFamilyMutation();
    const handleDelete = async (id) => {
        const result = await deleteFamily(id);
        try {
            if (result.data.success) {
                closeFormModal();
            }
        } catch (error) {
            console.log(error);
            console.log(deleteFamilyError);
        }
    };

    return (

        <>
            {createFamilyData?.success && (
                <Alert
                    msg={`New family created successfully!`}
                    severity="success"
                    autoHide
                />
            )}

            {updateFamilyData?.success && (
                <Alert
                    msg={`Family "${updateFamilyData.data.name}" updated successfully!`}
                    severity="success"
                    autoHide
                />
            )}

            {deleteFamilyData?.success && (
                <Alert
                    msg={`Family deleted successfully!`}
                    severity="success"
                    autoHide
                />
            )}

            <JoyModal
                isOpen={formModalOpen}
                onClose={closeFormModal}
                title={!family ? 'New Family' : 'Edit Family'}
                maxWidth={600}
            >
                <FamilyForm
                    mode={!family ? 'create' : 'edit'}
                    data={family}
                    onSubmit={!family ? handleCreate : handleUpdate}
                    isLoading={isCreatingFamily || isUpdatingFamily}
                />
            </JoyModal>

            <Modal
                open={open}
                onClose={onClose}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ModalDialog
                    variant="outlined"
                    sx={{
                        width: 360,
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

                    <Typography level="title-lg">
                        {workspace.name} Families
                    </Typography>

                    <Divider />

                    {workspace.families.length ? (

                        <List
                            sx={{
                                '--ListItemDecorator-size': '48px',
                                overflowY: 'scroll',
                            }}
                        >
                            {workspace.families.map((family) => (

                                <ListItem key={family._id}>
                                    <ListItemDecorator>
                                        <Link
                                            href={`/tree/${family._id}`}
                                            onClick={onClose}
                                        >
                                            <Avatar src={family.root?.image} />
                                        </Link>
                                    </ListItemDecorator>

                                    <ListItemContent>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="start"
                                        >
                                            <Link
                                                href={`/tree/${family._id}`}
                                                onClick={onClose}
                                            >
                                                <Typography level="title-md">
                                                    {family.name}
                                                </Typography>

                                                <Typography level="body-sm" fontWeight="500">
                                                    {family.root?.name}
                                                </Typography>
                                            </Link>

                                            <Box
                                                display="flex"
                                                gap={1}
                                            >
                                                <IconButton
                                                    color="primary"
                                                    variant="soft"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openFormModal(family);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>

                                                <DeleteConfirmButton
                                                    title="Delete Family"
                                                    itemName={family.name}
                                                    onConfirm={() => handleDelete(family._id)}
                                                    isLoading={isDeletingFamily}
                                                />
                                            </Box>
                                        </Box>
                                    </ListItemContent>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>
                            This workspace has no families yet!
                        </Typography>
                    )}

                    <Button
                        onClick={() => openFormModal()}
                        sx={{ mt: 1 }}
                    >
                        New Family
                    </Button>
                </ModalDialog>
            </Modal>
        </>
    );
};

export default Workspace;