import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
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
  
  
}
