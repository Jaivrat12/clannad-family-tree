import Link from 'next/link';
import { useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { IconButton } from '@mui/joy';
import { Edit } from '@mui/icons-material';
import FamilyForm from './Family/FamilyForm';
import MuiModal from './Common/MuiModal';
import { useCreateFamilyMutation, useUpdateFamilyMutation } from 'services/workspace';

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

    const [createFamily] = useCreateFamilyMutation();
    const handleCreate = async (family) => {

        const result = await createFamily({
            workspaceId: workspace._id,
            family
        });
		if (result.data.success) {
			closeFormModal();
		}
    };

    const [updateFamily] = useUpdateFamilyMutation();
    const handleUpdate = async (updates) => {

        const result = await updateFamily({
            id: family._id,
            updates,
        });
		if (result.data.success) {
			closeFormModal();
		}
    };

    return (

        <>
            <MuiModal
                isOpen={ formModalOpen }
                onClose={ closeFormModal }
				title={ !family ? 'New Family' : 'Edit Family' }
                maxWidth={ 600 }
            >
                <FamilyForm
					mode={ !family ? 'create' : 'edit' }
                    data={ family }
                    onSubmit={ !family ? handleCreate : handleUpdate }
                />
            </MuiModal>

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

                    <Typography
                        level="h6"
                        fontWeight={600}
                    >
                        { workspace.name } Families
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    { workspace.families.length ? (

                        <List
                            sx={{
                                '--List-decoratorSize': '56px',
                                overflowY: 'scroll',
                            }}
                        >
                            { workspace.families.map((family) => (

                                <ListItem key={ family._id }>
                                    <Box
                                        width="100%"
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                                            <Link
                                                href={ `/tree/${ family._id }` }
                                                onClick={ onClose }
                                            >
                                                <Avatar src={ family.root?.image } />
                                            </Link>
                                        </ListItemDecorator>

                                        <ListItemContent>
                                            <div className="flex align-items-start justify-content-between">
                                                <Link
                                                    href={ `/tree/${ family._id }` }
                                                    onClick={ onClose }
                                                >
                                                    <div>
                                                        <Typography>
                                                            { family.name } Family
                                                        </Typography>

                                                        <Typography level="body2">
                                                            { family.root?.name }
                                                        </Typography>
                                                    </div>
                                                </Link>

                                                <div className="flex gap-1">
                                                    <IconButton
                                                        size="sm"
                                                        onClick={ (e) => {
                                                            e.preventDefault();
                                                            openFormModal(family);
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>

                                                    {/* <Button
                                                        size="small"
                                                        severity="danger"
                                                        icon={ PrimeIcons.TRASH }
                                                        onClick={ () => delteWorkspace(workspace._id) }
                                                        className="py-1"
                                                        disabled={ isLoading }
                                                    /> */}
                                                </div>
                                            </div>
                                        </ListItemContent>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>
                            This workspace has no families yet!
                        </Typography>
                    )}

                    <Button
                        onClick={ () => openFormModal() }
                        sx={{ mt: 3 }}
                    >
                        New Family
                    </Button>
                </ModalDialog>
            </Modal>
        </>
    );
};

export default Workspace;