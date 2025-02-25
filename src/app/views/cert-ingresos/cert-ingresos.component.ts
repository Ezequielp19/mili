import { IonItem, IonButton, IonLabel, IonInput, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonList, IonCardContent, IonHeader, IonButtons, IonTitle, IonBackButton, IonToolbar, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria } from 'src/app/common/models/categoria.model';
import { Producto } from 'src/app/common/models/producto.model';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';


@Component({
  selector: 'app-cert-ingresos',
  templateUrl: './cert-ingresos.component.html',
  styleUrls: ['./cert-ingresos.component.scss'],
  standalone: true,
  imports: [IonToolbar, IonBackButton, IonTitle, IonButtons, IonButton, IonHeader, IonItem, IonInput, IonLabel, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonList, IonCardContent, IonSelect, IonSelectOption, CommonModule, FormsModule],
})
export class CertIngresosComponent implements OnInit {

 categorias: Categoria[] = [];
  productos: Producto[] = [];
  selectedCategoria: Categoria | undefined;

  constructor(private firestoreService: FirestoreService,private router: Router,private authService: AuthService
) {}

  async ngOnInit() {
    this.loadCategories();
         this.checkLoginStatus();

  }

  async checkLoginStatus() {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

    isLoggedIn: boolean = false; // Variable para controlar si el usuario está logueado




  async loadCategories() {
    try {
      this.categorias = await this.firestoreService.getCategorias();
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  }

  async loadProductosByCategoria(categoriaId: string) {
    try {
      this.productos = await this.firestoreService.getProductosByCategoria(categoriaId);
      this.selectedCategoria = this.categorias.find(categoria => categoria.id === categoriaId);
      console.log('Productos obtenidos de la categoría:', this.productos);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
    }
  }

  onCategoriaClick(categoriaId: string) {
    this.loadProductosByCategoria(categoriaId);
  }

  navigateToDetail(product:Producto){
  this.router.navigate(['/product', product.id]);
}

}
