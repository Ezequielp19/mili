import { IonContent, IonCard, IonCardHeader,IonItem, IonLabel, IonInput, IonCardTitle, IonCardContent, IonButtons, IonTitle, IonBackButton, IonToolbar, IonHeader, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../common/services/auth.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { Router } from '@angular/router';
import { UserI } from 'src/app/common/models/users.models';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonButton, FormsModule,IonHeader, IonInput, IonLabel,IonItem, IonToolbar, IonBackButton, IonTitle, IonButtons, CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class RegisterComponent {
    user: UserI = { id: '', nombre: '', apellido: '', email: '', password: '' }; // Inicializa el usuario


  constructor(private authService: AuthService,private router: Router,) {}

//  register(userData: UserI) {
//     this.authService.register(userData);
//   }

 register(userData: UserI) { // Pasa los datos del usuario
    this.authService.register(userData).then(() => {
      // Si el registro es exitoso, redirigir o mostrar un mensaje
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Error al registrar:', error);
    });
  }

navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
