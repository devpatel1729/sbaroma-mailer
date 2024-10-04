import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
// const baseUrl = "http://localhost:3000";
const baseUrl = "https://dhruvinbackend-1.onrender.com";
// const baseUrl = "https://sbaromabackend.vercel.app/";

@Injectable({
  providedIn: 'root'
})
export class MailService {
  constructor(
    private http: HttpClient,
  ) { }

  send(data:FormData){
    return this.http.post(`${baseUrl}/send-email`,data);
  }
}
