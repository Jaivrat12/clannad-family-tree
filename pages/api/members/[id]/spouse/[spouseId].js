import handler from '@server';
import { addSpouse } from '@server/controllers/member';

handler.put(addSpouse);

export default handler;