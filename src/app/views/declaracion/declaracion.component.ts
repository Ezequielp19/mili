import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonCardTitle,IonCardContent, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonSpinner, IonButtons, IonButton, IonIcon, IonImg, IonCol, IonRow, IonBackButton, IonGrid,IonCardHeader  } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import * as bcrypt from 'bcryptjs';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-declaracion',
  templateUrl: './declaracion.component.html',
  styleUrls: ['./declaracion.component.scss'],
 standalone: true,
  imports: [IonGrid, IonBackButton, IonRow, IonCol, IonImg, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
    IonIcon, IonButton, IonButtons, IonSpinner, IonInput, IonCard,
    FormsModule,
    IoniconsModule,
    ReactiveFormsModule,
    CommonModule,
     IonCardHeader,
     IonCardTitle,
     IonCardContent
  ],
})
export class DeclaracionComponent  implements OnInit {

  userId: string;
  jurada: any;
  pdfs: any[];


  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.jurada = await this.firestoreService.getAfip(this.userId);
      this.pdfs = await this.firestoreService.getDeclaracionJuradaPDFs(this.userId);
      console.log('PDFs de Declaración Jurada obtenidos:', this.pdfs);
    } else {
      console.error('No se encontró userId en localStorage');
    }
  }

  verPdf(url: string) {
  window.open(url, '_blank');
}



}
