import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import { useColorScheme } from '@mui/joy/styles';
import FolderICon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MembersList from 'components/MembersList';
import Node from 'components/Node';
import Profile from 'components/Profile';
import Workspace from 'components/Workspace';
import ThemeToggleButton from 'components/Common/ThemeToggleButton';
import { setFamilyData } from 'features/family/familySlice';
import {
	useAddRootMutation,
	useGetFamilyByIdQuery,
} from 'services/family';
import {
	useGetMembersByWorkspaceIdQuery,
	useGetWorkspaceByFamilyIdQuery,
} from 'services/workspace';
import { denormalize } from 'utils';
import useCenteredTree from 'utils/hooks/useCenteredTree';
import settings from 'mocks/settings';

const Tree = dynamic(
	() => import('react-d3-tree'),
	{ ssr: false },
);

const renderNode = ({ nodeDatum, toggleNode }, onNodeClick) => {

	return nodeDatum._id && (
		<Node
			id={nodeDatum._id}
			onClick={(id) => {
				toggleNode();
				onNodeClick(id)();
			}}
		/>
	);
};

// FamilyTree.title = 'Okazaki';
export default function FamilyTree() {

	const { data: session } = useSession();
	const router = useRouter();

	const { familyId } = router.query;
	const dispatch = useDispatch();

	const { mode, systemMode } = useColorScheme();
	const isDarkMode = [mode, systemMode].includes('dark');

	const {
		data: familyData,
		isFetching: isFamilyFetching,
		isLoading: isFamilyLoading,
	} = useGetFamilyByIdQuery(familyId, {
		skip: !familyId
	});

	const {
		data: workspaceData
	} = useGetWorkspaceByFamilyIdQuery(familyId, {
		skip: !familyId
	});

	const {
		data: parentlessMembers
	} = useGetMembersByWorkspaceIdQuery({
		workspaceId: workspaceData?.workspaces?.[0]?._id,
		filters: { hasParent: false },
	}, {
		skip: !workspaceData || isFamilyLoading || !!familyData?.data?.root,
	});

	const {
		data: workspaceMembers
	} = useGetMembersByWorkspaceIdQuery({
		workspaceId: workspaceData?.workspaces?.[0]?._id,
	}, {
		skip: !workspaceData,
	});

	const [rootListOpen, setRootListOpen] = useState(false);
	const [addRoot] = useAddRootMutation();
	const addFamilyRoot = async (memberId) => {
		const result = await addRoot({ familyId, memberId });
		if (result.data.success) {
			setRootListOpen(false);
		}
	};

	useEffect(() => {
		familyData && dispatch(setFamilyData(familyData));
	}, [familyData, dispatch]);

	const family = useSelector((state) => state.family);

	const memberCategories = {
		workspace: {
			key: 'workspace',
			label: 'Workspace',
			data: workspaceMembers?.members ?? [],
		},
		family: {
			key: 'family',
			label: 'Family Only',
			data: denormalize(family.data.members ?? []),
		},
	};
	const [memberCategory, setMemberCategory] = useState('workspace');
	const members = memberCategories[memberCategory].data;

	const [dimensions, translate, containerRef] = useCenteredTree();
	const [changed, setChanged] = useState(true);
	const triggerCenterNode = () => setChanged(!changed);

	const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
	const [membersListOpen, setMembersListOpen] = useState(false);

	const [memberId, setMemberId] = useState(null);
	const onNodeClick = (id) => () => {
		triggerCenterNode();
		setMemberId(id);
	};

	if (!session) {

		if (session === null) {
			router.push('/api/auth/signin');
		}
		return;
	}

	if (!familyData) {

		const isLoading = !familyId || isFamilyFetching || isFamilyLoading;
		return (

			<Box
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography level="h3" gutterBottom>
					{isLoading
						? 'Loading...'
						: 'Family not found!'
					}
				</Typography>

				{!isLoading && (
					<Link href="/">
						<Button>
							Go Back to Home
						</Button>
					</Link>
				)}
			</Box>
		);
	}

	return familyData && (

		<Box
			ref={containerRef}
			sx={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					inset: '1.5rem 1.5rem auto auto',
				}}
			>
				<ThemeToggleButton />
			</Box>

			<Tree
				data={family.tree}
				dimensions={dimensions}
				translate={translate}
				renderCustomNodeElement={(nodeProps) =>
					renderNode(nodeProps, onNodeClick)
				}
				pathClassFunc={() => isDarkMode && 'dark-tree-link-path'}
				{...settings.treeProps}
			/>

			<Link href="/">
				<IconButton
					variant="solid"
					color="primary"
					sx={{
						position: 'absolute',
						inset: 'auto 1.5rem 7.5rem auto',
					}}
				>
					<HomeIcon />
				</IconButton>
			</Link>

			{!familyData?.data?.root && (

				<Box
					sx={{
						position: 'absolute',
						top: '40%',
						left: 10,
						right: 10,
						textAlign: 'center',
					}}
				>
					<Typography
						level="h5"
						gutterBottom
						mb={2}
					>
						This family does not have a root member
					</Typography>

					<Button onClick={() => setRootListOpen(true)}>
						Add Root Member
					</Button>

					{parentlessMembers?.members && (

						<MembersList
							title="Select a Root Member..."
							members={parentlessMembers?.members}
							onClick={(member) => addFamilyRoot(member._id)}
							workspaceId={workspaceData.workspaces[0]._id}
							open={rootListOpen}
							onClose={() => setRootListOpen(false)}
						/>
					)}
				</Box>
			)}

			{workspaceData && (

				<>
					<IconButton
						variant="solid"
						color="primary"
						onClick={() => setMembersListOpen(true)}
						sx={{
							position: 'absolute',
							inset: 'auto 1.5rem 4.5rem auto',
						}}
					>
						<PersonIcon />
					</IconButton>

					<MembersList
						title={`Members (${members.length})`}
						members={members}
						onClick={(member) => setMemberId(member._id)}
						workspaceId={workspaceData.workspaces[0]._id}
						memberCategory={memberCategory}
						setMemberCategory={setMemberCategory}
						memberCategories={Object.values(memberCategories)}
						open={membersListOpen}
						onClose={() => setMembersListOpen(false)}
					/>

					{memberId && (
						<Profile
							open={true}
							onClose={() => setMemberId(null)}
							memberId={memberId}
							setMemberId={setMemberId}
							workspaceId={workspaceData.workspaces[0]._id}
						/>
					)}

					<IconButton
						variant="solid"
						color="primary"
						onClick={() => setWorkspaceModalOpen(true)}
						sx={{
							position: 'absolute',
							inset: 'auto 1.5rem 1.5rem auto',
						}}
					>
						<FolderICon />
					</IconButton>

					<Workspace
						workspace={workspaceData.workspaces[0]}
						open={workspaceModalOpen}
						onClose={() => setWorkspaceModalOpen(false)}
					/>
				</>
			)}
		</Box>
	);
}