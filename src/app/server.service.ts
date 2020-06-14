import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }

  sendImage(img) {
    img = img.split(',')[1];
    return this.http.post('api/ocr', {img}, {});
  }
}
