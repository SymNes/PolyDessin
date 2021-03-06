import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

// tslint:disable: no-string-literal

const injector = Injector.create(
    { providers: [{provide: RouterStateSnapshot, useValue: {}}, {provide: RoutesRecognized, deps: [RouterStateSnapshot]}] }
);

describe('AppComponent', () => {
    let app: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [AppComponent],
        });
        const fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
    }));

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    //  Tests updateURL

    it('#updateURL devrait mettre à jour l\'URL courante', () => {
        // tslint:disable-next-line: no-any
        const routes: [any, any] = [{url: 'précédante'}, {url: 'actuelle'}];
        app.updateURL(routes);
        expect(app['routingManager'].currentPage).toBe('actuelle');
    });

    it('#updateURL devrait mettre à jour l\'URL précédante', () => {
        // tslint:disable-next-line: no-any
        const routes: [any, any] = [{url: 'précédante'}, {url: 'actuelle'}];
        app.updateURL(routes);
        expect(app['routingManager'].previousPage).toBe('précédante');
    });

    //  Tests filterFunction

    it('#filterFunction devrait accepter un paramètre de type RouteRecognized', () => {
        const evt: RoutesRecognized = injector.get(RoutesRecognized);
        expect(app.filterFunction(evt)).toBe(true);
    });
});
