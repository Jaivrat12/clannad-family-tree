import { Fragment, useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import ListDivider from '@mui/joy/ListDivider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import MemberForm from './Member/MemberForm';
import Alert from './Common/Alert';
import JoyModal from './Common/JoyModal';
import { useCreateMemberMutation } from 'services/workspace';

const MembersList = ({
    title,
    members,
    onClick,
    disableCreate,
    workspaceId,
    open,
    onClose,
    memberCategory,
    setMemberCategory,
    memberCategories,
}) => {

    const [query, setQuery] = useState('');
    const filteredMembers = members.filter(({ name }) => {
        return name.toLowerCase().includes(query.toLowerCase());
    });

    const alertInit = { msg: '', severity: '' };
    const [alert, setAlert] = useState(alertInit);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const openFormModal = () => setFormModalOpen(true);
    const closeFormModal = () => setFormModalOpen(false);

    const [createMember, {
        isLoading: isCreatingMember
    }] = useCreateMemberMutation();
    const handleCreate = async (member) => {

        const formData = new FormData();
        member.image = member.image?.[0];
        for (const key in member) {
            if (member[key] !== undefined && member[key] !== null) {
                formData.append(key, member[key]);
            }
        }

        setAlert(alertInit);
        const result = await createMember({
            workspaceId,
            member: formData
        });
        try {
            if (result.data?.success) {
                setAlert({
                    severity: 'success',
                    msg: `New member "${result.data.member.name}" created successfully!`,
                });
                setFormModalOpen(false);
            } else if (result.error) {
                setAlert({
                    severity: 'error',
                    msg: result.error.data?.error ?? 'Something went wrong!',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <>
            {alert.msg && (
                <Alert
                    msg={alert.msg}
                    severity={alert.severity}
                    autoHide
                />
            )}

            <JoyModal
                isOpen={formModalOpen}
                onClose={closeFormModal}
                title="New Member"
                maxWidth={600}
            >
                <MemberForm
                    mode="create"
                    onSubmit={handleCreate}
                    isLoading={isCreatingMember}
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

                    <Typography level="title-lg">
                        {title}
                    </Typography>

                    <Divider sx={{ mb: 1 }} />

                    <Box>
                        <Input
                            placeholder="Search for members..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                            sx={{ mb: 1 }}
                        />

                        {!!memberCategories && (
                            <RadioGroup
                                name="member-category"
                                aria-labelledby="member-category"
                                orientation="horizontal"
                                sx={{
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                {memberCategories.map(({ key, label }) => {
                                    const checked = memberCategory === key;
                                    return (
                                        <Chip
                                            key={key}
                                            color={checked ? 'primary' : 'neutral'}
                                            size="sm"
                                        >
                                            <Radio
                                                disableIcon
                                                overlay
                                                label={label}
                                                value={key}
                                                checked={checked}
                                                size="sm"
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setMemberCategory(key);
                                                    }
                                                }}
                                            />
                                        </Chip>
                                    );
                                })}
                            </RadioGroup>
                        )}

                        <Typography level="title-sm">
                            Showing {filteredMembers.length} member{filteredMembers.length !== 1 && 's'}
                        </Typography>
                    </Box>

                    {filteredMembers.length ? (
                        <Sheet
                            variant="outlined"
                            sx={{
                                borderRadius: 'md',
                                overflowY: 'scroll',
                            }}
                        >
                            <List
                                sx={{
                                    '--ListItemDecorator-size': '52px',
                                }}
                            >
                                {filteredMembers.map((member, i) => (

                                    <Fragment key={member._id}>
                                        <ListItem>
                                            <ListItemButton onClick={() => onClick(member)}>
                                                <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                                                    <Avatar src={member.image} />
                                                </ListItemDecorator>

                                                <ListItemContent>
                                                    <Typography level="title-md">
                                                        {member.name}
                                                    </Typography>
                                                </ListItemContent>
                                            </ListItemButton>
                                        </ListItem>

                                        {filteredMembers.length - 1 > i && (
                                            <ListDivider inset="startContent" />
                                        )}
                                    </Fragment>
                                ))}
                            </List>
                        </Sheet>
                    ) : (
                        <Typography textAlign="center">
                            No members found
                        </Typography>
                    )}

                    {!disableCreate && (
                        <Button
                            onClick={() => openFormModal()}
                            sx={{ mt: 1 }}
                        >
                            New Member
                        </Button>
                    )}
                </ModalDialog>
            </Modal>
        </>
    );
};

export default MembersList;