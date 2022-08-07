import { IMission, NewMission } from './mission.model';

export const sampleWithRequiredData: IMission = {
  id: 13680,
  name: 'HTTP Garden',
};

export const sampleWithPartialData: IMission = {
  id: 51258,
  name: 'Developer cross-platform protocol',
  description: 'Cotton',
};

export const sampleWithFullData: IMission = {
  id: 39571,
  name: 'Guinea Steel',
  description: 'recontextualize',
};

export const sampleWithNewData: NewMission = {
  name: 'Berkshire',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
