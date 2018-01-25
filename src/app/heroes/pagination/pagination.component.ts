import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() totalHeroes: number;
  @Input() currentPage$: any;
  private pageList$: Observable<number[]>;
  private pageSize: number = 10;

  constructor() { }

  ngOnChanges({ totalHeroes }: SimpleChanges) {
    totalHeroes.currentValue && this.generatePages();
  }

  generatePages() {
    const totalPages: number = Math.ceil(this.totalHeroes / this.pageSize);

    this.pageList$ = Observable
      .range(1, totalPages)
      .reduce((total, item) => [...total, item], [])
      .take(5);
  }

}
