import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class HttpService {
  //private readonly httpOptions: HttpParamsOptions;
  constructor(private readonly http: HttpClient) {
    // Prevent request caching for internet explorer
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  put<T>(url: string, body: T): Observable<T> {
    return this.http.put<T>(url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
