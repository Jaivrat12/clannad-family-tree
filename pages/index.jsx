import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Container from '@mui/joy/Container';
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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

Home.title = 'Home';
export default function Home() {

	const { data: session } = useSession();
	const router = useRouter();

	const {
		data: workspacesData,
		isFetching: isFetchingWorkspaces,
		isSuccess: isWorkspacesSuccess,
		error: workspacesError,
	} = useGetWorkspacesQuery();
	const workspaces = workspacesData?.workspaces;
	const [workspace, setWorkspace] = useState(null);

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

			{workspacesError && (
				<Alert
					msg="Something went wrong"
					severity="error"
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
						<Avatar src={session.user.image} />
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