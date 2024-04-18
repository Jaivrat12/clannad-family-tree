import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import JoyLink from '@mui/joy/Link';
import Skeleton from '@mui/joy/Skeleton';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import EditIcon from '@mui/icons-material/Edit';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import Workspace from 'components/Workspace';
import Alert from './Common/Alert';
import DeleteConfirmButton from 'components/Common/DeleteConfirmButton';
import HorizontalScrollbar from './Common/HorizontalScrollbar';
import { useDeleteWorkspaceMutation } from 'services/workspace';

const MAX_DESCRIPTION_LENGTH = 200;

const WorkspaceCard = ({ workspace, openFormModal, isLoading }) => {

    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const toggleDescriptionExpanded = (e) => {
        e?.stopPropagation();
        setDescriptionExpanded(val => !val);
    }

    let description = workspace.description ?? '';
    const isDescriptionLong = description.length > MAX_DESCRIPTION_LENGTH;
    if (!descriptionExpanded && isDescriptionLong) {
        description = description
            .replaceAll(/\s+/g, ' ')
            .slice(0, MAX_DESCRIPTION_LENGTH)
            .trim() + '...';
    }

    const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
    const openWorkspaceModal = () => setWorkspaceModalOpen(true);
    const closeWorkspaceModal = () => setWorkspaceModalOpen(false);

    const [deleteWorkspace, {
        data: deleteWorkspaceData,
        error: deleteWorkspaceError,
        isLoading: isDeletingWorkspace,
    }] = useDeleteWorkspaceMutation();
    const handleDelete = async (id) => {

        try {
            await deleteWorkspace(id);
        } catch (error) {
            // ! couldn't connect to net/server
            console.log(error);
            console.log(deleteWorkspaceError);
        }
    };

    return (

        <>
            {deleteWorkspaceData?.success && (
                <Alert
                    msg={`Workspace "${deleteWorkspaceData.data.name}" deleted successfully!`}
                    severity="success"
                    autoHide
                />
            )}

            {workspaceModalOpen && (
                <Workspace
                    open={workspaceModalOpen}
                    onClose={closeWorkspaceModal}
                    workspace={workspace}
                />
            )}

            <Card
                variant="outlined"
                sx={{
                    gap: 1.5,
                    boxShadow: 'md',
                    overflow: 'hidden',
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <AspectRatio
                        ratio="1"
                        sx={{ width: 40 }}
                    >
                        <Skeleton loading={isLoading}>
                            <Image
                                src={
                                    workspace.image
                                    ?? workspace.families?.[0]?.root?.image
                                    ?? '/static/images/default-workspace.jpg'
                                }
                                alt=""
                                width={90}
                                height={90}
                            />
                        </Skeleton>
                    </AspectRatio>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                        width="100%"
                    >
                        <Typography level="title-lg" width="100%">
                            {isLoading ? (
                                <Skeleton
                                    variant="text"
                                    width="90%"
                                    level="title-lg"
                                />
                            ) : (
                                workspace.name
                            )}
                        </Typography>

                        <Box
                            display="flex"
                            gap={1}
                        >
                            {isLoading ? Array(3).fill({}).map((_, i) => (
                                <IconButton key={i}>
                                    <Skeleton />
                                    <FamilyRestroomIcon />
                                </IconButton>
                            )) : (
                                <>
                                    <Tooltip title="Show All Familes">
                                        <IconButton
                                            variant="soft"
                                            color="success"
                                            fontSize="sm"
                                            onClick={openWorkspaceModal}
                                        >
                                            <FamilyRestroomIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Edit Workspace">
                                        <IconButton
                                            size="sm"
                                            color="primary"
                                            variant="soft"
                                            onClick={() => openFormModal(workspace)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <DeleteConfirmButton
                                        title="Delete Workspace"
                                        itemName={workspace.name}
                                        onConfirm={() => handleDelete(workspace._id)}
                                        isLoading={isDeletingWorkspace}
                                    />
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>

                {isLoading ? (
                    <Box>
                        <Skeleton level="body-sm" variant="text" width="92%" />
                        <Skeleton level="body-sm" variant="text" width="99%" />
                        <Skeleton level="body-sm" variant="text" width="96%" />
                    </Box>
                ) : description.trim() && (
                    <Typography
                        level="body-sm"
                        fontWeight="500"
                        whiteSpace="break-spaces"
                        {...(isDescriptionLong && {
                            onClick: toggleDescriptionExpanded,
                            sx: { cursor: 'pointer' }
                        })}
                        {...(!description && {
                            textColor: !description && 'neutral.500',
                            fontStyle: 'italic'
                        })}
                    >
                        {description} {isDescriptionLong && (
                            <JoyLink underline="none">
                                Read {descriptionExpanded ? 'Less' : 'More'}
                            </JoyLink>
                        )}
                    </Typography>
                )}

                {isLoading ? (
                    <Box
                        display="flex"
                        gap={0.75}
                    >
                        {Array(3).fill({}).map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="inline"
                                width="8rem"
                                height="1.5rem"
                                sx={{ borderRadius: '5rem' }}
                            />
                        ))}
                    </Box>
                ) : workspace.families.length > 0 && (

                    <HorizontalScrollbar>
                        <Box
                            display="flex"
                            gap={0.75}
                        >
                            {workspace.families.map((family) => (

                                <Link
                                    key={family._id}
                                    href={`/tree/${family._id}`}
                                >
                                    <Chip
                                        color="success"
                                        startDecorator={
                                            <Avatar
                                                src={family.root?.image ?? (family.root ? (family.root.gender === 'male'
                                                    ? '/members/images/default-male.png'
                                                    : '/members/images/default-female.png'
                                                ) : '')}
                                            />
                                        }
                                    >
                                        {family.name}
                                    </Chip>
                                </Link>
                            ))}
                        </Box>
                    </HorizontalScrollbar>
                )}
            </Card>
        </>
    );
}

export default WorkspaceCard;