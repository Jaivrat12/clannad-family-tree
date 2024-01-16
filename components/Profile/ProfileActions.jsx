import { useSelector } from 'react-redux';
import MembersList from 'components/MembersList';
import { useGetMembersByWorkspaceIdQuery } from 'services/workspace';
import { denormalize } from 'utils';

const ProfileActions = ({
    workspaceId,
    member,
    memberChildren,
    addSpouse,
    addChild,
    removeChild,
    memberListType,
    closeMembersList,
}) => {

    const familyMembers = useSelector((state) => state.family.data.members);

    const {
        data: spouseList,
        isFetching: isSpouseListFetching,
        isUninitialized: isSpouseListUninitialized,
    } = useGetMembersByWorkspaceIdQuery({
        workspaceId,
        filters: {
            gender: member.gender === 'female' ? 'male' : 'female',
            hasSpouse: false,
        },
    }, {
        skip: memberListType !== 'addSpouse',
    });

    const {
        data: childList,
        isFetching: isChildListFetching,
        isUninitialized: isChildListUninitialized,
    } = useGetMembersByWorkspaceIdQuery({
        workspaceId,
        filters: { hasParent: false },
    }, {
        skip: !(['addChild', 'addParent'].includes(memberListType))
    });

    const actionsToProps = {
        addSpouse: {
            title: 'Select a member as spouse...',
            getList: () => spouseList?.members ?? [],
            onClick: (spouse) => {
                addSpouse(spouse._id);
                closeMembersList();
            },
            disableCreate: false,
            isLoading: isSpouseListUninitialized || isSpouseListFetching,
        },
        addChild: {
            title: 'Select a child to add...',
            getList: () => childList?.members ?? [],
            onClick: (child) => {
                addChild(member._id, child._id);
                closeMembersList();
            },
            disableCreate: false,
            isLoading: isChildListUninitialized || isChildListFetching,
        },
        addParent: {
            title: 'Select a parent to add...',
            getList: () => (childList?.members ?? []).filter((child) => !familyMembers[child._id]),
            onClick: (parent) => {
                addChild(parent._id, member._id, true);
                closeMembersList();
            },
            disableCreate: false,
            isLoading: isChildListUninitialized || isChildListFetching,
        },
        removeChild: {
            title: 'Select a child to remove...',
            getList: () => denormalize(memberChildren),
            onClick: (child) => {
                removeChild(child._id);
                closeMembersList();
            },
            disableCreate: true,
            isLoading: false,
        },
    };

    const listProps = actionsToProps[memberListType];
    const { title, onClick, disableCreate, getList, isLoading } = listProps ?? {};
    return listProps && (
        <MembersList
            title={title}
            members={getList()}
            onClick={onClick}
            disableCreate={disableCreate}
            workspaceId={workspaceId}
            open={true}
            onClose={closeMembersList}
            isLoading={isLoading}
        />
    );
}

export default ProfileActions;