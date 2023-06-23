import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent {

  constructor( private router: Router) { }

  initApp(){
    this.router.navigate(['./default']);
  }

}
