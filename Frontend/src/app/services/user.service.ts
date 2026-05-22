import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://'+environment.apiUrl+"api/user";

  constructor(private http: HttpClient) {
  }

  getAll():Observable<any>{
    return this.http.get(this.baseUrl+"/");
  }
  get(id:string):Observable<any>{
    return this.http.get(this.baseUrl+"/"+id+"/");
  }
  delete(id:string):Observable<any>{
    return this.http.delete(this.baseUrl+"/"+id+"/");
  }
}
