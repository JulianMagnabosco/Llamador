import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientCallsService {
  private baseUrl = 'http://'+environment.apiUrl+"api/";

  constructor(private http: HttpClient) {
  }

  addCall(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"addcall/",data);
  }

  getCalls():Observable<any>{
    return this.http.get(this.baseUrl+"getcalls/");
  }
  
  dellCall(id:number):Observable<any>{
    return this.http.delete(this.baseUrl+"dellcall/"+id+"/");
  }
  
  getTextToSpeech(text: string) {
    const url = `${this.baseUrl}tts?text=${encodeURIComponent(text)}`;
    return this.http.get(url, { responseType: 'blob'});
  }
  
}
