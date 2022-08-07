import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMission, NewMission } from '../mission.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMission for edit and NewMissionFormGroupInput for create.
 */
type MissionFormGroupInput = IMission | PartialWithRequiredKeyOf<NewMission>;

type MissionFormDefaults = Pick<NewMission, 'id'>;

type MissionFormGroupContent = {
  id: FormControl<IMission['id'] | NewMission['id']>;
  name: FormControl<IMission['name']>;
  description: FormControl<IMission['description']>;
};

export type MissionFormGroup = FormGroup<MissionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MissionFormService {
  createMissionFormGroup(mission: MissionFormGroupInput = { id: null }): MissionFormGroup {
    const missionRawValue = {
      ...this.getFormDefaults(),
      ...mission,
    };
    return new FormGroup<MissionFormGroupContent>({
      id: new FormControl(
        { value: missionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(missionRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(missionRawValue.description),
    });
  }

  getMission(form: MissionFormGroup): IMission | NewMission {
    return form.getRawValue() as IMission | NewMission;
  }

  resetForm(form: MissionFormGroup, mission: MissionFormGroupInput): void {
    const missionRawValue = { ...this.getFormDefaults(), ...mission };
    form.reset(
      {
        ...missionRawValue,
        id: { value: missionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MissionFormDefaults {
    return {
      id: null,
    };
  }
}
