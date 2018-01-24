import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HeroesService } from './heroes.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/merge';

import { Hero } from '../models/hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesComponent implements OnInit {
  searchField: FormControl;
  heroes: Hero[];
  totalHeroes: number;
  loading$ = new BehaviorSubject<boolean>(false);
  pageNumber$ = new Subject<number>();

  constructor(private heroesService: HeroesService) { }

  ngOnInit() {
    this.searchField = new FormControl();
    this.initHeroes();
  }

  initHeroes() {
    this.getHeroes()
      .merge(this.search())
      .merge(this.page())
      .subscribe(({ count, heroes }: { count: number, heroes: Hero[] }) => {
        this.totalHeroes = count;
        this.heroes = heroes;
      });
  }

  getHeroes() {
    this.loading$.next(true);
    return this.heroesService.getHeroes()
      .finally(() => this.loading$.next(false));
  }

  search() {
    return this.searchField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.loading$.next(true))
      .switchMap(searchTerm => this.heroesService.getHeroes(searchTerm))
      .do(() => this.loading$.next(false))
      .catch(err => Observable.throw(err));
  }

  pageChanged(pageNumber: number) {
    this.pageNumber$.next(pageNumber);
  }

  page() {
    return this.pageNumber$
      .switchMap(page => this.heroesService.getHeroes(undefined, page));
  }
}
