import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  response;
  constructor(private http: HttpClient) {}

  baseURL = 'http://192.168.1.14';
  baseNetworkUrl = this.baseURL + ':8080';
  baseAccountUrl = this.baseURL + ':9090';

  //testing testing
  getNetworks() {
    return this.http.get(this.baseNetworkUrl + '/status');
  }

  saveNetwork(info) {
    let body = JSON.stringify(info);
    return this.http.post(this.baseNetworkUrl + '/add', body);
  }

  removeNetwork(info) {
    let body = JSON.stringify(info);
    return this.http.post(this.baseNetworkUrl + '/remove', body);
  }

  closeNetwork() {
    return this.http
      .get(this.baseNetworkUrl + '/close')
      .toPromise()
      .then((data) => {
        console.log(data);
      });
  }

  getAccountStatus() {
    return this.http.get(this.baseAccountUrl + '/status');
  }

  updateAccount(info: User) {
    let body = JSON.stringify(info);
    return this.http.post(this.baseAccountUrl + '/update', body);
  }

  closeConfig() {
    return this.http
      .get(this.baseAccountUrl + '/close')
      .toPromise()
      .then((data) => {
        console.log(data);
      });
  }
}
