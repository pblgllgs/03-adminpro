import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent{

  constructor() {
  }
}
