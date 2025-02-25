import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  docData,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  DocumentData,
  WithFieldValue,
  UpdateData,
  getDocs,
  query,
  orderBy,
  where
} from '@angular/fire/firestore';



import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';



import { Observable } from 'rxjs';

const { v4: uuidv4 } = require('uuid');


import { UserI } from '../models/users.models';
import { Marca } from '../models/marca.model';
import { Categoria } from '../models/categoria.model';
import { Producto } from '../models/producto.model';
import { Productoferta } from '../models/productofree.model';


// Convertidor genérico para Firestore
const converter = <T>() => ({
  toFirestore: (data: WithFieldValue<T>) => data,
  fromFirestore: (snapshot: any) => snapshot.data() as T
});

const docWithConverter = <T>(firestore: Firestore, path: string) =>
  doc(firestore, path).withConverter(converter<T>());

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore);





  constructor(private storage: Storage) { }



// Marcas
  async getMarcas(): Promise<Marca[]> {
    const marcasSnapshot = await getDocs(
      query(collection(this.firestore, 'marcas'), orderBy('nombre'))
    );
    const marcas = marcasSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Marca[];
    console.log('Marcas obtenidas:', marcas);
    return marcas;
  }

   async getMarcaById(id: string): Promise<Marca | undefined> {
    const docRef = doc(this.firestore, 'marcas', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Marca) : undefined;
  }



  // Categorías
   // Obtener todas las categorías
  async getCategorias(): Promise<Categoria[]> {
    const categoriasSnapshot = await getDocs(
      query(collection(this.firestore, 'categorias'), orderBy('nombre'))
    );
    return categoriasSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Categoria[];
  }


async getCategoriaById(id: string): Promise<Categoria | undefined> {
    const docRef = doc(this.firestore, 'categorias', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Categoria) : undefined;
  }


// Productos
  // Obtener todos los productos
  async getProductos(): Promise<Producto[]> {
    const productosSnapshot = await getDocs(
      query(collection(this.firestore, 'productos'), orderBy('nombre'))
    );
    return productosSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data['nombre'],
        descripcion: data['descripcion'],
        precio: data['precio'],
        precioFinal: data['precioFinal'] || null,
        codigo: data['codigo'],
        etiqueta: data['etiqueta'],
        categoria: data['categoria'],
        marca: data['marca'],
        imagen: data['imagen'] || null,
      } as Producto;
    });
  }

   async getProductoById(id: string): Promise<Producto | undefined> {
    const docRef = doc(this.firestore, 'productos', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Producto) : undefined;
  }


  // Obtener productos por ID de categoría
 async getProductosByCategoria(categoriaId: string): Promise<Producto[]> {
  const productosSnapshot = await getDocs(
    query(collection(this.firestore, 'productos'), where('categoria.id', '==', categoriaId))
  );
  return productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Producto[];
}


// Obtener productos por ID de marca
  async getProductosByMarca(marcaId: string): Promise<Producto[]> {

   const productosSnapshot = await getDocs(
    query(collection(this.firestore, 'productos'), where('marca.id', '==', marcaId))
  );
  return productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Producto[];
  }


async getProductosOfertaByCategoria(categoriaId: string): Promise<Productoferta[]> {
  const productosSnapshot = await getDocs(
    query(collection(this.firestore, 'productofertas'), where('categoria.id', '==', categoriaId))
  );
  return productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Productoferta[];
}


async getProductosOfertaByMarca(marcaId: string): Promise<Productoferta[]> {
  const productosSnapshot = await getDocs(
    query(collection(this.firestore, 'productofertas'), where('marca.id', '==', marcaId))
  );
  return productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Productoferta[];
}



  getFirestoreInstance(): Firestore {
    return this.firestore;
  }

  getDocument<T>(enlace: string): Promise<DocumentData> {
    const document = docWithConverter<T>(this.firestore, enlace);
    return getDoc(document);
  }

  getDocumentChanges<T>(enlace: string): Observable<T> {
    const document = docWithConverter<T>(this.firestore, enlace);
    return docData(document) as Observable<T>;
  }

  getCollectionChanges<T>(path: string): Observable<T[]> {
    const itemCollection = collection(this.firestore, path);
    return collectionData(itemCollection, { idField: 'id' }) as Observable<T[]>;
  }

  createDocument<T>(data: T, enlace: string): Promise<void> {
    const document = docWithConverter<T>(this.firestore, enlace);
    return setDoc(document, data);
  }

  async createDocumentWithAutoId<T>(data: T, enlace: string): Promise<void> {
    const itemCollection = collection(this.firestore, enlace);
    const newDocRef = doc(itemCollection).withConverter(converter<T>());
    await setDoc(newDocRef, data);
  }

  async updateDocument<T>(data: UpdateData<T>, enlace: string, idDoc: string): Promise<void> {
    const document = docWithConverter<T>(this.firestore, `${enlace}/${idDoc}`);
    return updateDoc(document, data);
  }

  deleteDocumentID(enlace: string, idDoc: string): Promise<void> {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return deleteDoc(document);
  }

  deleteDocFromRef(ref: DocumentReference): Promise<void> {
    return deleteDoc(ref);
  }

  createIdDoc(): string {
    return uuidv4();
  }

  async getAuthUser() {
    return { uid: '05OTLvPNICH5Gs9ZsW0k' };
  }

  async createUserWithSubcollections(userData: any, userId: string): Promise<void> {
    const userRef = doc(this.firestore, `Usuarios/${userId}`);
    await setDoc(userRef, userData);

    // Create subcollections
    const subcollections = ['certIngreso', 'declaracionJurada', 'facturacion', 'infoPersonal', 'planPago', 'AFIP', 'sueldos', 'f931'];
    for (const subcollection of subcollections) {
      const subcollectionRef = doc(collection(userRef, subcollection));
      await setDoc(subcollectionRef, { initialized: true }); // Puedes añadir datos por defecto aquí
    }
  }

  async getDocumentIdInSubcollection(path: string, subcollection: string): Promise<string | null> {
    const subcollectionRef = collection(this.firestore, `${path}/${subcollection}`);
    const querySnapshot = await getDocs(subcollectionRef);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];  // Suponiendo que solo hay un documento
      return doc.id;
    } else {
      return null;
    }
  }

  // Obtener el documento del usuario
  public async getDocumentById<T>(collectionPath: string, documentId: string): Promise<DocumentData | undefined> {
    try {
      const docRef = doc(this.firestore, collectionPath, documentId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : undefined;
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      throw error; // Relanza el error para manejarlo en el componente
    }
  }

  // Login del usuario basado en dni y password
  async loginUser(dni: string, password: string): Promise<UserI | undefined> {
    try {
      // Consulta a la colección Usuarios por el campo dni
      const userCollection = collection(this.firestore, 'Usuarios');
      const q = query(userCollection, where('dni', '==', dni));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data() as UserI;

        console.log('User found:', user);

        if(password === user.password){
          localStorage.setItem('userId', user.id);
          const validPassword = true
          console.log('Password comparison result:', validPassword);
          return user
        } else {
          return undefined
        }
        // const validPassword = await bcrypt.compare(password, user.password);

        // if (validPassword) {
        //   return user;
        // } else {
        //   return undefined;
        // }
      } else {
        console.log('No user found with given DNI');
        return undefined;
      }
    } catch (error) {
      console.error("Error al obtener credenciales del usuario:", error);
      throw error;
    }
  }

// Recuperar datos del usuario por ID
  async getUserData(userId: string): Promise<UserI | undefined> {
    try {
      const userDocRef = doc(this.firestore, `Usuarios/${userId}`).withConverter(converter<UserI>());
      const userDocSnap = await getDoc(userDocRef);
      return userDocSnap.exists() ? userDocSnap.data() : undefined;
    } catch (error) {
      console.error("Error al recuperar los datos del usuario:", error);
      throw error;
    }
  }


 async getUniqueYears(userId: string): Promise<string[]> {
    const certIngresoCollection = collection(this.firestore, `Usuarios/${userId}/certIngreso`);
    const querySnapshot = await getDocs(certIngresoCollection);

    const yearsSet = new Set<string>();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data && data['anio']) {
        yearsSet.add(data['anio']);
      }
    });

    return Array.from(yearsSet);
  }

  getCertificacionIngresosByYear(userId: string, year: string): Observable<any[]> {
    const certIngresoCollection = collection(this.firestore, `Usuarios/${userId}/certIngreso`);
    const q = query(certIngresoCollection, where('anio', '==', year));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }


// Obtener datos de AFIP
  async getAfip(userId: string): Promise<any> {
    try {
      const afipCollectionRef = collection(this.firestore, `Usuarios/${userId}/AFIP`);
      const querySnapshot = await getDocs(afipCollectionRef);

      if (!querySnapshot.empty) {
        const afipDoc = querySnapshot.docs[0];
        return afipDoc.data();
      } else {
        console.log('No se encontraron datos de AFIP para el usuario');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos de AFIP:', error);
      throw error;
    }
  }



 // Obtener PDFs de declaración jurada en orden
  async getDeclaracionJuradaPDFs(userId: string): Promise<any[]> {
    try {
      const declaracionJuradaCollectionRef = collection(this.firestore, `Usuarios/${userId}/declaracionJurada`);
      const q = query(declaracionJuradaCollectionRef);
      const querySnapshot = await getDocs(q);

      const pdfs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return pdfs;
    } catch (error) {
      console.error('Error al obtener los PDFs de declaración jurada:', error);
      throw error;
    }
  }


 async getF931(userId: string): Promise<any[]> {
    try {
      const f931CollectionRef = collection(this.firestore, `Usuarios/${userId}/f931`);
      const querySnapshot = await getDocs(f931CollectionRef);

      const pdfs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return pdfs;
    } catch (error) {
      console.error('Error al obtener los PDFs de F931:', error);
      throw error;
    }
  }


  // OFERTA // Añadir un nuevo producto OFERTA


 async getProductofertas(): Promise<Productoferta[]> {
  const ofertasSnapshot = await getDocs(
    query(collection(this.firestore, 'productofertas'), orderBy('nombre'))
  );
  return ofertasSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      nombre: data['nombre'],
      descripcion: data['descripcion'],
      precio: data['precio'],
      descuento: data['descuento'] || null,
      precioFinal: data['precioFinal'] || null,
      codigo: data['codigo'],
      etiqueta: data['etiqueta'],
      categoria: data['categoria'],
      marca: data['marca'],
      imagen: data['imagen'] || null,
    } as Productoferta;
  });
}



 async getProductofertaById(id: string): Promise<Productoferta | undefined> {
    const docRef = doc(this.firestore, 'productofertas', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Productoferta) : undefined;
  }





}




