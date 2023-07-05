import handler from '@server';
import { addChildren, removeChildren } from '@server/controllers/member';

handler.put(addChildren);
handler.delete(removeChildren);

export default handler;