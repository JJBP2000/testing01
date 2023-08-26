import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

declare function _clickDoc():any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  //auth-Login
  email: any = null;
  password: any = null;
  constructor(
    public authService: AuthService,
    public router: Router,
  ){}

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      setTimeout(() => {
        _clickDoc();
      }, 50);

      if(this.authService.user){
        this.router.navigateByUrl("/");
        return;
      }
    }


  login(){

    if(!this.email || !this.password){
      alert("Necesitas ingresar todos los campos requeridos");
      return;
    }
    this.authService.login(this.email,this.password).subscribe((resp:any) => {
      console.log(resp);
      if(resp){
        window.location.reload();
      }else{
        alert("LAS CREDENCIALES NO EXISTEN");
      }
    }) 
    
  }
}
