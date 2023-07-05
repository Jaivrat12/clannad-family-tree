import handler from '@server';
import { removeFamily } from '@server/controllers/workspace';

handler.delete(removeFamily);

export default handler;