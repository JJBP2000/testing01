import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


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

  //auth-register
  email_register:any = null;
  password_register:any = null;
  name:any = null;
  surname:any = null;
  password_confirmation:any = null;
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


    login() {
        if (!this.email || !this.password) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Necesitas ingresar todos los campos requeridos'
            });
            return;
        }
        this.authService.login(this.email, this.password).subscribe(
            (resp: any) => {
                console.log(resp);
                if (resp) {
                    window.location.reload();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'LAS CREDENCIALES NO EXISTEN'
                    });
                }
            },
            error => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'ERROR EN EL LOGIN'
                });
            },
            () => {
                // Esta función se ejecuta siempre, haya sido la petición exitosa o no
                this.email = null;
                this.password = null;
            }
        );
    }
    
  
  register() {
    if(!this.email_register || !this.name || !this.surname || !this.password_register || !this.password_confirmation){
        Swal.fire('Error', 'TODOS LOS CAMPOS SON NECESARIOS', 'error');
        return;
    }
    if(this.password_register !== this.password_confirmation){
        Swal.fire('Error', 'LAS CONTRASEÑAS SON DIFERENTES', 'error');
        return;
    }
    
    let data = {
        email: this.email_register,
        name: this.name,
        surname: this.surname,
        password: this.password_register,
    }
  
    this.authService.register(data).subscribe(
        (resp: any) => {
            console.log(resp);
            Swal.fire('Éxito', 'EL USUARIO SE HA CREADO CORRECTAMENTE', 'success');
        },
        error => {
            console.error(error);
            Swal.fire('Error', 'LAS CREDENCIALES NO SON CORRECTAS O YA EXISTEN', 'error');
        },
        () => {
            // Limpiar los campos de formulario después de la suscripción
            this.email_register = null;
            this.name = null;
            this.surname = null;
            this.password_register = null;
            this.password_confirmation = null;
        }
    );
  }
  
  
}
