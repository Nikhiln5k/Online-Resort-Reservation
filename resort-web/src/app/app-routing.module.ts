import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/layout/main-layout/main-layout.component';

const routes: Routes = [
  { 
    path: '', component: MainLayoutComponent, 
    children:[
      {
        path:'',
        loadChildren: () => import ('./layouts/layout/layout.module').then(m => m.LayoutModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
