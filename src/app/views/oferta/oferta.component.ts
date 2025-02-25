import { IonContent, IonCard, IonIcon, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonTitle, IonButtons, IonToolbar, IonBackButton, IonHeader, IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Productoferta } from 'src/app/common/models/productofree.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/common/services/cart.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../common/services/auth.service';


@Component({
  selector: 'app-productoferta-detail',
  templateUrl: './productoferta-detail.component.html',
  styleUrls: ['./productoferta-detail.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonCol, IonRow, IonIcon, IonGrid, IonHeader, IonBackButton, IonToolbar, IonButtons, IonButton, IonTitle, CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class ProductofertaDetailComponent implements OnInit {
  productId: string;
  productoferta: Productoferta | undefined;

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


    async checkLoginStatus() {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

    isLoggedIn: boolean = false; // Variable para controlar si el usuario está logueado


  async loadProduct() {
    if (this.productId) {
      this.productoferta = await this.firestoreService.getProductofertaById(this.productId);
    }
  }

  comprar() {
    const message = `Hola, estoy interesado en el producto ${this.productoferta.nombre}`;
    const whatsappUrl = `https://wa.me/5491167554362?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  async addToCart(product: Productoferta) {
    this.cartService.addToCart(product);
    await this.showAlert(product.nombre);
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


 calculateOriginalPrice(precioFinal: number, descuento: number): number {
    return precioFinal / (1 - descuento / 100);
  }


}
