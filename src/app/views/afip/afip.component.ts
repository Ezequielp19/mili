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
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-afip',
  templateUrl: './afip.component.html',
  styleUrls: ['./afip.component.scss'],
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
export class AfipComponent implements OnInit {
  userId: string;
  afip: any;


  marcas: Marca[] = [];
  productos: Producto[] = [];
  selectedMarca: Marca | undefined;


  constructor(private firestoreService: FirestoreService, private router: Router) {}

 async ngOnInit() {
    this.marcas = await this.firestoreService.getMarcas();
  }


  //  async ngOnInit() {
  //   this.loadCategories();
  // }

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


// downloadPriceList() {
//     const csvData = this.convertToCSV(this.productos);
//     const blob = new Blob([csvData], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.setAttribute('hidden', '');
//     a.setAttribute('href', url);
//     a.setAttribute('download', `lista_precios_${this.selectedMarca?.nombre}.csv`);
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   }

//   convertToCSV(objArray: Producto[]): string {
//     const header = 'Nombre,Codigo,Precio Final,Marca';
//     const rows = objArray.map(producto =>
//       `${producto.nombre},${producto.codigo},${producto.precioFinal},${producto.marca.nombre},${producto.categoria}`
//     ).join('\n');
//     return header + rows;
//   }


downloadPriceList() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.productos.map(producto => ({
      Nombre: producto.nombre,
      Codigo: producto.codigo,
      'Precio Final': producto.precioFinal,
      Marca: producto.marca.nombre,
      Categoria: producto.categoria
    })));

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Lista de Precios': worksheet },
      SheetNames: ['Lista de Precios']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, `lista_precios_${this.selectedMarca?.nombre}`);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';




