import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from './config.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'config';
  psClass = '';
  alertErr;
  //formGroup
  wifiForm: FormGroup;
  accountForm: FormGroup;
  notif: FormGroup;

  //wifiForm
  wifiSubscribe;
  wifiList = [];
  wifiError;

  //wifiFormModal conditionals
  forgetPass = false;
  addWifi = false;
  saved_notAvailable = false;
  newConnection = false;
  //account
  accountStat;

  constructor(
    private md: NgbModal,
    private fb: FormBuilder,
    public config: ConfigService
  ) {
    this.wifiForm = this.fb.group({
      wifi_name: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.accountForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.notif = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subscribe: [false],
    });
  }

  ngOnInit() {
    this.networkStatus();
    this.getAccountStatus();
  }

  open(modal) {
    this.md.open(modal, {
      centered: true,
    });
  }

  get wi() {
    return this.wifiForm.get('wifi_name');
  }

  get ps() {
    return this.wifiForm.get('password');
  }

  get us() {
    return this.accountForm.get('username');
  }

  get acc_ps() {
    return this.accountForm.get('password');
  }

  get em() {
    return this.notif.get('email');
  }

  get sub() {
    return this.notif.get('subscribe');
  }

  networkStatus() {
    this.config
      .getNetworks()
      .toPromise()
      .then((data) => {
        this.wifiSubscribe = data;
      })
      .catch((err) => console.log(err));
  }

  checkSaved(wifi) {
    let a = this.wifiSubscribe?.SavedNetworks?.find((x) => x.ssid === wifi);
    return a ? true : false;
  }

  checkAvailable(wifi) {
    let a = this.wifiSubscribe?.AvailableNetworks.includes(wifi);
    return a;
  }

  connect(wifi) {
    this.addWifi = true;
    if (!this.checkAvailable(wifi) || wifi === this.wifiSubscribe?.SSID) {
      this.saved_notAvailable = true;
    }
    if (!this.newConnection) {
      this.wi.disable();
    }
    this.wi.setValue(wifi);
    if (this.checkSaved(wifi)) {
      this.forgetPass = true;
      let pss = this.wifiSubscribe?.SavedNetworks?.find((x) => x.ssid === wifi)
        .password;
      this.ps.setValue(pss);
    } else {
      this.wifiError = 'Enter Password to connect!';
    }
  }

  forgetWifi() {
    if (this.wifiForm.valid) {
      this.config
        .removeNetwork({
          ssid: this.wi.value,
          password: this.ps.value,
        })
        .subscribe(
          (data) => {
            this.networkStatus();
            if (data['success']) {
            } else {
              alert(data['error']);
            }
          },
          (err) => {
            console.log(err);
          }
        );
      this.clearWifi();
    } else {
      this.wifiError = 'Please Enter Password to Connect';
    }
  }

  saveWifi() {
    if (this.wifiForm.valid) {
      this.config
        .saveNetwork({ ssid: this.wi.value, password: this.ps.value })
        .subscribe(
          (data) => {
            this.networkStatus();
            if (data['success']) {
            } else {
              alert(data['error']);
            }
          },
          (err) => {
            console.log(err);
          }
        );
      this.clearWifi();
    } else {
      this.wifiError = 'Please Enter Password to Connect';
    }
  }

  changeValuePosition = (arr, init, target) => {
    [arr[init], arr[target]] = [arr[target], arr[init]];
    return arr;
  };

  clearWifi() {
    this.addWifi = false;
    this.forgetPass = false;
    this.wi.setValue('');
    this.wifiError = '';
    this.ps.setValue('');
    this.saved_notAvailable = false;
    this.newConnection = false;
    this.wi.enable();
  }

  getAccountStatus() {
    this.config
      .getAccountStatus()
      .toPromise()
      .then((data) => {
        this.us.setValue(data['username']);
        this.acc_ps.setValue(data['password']);
        this.em.setValue(data['email']);
        this.sub.setValue(data['notification']);
        this.accountStat = data;
      })
      .catch((err) => console.log(err.error));
  }

  addAccount() {
    let info: User = {
      username: this.us.value,
      password: this.acc_ps.value,
      email: this.em.value,
      notification: this.sub.value,
    };

    return this.config
      .updateAccount(info)
      .toPromise()
      .then((data) => {
        this.getAccountStatus();
      });
  }

  submit() {
    console.log('submit');
    this.config.closeNetwork().then();
    this.config.closeConfig().then();
  }

  togglePassword(id) {
    var x = document.getElementById(id);
    if (x['type'] === 'password') {
      x['type'] = 'text';
      this.psClass = 'active';
    } else {
      x['type'] = 'password';
      this.psClass = '';
    }
  }
}
