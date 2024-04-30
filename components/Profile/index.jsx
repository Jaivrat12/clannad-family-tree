import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/joy/AvatarGroup';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import BasicProfileInfo from './BasicProfileInfo';
import ProfileActions from './ProfileActions';
import MemberForm from '../Member/MemberForm';
import Workspace from '../Workspace';
import Alert from '../Common/Alert';
import Modal from '../Common/Modal';
import {
    addMemberChild,
    addMemberSpouse,
    removeMemberChild,
    removeMemberSpouse,
    selectChildren,
    selectMember,
    selectSpouse,
    updateMemberDetails,
} from 'features/family/familySlice';

const genderMap = {
    male: 'Wife',
    female: 'Husband',
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * @typedef {Object} Attributes
 * @property {string} name
 * @property {string} image
 * @property {string} gender
 * @property {Date} dob
 * @property {Date} dod
 * @property {Attributes} spouse
 */

/**
 * @typedef {Object} Member
 * @property {string} name
 * @property {Attributes} attributes
 * @property {Member} children
 */

/**
 * @typedef {Object} ProfileProps
 * @property {Member} member
*/

/**
 * @param {ProfileProps} props
*/
const Profile = ({
    open,
    onClose,
    memberId,
    setMemberId,
    workspaceId,
}) => {

    const dispatch = useDispatch();

    const member = useSelector(selectMember(memberId));
    const spouse = useSelector(selectSpouse(memberId));
    const children = useSelector(selectChildren(memberId));

    const { _id, gender } = member;

    const [formModalOpen, setFormModalOpen] = useState(false);
    const openFormModal = () => setFormModalOpen(true);
    const closeFormModal = () => setFormModalOpen(false);

    const [familiesModalOpen, setFamiliesModalOpen] = useState(false);
    const openFamiliesModal = () => setFamiliesModalOpen(true);
    const closeFamiliesModal = () => setFamiliesModalOpen(false);

    const {
        data: families,
        isFetching: isFamiliesFetching,
    } = useQuery({
        queryKey: [`${_id}-families`],
        queryFn: () => axios.get(`${BASE_URL}/members/${_id}/families`, {
            withCredentials: true,
        }),
        select: (res) => {
            const { success, data } = res.data;
            return success ? data : null;
        },
        enabled: familiesModalOpen,
    });

    const [memberListType, setMemberListType] = useState('');
    const closeMembersList = () => setMemberListType('');

    const alertStateInit = {
        msg: '',
        severity: '',
    };
    const [alertState, setAlertState] = useState(alertStateInit);

    const [isUpdatingMember, setIsUpdatingMember] = useState(false);
    const updateDetails = (updates) => {

        setAlertState(alertStateInit);
        setIsUpdatingMember(true);

        const formData = new FormData();
        updates.image = updates.image?.[0];
        for (const key in updates) {
            if (updates[key] !== undefined/*  && updates[key] !== null */) {
                formData.append(key, updates[key] ?? '');
            }
        }

        const onSuccess = (data) => {
            closeFormModal();
            setAlertState({
                msg: `${data.member.name}'s details updated successfully!`,
                severity: 'success',
            });
        };
        const onError = (error) => {
            setAlertState({
                msg: error,
                severity: 'error',
            });
        };
        const onFinally = () => {
            setIsUpdatingMember(false);
        };
        dispatch(updateMemberDetails(memberId, formData, onSuccess, onError, onFinally));
    };

    const [isAddingSpouse, setIsAddingSpouse] = useState(false);
    const addSpouse = (spouseId) => {

        setAlertState(alertStateInit);
        setIsAddingSpouse(true);

        const onSuccess = (/* data */) => {
            setAlertState({
                msg: `Updated ${member.name}'s ${genderMap[member.gender]} successfully!`,
                severity: 'success',
            });
        };
        const onError = (error) => {
            setAlertState({
                msg: error,
                severity: 'error',
            });
        };
        const onFinally = () => {
            setIsAddingSpouse(false);
        };
        dispatch(addMemberSpouse(memberId, spouseId, onSuccess, onError, onFinally));
    };

    const [isRemovingSpouse, setIsRemovingSpouse] = useState(false);
    const removeSpouse = () => {

        setAlertState(alertStateInit);
        setIsRemovingSpouse(true);

        const onSuccess = (/* data */) => {
            setAlertState({
                msg: `Removed ${member.name}'s ${genderMap[member.gender]} successfully!`,
                severity: 'success',
            });
        };
        const onError = (error) => {
            setAlertState({
                msg: error,
                severity: 'error',
            });
        };
        const onFinally = () => {
            setIsRemovingSpouse(false);
        };
        dispatch(removeMemberSpouse(memberId, onSuccess, onError, onFinally));
    };

    const [isAddingChild, setIsAddingChild] = useState(false);
    const [isAddingParent, setIsAddingParent] = useState(false);
    const addChild = (memberId, childId, currMemberIsChild = false) => {

        setAlertState(alertStateInit);
        if (currMemberIsChild) {
            setIsAddingParent(true);
        } else {
            setIsAddingChild(true);
        }

        const onSuccess = (/* data */) => {
            setAlertState({
                msg: `Updated ${member.name}'s ${currMemberIsChild ? 'parent' : 'children'} successfully!`,
                severity: 'success',
            });
        };
        const onError = (error) => {
            setAlertState({
                msg: error,
                severity: 'error',
            });
        };
        const onFinally = () => {
            if (currMemberIsChild) {
                setIsAddingParent(false);
            } else {
                setIsAddingChild(false);
            }
        };
        dispatch(addMemberChild(memberId, childId, onSuccess, onError, onFinally));
    };

    const [isRemovingChild, setIsRemovingChild] = useState(false);
    const removeChild = (childId) => {

        setAlertState(alertStateInit);
        setIsRemovingChild(true);

        const onSuccess = (/* data */) => {
            setAlertState({
                msg: `Removed ${member.name}'s child successfully!`,
                severity: 'success',
            });
        };
        const onError = (error) => {
            setAlertState({
                msg: error,
                severity: 'error',
            });
        };
        const onFinally = () => {
            setIsRemovingChild(false);
        };
        dispatch(removeMemberChild(childId, onSuccess, onError, onFinally));
    };

    return (

        <>
            {!!alertState.msg && (
                <Alert
                    msg={alertState.msg}
                    severity={alertState.severity}
                    autoHide={alertState.severity === 'success'}
                />
            )}

            <Modal
                isOpen={formModalOpen}
                onClose={closeFormModal}
                title="Edit Member"
                maxWidth={600}
            >
                <MemberForm
                    mode="edit"
                    data={{
                        ...member,
                        dob: member.dob && new Date(member.dob),
                        dod: member.dod && new Date(member.dod),
                    }}
                    onSubmit={updateDetails}
                    isLoading={isUpdatingMember}
                />
            </Modal>

            <Modal
                isOpen={open}
                onClose={onClose}
                maxWidth={320}
            >
                <BasicProfileInfo {...member} />

                {spouse && (

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mt={1}
                    >
                        <Typography
                            textColor="text.tertiary"
                            fontSize="x-large"
                        >
                            💑
                        </Typography>

                        <BasicProfileInfo
                            {...spouse}
                            avatarProps={{
                                onClick: () => setMemberId(spouse._id),
                                sx: { cursor: 'pointer' },
                            }}
                        />
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box
                    display="flex"
                    gap={1}
                    sx={{ mb: 3 }}
                >
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={openFormModal}
                        fullWidth
                    >
                        Update Details
                    </Button>

                    <Button
                        variant="soft"
                        size="sm"
                        onClick={!spouse
                            ? () => setMemberListType('addSpouse')
                            : removeSpouse
                        }
                        loading={isAddingSpouse || isRemovingSpouse}
                        loadingPosition="start"
                        fullWidth
                    >
                        {!spouse
                            ? isAddingSpouse ? 'Adding' : 'Add'
                            : isRemovingSpouse ? 'Removing' : 'Remove'}
                        {' '}
                        {genderMap[gender]}
                    </Button>
                </Box>

                <Box
                    sx={{
                        mb: 1,
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        level="h6"
                        fontSize="md"
                        fontWeight="lg"
                    >
                        Children
                    </Typography>
                    <AvatarGroup
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        {children.map((child) => (
                            <Avatar
                                key={child._id}
                                src={child.image ?? (child.gender === 'male'
                                    ? '/members/images/default-male.png'
                                    : '/members/images/default-female.png'
                                )}
                                onClick={() => setMemberId(child._id)}
                                sx={{ cursor: 'pointer' }}
                            />
                        ))}
                    </AvatarGroup>
                </Box>

                <Box
                    display="flex"
                    gap={1}
                    sx={{ mb: 1 }}
                >
                    <Button
                        variant="soft"
                        color="success"
                        size="sm"
                        onClick={() => setMemberListType('addChild')}
                        loading={isAddingChild}
                        loadingPosition="start"
                        fullWidth
                    >
                        {isAddingChild ? 'Adding' : 'Add'} Child
                    </Button>

                    <Button
                        variant="soft"
                        color="danger"
                        size="sm"
                        onClick={() => setMemberListType('removeChild')}
                        disabled={children.length === 0}
                        loading={isRemovingChild}
                        loadingPosition="start"
                        fullWidth
                    >
                        {isRemovingChild ? 'Removing' : 'Remove'} Child
                    </Button>
                </Box>

                <Button
                    variant="soft"
                    color={!member.parent ? 'warning' : 'neutral'}
                    size="sm"
                    onClick={() => setMemberListType('addParent')}
                    disabled={!!member.parent}
                    loading={isAddingParent}
                    loadingPosition="start"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    {isAddingParent ? 'Adding' : 'Add'} Parent
                </Button>

                <Button
                    size="sm"
                    onClick={openFamiliesModal}
                    loading={isFamiliesFetching}
                    loadingPosition="start"
                    fullWidth
                >
                    Show All Ancestral Families
                </Button>
            </Modal>

            {families && (
                <Workspace
                    workspace={{
                        name: `${member.name.split(' ')[0]}'s Ancestral`,
                        families,
                    }}
                    open={!isFamiliesFetching && familiesModalOpen}
                    onClose={closeFamiliesModal}
                    readOnly
                />
            )}

            <ProfileActions
                workspaceId={workspaceId}
                member={member}
                memberChildren={children}
                addSpouse={addSpouse}
                addChild={addChild}
                removeChild={removeChild}
                memberListType={memberListType}
                closeMembersList={closeMembersList}
            />
        </>
    );
};

export default Profile;