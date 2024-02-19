import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationConfig} from "../../../../models/authentication-config.model";
import {AuthenticationConfigService} from "../../../../services/authentication-config.service";
import {AuthenticationGuard} from "../../../../shared/guards/authentication.guard";
import {NotificationsService, NotificationType} from "angular2-notifications";
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthenticationType} from "../../../../shared/enums/authentication-type.enum";
import {BaseComponent} from "../../../../shared/components/base.component";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styles: [
  ]
})
export class CreateComponent extends BaseComponent implements OnInit {

  updateForm: FormGroup;
  authConfig: AuthenticationConfig;
  saving = false;
  constructor(
    private authConfigService: AuthenticationConfigService,
    public authGuard: AuthenticationGuard,
    public notificationsService: NotificationsService,
    public translate: TranslateService,
    public toastrService: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) public options: { authConfig:AuthenticationConfig},) {
    super(authGuard, notificationsService, translate, toastrService);
  }

  ngOnInit(): void {
    this.authConfig = this.options.authConfig;
    this.updateForm = new FormGroup({
      'clientId': new FormControl(null,  [Validators.required, this.noWhitespaceValidator]),
      'clientSecret':new FormControl(null,[Validators.required, this.noWhitespaceValidator]),

    })
  }

  onSubmit(){
    this.saving = true;
    this.authConfig.googleClientId = this.updateForm.value.clientId;
    this.authConfig.googleClientSecret = this.updateForm.value.clientSecret;
    this.authConfig.authenticationType=AuthenticationType.GOOGLE;

    this.authConfigService.update(this.authConfig).subscribe(
      (storage) => {
        this.translate.get('message.common.auth_config.success',).subscribe((res) => {
          this.showNotification(NotificationType.Success, res);
          this.dialogRef.close({storage,isCreated:true});
        })
        this.saving = false;
      }, error => {
        this.translate.get('message.common.update.failure', {FieldName: 'Authentication Config'}).subscribe((res) => {
          this.showAPIError(error, res);
          this.saving = false;
        })
      });

  }
}
