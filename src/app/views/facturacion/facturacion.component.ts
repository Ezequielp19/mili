import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonSpinner, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonGrid, IonSpinner, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class FacturacionComponent implements OnInit {
  facturacionDocs$: Observable<any[]>;
  userId: string;

  constructor(
    private firestoreService: FirestoreService,
    private storage: Storage,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.loadFacturacion();
  }

  loadFacturacion() {
    const path = `Usuarios/${this.userId}/facturacion`;
    this.facturacionDocs$ = this.firestoreService.getCollectionChanges(path);
  }




  getSanitizedUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
