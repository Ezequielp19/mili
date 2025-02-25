import {
  IonItem,
  IonButton,
  IonLabel,
  IonInput,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonList,
  IonCardContent,
  IonToolbar,
  IonTitle,
  IonHeader, IonBackButton,IonFabButton, IonButtons, IonSpinner, IonImg, IonFab, IonModal } from '@ionic/angular/standalone';
import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Marca } from '../../common/models/marca.model';
import { Producto } from 'src/app/common/models/producto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import * as XLSX from 'xlsx';








@Component({
  selector: 'app-productos-marca',
  templateUrl: './productos-marca.component.html',
  styleUrls: ['./productos-marca.component.scss'],

 standalone: true,
  imports: [IonModal, IonFabButton, IonImg, IonSpinner, IonButton,IonButtons, IonBackButton,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonFab,
     IonIcon,
    IonLabel,
    IonContent,
    IonGrid,
    IonFabButton,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonCardContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProductosMarcaComponent  implements OnInit {
marcas: Marca[] = [];
productos: Producto[] = [];
selectedMarca: Marca | undefined;



  constructor(private firestoreService: FirestoreService, private router: Router,private route: ActivatedRoute, private authService: AuthService) {}

async ngOnInit() {
    const marcaId = this.route.snapshot.paramMap.get('id');
    if (marcaId) {
      this.selectedMarca = await this.firestoreService.getMarcaById(marcaId);
      this.productos = await this.firestoreService.getProductosByMarca(marcaId);
    }
    this.checkLoginStatus();
  }

  async checkLoginStatus() {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

    isLoggedIn: boolean = false;


  async loadMarcas() {
    try {
      this.marcas = await this.firestoreService.getMarcas();
    } catch (error) {
      console.error('Error al obtener marcas:', error);
    }
  }

  async loadProductosByMarca(marcaId: string) {
    try {
      this.productos = await this.firestoreService.getProductosByMarca(marcaId);
      this.selectedMarca = this.marcas.find(marca => marca.id === marcaId);
      console.log('Productos obtenidos de la marca:', this.productos);
    } catch (error) {
      console.error('Error al obtener productos por marca:', error);
    }
  }

  onMarcaClick(marcaId: string) {
    this.loadProductosByMarca(marcaId);
  }


  navigateToDetail(product:Producto){
  this.router.navigate(['/product', product.id]);
}


exportToCSV() {
  if (this.productos && this.productos.length > 0) {
    const csvContent = this.productos.map(producto => [
      `"${producto.nombre}"`,
      `"${producto.codigo}"`,
      this.isLoggedIn ? `"${producto.precioFinal}"` : `""`, // Si no está logueado, deja el precio vacío
      `"${producto.marca.nombre}"`,
    ].join(',')).join('\n');

    const csvHeader = `"Nombre","Código","Precio Final","Marca"\n`;
    const csvData = csvHeader + csvContent;

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `productos_${this.selectedMarca?.nombre || 'marca'}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  } else {
    console.error('No hay productos para descargar.');
  }
}




}
