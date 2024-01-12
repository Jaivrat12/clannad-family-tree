import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Container from '@mui/joy/Container';
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Workspace from 'components/Workspace';
import WorkspaceForm from 'components/Workspace/WorkspaceForm';
import Alert from 'components/Common/Alert';
import DeleteConfirmButton from 'components/Common/DeleteConfirmButton';
import JoyModal from 'components/Common/JoyModal';
import ThemeToggleButton from 'components/Common/ThemeToggleButton';
import {
	useCreateWorkspaceMutation,
	useDeleteWorkspaceMutation,
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

	const { data, isLoading, isFetching, isSuccess, isError } = useGetWorkspacesQuery();
	const [workspaces, setWorkspaces] = useState([]);
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

	const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
	const openWorkspaceModal = (workspace) => {
		setWorkspaceModalOpen(true);
		setWorkspace(workspace);
	};
	const closeWorkspaceModal = () => {
		setWorkspaceModalOpen(false);
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

	useEffect(() => {
		data && setWorkspaces(data.workspaces);
		workspace && setWorkspace(data.workspaces.find(({ _id }) => _id === workspace._id));
	}, [data, workspace]);

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

			{deleteWorkspaceData?.success && (
				<Alert
					msg={`Workspace "${deleteWorkspaceData.data.name}" deleted successfully!`}
					severity="success"
					autoHide
				/>
			)}

			{/* <Alert
				msg="Something went wrong"
				severity="error"
				autoHide
			/> */}

			<JoyModal
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
			</JoyModal>

			{workspaceModalOpen && (
				<Workspace
					open={workspaceModalOpen}
					onClose={closeWorkspaceModal}
					workspace={workspace}
				/>
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
						variant="soft"
						arrow
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

					<Tooltip title="Logout" variant="soft">
						<Link href="/api/auth/signout">
							<IconButton
								variant="soft"
								color="danger"
								sx={{ borderRadius: '50%' }}
							>
								<ExitToAppIcon />
							</IconButton>
						</Link>
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

				{workspaces.length ? workspaces.map((workspace) => (

					<Card
						key={workspace._id}
						variant="outlined"
						orientation="horizontal"
						sx={{
							mb: 1,
							gap: 2,
							boxShadow: 'md',
							borderColor: 'neutral.outlinedHoverBorder',
						}}
					>
						<AspectRatio
							ratio="1"
							sx={{ width: 90 }}
						>
							<Image
								src={
									workspace.image
									?? workspace.families[0]?.root?.image
									?? '/static/images/default-workspace.jpg'
								}
								alt=""
								width={90}
								height={90}
							/>
						</AspectRatio>

						<Box width="100%">
							<Box
								display="flex"
								justifyContent="space-between"
							>
								<Typography level="title-lg">
									{workspace.name}
								</Typography>

								<Box
									display="flex"
									gap={1}
								>
									<IconButton
										size="sm"
										color="primary"
										variant="soft"
										onClick={() => openFormModal(workspace)}
									>
										<EditIcon />
									</IconButton>

									<DeleteConfirmButton
										title="Delete Workspace"
										itemName={workspace.name}
										onConfirm={() => handleDelete(workspace._id)}
										isLoading={isDeletingWorkspace}
									/>
								</Box>
							</Box>

							<Typography
								level="body-sm"
								fontWeight="500"
								mb={1}
							>
								{workspace.description}
							</Typography>

							<Box
								display="flex"
								flexWrap="wrap"
								gap={0.5}
							>
								{workspace.families.map((family, i) => (

									<Link
										key={family._id}
										href={`/tree/${family._id}`}
									>
										<Chip
											variant={i === 0 ? 'solid' : 'soft'}
											color="success"
											size="sm"
											startDecorator={
												<Avatar src={family.root?.image} />
											}
										>
											{family.name}
										</Chip>
									</Link>
								))}

								<Chip
									variant="solid"
									color="primary"
									size="sm"
									onClick={() => openWorkspaceModal(workspace)}
								>
									All Families
								</Chip>
							</Box>
						</Box>
					</Card>
				)) : (
					<Typography
						fontStyle="italic"
						textAlign="center"
						marginTop={4}
					>
						{!data || isLoading || isFetching ? (
							'Loading...'
						) : isError ? (
							'Something wen\'t wrong...'
						) : isSuccess && (
							<>
								You don&apos;t have any Workspaces. Make one using the Create Button!
								<br />
								<br />
								A Workspace is a collection of families,
								e.g. your father&apos;s family and your mother&apos;s family
								are separate and have their own family trees their own parents, etc.
								There can be many such families which you can keep in here together
								so that everything related to your main family is kept in one <b>Workspace</b>.
							</>
						)}
					</Typography>
				)}
			</Box>
		</Container>
	);
}