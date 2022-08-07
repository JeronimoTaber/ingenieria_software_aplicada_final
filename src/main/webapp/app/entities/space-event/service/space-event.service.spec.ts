import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISpaceEvent } from '../space-event.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../space-event.test-samples';

import { SpaceEventService, RestSpaceEvent } from './space-event.service';

const requireRestSample: RestSpaceEvent = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('SpaceEvent Service', () => {
  let service: SpaceEventService;
  let httpMock: HttpTestingController;
  let expectedResult: ISpaceEvent | ISpaceEvent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SpaceEventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a SpaceEvent', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const spaceEvent = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(spaceEvent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SpaceEvent', () => {
      const spaceEvent = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(spaceEvent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SpaceEvent', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SpaceEvent', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SpaceEvent', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSpaceEventToCollectionIfMissing', () => {
      it('should add a SpaceEvent to an empty array', () => {
        const spaceEvent: ISpaceEvent = sampleWithRequiredData;
        expectedResult = service.addSpaceEventToCollectionIfMissing([], spaceEvent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(spaceEvent);
      });

      it('should not add a SpaceEvent to an array that contains it', () => {
        const spaceEvent: ISpaceEvent = sampleWithRequiredData;
        const spaceEventCollection: ISpaceEvent[] = [
          {
            ...spaceEvent,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSpaceEventToCollectionIfMissing(spaceEventCollection, spaceEvent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SpaceEvent to an array that doesn't contain it", () => {
        const spaceEvent: ISpaceEvent = sampleWithRequiredData;
        const spaceEventCollection: ISpaceEvent[] = [sampleWithPartialData];
        expectedResult = service.addSpaceEventToCollectionIfMissing(spaceEventCollection, spaceEvent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(spaceEvent);
      });

      it('should add only unique SpaceEvent to an array', () => {
        const spaceEventArray: ISpaceEvent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const spaceEventCollection: ISpaceEvent[] = [sampleWithRequiredData];
        expectedResult = service.addSpaceEventToCollectionIfMissing(spaceEventCollection, ...spaceEventArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const spaceEvent: ISpaceEvent = sampleWithRequiredData;
        const spaceEvent2: ISpaceEvent = sampleWithPartialData;
        expectedResult = service.addSpaceEventToCollectionIfMissing([], spaceEvent, spaceEvent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(spaceEvent);
        expect(expectedResult).toContain(spaceEvent2);
      });

      it('should accept null and undefined values', () => {
        const spaceEvent: ISpaceEvent = sampleWithRequiredData;
        expectedResult = service.addSpaceEventToCollectionIfMissing([], null, spaceEvent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(spaceEvent);
      });

      it('should return initial array if no SpaceEvent is added', () => {
        const spaceEventCollection: ISpaceEvent[] = [sampleWithRequiredData];
        expectedResult = service.addSpaceEventToCollectionIfMissing(spaceEventCollection, undefined, null);
        expect(expectedResult).toEqual(spaceEventCollection);
      });
    });

    describe('compareSpaceEvent', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSpaceEvent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSpaceEvent(entity1, entity2);
        const compareResult2 = service.compareSpaceEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSpaceEvent(entity1, entity2);
        const compareResult2 = service.compareSpaceEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSpaceEvent(entity1, entity2);
        const compareResult2 = service.compareSpaceEvent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
