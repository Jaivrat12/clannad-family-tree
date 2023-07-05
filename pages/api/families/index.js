import handler from '@server';
import { createFamily, getFamilies } from '@server/controllers/family';

handler.get(getFamilies);
handler.post(createFamily);

export default handler;