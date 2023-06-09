import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { User } from './models/user';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {
    constructor(private router: Router) { }

    static currentUser() : User {
        return JSON.parse(sessionStorage.getItem('user')!);
    }

}