import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISpaceEvent } from '../space-event.model';
import { SpaceEventService } from '../service/space-event.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './space-event-delete-dialog.component.html',
})
export class SpaceEventDeleteDialogComponent {
  spaceEvent?: ISpaceEvent;

  constructor(protected spaceEventService: SpaceEventService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.spaceEventService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
