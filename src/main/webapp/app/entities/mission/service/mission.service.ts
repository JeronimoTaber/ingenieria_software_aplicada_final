import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMission, NewMission } from '../mission.model';

export type PartialUpdateMission = Partial<IMission> & Pick<IMission, 'id'>;

export type EntityResponseType = HttpResponse<IMission>;
export type EntityArrayResponseType = HttpResponse<IMission[]>;

@Injectable({ providedIn: 'root' })
export class MissionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/missions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mission: NewMission): Observable<EntityResponseType> {
    return this.http.post<IMission>(this.resourceUrl, mission, { observe: 'response' });
  }

  update(mission: IMission): Observable<EntityResponseType> {
    return this.http.put<IMission>(`${this.resourceUrl}/${this.getMissionIdentifier(mission)}`, mission, { observe: 'response' });
  }

  partialUpdate(mission: PartialUpdateMission): Observable<EntityResponseType> {
    return this.http.patch<IMission>(`${this.resourceUrl}/${this.getMissionIdentifier(mission)}`, mission, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMission>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMission[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMissionIdentifier(mission: Pick<IMission, 'id'>): number {
    return mission.id;
  }

  compareMission(o1: Pick<IMission, 'id'> | null, o2: Pick<IMission, 'id'> | null): boolean {
    return o1 && o2 ? this.getMissionIdentifier(o1) === this.getMissionIdentifier(o2) : o1 === o2;
  }

  addMissionToCollectionIfMissing<Type extends Pick<IMission, 'id'>>(
    missionCollection: Type[],
    ...missionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const missions: Type[] = missionsToCheck.filter(isPresent);
    if (missions.length > 0) {
      const missionCollectionIdentifiers = missionCollection.map(missionItem => this.getMissionIdentifier(missionItem)!);
      const missionsToAdd = missions.filter(missionItem => {
        const missionIdentifier = this.getMissionIdentifier(missionItem);
        if (missionCollectionIdentifiers.includes(missionIdentifier)) {
          return false;
        }
        missionCollectionIdentifiers.push(missionIdentifier);
        return true;
      });
      return [...missionsToAdd, ...missionCollection];
    }
    return missionCollection;
  }
}
