import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatToastComponent } from './components/notification/notification.component';
import { ErrorModalContentComponent } from './components/error.modal.component';
import { SearchService } from './services/search.service';
import { UserService } from './services/user.service';
import { BackendService } from './services/backend.service';
import { CordovaService } from './services/cordova.service';
import { ToastrModule } from 'ngx-toastr';
import { EnsureLoggedInGuard } from './guards/loggedin.guard';
import { FilterPipe } from './pipes/filter.pipe';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    ChatToastComponent,
    ErrorModalContentComponent,
    SafePipe,
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      toastComponent: ChatToastComponent, // added custom toast!
      newestOnTop: false,
    }),
  ],
  entryComponents: [ChatToastComponent, ErrorModalContentComponent], // add!
  providers: [
    SearchService,
    UserService,
    BackendService,
    CordovaService,
    EnsureLoggedInGuard
  ],
  exports: [
    ChatToastComponent,
    ErrorModalContentComponent,
    FilterPipe,
    SafePipe,
  ],
})
export class UiModule {}
