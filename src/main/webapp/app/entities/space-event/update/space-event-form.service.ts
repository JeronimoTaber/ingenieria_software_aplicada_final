import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISpaceEvent, NewSpaceEvent } from '../space-event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISpaceEvent for edit and NewSpaceEventFormGroupInput for create.
 */
type SpaceEventFormGroupInput = ISpaceEvent | PartialWithRequiredKeyOf<NewSpaceEvent>;

type SpaceEventFormDefaults = Pick<NewSpaceEvent, 'id'>;

type SpaceEventFormGroupContent = {
  id: FormControl<ISpaceEvent['id'] | NewSpaceEvent['id']>;
  name: FormControl<ISpaceEvent['name']>;
  date: FormControl<ISpaceEvent['date']>;
  description: FormControl<ISpaceEvent['description']>;
  photo: FormControl<ISpaceEvent['photo']>;
  photoContentType: FormControl<ISpaceEvent['photoContentType']>;
  type: FormControl<ISpaceEvent['type']>;
  mission: FormControl<ISpaceEvent['mission']>;
};

export type SpaceEventFormGroup = FormGroup<SpaceEventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SpaceEventFormService {
  createSpaceEventFormGroup(spaceEvent: SpaceEventFormGroupInput = { id: null }): SpaceEventFormGroup {
    const spaceEventRawValue = {
      ...this.getFormDefaults(),
      ...spaceEvent,
    };
    return new FormGroup<SpaceEventFormGroupContent>({
      id: new FormControl(
        { value: spaceEventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(spaceEventRawValue.name, {
        validators: [Validators.required],
      }),
      date: new FormControl(spaceEventRawValue.date, {
        validators: [Validators.required],
      }),
      description: new FormControl(spaceEventRawValue.description, {
        validators: [Validators.required],
      }),
      photo: new FormControl(spaceEventRawValue.photo, {
        validators: [Validators.required],
      }),
      photoContentType: new FormControl(spaceEventRawValue.photoContentType),
      type: new FormControl(spaceEventRawValue.type, {
        validators: [Validators.required],
      }),
      mission: new FormControl(spaceEventRawValue.mission),
    });
  }

  getSpaceEvent(form: SpaceEventFormGroup): ISpaceEvent | NewSpaceEvent {
    return form.getRawValue() as ISpaceEvent | NewSpaceEvent;
  }

  resetForm(form: SpaceEventFormGroup, spaceEvent: SpaceEventFormGroupInput): void {
    const spaceEventRawValue = { ...this.getFormDefaults(), ...spaceEvent };
    form.reset(
      {
        ...spaceEventRawValue,
        id: { value: spaceEventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SpaceEventFormDefaults {
    return {
      id: null,
    };
  }
}
