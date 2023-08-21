import { Users } from '../user/entities/user.entity';
import { Platforms } from '../platform/entities/platform.entity';
declare const entities: (typeof Platforms | typeof Users)[];
export { Users, Platforms };
export default entities;
