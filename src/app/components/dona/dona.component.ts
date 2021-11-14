import { Component, Input, OnInit } from '@angular/core';

import { ChartType } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { Dona } from '../../pages/grafica1/grafica1.component';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  @Input('title') title: string = 'Por defecto';
  @Input('colores') colores: Color[] = [
    {
      backgroundColor: [
        '#4458FC',
        '#4ED2F0',
        '#5FFAA3'
      ]
    }
  ];

  @Input('labels') doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];

  @Input('dona5') dona: Dona = {
    titulo: 'Por defecto interfaz',
    labels: ['1','2','3'],
    data: [[10,20,30]],
    colores: [
      {
        backgroundColor: [
          '#B9D6F7',
          '#BFEDEE',
          '#B9F7D5'
        ]
      }
    ]
  };


  constructor() { }

  ngOnInit(): void {
  }

  public doughnutChartType: ChartType = 'doughnut';
  

  

  

}
