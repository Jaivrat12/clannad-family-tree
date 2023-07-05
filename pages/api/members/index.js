import handler from '@server';
import { createMember } from '@server/controllers/member';

handler.post(createMember);

export default handler;