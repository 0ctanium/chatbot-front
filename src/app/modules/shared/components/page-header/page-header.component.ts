import { Component, Input } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {

  @Input() title: string;

  constructor(public auth: AuthService) {}

}
