import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graficos-instructor-bg',
  templateUrl: './graficos-instructor-bg.component.html',
})
export class GraficosInstructorBGComponent implements OnInit {
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' }
  ];
  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];

  ngOnInit() {
    console.log('hola');
  }
}
