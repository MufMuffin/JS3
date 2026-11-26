import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError, switchMap } from 'rxjs';

export interface Product {
  id?: number;
  title?: string;
  name?: string;
  category: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = '/products.json';


  private products = [{}]
  productsSignal = signal<Product[]>([]);

  constructor(private http: HttpClient) { }



  get(id: number): Observable<Product> {
    const found = this.productsSignal().find(p => p.id === id);
    if (found) {
      return of(found);
    }

    return this.list().pipe(
      switchMap(list => {
        const item = list.find(p => p.id === id);
        return item ? of(item) : of({} as Product);
      })
    );
  }
  list(): Observable<Product[]> {
    const localSaved = localStorage.getItem('custom_products');
    if (localSaved && this.productsSignal().length === 0) {
      this.productsSignal.set(JSON.parse(localSaved));
      return of(this.productsSignal());
    }

    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(data => {
        if (this.productsSignal().length === 0) {
          this.productsSignal.set(data);
        }
      })
    );
  }

  create(p: Product): Observable<Product> {
    const created: Product = {
      ...p,
      id: Date.now(),
      title: p.name || p.title
    };
    this.productsSignal.update(list => {
      const updatedList = [created, ...list];
      localStorage.setItem('custom_products', JSON.stringify(updatedList));
      return updatedList;
    });
    return of(created);
  }

  update(id: number, p: Product): Observable<Product> {
    this.productsSignal.update(list =>
      list.map(item => (item.id === id ? { ...item, ...p, title: p.title || p.name } : item))
    );
    return of({ ...p, id });
  }

  delete(id: number): Observable<void> {
    this.productsSignal.update(list => list.filter(item => item.id !== id));
    return of(void 0);
  }
}