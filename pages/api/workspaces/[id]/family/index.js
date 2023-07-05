import handler from '@server';
import { createFamily } from '@server/controllers/workspace';

handler.post(createFamily);

export default handler;