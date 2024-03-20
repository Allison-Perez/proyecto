import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private _userFichas: number[] = [];

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // VER BLOG
    getUserInfoByBlog(idBlog: number): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-blog-por-correo/${idBlog}`;
      console.log(idBlog);
      return this.http.get(url);
    }


    getBlogs(email: string): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-blog-por-correo/${email}`;
      console.log('URL para obtener blogs:', url);
      return this.http.get(url);
    }

  // VER GUIAS
    getUserInfoByguias(idguia: number): Observable<any> {
        const url = `${this.apiUrl}/api/obtener-guias-por-correo/${idguia}`;
        console.log(idguia);
        return this.http.get(url);
      }

    getguias(email: string): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-guias-por-correo/${email}`;
      console.log('URL para obtener guias:', url);
      return this.http.get(url);
    }

  //VER HORARIOS
    getUserInfoByHorario(idHorario: number): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-horarios-por-correo/${idHorario}`;
      console.log(idHorario);
      return this.http.get(url);
    }

    getHorarios(email: string): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-horarios-por-correo/${email}`;
      console.log('URL para obtener horarios:', url);
      return this.http.get(url);
    }
    
  // VER ASISTENCIA 
    getAsistenciasPorAprendiz(email: string): Observable<any[]> {
      const correoSinComillas = email.replace(/"/g, '');
      const url = `${this.apiUrl}/api/asistenciasPorAprendiz/${correoSinComillas}`;
      return this.http.get<any[]>(url);
    }

    getasistenciasPorcorreo(email: string): Observable<any[]> {
      const correoSinComillas = email.replace(/"/g, '');
      const url = `${this.apiUrl}/api/asistenciasPorcorreo/${correoSinComillas}`;
      return this.http.get<any[]>(url);
    }
  // ALERTA ASISTENCIA 3 FALLAS CONSECUTIVAS
    verificarDecercion(asistencias: any[]): boolean {
      let contadorNoAsistio = 0;
    
      for (let i = 0; i < asistencias.length; i++) {
        if (asistencias[i].status === 'No Asistió') {
          contadorNoAsistio++;
        } else {
          contadorNoAsistio = 0; // Reiniciar el contador si no hay tres fechas consecutivas
        }
    
        console.log(`Contador en iteración ${i}: ${contadorNoAsistio}`);
    
      if (contadorNoAsistio === 3) {
        return true; // Hay tres fechas consecutivas con estatus "No Asistió"
      }
    }
  
    return false; // No hay tres fechas consecutivas con estatus "No Asistió"
  }
  
 // ALERTA ASISTENCIA 5 FALLAS 
    verificarFallas(asistencias: any[]): boolean {
      let contadorNoAsistio = 0;
      let noAsistioConsecutivos = 0;
    
      for (let i = 0; i < asistencias.length; i++) {
        if (asistencias[i].status === 'No Asistió') {
          contadorNoAsistio++;
        } else {
          if (contadorNoAsistio > 0) {
            noAsistioConsecutivos++;
          }
          contadorNoAsistio = 0; // Reiniciar el contador si no hay tres fechas consecutivas
        }
    
        console.log(`Contador en iteración ${i}: ${contadorNoAsistio}`);
    
        if (noAsistioConsecutivos >= 5) {
          return true; // Hay al menos cinco registros de "No Asistió" no consecutivos
        }
      }
    
      return false; // No hay al menos cinco registros de "No Asistió" no consecutivos
    }

  // CAMBIAR Y ACTUALIZAR CONTYRASEÑA
    cambiarContrasena(contrasenaAntigua: string, contrasenaNueva: string): Observable<any> {
      const endpoint = '/cambiar-contrasena';
      const url = `${this.apiUrl}${endpoint}`;
      const body = { contrasenaAntigua, contrasenaNueva };

      return this.http.post<any>(url, body);
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

  // INFORMACION PERFIL
    getUserInfoByEmail(email: string): Observable<any> {
      const correoSinComillas = email.replace(/"/g, '');
      const url = `${this.apiUrl}/api/obtenerUsuario?correo=${correoSinComillas}`;
      return this.http.get(url);
    }

    updateUserInfoByEmail(email: string, userData: any): Observable<any> {
      const url = `${this.apiUrl}/api/actualizar-usuario?correo=${email}`;
      return this.http.post(url, userData);
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