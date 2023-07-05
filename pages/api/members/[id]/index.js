import handler from '@server';
import { getMember, updateMember } from '@server/controllers/member';

handler.get(getMember);
handler.put(updateMember);

export default handler;