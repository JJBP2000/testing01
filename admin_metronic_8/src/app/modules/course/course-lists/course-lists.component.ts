import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { CourseDeleteComponent } from '../course-delete/course-delete.component';
import { NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-lists',
  templateUrl: './course-lists.component.html',
  styleUrls: ['./course-lists.component.scss']
})
export class CourseListsComponent implements OnInit {

  COURSES:any = [];
  isLoading:any;

  search: any = null; 
  state: any = null;
  constructor(
    public modalService: NgbModal,
    public courseService:CourseService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.listCourse();
  }

  listCourse(){
    this.courseService.listCourse(this.search,this.state).subscribe((resp:any) => {
      console.log(resp);
      this.COURSES = resp.courses.data;
    })
  }

  deleteCourse(COURSE:any){
    const modalRef = this.modalService.open(CourseDeleteComponent,{centered: true, size: "md"});
    modalRef.componentInstance.course = COURSE;

    modalRef.componentInstance.CourseD.subscribe((resp:any) => {
      let INDEX = this.COURSES.findIndex((item:any) => item.id == COURSE.id );
      this.COURSES.splice(INDEX,1);
    })
  }

}
