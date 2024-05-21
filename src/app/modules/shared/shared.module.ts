import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { AppBannersComponent } from './components/app-banners/app-banners.component';
import { BannerComponent } from './components/banner/banner.component';
import { ChatbotListItemComponent } from './components/chatbot-list-item/chatbot-list-item.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SelectPaginationElementsComponent } from './components/select-pagination-elements/select-pagination-elements.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { ReversePipe } from './pipes/reverse.pipe';

@NgModule({
  declarations: [
    ChatbotListItemComponent,
    ConfirmDialogComponent,
    BannerComponent,
    AppBannersComponent,
    PageHeaderComponent,
    PaginationComponent,
    ReversePipe,
    HasRoleDirective,
    SelectPaginationElementsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ChatbotListItemComponent,
    ConfirmDialogComponent,
    PageHeaderComponent,
    PaginationComponent,
    ReversePipe,
    HasRoleDirective,
    SelectPaginationElementsComponent
  ]
})
export class SharedModule { }
