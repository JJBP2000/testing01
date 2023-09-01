import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/service/auth.guard';

export const routes: Routes = [
  {
    path: '',
    //canActivate: [AuthGuard],
    loadChildren:() => import("./modules/home/home.module").then(m => m.HomeModule),//Carga de módulos y apuntador al archivo
  },
  {
    path: 'auth',
    loadChildren:() => import("./modules/auth/auth.module").then(m => m.AuthModule),//Carga de módulos y apuntador al archivo
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
