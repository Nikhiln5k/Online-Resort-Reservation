import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from 'src/app/pages/about/about.component';
import { AdminComponent } from 'src/app/pages/admin/admin.component';
import { AuthComponent } from 'src/app/pages/auth/auth.component';
import { HomeComponent } from 'src/app/pages/home/components/home/home.component';
import { RoomDetailsComponent } from 'src/app/pages/room-details/room-details.component';
import { RoomsComponent } from 'src/app/pages/rooms/rooms.component';
import { UserComponent } from 'src/app/pages/user/user.component';

const routes: Routes = [
  { path:'', component: HomeComponent},
  { path:'about', component: AboutComponent},
  { path:'auth', component: AuthComponent},
  { path:'rooms', component: RoomsComponent},
  { path:'room-details', component: RoomDetailsComponent},
  { path:'user', component: UserComponent},
  { path:'admin', component: AdminComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
