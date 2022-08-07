import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpaceEvent, NewSpaceEvent } from '../space-event.model';

export type PartialUpdateSpaceEvent = Partial<ISpaceEvent> & Pick<ISpaceEvent, 'id'>;

type RestOf<T extends ISpaceEvent | NewSpaceEvent> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestSpaceEvent = RestOf<ISpaceEvent>;

export type NewRestSpaceEvent = RestOf<NewSpaceEvent>;

export type PartialUpdateRestSpaceEvent = RestOf<PartialUpdateSpaceEvent>;

export type EntityResponseType = HttpResponse<ISpaceEvent>;
export type EntityArrayResponseType = HttpResponse<ISpaceEvent[]>;

@Injectable({ providedIn: 'root' })
export class SpaceEventService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/space-events');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(spaceEvent: NewSpaceEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(spaceEvent);
    return this.http
      .post<RestSpaceEvent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(spaceEvent: ISpaceEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(spaceEvent);
    return this.http
      .put<RestSpaceEvent>(`${this.resourceUrl}/${this.getSpaceEventIdentifier(spaceEvent)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(spaceEvent: PartialUpdateSpaceEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(spaceEvent);
    return this.http
      .patch<RestSpaceEvent>(`${this.resourceUrl}/${this.getSpaceEventIdentifier(spaceEvent)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSpaceEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSpaceEvent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSpaceEventIdentifier(spaceEvent: Pick<ISpaceEvent, 'id'>): number {
    return spaceEvent.id;
  }

  compareSpaceEvent(o1: Pick<ISpaceEvent, 'id'> | null, o2: Pick<ISpaceEvent, 'id'> | null): boolean {
    return o1 && o2 ? this.getSpaceEventIdentifier(o1) === this.getSpaceEventIdentifier(o2) : o1 === o2;
  }

  addSpaceEventToCollectionIfMissing<Type extends Pick<ISpaceEvent, 'id'>>(
    spaceEventCollection: Type[],
    ...spaceEventsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const spaceEvents: Type[] = spaceEventsToCheck.filter(isPresent);
    if (spaceEvents.length > 0) {
      const spaceEventCollectionIdentifiers = spaceEventCollection.map(spaceEventItem => this.getSpaceEventIdentifier(spaceEventItem)!);
      const spaceEventsToAdd = spaceEvents.filter(spaceEventItem => {
        const spaceEventIdentifier = this.getSpaceEventIdentifier(spaceEventItem);
        if (spaceEventCollectionIdentifiers.includes(spaceEventIdentifier)) {
          return false;
        }
        spaceEventCollectionIdentifiers.push(spaceEventIdentifier);
        return true;
      });
      return [...spaceEventsToAdd, ...spaceEventCollection];
    }
    return spaceEventCollection;
  }

  protected convertDateFromClient<T extends ISpaceEvent | NewSpaceEvent | PartialUpdateSpaceEvent>(spaceEvent: T): RestOf<T> {
    return {
      ...spaceEvent,
      date: spaceEvent.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restSpaceEvent: RestSpaceEvent): ISpaceEvent {
    return {
      ...restSpaceEvent,
      date: restSpaceEvent.date ? dayjs(restSpaceEvent.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSpaceEvent>): HttpResponse<ISpaceEvent> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSpaceEvent[]>): HttpResponse<ISpaceEvent[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
