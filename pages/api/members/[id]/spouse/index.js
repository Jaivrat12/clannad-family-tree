import handler from '@server';
import { removeSpouse } from '@server/controllers/member';

handler.delete(removeSpouse);

export default handler;