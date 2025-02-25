import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/carrito.models';
import { Producto } from '../models/producto.model';
import { Productoferta } from '../models/productofree.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.items);

  constructor() {}

  getCart() {
    return this.cartSubject.asObservable();
  }

  // addToCart(product: Producto | Productoferta, cantidad: number = 1) {
  //   const existingIndex = this.items.findIndex(item => item.producto.id === product.id);
  //   if (existingIndex !== -1) {
  //     this.items[existingIndex].cantidad += cantidad;
  //   } else {
  //     this.items.push({ producto: product as Producto, cantidad });
  //   }
  //   this.cartSubject.next(this.items);
  // }

  // removeFromCart(product: Producto | Productoferta) {
  //   this.items = this.items.filter(item => item.producto.id !== product.id);
  //   this.cartSubject.next(this.items);
  // }

  // clearCart() {
  //   this.items = [];
  //   this.cartSubject.next(this.items);
  // }

  // getTotal() {
  //   return this.items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  // }

   addToCart(product: Producto | Productoferta, cantidad: number = 1) {
    const existingIndex = this.items.findIndex(item => item.producto.id === product.id);
    if (existingIndex !== -1) {
      this.items[existingIndex].cantidad += cantidad;
    } else {
      this.items.push({ producto: product as Producto, cantidad });
    }
    this.cartSubject.next(this.items);
  }

  // removeFromCart(product: Producto | Productoferta) {
  //   this.items = this.items.filter(item => item.producto.id !== product.id);
  //   this.cartSubject.next(this.items);
  // }

    removeFromCart(product: Producto | Productoferta) {
    const existingItem = this.items.find(item => item.producto.id === product.id);
    if (existingItem) {
      if (existingItem.cantidad > 1) {
        existingItem.cantidad -= 1;
      } else {
        this.items = this.items.filter(item => item.producto.id !== product.id);
      }
      this.cartSubject.next(this.items);
    }
  }

  clearCart() {
    this.items = [];
    this.cartSubject.next(this.items);
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  }
}

