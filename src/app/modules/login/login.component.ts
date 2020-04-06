import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyObservable } from '../../core/utils/destroy-observable';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends DestroyObservable implements OnInit {

  loginForm: FormGroup;
  authenticating$: Observable<boolean>;

  constructor(private _fb: FormBuilder,
              private _authService: AuthService,
              private _router: Router) {
    super();
  }

  ngOnInit(): void {
    this.authenticating$ = this._authService.authenticating$;
    this.initLoginForm();
  }

  get controls() {
    return this.loginForm.controls;
  }

  login() {
    this._authService.authenticate(this.loginForm.getRawValue())
      .pipe(finalize(() => {
        this._router.navigateByUrl('');
      }))
      .subscribe();
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private initLoginForm() {
    this.loginForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

}