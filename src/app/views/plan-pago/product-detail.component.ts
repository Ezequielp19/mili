import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonIcon, IonLabel,IonCardHeader,  IonCardTitle, IonCardContent, IonButton,IonTitle, IonButtons, IonToolbar, IonBackButton, IonHeader, IonGrid, IonRow, IonCol, IonSpinner, IonItem, IonInput } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Producto } from 'src/app/common/models/producto.model';
import { ActivatedRoute, Router } from '@angular/router';

import { Productoferta } from 'src/app/common/models/productofree.model';
import { CartService } from 'src/app/common/services/cart.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../common/services/auth.service';


@Component({
   selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [IonInput, IonItem, FormsModule, IonSpinner, IonCol, IonLabel, IonRow, IonIcon, IonGrid, IonHeader, IonBackButton, IonToolbar, IonButtons,IonButton, IonTitle, CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class ProductDetailComponent  implements OnInit {
  planPagoDocs$: Observable<any[]>;
  userId: string;

   productId: string;
  producto: Producto | undefined;
  cantidad: number = 0;
  isLoading: boolean = true;
  isLoggedIn: boolean = false;


  constructor(
    private firestoreService: FirestoreService,
    private storage: Storage,
     private cartService: CartService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct();

    this.checkLoginStatus();



  }



async loadProduct() {
    if (this.productId) {
      this.producto = await this.firestoreService.getProductoById(this.productId);

    }
        this.isLoading = false; // Una vez que el producto se carga, detén el spinner

  }

  comprar() {
    const message = `Hola, estoy interesado en el producto ${this.producto.nombre}`;
    const whatsappUrl = `https://wa.me/5491167554362?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

async addToCart(product: Producto) {
    this.cartService.addToCart(product,this.cantidad);
    await this.showAlert(product.nombre);
  }

 increaseQuantity() {
    if (this.cantidad < 10) { // Ajusta según tus requisitos
      this.cantidad++;
    }
  }

  decreaseQuantity() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

 async checkLoginStatus() {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }






async showAlert(productName: string) {
  const message = `${productName} ha sido agregado al carrito.`;
  window.alert(message);
}



  // async showAlert(productName: string) {
  //   const alert = await this.alertController.create({
  //     header: 'Producto Agregado',
  //     message: `${productName} ha sido agregado al carrito.`,
  //     buttons: ['OK'],
  //   });

  //   await alert.present();
  // }

  goToCart() {
    this.router.navigate(['/carrito']);
  }





}
