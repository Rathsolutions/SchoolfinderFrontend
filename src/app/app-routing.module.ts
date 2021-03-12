//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './overlay/main/main.component';
import { BarrierFree } from './overlay/barrierfree/barrierfree.component';

const routes: Routes = [{
  path: '', component: MainComponent, pathMatch: 'full'
}, {
  path: 'barrierefrei', component: BarrierFree
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
