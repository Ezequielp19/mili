import { DocumentReference } from '@angular/fire/firestore';

export interface Productoferta {
  id: string;
  nombre: string;
 descripcion: string;
  precio: number;
  descuento?:number;
  precioFinal?: number;
  codigo: string;
  etiqueta: string;
  categoria: { id: string, nombre: string }; // Referencia a la categoría con nombre
  marca: { id: string, nombre: string };
  imagen: string;              // URL de la imagen
}
