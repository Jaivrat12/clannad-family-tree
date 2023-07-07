import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Container, IconButton } from '@mui/joy';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import { Add, Edit, ExitToApp } from '@mui/icons-material';
import MuiModal from 'components/Common/MuiModal';
import WorkspaceForm from 'components/Workspace/WorkspaceForm';
import Workspace from 'components/Workspace';
import {
	useCreateWorkspaceMutation,
	// useDelteWorkspaceMutation,
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

    const [createWorkspace] = useCreateWorkspaceMutation();
    const handleCreate = async (workspace) => {
        const result = await createWorkspace(workspace);
		if (result.data.success) {
			closeFormModal();
		}
    };

	const [updateWorkspace] =  useUpdateWorkspaceMutation();
    const handleUpdate = async (updates) => {

        const result = await updateWorkspace({
			id: workspace._id,
			updates,
		});
		if (result.data.success) {
			closeFormModal();
		}
    };

	// const [deleteWorkspace, { isLoading }] = useDelteWorkspaceMutation();

	useEffect(() => {
		data && setWorkspaces(data.workspaces);
		workspace && setWorkspace(data.workspaces.find(({ _id }) => _id === workspace._id));
	}, [data, workspace]);

	if (!session) {

		if (session === null) {
			router.push('/api/auth/signin');
		}
		return;
	}

	return (

		<Container sx={{ pt: 3, pb: 5 }}>
			<MuiModal
				isOpen={ formModalOpen }
				onClose={ closeFormModal }
				title={ !workspace ? 'New Workspace' : 'Edit Workspace' }
				maxWidth={ 600 }
			>
				<WorkspaceForm
					mode={ !workspace ? 'create' : 'edit' }
					data={ workspace }
					onSubmit={ !workspace ? handleCreate : handleUpdate }
				/>
			</MuiModal>

			{ workspaceModalOpen && (
				<Workspace
					open={ workspaceModalOpen }
					onClose={ closeWorkspaceModal }
					workspace={ workspace }
				/>
			)}

			<Box
				sx={{
					mx: 'auto',
					maxWidth: '700px',
				}}
			>
				<Box
					width="max-content"
					ml="auto" mb={3}
					px={1} py={0.5}
					display="flex"
					justifyContent="end"
					alignItems="center"
					gap={1}
					sx={{
						border: '1px solid #aaaa',
						borderRadius: '3rem',
					}}
				>
					<Avatar src={ session.user.image } />

					<Typography alignItems="center">
						{session.user.name}
						<br />
						<small title={session.user.email}>
							{session.user.email.split('@')[0]}
						</small>
					</Typography>

					<Link href="/api/auth/signout">
						<IconButton
							title="Logout"
							variant="solid"
							color="danger"
							sx={{ borderRadius: '50%' }}
						>
							<ExitToApp />
						</IconButton>
					</Link>
				</Box>

				<Box
					mb={5}
					display="flex"
					flexDirection="column"
					gap={1}
					sx={{
						'@media (min-width: 400px)' : {
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
						onClick={ () => openFormModal() }
						startDecorator={ <Add /> }
						// fullWidth
						sx={{
							'@media (max-width: 400px)' : {
								margin: 'auto',
								display: 'flex',
								// width: '100%',
							},
						}}
					>
						Create
					</Button>
				</Box>

				{ workspaces.length ? workspaces.map((workspace) => (

					<Card
						key={ workspace._id }
						variant="outlined"
						orientation="horizontal"
						sx={{
							mb: 1,
							gap: 2,
							boxShadow: 'md',
							borderColor: 'neutral.outlinedHoverBorder'
							// '&:hover': {
							// 	boxShadow: 'md',
							// 	borderColor: 'neutral.outlinedHoverBorder'
							// },
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
								width={ 90 }
								height={ 90 }
							/>
						</AspectRatio>

						<Box width="100%">
							<div className="flex align-items-center justify-content-between">
								<Typography
									level="h2"
									fontSize="lg"
									mb={ 0.5 }
								>
									{ workspace.name }
								</Typography>

								<div className="flex gap-1">
									<IconButton
										size="sm"
										onClick={ () => openFormModal(workspace) }
									>
										<Edit />
									</IconButton>

									{/* <Button
										size="small"
										severity="danger"
										icon={ PrimeIcons.TRASH }
										onClick={ () => delteWorkspace(workspace._id) }
										className="py-1"
										disabled={ isLoading }
									/> */}
								</div>
							</div>

							<Typography
								fontSize="sm"
								mb={ 1 }
							>
								{ workspace.description }
							</Typography>

							<Box
								display="flex"
								flexWrap="wrap"
								gap={ 0.5 }
							>
								{ workspace.families.map((family, i) => (

									<Link
										key={ family._id }
										href={ `/tree/${ family._id }` }
									>
										<Chip
											variant={ i === 0 ? 'solid' : 'soft' }
											color="success"
											size="sm"
											startDecorator={
												<Avatar src={ family.root?.image } />
											}
										>
											{ family.name }
										</Chip>
									</Link>
								))}

								<Chip
									// variant="outlined"
									// color="neutral"
									size="sm"
									onClick={ () => openWorkspaceModal(workspace) }
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
						{ !data || isLoading || isFetching ? 'Loading...'
						: isError ? 'Something wen\'t wrong...' : isSuccess && (

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