import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Hero } from '../models/hero';

@Injectable()
export class HeroesService {

  constructor(private http: HttpClient) { }

  getHeroes(searchValue = '', pageNumber = 1): Observable<{count: number, heroes: Hero[]}> {
    return this.http.get(`https://swapi.co/api/people/?page=${pageNumber}&search=${searchValue}`)
      .map((data: any) => ({
        count: data.count,
        heroes: data.results
      }));
  }
}
