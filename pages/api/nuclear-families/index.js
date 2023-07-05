import handler from '@server';
import { createNuclearFamily } from '@server/controllers/nuclearFamily';

handler.post(createNuclearFamily);

export default handler;