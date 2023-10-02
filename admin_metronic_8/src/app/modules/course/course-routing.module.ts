import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course.component';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseListsComponent } from './course-lists/course-lists.component';

const routes: Routes = [{
  path: '',
  component: CourseComponent,
  children: [
    {
      path: 'registro',
      component: CourseAddComponent,
    },
    {
      path: 'editar/:id',
      component: CourseEditComponent,
    },
    {
      path: 'list',
      component: CourseListsComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
