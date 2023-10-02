import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategorieService } from '../service/categorie.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-categories-add',
  templateUrl: './categories-add.component.html',
  styleUrls: ['./categories-add.component.scss']
})
export class CategoriesAddComponent implements OnInit {

  @Output() CategorieC: EventEmitter<any> = new EventEmitter();
  @Input()  CATEGORIES:any = null;

  name : any = null;

  IMAGEN_PREVISUALIZA: any = "./assets/media/avatars/300-6.jpg";
  FILE_PORTADA: any = null;

  isLoading:any;
  selected_option: any = 1;
  categorie_id: any = null;

  constructor(
    public categorieService: CategorieService,
    public toaster:Toaster,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
  }

  processAvatar($event:any){
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toaster.open({text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption: 'MENSAJE DE VALIDACION', type: 'danger'})
      return;
    }

    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
  }

  store(){

    if(this.selected_option == 1){//CREACION DE CATEGORIA
      if(!this.name || !this.FILE_PORTADA){
        this.toaster.open({text: "NECESITAS LLENAR TODOS LOS CAMPOS",caption: 'VALIDACION', type:"danger"})
        return;
      }
    }
    if(this.selected_option == 2){
      if(!this.name || !this.categorie_id){//CREACION DE SUBCATEGORIA
        this.toaster.open({text: "NECESITAS LLENAR TODOS LOS CAMPOS",caption: 'VALIDACION', type:"danger"})
        return;
      }
    }

    let formData = new FormData();

    formData.append("name",this.name);
    if(this.categorie_id){
      formData.append("categorie_id",this.categorie_id);
    }
    if(this.FILE_PORTADA){
      formData.append("portada",this.FILE_PORTADA);
    }

    this.categorieService.registercategorie(formData).subscribe((resp:any) => {
      console.log(resp);
      this.CategorieC.emit(resp.categorie);
      this.toaster.open({text: "LA CATEGORIA SE INGRESO CORRECTAMENTE",caption: 'INFORME', type:"primary"});
      this.modal.close();
    }
    )
  }

  selectedOption(value:number){
    this.selected_option = value;
  }
}
