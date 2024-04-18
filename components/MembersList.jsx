import { Fragment, useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Input from '@mui/joy/Input';
import JoyListItem from '@mui/joy/ListItem';
import ListDivider from '@mui/joy/ListDivider';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Skeleton from '@mui/joy/Skeleton';
import Typography from '@mui/joy/Typography';
import MemberForm from './Member/MemberForm';
import Alert from './Common/Alert';
import Modal from './Common/Modal';
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
    isLoading = false,
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

    const ListItem = ({ member, children }) => onClick ? (
        <JoyListItem>
            <ListItemButton
                onClick={() => onClick(member)}
                sx={{ py: 1 }}
            >
                {children}
            </ListItemButton>
        </JoyListItem>
    ) : (
        <JoyListItem sx={{ py: 1 }}>
            {children}
        </JoyListItem>
    );

    return (

        <>
            {alert.msg && (
                <Alert
                    msg={alert.msg}
                    severity={alert.severity}
                    autoHide
                />
            )}

            <Modal
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
            </Modal>

            <Modal
                title={title}
                isOpen={open}
                onClose={onClose}
                maxWidth={360}
            >
                {!isLoading ? (
                    <Box>
                        <Input
                            placeholder="Search for members..."
                            type="search"
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

                        <Typography level="title-sm" mb={1}>
                            Showing {filteredMembers.length} member{filteredMembers.length !== 1 && 's'}
                        </Typography>
                    </Box>
                ) : (
                    <Typography level="title-md">
                        Loading members...
                    </Typography>
                )}

                {isLoading ? (
                    <Sheet
                        variant="outlined"
                        sx={{
                            maxHeight: 320,
                            overflowY: 'scroll',
                            borderRadius: 'md',
                        }}
                    >
                        <List
                            sx={{
                                '--ListItemDecorator-size': '52px',
                            }}
                        >
                            {Array(3).fill({}).map((_, i) => (

                                <Fragment key={i}>
                                    <ListItem>
                                        <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                                            <Avatar>
                                                <Skeleton />
                                            </Avatar>
                                        </ListItemDecorator>

                                        <ListItemContent>
                                            <Typography level="title-md">
                                                <Skeleton>
                                                    Some Name is Loading...
                                                </Skeleton>
                                            </Typography>
                                        </ListItemContent>
                                    </ListItem>

                                    {i < 2 && (
                                        <ListDivider inset="startContent" />
                                    )}
                                </Fragment>
                            ))}
                        </List>
                    </Sheet>
                ) : filteredMembers.length ? (
                    <Sheet
                        variant="outlined"
                        sx={{
                            maxHeight: 320,
                            overflowY: 'scroll',
                            borderRadius: 'md',
                        }}
                    >
                        <List
                            sx={{
                                '--ListItemDecorator-size': '52px',
                            }}
                        >
                            {filteredMembers.map((member, i) => (

                                <Fragment key={member._id}>
                                    <ListItem member={member}>
                                        <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                                            <Avatar
                                                src={member.image ?? (member.gender === 'male'
                                                    ? '/members/images/default-male.png'
                                                    : '/members/images/default-female.png'
                                                )}
                                            />
                                        </ListItemDecorator>

                                        <ListItemContent>
                                            <Typography level="title-md">
                                                {member.name}
                                            </Typography>
                                        </ListItemContent>
                                    </ListItem>

                                    {filteredMembers.length - 1 > i && (
                                        <ListDivider
                                            inset="startContent"
                                            sx={{ my: 0 }}
                                        />
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

                {!isLoading && !disableCreate && (
                    <Button
                        onClick={() => openFormModal()}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        New Member
                    </Button>
                )}
            </Modal>
        </>
    );
};

export default MembersList;