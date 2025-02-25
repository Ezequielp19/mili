import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonFab,IonFabList,   IonFabButton, IonBadge, IonFooter,IonSegment,IonCardHeader, IonThumbnail, IonCardTitle, IonCardContent, IonCardSubtitle, IonSegmentButton, IonChip,IonAvatar, IonSearchbar,IonApp, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonSpinner, IonButtons, IonButton, IonIcon, IonImg, IonCol, IonRow, IonBackButton, IonGrid } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

import { IoniconsModule } from '../common/modules/ionicons.module';
import { Router } from '@angular/router';
import { AlertController,  IonicModule } from '@ionic/angular';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { UserI } from '../common/models/users.models';
import { CommonModule } from '@angular/common';
import { Producto } from '../common/models/producto.model';
import { Observable } from 'rxjs';
import { AuthService } from '../common/services/auth.service';



import { Marca } from '../common/models/marca.model';
import { Productoferta } from '../common/models/productofree.model';
import { CartItem } from '../common/models/carrito.models';
import { CartService } from '../common/services/cart.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonGrid, IonBackButton, IonRow, IonCol, IonFabButton, IonImg, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
    IonIcon, IonButton, IonButtons,IonFab, IonSpinner, IonInput, IonCard,
    FormsModule,
    IoniconsModule,
    CommonModule,
    IonChip,
    IonBadge,
    IonAvatar,
IonFabList,
    IonThumbnail,
IonFooter,
IonCardHeader,
    IonApp,
IonCardSubtitle,
    IonSearchbar,
    IonSegment, IonSegmentButton,
    IonCardTitle,
    IonCardContent,


  ],
})
export class HomePage implements OnInit {

productos: Producto[] = [];
productosFiltrados: Producto[] = [];
producto: Producto | undefined;
 productOferta: Productoferta[] = [];


  minDate: string;
  maxDate: string;

 showMasInfo = false;
  user$: Observable<any | null> = this.authService.user$;
selectedProduct: any;

marcas: Marca[] = [];
  totalItems: number = 0;


  isSearching: boolean = false;  // Nueva variable de estado




// Método para mostrar los detalles del producto al pasar el mouse
  showDetails(product: any) {
    this.selectedProduct = product;
  }

  // Método para ocultar los detalles del producto al quitar el mouse
  hideDetails() {
    this.selectedProduct = null;
  }

  openWhatsApp() {
  const whatsappNumber = '5491167554362';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  window.open(whatsappUrl, '_blank');
}

openInstgram(){
const instagramUrl= "https://www.instagram.com/expotools_/";
window.open(instagramUrl, '_blank')
}

comprar() {
    const message = `Hola, estoy interesado en el producto ${this.producto.nombre}`;
    const whatsappUrl = `https://wa.me/5491167554362?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  }



  constructor( private router: Router,private firestoreService: FirestoreService,
    private alertController: AlertController,private authService: AuthService,private cartService: CartService) {


  }





logout() {
    this.authService.logout();
  }





  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'se ha cerrado la sesión',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  navigateToCertificacion() {
    this.router.navigate(['/certificacion']);
  }

  navigateToFacturacion() {
    this.router.navigate(['/facturacion']);
  }

  navigateToPlanPago() {
    this.router.navigate(['/planpago']);
  }

  navigateToReciboSueldo() {
    this.router.navigate(['/recibosueldo']);
  }

 navigateToPerfil() {
    this.router.navigate(['/perfil']);
  }

navigateToAfip() {
    this.router.navigate(['/afip']);
  }

  navigateToF931() {
    this.router.navigate(['/F931']);
  }

   navigateToDeclaracion() {
    this.router.navigate(['/declaracion']);
  }

navigateToDetail(product:Producto){
  this.router.navigate(['/product', product.id]);
}

navigateToDetailOferta(productOfer:Productoferta){
  this.router.navigate(['/productOferta', productOfer.id]);
}

 ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    today.setDate(today.getDate() + 6);
    this.maxDate = today.toISOString().split('T')[0];
  }

selectedDate: string = '';

  sendInvitation() {
    if (!this.selectedDate) {
      alert('Por favor, selecciona una fecha.');
      return;
    }

    const message = `Hola amor ❤️, quiero que durmamos juntos el día ${this.selectedDate}. ¿Qué opinas? 😘`;
    const whatsappUrl = `https://wa.me/5493412714029?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  }


//  async ngOnInit() {

//  this.cartService.getCart().subscribe(items => {
//       this.updateTotalItems(items);
//     });


// await this.cargarProductos();
//   this.marcas = await this.firestoreService.getMarcas();
// this.cargarProductosOferta()

// this.clearSearch();

//   }

   updateTotalItems(cartItems: CartItem[]) {
    this.totalItems = cartItems.reduce((total, item) => total + item.cantidad, 0);
  }

   onMarcaClick(marcaId: string) {
    this.router.navigate(['/productos-marca', marcaId]);
  }

   closeSearchResults() {
    this.productosFiltrados = [];
  }


 async cargarProductos() {
    this.productos = await this.firestoreService.getProductos();
    // this.productosFiltrados = this.productos;
      this.productosFiltrados = [];
  }


//oferta
  async cargarProductosOferta() {
    this.productOferta = await this.firestoreService.getProductofertas();
    console.log('Productos obtenidos de oferta:', this.productOferta);
  }



  // search(event: any) {
  //   const query = event.target.value.toLowerCase();
  //   if (query.trim() === '') {
  //     this.productosFiltrados = [];
  //     this.isSearching = false;  // Cambia el estado de búsqueda
  //   } else {
  //     this.productosFiltrados = this.productos.filter(producto =>
  //       // producto.nombre.toLowerCase().includes(query)
  //             producto.nombre.toLowerCase().includes(query) || producto.codigo.toLowerCase().includes(query)

  //     );
  //     this.isSearching = true;  // Cambia el estado de búsqueda
  //   }
  // }

search(event: any) {
  const query = event.target.value.toLowerCase().trim();
  if (query === '') {
    this.productosFiltrados = [];
    this.isSearching = false;
  } else {
    this.productosFiltrados = this.productos.filter(producto => {
      const nombreMatches = producto.nombre && producto.nombre.toLowerCase().includes(query);
      const codigoMatches = producto.codigo && producto.codigo.toLowerCase().includes(query); // Modificación aquí
      return nombreMatches || codigoMatches;
    });
    this.isSearching = true;
  }
}


formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(precio);
}



  clearSearch() {
    const searchbar = document.querySelector('ion-searchbar');
    if (searchbar) {
      searchbar.value = ''; // Reinicia el valor del ion-searchbar a una cadena vacía
    }
  }

  navigateToProduct(product: Producto) {
    // Implementa la navegación al detalle del producto si es necesario
    console.log('Navegar a producto:', product);
  }

   navigateTologin() {
    this.router.navigate(['/login']);
  }


async mostrarAlertaBienvenida(nombre: string) {
    const alert = await this.alertController.create({
      header: '¡Bienvenidx!',
      message: `Hola, ${nombre}!`,
      buttons: ['OK']
    });

    await alert.present();
  }


  openLink(url: string) {
    window.open(url, '_blank');
  }

goToCart() {
    this.router.navigate(['/carrito']);
  }





}

