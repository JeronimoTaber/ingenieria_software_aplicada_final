import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'space-event',
        data: { pageTitle: 'spaceApp.spaceEvent.home.title' },
        loadChildren: () => import('./space-event/space-event.module').then(m => m.SpaceEventModule),
      },
      {
        path: 'mission',
        data: { pageTitle: 'spaceApp.mission.home.title' },
        loadChildren: () => import('./mission/mission.module').then(m => m.MissionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
