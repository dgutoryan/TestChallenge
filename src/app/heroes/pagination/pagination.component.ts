import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() totalHeroes: number;
  @Input() currentPage$: BehaviorSubject<number>;

  private pageList$: Observable<number[]>;
  private pageSize: number = 10;

  constructor() { }

  ngOnChanges({ totalHeroes }: SimpleChanges) {
    totalHeroes.currentValue && this.generatePages();
  }

  totalPagesNumber() {
    return Math.ceil(this.totalHeroes / this.pageSize);
  }

  generatePages() {
    this.pageList$ = Observable
      .range(1, this.totalPagesNumber())
      .reduce((total, item) => [...total, item], []);
  }

  goToPreviousPage() {
    if ((this.currentPage$.value - 1) > 0) {
      this.currentPage$.next(this.currentPage$.getValue() - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage$.value < this.totalPagesNumber()) {
      this.currentPage$.next(this.currentPage$.getValue() + 1);
    }
  }

  goToFirstPage() {
    this.currentPage$.next(1);
  }

  goToLastPage() {
    this.currentPage$.next(this.totalPagesNumber());
  }

}
