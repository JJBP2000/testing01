import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategorieService } from '../service/categorie.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-categories-delete',
  templateUrl: './categories-delete.component.html',
  styleUrls: ['./categories-delete.component.scss']
})
export class CategoriesDeleteComponent implements OnInit {

 
  @Input() categorie:any;
  @Output() CategorieD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public categorieService: CategorieService,
    public toaster:Toaster,
    public modal: NgbActiveModal,
  ) { }



    ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
  }

  delete(){
    this.categorieService.deletecategorie(this.categorie.id).subscribe((resp:any) => {
      //console.log(resp)
      this.CategorieD.emit("");
      this.toaster.open({text: "LA CATEGORIA SE HA ELIMINADO CORRECTAMENTE",caption: 'INFORME', type:"warning"});
      this.modal.dismiss(); 
    }
    )
  }
}
