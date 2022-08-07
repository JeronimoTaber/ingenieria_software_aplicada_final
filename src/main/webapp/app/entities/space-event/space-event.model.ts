import dayjs from 'dayjs/esm';
import { IMission } from 'app/entities/mission/mission.model';
import { SpaceEventType } from 'app/entities/enumerations/space-event-type.model';

export interface ISpaceEvent {
  id: number;
  name?: string | null;
  date?: dayjs.Dayjs | null;
  description?: string | null;
  photo?: string | null;
  photoContentType?: string | null;
  type?: SpaceEventType | null;
  mission?: Pick<IMission, 'id' | 'name'> | null;
}

export type NewSpaceEvent = Omit<ISpaceEvent, 'id'> & { id: null };
