import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserI } from '../models/users.models';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar Firestore
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

 constructor(private afAuth: AngularFireAuth, private router: Router,private afs: AngularFirestore,) {
    this.user$ = this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          return {
            id: user.uid,
            nombre: user.displayName?.split(' ')[0] || '',
            apellido: user.displayName?.split(' ')[1] || '',
            email: user.email || '',
            password: '' // No se debe almacenar la contraseña en el lado del cliente
          };
        } else {
          return null;
        }
      })
    );
  }

  // async register(user: UserI) {
  //   try {
  //     const result = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
  //     await result.user?.updateProfile({
  //       displayName: `${user.nombre} ${user.apellido}`
  //     });
  //     this.router.navigate(['/']);
  //   } catch (error) {
  //     console.error('Error during registration:', error);
  //   }
  // }

   isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user) // Devuelve true si el usuario está autenticado, false en caso contrario
    );
  }


   async register(user: UserI) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
      await result.user?.updateProfile({
        displayName: `${user.nombre} ${user.apellido}`
      });

      // Crear un documento en una colección 'pendingUsers' para que el administrador lo revise
      await this.afs.collection('pendingUsers').doc(result.user?.uid).set({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        approved: false // Estado de la aprobación
      });

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }


  // async login(email: string, password: string) {
  //   try {
  //     const result = await this.afAuth.signInWithEmailAndPassword(email, password);
  //     this.router.navigate(['/']);
  //   } catch (error) {
  //     console.log('Error during login:', error);
  //   }
  // }


 async login(email: string, password: string) {
  try {
    const result = await this.afAuth.signInWithEmailAndPassword(email, password);
    const userDoc = await this.afs.collection('users').doc(result.user?.uid).get().toPromise();

    if (userDoc.exists) {
      const userData = userDoc.data() as UserI;
      if (userData.approved) {
        this.router.navigate(['/home']);
      } else {
        await this.afAuth.signOut();
        console.log('El usuario no está aprobado.');
        alert('Tu cuenta aún no ha sido aprobada por un administrador');
      }
    } else {
      await this.afAuth.signOut();
      console.log('Tu cuenta aún no ha sido aprobada por un administrador');
      alert('Tu cuenta aún no ha sido aprobada por un administrador');
    }
  } catch (error) {
    console.log('Error durante el inicio de sesión:', error);
    alert('Error durante el inicio de sesión');
  }
}




  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  }



   async getAllUsers(): Promise<UserI[]> {
    try {
      const userRecords = await this.afs.collection('users').get().toPromise();
      const users = userRecords.docs.map((doc: { id: any; data: () => any; }) => ({
        id: doc.id,
        ...doc.data()
      })) as UserI[];
      console.log('Usuarios obtenidos:', users); // Agregar console.log aquí
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

}
