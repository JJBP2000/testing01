import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {

  subcategories:any = [];
  subcategories_back:any = [];
  categories:any = [];
  instructores:any = [];

  isLoading:any;
  FILE_PORTADA:any = null;
  IMAGEN_PREVISUALIZA:any = null;

  text_requirements:any = null;
  requirements:any = [];
  text_what_is_for:any = null;
  what_is_fors:any = [];
  constructor(
    public courseService: CourseService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.courseService.listConfig().subscribe((resp:any) => {
      console.log(resp);
      this.subcategories = resp.subcategories;
      this.categories = resp.categories;
      this.instructores = resp.instructores;
    })
  }

  selectCategorie(event:any){
    let VALUE =  event.target.value;
    console.log(VALUE);
    this.subcategories_back = this.subcategories.filter((item:any) => item.categorie_id == VALUE);
  }

  addRequirements(){
    if(!this.text_requirements){
      this.toaster.open({text:'NECESITAS INGRESAR UN REQUERIMIENTO',caption: 'VALIDACION',type:'danger'});
      return;
    }
    this.requirements.push(this.text_requirements);
  }
  addWhatIsFor(){
    if(!this.text_what_is_for){
      this.toaster.open({text:'NECESITAS INGRESAR A QUIEN VA DIRIGIDO',caption: 'VALIDACION',type:'danger'});
      return;
    }
    this.what_is_fors.push(this.text_what_is_for);
  }

  save(){

  }
  processFile($event:any){
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toaster.open({text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption: 'MENSAJE DE VALIDACION', type: 'danger'})
      return;
    }

    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    this.courseService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.courseService.isLoadingSubject.next(false);
    }, 50);
  }

}
