import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import EditIcon from '@mui/icons-material/Edit';
import FamilyForm from './Family/FamilyForm';
import Alert from './Common/Alert';
import DeleteConfirmButton from './Common/DeleteConfirmButton';
import Modal from './Common/Modal';
import {
    useCreateFamilyMutation,
    useDeleteFamilyMutation,
    useUpdateFamilyMutation,
} from 'services/workspace';

const Workspace = ({
    workspace,
    open,
    onClose,
    readOnly = false,
}) => {

    const router = useRouter();
	const { familyId } = router.query;

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
                router.push(`/tree/${result.data.family._id}`);
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

            <Modal
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
            </Modal>

            <Modal
                title={`${workspace.name} Families`}
                isOpen={open}
                onClose={onClose}
                maxWidth={360}
            >
                {workspace.families.length ? (

                    <List
                        sx={{
                            '--ListItemDecorator-size': '48px',
                            maxHeight: 320,
                            overflowY: 'scroll',
                        }}
                    >
                        {workspace.families.map((family) => (

                            <ListItem key={family._id}>
                                <ListItemButton
                                    component={Link}
                                    href={`/tree/${family._id}`}
                                    selected={familyId === family._id}
                                    onClick={onClose}
                                >
                                    <ListItemDecorator>
                                        <Avatar
                                            src={family.root?.image ?? (family.root ? (family.root.gender === 'male'
                                                ? '/members/images/default-male.png'
                                                : '/members/images/default-female.png'
                                            ) : '')}
                                        />
                                    </ListItemDecorator>

                                    <ListItemContent>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            <Tooltip
                                                enterDelay={1000}
                                                followCursor
                                                title={(
                                                    <>
                                                        <Typography level="title-md">
                                                            {family.name}
                                                        </Typography>

                                                        <Typography level="body-sm" fontWeight="500">
                                                            {family.root?.name}
                                                        </Typography>
                                                    </>
                                                )}
                                            >
                                                <Box
                                                    flexGrow={1}
                                                    sx={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        maxWidth: '100%',
                                                    }}
                                                >
                                                    <Typography level="title-md">
                                                        {family.name}
                                                    </Typography>

                                                    <Typography level="body-sm" fontWeight="500">
                                                        {family.root?.name}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>

                                            {!readOnly && (
                                                <Box
                                                    display="flex"
                                                    gap={1}
                                                >
                                                    <Tooltip title="Edit Family">
                                                        <IconButton
                                                            color="primary"
                                                            variant="soft"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                openFormModal(family);
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <DeleteConfirmButton
                                                        title="Delete Family"
                                                        itemName={family.name}
                                                        onConfirm={() => handleDelete(family._id)}
                                                        isLoading={isDeletingFamily}
                                                        preventDefault
                                                        stopPropagation
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    </ListItemContent>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>
                        This workspace has no families yet!
                    </Typography>
                )}

                {!readOnly && (
                    <Button
                        onClick={() => openFormModal()}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        New Family
                    </Button>
                )}
            </Modal>
        </>
    );
};

export default Workspace;