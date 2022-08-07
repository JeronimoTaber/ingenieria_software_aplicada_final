import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../space-event.test-samples';

import { SpaceEventFormService } from './space-event-form.service';

describe('SpaceEvent Form Service', () => {
  let service: SpaceEventFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceEventFormService);
  });

  describe('Service methods', () => {
    describe('createSpaceEventFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSpaceEventFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            photo: expect.any(Object),
            type: expect.any(Object),
            mission: expect.any(Object),
          })
        );
      });

      it('passing ISpaceEvent should create a new form with FormGroup', () => {
        const formGroup = service.createSpaceEventFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            photo: expect.any(Object),
            type: expect.any(Object),
            mission: expect.any(Object),
          })
        );
      });
    });

    describe('getSpaceEvent', () => {
      it('should return NewSpaceEvent for default SpaceEvent initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSpaceEventFormGroup(sampleWithNewData);

        const spaceEvent = service.getSpaceEvent(formGroup) as any;

        expect(spaceEvent).toMatchObject(sampleWithNewData);
      });

      it('should return NewSpaceEvent for empty SpaceEvent initial value', () => {
        const formGroup = service.createSpaceEventFormGroup();

        const spaceEvent = service.getSpaceEvent(formGroup) as any;

        expect(spaceEvent).toMatchObject({});
      });

      it('should return ISpaceEvent', () => {
        const formGroup = service.createSpaceEventFormGroup(sampleWithRequiredData);

        const spaceEvent = service.getSpaceEvent(formGroup) as any;

        expect(spaceEvent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISpaceEvent should not enable id FormControl', () => {
        const formGroup = service.createSpaceEventFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSpaceEvent should disable id FormControl', () => {
        const formGroup = service.createSpaceEventFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
