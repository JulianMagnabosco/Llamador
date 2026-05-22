import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../models/user';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  if(isPlatformBrowser(platformId)){
    let user = localStorage.getItem("app.user");
    const router = inject(Router)
    if(user){
      return true
    }
    router.navigate(["/login"])
  }
  return false
};

export const authGuardAdmin: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  if(isPlatformBrowser(platformId)){
    let dataUser = localStorage.getItem("app.user");
    let user:User|undefined;
    try {
      user= JSON.parse( dataUser || "");
    }catch (e) {
      user= undefined
    }
    const router = inject(Router)
    if(user){
      if(user.admin){
        return true
      }else{
        if(confirm("No posee los permisos para acceder a esta pagina")){
          router.navigate(["/login"])
        }
      }
    } else{
      router.navigate(["/login"])
    }
  }
  return false
};
