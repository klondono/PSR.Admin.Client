import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UserService, ICurrentUser } from './pa.common';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ExceptionService } from './infrastructure';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  appTitle = 'Public Service Request Administration';
  currentUser: ICurrentUser;
  currentDate: string;
  errorMessage: string;
  private userSub: Subscription;

  constructor(private userService: UserService,
  public toastr: ToastsManager,
  private exceptionService: ExceptionService,
  public vContainerRef: ViewContainerRef){}

  ngOnInit() {

    this.currentDate = this.getCurrentDate();

      this.toastr.setRootViewContainerRef(this.vContainerRef);

      this.userSub = this.userService.getCurrentUser()
            .subscribe(
            (currentUser) => {
                this.currentUser = currentUser;
            },
            (error) => {
              this.exceptionService.catchBadResponse(error);
            },
            ()=> console.log('completed userService subscription'));
  }

  getCurrentDate() : string {
    let currentDt = new Date();
    let mm = currentDt.getMonth() + 1;
    let dd = currentDt.getDate();
    let yyyy = currentDt.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
  }
}
