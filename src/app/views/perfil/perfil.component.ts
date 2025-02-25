import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar,IonCardContent,IonCardHeader,IonCardTitle, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonSpinner, IonButtons, IonButton, IonIcon, IonImg, IonCol, IonRow, IonBackButton, IonGrid } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import * as bcrypt from 'bcryptjs';
import { Auth } from '@angular/fire/auth';
import { UserI } from 'src/app/common/models/users.models';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
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
export class PerfilComponent  implements OnInit {

  user: UserI | undefined;
  userId: string | null = null;

  constructor(  private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private fb: FormBuilder,
    private auth: Auth
 ) { }

 async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.user = await this.firestoreService.getUserData(this.userId);
    }
  }
}
