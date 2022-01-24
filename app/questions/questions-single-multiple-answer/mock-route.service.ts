import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class MockRouteService {
  getCurrentUrl(router: Router) {
    return router.url;
  }
}
