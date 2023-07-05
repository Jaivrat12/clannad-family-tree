import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/joy/AvatarGroup';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import MembersList from './MembersList';
import MemberForm from './Member/MemberForm';
import MuiModal from './Common/MuiModal';
import {
    addMemberChild,
    addMemberSpouse,
    removeMemberChild,
    removeMemberSpouse,
    selectChildren,
    selectMember,
    selectSpouse,
    updateMemberDetails
} from 'features/family/familySlice';
import { useGetMembersByWorkspaceIdQuery } from 'services/workspace';
import { denormalize } from 'utils';

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

    const familyMembers = useSelector((state) => state.family.data.members);

    const { _id, name, image, gender, dob, dod } = member;
    const formatter = Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium'
    });

    const formateDate = (date) => formatter.format(new Date(date));
    const getAge = (dob) => new Date().getFullYear() - new Date(dob).getFullYear();

    const [formModalOpen, setFormModalOpen] = useState(false);
	const openFormModal = () => setFormModalOpen(true);
	const closeFormModal = () => setFormModalOpen(false);

    const [memberList, setMemberList] = useState('');
    const closeMembersList = () => setMemberList('');

    const [lists, setLists] = useState({
        spouseList: [],
        childList: [],
        parentList: [],
    });
    const [isEnabled, setIsEnabled] = useState({
        spouseList: false,
        childList: false,
        parentList: false,
    });

    const {
        data: spouseList
    } = useGetMembersByWorkspaceIdQuery({ workspaceId, filters: {
        gender: member.gender === 'female' ? 'male' : 'female',
        hasSpouse: false,
    }}, {
        skip: !isEnabled.spouseList,
    });

    const {
        data: childList
    } = useGetMembersByWorkspaceIdQuery({ workspaceId, filters: {
        hasParent: false,
    }}, {
        skip: !isEnabled.childList,
    });

    const updateDetails = (updates) => {

        const formData = new FormData();
        updates.image = updates.image?.[0];
        for (const key in updates) {
            if (updates[key] !== undefined/*  && updates[key] !== null */) {
                formData.append(key, updates[key] ?? '');
            }
        }

        dispatch(updateMemberDetails(memberId, formData, closeFormModal));
    };

    const addSpouse = (spouseId) => {
        dispatch(addMemberSpouse(memberId, spouseId));
    };

    const removeSpouse = () => {
        dispatch(removeMemberSpouse(memberId));
    };

    const addChild = (memberId, childId) => {
        dispatch(addMemberChild(memberId, childId));
    };

    const removeChild = (childId) => {
        dispatch(removeMemberChild(childId));
    };

    const genderMap = {
        male: 'Wife',
        female: 'Husband',
    };

    const actionsToProps = {
        addSpouse: {
            title: 'Select a member as spouse...',
            getList: () => lists.spouseList,
            fetchData: () => setIsEnabled({ ...isEnabled, spouseList: true }),
            onClick: (spouse) => {
                addSpouse(spouse._id);
                closeMembersList();
            },
            disableCreate: false,
        },
        addChild: {
            title: 'Select a child to add...',
            getList: () => lists.childList,
            fetchData: () => setIsEnabled({ ...isEnabled, childList: true }),
            onClick: (child) => {
                addChild(memberId, child._id);
                closeMembersList();
            },
            disableCreate: false,
        },
        addParent: {
            title: 'Select a parent to add...',
            getList: () => lists.childList.filter((child) => !familyMembers[child._id]),
            fetchData: () => setIsEnabled({ ...isEnabled, childList: true }),
            onClick: (parent) => {
                addChild(parent._id, memberId);
                closeMembersList();
            },
            disableCreate: false,
        },
        removeChild: {
            title: 'Select a child to remove...',
            getList: () => denormalize(children),
            onClick: (child) => {
                removeChild(child._id);
                closeMembersList();
            },
            disableCreate: true,
        },
    };

    useEffect(() => {
        if (memberList && actionsToProps[memberList].fetchData) {
            actionsToProps[memberList].fetchData();
        }
    }, [memberList]);

    useEffect(() => {

        const newLists = { ...lists };
        let changed = false;
        if (spouseList?.members && lists.spouseList != spouseList.members) {
            newLists.spouseList = spouseList.members;
            changed = true;
        }

        if (childList?.members && lists.childList != childList.members) {
            newLists.childList = childList.members;
            changed = true;
        }

        if (changed) {
            setLists(newLists);
        }
    }, [spouseList, childList, lists, lists.spouseList.length, lists.childList.length]);

    return (

        <>
			<MuiModal
				isOpen={ formModalOpen }
				onClose={ closeFormModal }
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
                    onSubmit={ updateDetails }
                />
			</MuiModal>

            {/* { !formModalOpen && ( */}

                <>
                    <Modal
                        open={ open }
                        onClose={ onClose }
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Sheet
                            variant="outlined"
                            sx={{
                                maxWidth: 500,
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

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={ 1 }
                                mb={ 1 }
                            >
                                <Avatar
                                    src={ image ?? (gender === 'male'
                                        ? '/members/images/default-male.jpg'
                                        : '/members/images/default-female.jpg'
                                    )}
                                />

                                <Box>
                                    <Typography
                                        level="h5"
                                        fontWeight="lg"
                                    >
                                        { `${ name }` }
                                    </Typography>

                                    <Typography
                                        textColor="text.tertiary"
                                        fontSize="small"
                                        fontWeight="lg"
                                    >
                                        { `#${ _id }` }
                                    </Typography>

                                    <Typography
                                        textColor="text.tertiary"
                                        fontSize="small"
                                    >
                                        { gender[0].toUpperCase() + gender.slice(1) }
                                        { dob && ` | 🎂 ${formateDate(dob)} (${ getAge(dob) } years)` }
                                    </Typography>
                                </Box>
                            </Box>


                            { dod && (
                                <Typography textColor="text.tertiary">
                                    Died on { formateDate(dod) } 💐
                                </Typography>
                            )}

                            { spouse && (

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={ 1 }
                                    mt={ 1 }
                                >
                                    <Typography
                                        textColor="text.tertiary"
                                        fontSize="x-large"
                                    >
                                        💑
                                    </Typography>

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={ 1 }
                                    >
                                        <Avatar
                                            src={ spouse.image }
                                            onClick={ () => setMemberId(spouse._id) }
                                            sx={{ cursor: 'pointer' }}
                                        />

                                        <Box>
                                            <Typography fontWeight="lg">
                                                { spouse.name }
                                            </Typography>

                                            <Typography
                                                textColor="text.tertiary"
                                                fontSize="small"
                                                fontWeight="lg"
                                            >
                                                { `#${ spouse._id }` }
                                            </Typography>

                                            <Typography
                                                textColor="text.tertiary"
                                                fontSize="small"
                                            >
                                                { spouse.gender[0].toUpperCase() + spouse.gender.slice(1) }
                                                { dob && ` | 🎂 ${formateDate(spouse.dob)} (${ getAge(spouse.dob) } years)` }
                                                 {/* | 🎂 { formateDate(spouse.dob) }
                                                {' '}({ getAge(spouse.dob) } years) */}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Box
                                display="flex"
                                gap={ 1 }
                                sx={{ mb: 3 }}
                            >
                                <Button
                                    variant="soft"
                                    size="sm"
                                    onClick={ openFormModal }
                                    fullWidth
                                >
                                    Update Details
                                </Button>

                                <Button
                                    variant="soft"
                                    color="info"
                                    size="sm"
                                    onClick={ !spouse
                                        ? () => setMemberList('addSpouse')
                                        : removeSpouse
                                    }
                                    fullWidth
                                >
                                    { !spouse ? 'Add' : 'Remove' }
                                    { ' ' }
                                    { genderMap[gender] }
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
                                    { children.map((child) => (
                                        <Avatar
                                            key={ child._id }
                                            src={ child.image }
                                            onClick={ () => setMemberId(child._id) }
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </AvatarGroup>
                            </Box>

                            <Box
                                display="flex"
                                gap={ 1 }
                                sx={{ mb: 1 }}
                            >
                                <Button
                                    variant="soft"
                                    color="success"
                                    size="sm"
                                    onClick={ () => setMemberList('addChild') }
                                    fullWidth
                                >
                                    Add Child
                                </Button>

                                <Button
                                    variant="soft"
                                    color="danger"
                                    size="sm"
                                    onClick={ () => setMemberList('removeChild') }
                                    disabled={ children.length === 0 }
                                    fullWidth
                                >
                                    Remove Child
                                </Button>
                            </Box>

                            <Button
                                variant="soft"
                                color={ !member.parent ? 'warning' : 'neutral' }
                                size="sm"
                                onClick={ () => setMemberList('addParent') }
                                disabled={ !!member.parent }
                                fullWidth
                            >
                                Add Parent
                            </Button>
                        </Sheet>
                    </Modal>

                    { Object.keys(actionsToProps).map((action) => {

                        const { title, onClick, disableCreate, getList } = actionsToProps[action];
                        return (

                            <MembersList
                                key={ action }
                                title={ title }
                                members={ getList() }
                                onClick={ onClick }
                                disableCreate={ disableCreate }
                                workspaceId={ workspaceId }
                                open={ memberList === action }
                                onClose={ closeMembersList }
                            />
                        )
                    })}
                </>
            {/* )} */}
        </>
    );
};

export default Profile;