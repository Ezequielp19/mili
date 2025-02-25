import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonCardHeader, IonCardContent,IonCardTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonSpinner, IonButtons, IonButton, IonIcon, IonImg, IonCol, IonRow, IonBackButton, IonGrid } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import * as bcrypt from 'bcryptjs';
import { Auth } from '@angular/fire/auth';
import { AuthService } from 'src/app/common/services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonGrid, IonBackButton, IonCardHeader, IonCardTitle, IonRow, IonCol, IonImg, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
    IonIcon, IonButton, IonButtons, IonSpinner, IonInput, IonCard,
    FormsModule,
    IoniconsModule,
    ReactiveFormsModule, IonCardContent,
  ],
})
export class LoginComponent  {

 email: string = '';
  password: string = '';

constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private fb: FormBuilder,
    private authService: AuthService

  ) {}



//  login() {
//     this.authService.login(this.email, this.password);
//      this.router.navigate(['/home']);
//   }

 async login() {
    try {
      await this.authService.login(this.email, this.password);
    } catch (error) {
      this.mostrarAlertaError('No se pudo iniciar sesión. Verifica tus credenciales o contacta al administrador.');
    }
  }


navigateToRegister() {
    this.router.navigate(['/register']);
  }

navigateHome() {
    this.router.navigate(['/home']);
  }



  // Función para mostrar una alerta de error
  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Función para mostrar una alerta de éxito
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}





