import handler from '@server';
import { getWorkspaces, createWorkspace } from '@server/controllers/workspace';

handler.get(getWorkspaces);
handler.post(createWorkspace);

export default handler;