import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategorieService } from '../service/categorie.service';
import { CategoriesAddComponent } from '../categories-add/categories-add.component';
import { CategoriesEditComponent } from '../categories-edit/categories-edit.component';
import { CategoriesDeleteComponent } from '../categories-delete/categories-delete.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  CATEGORIES: any = []; 
  isLoading: any = null;
  search: any = null;
  state:any = null
  constructor(
    public modalService: NgbModal,
    public categorieService: CategorieService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
    this.listCategorie();
  }

  listCategorie(){
    this.categorieService.listCategories(this.search,this.state).subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories.data;
    }
    )
  }

  openModalCreateCategorie(){
    const modalRef = this.modalService.open(CategoriesAddComponent,{centered: true, size: "md"});
    modalRef.componentInstance.CATEGORIES = this.CATEGORIES.filter((categorie:any) => !categorie.categorie_id);

    modalRef.componentInstance.CategorieC.subscribe((Categorie:any) => {
      console.log(Categorie);
      this.CATEGORIES.unshift(Categorie);
    })
  }

  editCategorie(CATEGORIES:any){
    const modalRef = this.modalService.open(CategoriesEditComponent,{centered: true, size: "md"});
    modalRef.componentInstance.categorie = CATEGORIES;
    modalRef.componentInstance.CATEGORIES = this.CATEGORIES.filter((categorie:any) => !categorie.categorie_id);

    modalRef.componentInstance.CategorieE.subscribe((Categorie:any) => {
      console.log(Categorie);
      let INDEX = this.CATEGORIES.findIndex((item:any) => item.id == Categorie.id );
      this.CATEGORIES[INDEX] = Categorie;
    })
  }

  deleteCategorie(CATEGORIES:any){
    const modalRef = this.modalService.open(CategoriesDeleteComponent,{centered: true, size: "md"});
    modalRef.componentInstance.categorie = CATEGORIES;

    modalRef.componentInstance.CategorieD.subscribe((resp:any) => {
      let INDEX = this.CATEGORIES.findIndex((item:any) => item.id == CATEGORIES.id );
      this.CATEGORIES.splice(INDEX,1);
    })
  }

}
