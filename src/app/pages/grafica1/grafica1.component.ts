import { Component, Input, OnInit } from '@angular/core';
import { Color, MultiDataSet, SingleDataSet } from 'ng2-charts';

export interface Dona{
  titulo:string,
  labels:string[],
  data:SingleDataSet[],
  colores:Color[],

}

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})



export class Grafica1Component implements OnInit {

  //enviando todos los parametros
  public labels1 : string[]= ['Altas', 'Medias', 'Bajas'];
  
  public data1: MultiDataSet = [
    [200, 350, 400],
  ];

  public colores1: Color[] = [
    {
      backgroundColor: [
        '#F2836B',
        '#E6719E',
        '#D66BF2'
      ]
    }
  ];
  public titulo1 :string = "Ventas";

  //enviando solo 2, el restante queda por defecto deifnido en el componente reutilizable
  public labels2 : string[]= ['PC', 'Notes', 'Graficas'];

  public colores2: Color[] = [
    {
      backgroundColor: [
        '#B761F2',
        '#6E67E6',
        '#61A6F2'
      ]
    }
  ];

  public titulo2 :string = "Compras";

  public data3: MultiDataSet = [
    [135, 600, 200],
  ];

  public colores3: Color[] = [
    {
      backgroundColor: [
        '#8AF66C',
        '#E2EB73',
        '#F6DD6C'
      ]
    }
  ];

  public titulo3 :string = "Ganancias";

  public labels4 : string[]= ['Perdidas grandes', 'PErdidas medianas', 'Perdidas pequeñas'];
  
  public data4: MultiDataSet = [
    [300, 200, 500],
  ];

  public titulo4 :string = "Perdidas";

  //creacion de objeto tipo dona con envio de datos, se deben mandar todos
  public donaLenguajes :Dona = {
    titulo: 'Lenguajes',
    labels: ['JAVA','JAVASCRIPT','SQL'],
    data: [
      [248, 338, 750],
    ],
    colores: [
      {
        backgroundColor: [
          '#F6C55B',
          '#EB9F63',
          '#F6715B'
        ]
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }
}
