import { useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import MemberForm from './Member/MemberForm';
import MuiModal from './Common/MuiModal';
import { useCreateMemberMutation } from 'services/workspace';

const MembersList = ({
    title,
    members,
    onClick,
    disableCreate,
    workspaceId,
    open,
    onClose,
}) => {

    const [query, setQuery] = useState('');

    const matchesSearch = (str) => {
        const regex = new RegExp(query, 'i');
        return regex.test(str);
    };

    const [formModalOpen, setFormModalOpen] = useState(false);
	const openFormModal = () => setFormModalOpen(true);
	const closeFormModal = () => setFormModalOpen(false);

    const [createMember] = useCreateMemberMutation();
    const handleCreate = async (member) => {

        const formData = new FormData();
        member.image = member.image?.[0];
        for (const key in member) {
            if (member[key] !== undefined && member[key] !== null) {
                formData.append(key, member[key]);
            }
        }

        const result = await createMember({
            workspaceId,
            member: formData
        });
		if (result.data.success) {
			setFormModalOpen(false);
		}
    };

    return (

        <>
			<MuiModal
				isOpen={ formModalOpen }
				onClose={ closeFormModal }
				title="New Member"
                maxWidth={600}
			>
				<MemberForm
                    mode="create"
                    onSubmit={ handleCreate }
                />
			</MuiModal>

            {/* { !formModalOpen && ( */}

                <Modal
                    open={ open }
                    onClose={ onClose }
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ModalDialog
                        variant="outlined"
                        sx={{
                            maxWidth: 360,
                            width: '95%',
                            maxHeight: '75%',
                            p: 3,
                            borderRadius: 'md',
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
                            { title }
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Input
                            placeholder="Search for members..."
                            value={ query }
                            onChange={ (e) => setQuery(e.target.value) }
                            autoFocus
                            sx={{ mb: 2 }}
                        />

                        { members.length ? (

                            <List
                                sx={{
                                    '--List-decoratorSize': '56px',
                                    overflowY: 'scroll',
                                }}
                            >
                                { members.map((member) => matchesSearch(member.name) && (

                                    <ListItem
                                        key={ member._id }
                                        onClick={ () => onClick(member) }
                                        // sx={{ borderBottom: '1px solid #3331' }}
                                    >
                                        <ListItemButton
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                            }}
                                        >
                                            <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                                                <Avatar src={ member.image } />
                                            </ListItemDecorator>

                                            <ListItemContent>
                                                <Typography>
                                                    { member.name }
                                                </Typography>
                                            </ListItemContent>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography textAlign="center">
                                No members found
                            </Typography>
                        )}

                        { !disableCreate && (
                            <Button
                                onClick={ () => openFormModal() }
                                sx={{ mt: 3 }}
                            >
                                New Member
                            </Button>
                        )}
                    </ModalDialog>
                </Modal>
            {/* )} */}
        </>
    );
};

export default MembersList;