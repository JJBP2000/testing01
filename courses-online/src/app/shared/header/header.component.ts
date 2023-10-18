import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { CartService } from 'src/app/modules/tienda-guest/service/cart.service';
import Swal from 'sweetalert2';

declare function cartSidenav():any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  user:any = null;
  listCarts:any = [];
  totalSum:any = 0;
  constructor(
    public authService: AuthService,
    public cartService: CartService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.authService.user);
    this.user = this.authService.user;

    this.cartService.currentData$.subscribe((resp:any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalSum = this.listCarts.reduce((sum:number, item:any) => sum + item.total,0);
    })

    if(this.user){
      this.cartService.listCart().subscribe((resp:any) => {
        console.log(resp);
        resp.carts.data.forEach((cart:any) => {
          this.cartService.addCart(cart);
        });
      })
    }

    setTimeout(() => {
      cartSidenav();
    }, 50);
  }

  logout(){
    this.authService.logout();
  }

  removeItem(cart: any) {
    this.cartService.deleteCart(cart.id).subscribe(() => {
      this.cartService.removeItemCart(cart);
    });
  }
  

}
