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

  getAll():Observable<any>{
    return this.http.get(this.baseUrl+"tickets/");
  }
  
  searchTickets(paramList:any):Observable<any>{
    return this.http.get(this.baseUrl+"search/",{params:paramList});
  }
  
  
  getLines():Observable<any>{
    return this.http.get(this.baseUrl+"lines/");
  }
  setLines(data:any):Observable<any>{
    return this.http.put(this.baseUrl+"userlines/",data);
  }

  
  dellLines(id:number):Observable<any>{
    return this.http.delete(this.baseUrl+"line/"+id+"/");
  }
  
  addLines(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"line/",data);
  }
  
  // get(id:string):Observable<any>{
  //   return this.http.get(this.baseUrl+"product/"+id);
  // }
  // add(data:any):Observable<any>{
  //   return this.http.post(this.baseUrl+"product/",data);
  // }
  // edit(id:string,data:any):Observable<any>{
  //   return this.http.put(this.baseUrl+"product/"+id,data);
  // }
  // delete(id:string):Observable<any>{
  //   return this.http.delete(this.baseUrl+"product/"+id);
  // }
  
  // cart(){
  //   try {
  //     return JSON.parse( localStorage.getItem("data.cart") || "");
  //   }catch (e) {
  //     return []
  //   }
  // }
  // getCart(data:any):Observable<any>{
  //   let cartList:any[] =this.cart()
  //   return of({list:cartList,elements:cartList.length,pages:1})
  // }
  // addCart(data:any):Observable<any>{
  //   let cartList:any[] =this.cart()
  //   let found=false
  //   for(let element of cartList){
  //     if(element.id==data.id) return of("ok");
  //   }
  //   cartList.push(data);
  //   localStorage.setItem("data.cart",JSON.stringify(cartList));
  //   return of("ok")
  // }
  // editCart(data:any):Observable<any>{
  //   let cartList:any[] =this.cart()
  //   cartList.forEach((element, index) => {
  //     if(element.id!=data.id) return;
  //     if(data.quantity==0) cartList.splice(index,1);
  //     element.quantity=data.quantity
  //   });
  //   localStorage.setItem("data.cart",JSON.stringify(cartList));
  //   return of("ok")
  // }
}
