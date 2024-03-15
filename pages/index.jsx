import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Avatar from '@mui/joy/Avatar';
import Badge from '@mui/joy/Badge';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Container from '@mui/joy/Container';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import WorkspaceCard from 'components/WorkspaceCard';
import WorkspaceForm from 'components/Workspace/WorkspaceForm';
import Alert from 'components/Common/Alert';
import Modal from 'components/Common/Modal';
import ThemeToggleButton from 'components/Common/ThemeToggleButton';
import {
	useCreateWorkspaceMutation,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
} from 'services/workspace';

/**
 * ! THINGS THAT AREN'T SUPPORTED IN THIS PROJECT:
 * 	* Genders other than male female
 *  * Unnatural marriages
 * 	* Previous marriages (Ex-husband/wife)
 * 	* Polygamy 👀
 * 	* Siblings marriage 💀
*/

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

Home.title = 'Home';
export default function Home() {

	const { data: session } = useSession();
	const router = useRouter();

	const {
		data: workspacesData,
		isFetching: isFetchingWorkspaces,
		isSuccess: isWorkspacesSuccess,
		error: workspacesError,
	} = useGetWorkspacesQuery({
		own: true,				// a flag to only get god's own workspaces (because god can see everything :p)
	});
	const workspaces = workspacesData?.workspaces;
	const [workspace, setWorkspace] = useState(null);

	const { data: users } = useQuery({
		queryKey: ['users'],
		queryFn: () => axios.get(`${BASE_URL}/god/users`, {
			withCredentials: true,
		}),
		select: (res) => {
			const { success, users } = res.data;
			return success ? users : null;
		},
	});
	const isUsersFetchSuccess = users?.length > 0;
	const [usersModalOpen, setUsersModalOpen] = useState(false);

	const [currUser, setCurrUser] = useState(null);
	const {
		data: currUserWorkspaces,
		isFetching: isFetchingCurrUserWorkspaces,
		isSuccess: isCurrUserWorkspacesSuccess,
		error: currUserWorkspacesError,
	} = useQuery({
		queryKey: [`user-${currUser?._id}-workspaces`],
		queryFn: () => axios.get(`${BASE_URL}/god/workspaces/${currUser?._id}`, {
			withCredentials: true,
		}),
		select: (res) => {
			const { success, workspaces } = res.data;
			return success ? workspaces : null;
		},
		enabled: !!currUser?._id,
	});

	const [formModalOpen, setFormModalOpen] = useState(false);
	const openFormModal = (workspace) => {
		setFormModalOpen(true);
		workspace && setWorkspace(workspace);
	};
	const closeFormModal = () => {
		setFormModalOpen(false);
		setWorkspace(null);
	};

	const [createWorkspace, {
		data: createWorkspaceData,
		error: createWorkspaceError,
		isLoading: isCreatingWorkspace,
	}] = useCreateWorkspaceMutation();
	const handleCreate = async (workspace) => {
		const result = await createWorkspace(workspace);
		try {
			if (result.data.success) {
				closeFormModal();
			}
		} catch (error) {
			// ! couldn't connect to net/server
			console.log(error);
			console.log(createWorkspaceError);
		}
	};

	const [updateWorkspace, {
		data: updateWorkspaceData,
		error: updateWorkspaceError,
		isLoading: isUpdatingWorkspace,
	}] = useUpdateWorkspaceMutation();
	const handleUpdate = async (updates) => {

		const result = await updateWorkspace({
			id: workspace._id,
			updates,
		});
		try {
			if (result.data.success) {
				closeFormModal();
			}
		} catch (error) {
			// ! couldn't connect to net/server
			console.log(error);
			console.log(updateWorkspaceError);
		}
	};

	useEffect(() => {
		workspace && setWorkspace(workspaces.find(({ _id }) => _id === workspace._id));
	}, [workspaces, workspace]);

	// ! when net is off, then also it redirects even if session is there
	// ! so check if net is off
	if (!session) {

		if (session === null) {
			router.push('/api/auth/signin');
		}
		return;
	}

	return (

		<Container sx={{ pt: 3, pb: 5 }}>
			{createWorkspaceData?.success && (
				<Alert
					msg={`Workspace "${createWorkspaceData.data.name}" created successfully!`}
					severity="success"
					autoHide
				/>
			)}

			{updateWorkspaceData?.success && (
				<Alert
					msg={`Workspace "${updateWorkspaceData.data.name}" updated successfully!`}
					severity="success"
					autoHide
				/>
			)}

			{isFetchingWorkspaces && (
				<Alert
					msg="Please wait patiently as free-tier servers prefer to sleep when inactive 😅"
					severity="info"
				/>
			)}

			{workspacesError && (
				<Alert
					msg="Something went wrong! Please try again..."
					severity="error"
					endDecoratorIcon={<RefreshIcon />}
					onEndDecoratorClick={() => location.reload()}
				/>
			)}

			<Modal
				isOpen={formModalOpen}
				onClose={closeFormModal}
				title={!workspace ? 'New Workspace' : 'Edit Workspace'}
				maxWidth={600}
			>
				<WorkspaceForm
					mode={!workspace ? 'create' : 'edit'}
					data={workspace}
					onSubmit={!workspace ? handleCreate : handleUpdate}
					isLoading={isCreatingWorkspace || isUpdatingWorkspace}
				/>
			</Modal>

			{users && (
				<Modal
					title={`View All Users (${users.length})`}
					isOpen={usersModalOpen}
					onClose={() => setUsersModalOpen(false)}
					maxWidth="sm"
					contentScrollY
				>
					<List>
						{users.map((user) => (
							<ListItem key={user._id}>
								<ListItemButton onClick={() => setCurrUser(user)}>
									<ListItemDecorator>
										<PersonIcon />
									</ListItemDecorator>
									<ListItemContent>
										<Typography
											fontWeight="500"
											textOverflow="ellipsis"
											overflow="hidden"
											whiteSpace="nowrap"
										>
											{user.email.split('@')[0]}
										</Typography>

										<Typography
											color="neutral"
											fontSize="small"
											sx={{ wordBreak: 'break-all' }}
											gutterBottom
										>
											{user.email}
										</Typography>

										{user.isGod && (
											<Chip variant="soft" color="success">
												GOD
											</Chip>
										)}
									</ListItemContent>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Modal>
			)}

			{currUser && (
				<Modal
					title={`${currUser.email.split('@')[0]}'s Workspaces`}
					isOpen={true}
					onClose={() => setCurrUser(null)}
					maxWidth="md"
					contentScrollY
				>
					{currUserWorkspaces?.length || isFetchingCurrUserWorkspaces ? (currUserWorkspaces ?? Array(3).fill({})).map((workspace, i) => (

						<Box
							key={workspace._id ?? i}
							mb={2}
						>
							<WorkspaceCard
								workspace={workspace}
								openFormModal={openFormModal}
								isLoading={isFetchingCurrUserWorkspaces}
							/>
						</Box>
					)) : (
						<Typography
							fontStyle="italic"
							textAlign="center"
							marginTop={4}
						>
							{currUserWorkspacesError ? (
								'Something wen\'t wrong... Couldn\'t load your workspaces'
							) : isCurrUserWorkspacesSuccess && (
								<>
									The user doesn&apos;t have any Workspaces.
								</>
							)}
						</Typography>
					)}
				</Modal>
			)}

			<Box
				sx={{
					mx: 'auto',
					maxWidth: '700px',
				}}
			>
				<Box
					display="flex"
					justifyContent="end"
					alignItems="center"
					gap={1}
					mb={3}
				>
					<Tooltip
						arrow
						enterTouchDelay={0}
						title={(
							<>
								<Typography
									level="title-md"
									textAlign="center"
								>
									{session.user.name}
								</Typography>

								<Typography
									level="body-sm"
									textAlign="center"
								>
									{session.user.email}
								</Typography>
							</>
						)}
					>
						<Badge
							badgeContent={users?.length ?? 0}
							color="success"
							size="sm"
						>
							<Avatar
								src={session.user.image}
								{...(isUsersFetchSuccess && {
									onClick: () => setUsersModalOpen(true),
									sx: { cursor: 'pointer' }
								})}
							/>
						</Badge>
					</Tooltip>

					<ThemeToggleButton />

					<Tooltip title="Logout">
						<IconButton
							component={Link}
							href="/api/auth/signout"
							variant="soft"
							color="danger"
							sx={{ borderRadius: '50%' }}
						>
							<ExitToAppIcon />
						</IconButton>
					</Tooltip>
				</Box>

				<Box
					mb={5}
					display="flex"
					flexDirection="column"
					gap={1}
					sx={{
						'@media (min-width: 400px)': {
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							gap: 1,
						},
					}}
				>
					<Typography
						level="h3"
						fontWeight="bold"
						textAlign="center"
						textTransform="uppercase"
					>
						Workspaces
					</Typography>

					<Button
						size="lg"
						onClick={() => openFormModal()}
						startDecorator={<AddIcon />}
						sx={{
							'@media (max-width: 400px)': {
								margin: 'auto',
								display: 'flex',
							},
						}}
					>
						Create
					</Button>
				</Box>

				{workspaces?.length || isFetchingWorkspaces ? (workspaces ?? Array(3).fill({})).map((workspace, i) => (

					<Box
						key={workspace._id ?? i}
						mb={2}
					>
						<WorkspaceCard
							workspace={workspace}
							openFormModal={openFormModal}
							isLoading={isFetchingWorkspaces}
						/>
					</Box>
				)) : (
					<Typography
						fontStyle="italic"
						textAlign="center"
						marginTop={4}
					>
						{workspacesError ? (
							'Something wen\'t wrong... Couldn\'t load your workspaces'
						) : isWorkspacesSuccess && (
							<>
								You don&apos;t have any Workspaces. Make one using the Create Button!
								<br />
								<br />
								A Workspace is a collection of family trees,
								e.g. your father&apos;s family and your mother&apos;s family
								are separate and have their own family trees their own parents, etc.
								There can be many such families which you can keep in here together
								so that every family related to your main family is kept in one <b>Workspace</b>.
							</>
						)}
					</Typography>
				)}
			</Box>
		</Container>
	);
}