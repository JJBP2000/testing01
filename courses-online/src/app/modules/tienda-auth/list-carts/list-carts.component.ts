import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../tienda-guest/service/cart.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

declare var paypal:any;

@Component({
  selector: 'app-list-carts',
  templateUrl: './list-carts.component.html',
  styleUrls: ['./list-carts.component.css']
})
export class ListCartsComponent implements OnInit {

  listCarts: any = [];
  totalSum: number = 0;
  code: any = null;

  @ViewChild('paypal', {static: true}) paypalElement?: ElementRef;

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.currentData$.subscribe((resp: any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalSum = this.listCarts.reduce((sum: number, item: any) => sum + item.total, 0);
    });

    paypal.Buttons({
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },
      createOrder: (data: any, actions: any) => {
        // ... (tu código existente aquí)

        if(this.totalSum == 0){
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'NO PUEDES PAGAR UN MONTO DE 0'
          });
          return false;
      }
      if(this.listCarts.length == 0){
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'NO PUEDES PROCESAR EL PAGO CON NINGUN CURSO EN EL CARRITO'
          });
          return false;
      }
      const createOrderPayload = {
          purchase_units: [
              {
                  amount: {
                      description: "COMPRAR POR EL ECOMMERCE",
                      value: this.totalSum
                  }
              }
          ]
      };

        return actions.order.create(createOrderPayload);
      },
      onApprove: async (data: any, actions: any) => {
        let Order = await actions.order.capture();

        let dataT = {
          method_payment: "PAYPAL",
          currency_total: "USD",
          currency_payment: "USD",
          total: this.totalSum,
          n_transaccion: Order.purchase_units[0].payments.captures[0].id,
        }

        this.cartService.checkout(dataT).subscribe((resp: any) => {
          console.log(resp);
          
          // Limpiamos el contenido del carrito después de un checkout exitoso
          this.cartService.clearCart();
          this.listCarts = []; // Limpia la lista del carrito en la interfaz
        });
      },
      onError: (err: any) => {
        console.error('An error prevented the buyer from checking out with PayPal');
      }
    }).render(this.paypalElement?.nativeElement);
  }

  getNameCampaing(type: number) {
    let Name = "";
    switch (type) {
      case 1:
        Name = "CAMPAÑA NORMAL";
        break;
      case 2:
        Name = "CAMPAÑA FLASH";
        break;
      case 3:
        Name = "CAMPAÑA BANNER";
        break;
    
      default:
        break;
    }

    return Name;
  }

  removeItem(cart: any) {
    this.cartService.deleteCart(cart.id).subscribe((resp: any) => {
      console.log(resp);

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'EL ITEM SE A ELIMINADO CORRECTAMENTE',
      });

      this.cartService.removeItemCart(cart);
    });
  }

  applyCupon() {
    if (!this.code) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'NECESITAS INGRESAR UN CUPON',
      });

      return;
    }

    let data = {
      code: this.code,
    }

    this.cartService.applyCupon(data).subscribe((resp: any) => {
      console.log(resp);

      // Limpia el código del cupón
      this.code = "";

      if (resp.message == 403) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: resp.message_text,
        });
      } else {
        this.cartService.resetCart();
        setTimeout(() => {
          resp.carts.data.forEach((cart: any) => {
            this.cartService.addCart(cart);
          });
        }, 50);

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'EL CUPON SE HA REGISTRADO CORRECTAMENTE',
        });
      }
    });
  }

}
