import handler from '@server';
import { getFamilyById } from '@server/controllers/family';

handler.get(getFamilyById);

export default handler;