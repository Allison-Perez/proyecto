import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient) {}

  apiUrl = 'http://localhost:3000';

  getUserInfoByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/api/obtener-usuario?correo=${email}`;
    return this.http.get(url);
  }

  updateUserInfoByEmail(email: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/api/actualizar-usuario?correo=${email}`;
    return this.http.post(url, userData);
  }

  updatePassword(email: string, passwordAnterior: string, passwordNueva: string): Observable<any> {
    const url = `${this.apiUrl}/api/cambiar-contrasena`;
    const userData = {
        correo: email.slice(1, -1),
        passwordAnterior: passwordAnterior,
        nuevaPassword: passwordNueva
    };

    console.log('Datos a enviar al servidor:', userData);

    return this.http.post(url, userData);
}

  registro(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, data);
  }

  getStaticsInstructores(): Observable<any[]> {
    const url = `${this.apiUrl}/api/staticsInstructores`;
    return this.http.get<any[]>(url);
  }

// DONA DE FICHAS Y CANTIDAD DE INSTRUCTORES

  getFichasInstructores(): Observable<any[]> {
    const url = `${this.apiUrl}/api/fichasInstructores`;
    return this.http.get<any[]>(url);
  }

  // ASIGNA FICHAS

   getFichas(): Observable<any[]> {
    const url = `${this.apiUrl}/api/fichas`;
    return this.http.get<any[]>(url);
  }

  getInstructores(): Observable<any[]> {
    const url = `${this.apiUrl}/api/instructores`;
    return this.http.get<any[]>(url);
  }

  agregarFicha(formData: any): Observable<any> {
    const url = `${this.apiUrl}/api/asignar-ficha`;
    return this.http.post<any>(url, formData);
  }

  // PETICION DE ANTIGUEDAD

  obtenerDatosInstructores(): Observable<any> {
    const url = `${this.apiUrl}/api/antiguedadInstructores`;
    return this.http.get<any>(url);
  }

// ESTADISTICAS BLOGS

getBlogsPorInstructor(): Observable<any[]> {
  const url = `${this.apiUrl}/api/blogsPorInstructor`;
  return this.http.get<any[]>(url);
}

// ESTADISTICAS GUIAS

getGuiasPorInstructor(): Observable<any[]> {
  const url = `${this.apiUrl}/api/guiasPorInstructor`;
  return this.http.get<any[]>(url);
}


// DONA DE FICHAS Y CANTIDAD DE APRENDICES

getFichasAprendices(): Observable<any[]> {
  const url = `${this.apiUrl}/api/fichasAprendices`;
  return this.http.get<any[]>(url);
}
// PROMEDIO EDADES APRENDICES

getDistribucionEdades(): Observable<any[]> {
  const url = `${this.apiUrl}/api/promedioEdades`;
  return this.http.get<any[]>(url);
}

// PROMEDIO ASISTENCIA POR FICHAS

obtenerDatosAsistencia(): Observable<any> {
  const url = `${this.apiUrl}/api/asistenciaFichas`;
  return this.http.get<any>(url);
}
  // FOTO PERFIL
  updateProfilePicture(email: string, imageFile: File | null): Observable<any> {
    let formData: FormData | null = null;
    if (imageFile) {
      formData = new FormData();
      formData.append('imagen', imageFile);
    }
  
    return this.http.post<any>(`${this.apiUrl}/api/cambiar-foto?correo=${encodeURIComponent(email)}`, formData);
  }
  
  getProfilePicture(email: string): Observable<any> {
    const url = `${this.apiUrl}/api/obtener-foto-perfil?correo=${email}`;
    return this.http.get(url);
  }
  
  eliminarFotoPerfil(correo: string) {
    const url = `${this.apiUrl}/api/eliminar-foto?correo=${correo}`;
    return this.http.post(url, {});
  }


}
