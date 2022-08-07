import dayjs from 'dayjs/esm';

import { SpaceEventType } from 'app/entities/enumerations/space-event-type.model';

import { ISpaceEvent, NewSpaceEvent } from './space-event.model';

export const sampleWithRequiredData: ISpaceEvent = {
  id: 56821,
  name: 'Afghanistan Tennessee National',
  date: dayjs('2022-08-07'),
  description: '../fake-data/blob/hipster.txt',
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  type: SpaceEventType['LANDING'],
};

export const sampleWithPartialData: ISpaceEvent = {
  id: 60381,
  name: 'User-centric',
  date: dayjs('2022-08-07'),
  description: '../fake-data/blob/hipster.txt',
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  type: SpaceEventType['LANDING'],
};

export const sampleWithFullData: ISpaceEvent = {
  id: 96964,
  name: 'Right-sized withdrawal Small',
  date: dayjs('2022-08-07'),
  description: '../fake-data/blob/hipster.txt',
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  type: SpaceEventType['LANDING'],
};

export const sampleWithNewData: NewSpaceEvent = {
  name: 'initiatives',
  date: dayjs('2022-08-07'),
  description: '../fake-data/blob/hipster.txt',
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  type: SpaceEventType['LANDING'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
