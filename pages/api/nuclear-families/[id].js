import handler from '@server';
import { updateNuclearFamily } from '@server/controllers/nuclearFamily';

handler.put(updateNuclearFamily);

export default handler;