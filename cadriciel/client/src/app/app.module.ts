import { HttpClientModule } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogConfig, MatDialogModule} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Component
import { AccueilComponent } from './components/accueil/accueil.component';
import { AppComponent } from './components/app/app.component';
import { AvertissementNouveauDessinComponent } from './components/avertissement-nouveau-dessin/avertissement-nouveau-dessin.component';
import { BarreOutilsComponent } from './components/barre-outils/barre-outils.component';
import { ChoixCouleurComponent } from './components/choix-couleur/choix-couleur.component'
import { CouleurPaletteComponent } from './components/choix-couleur/couleur-palette/couleur-palette.component'
import { GlissiereCouleurComponent } from './components/choix-couleur/glissiere-couleur/glissiere-couleur.component'
import { ValeurCouleurComponent } from './components/choix-couleur/valeur-couleur/valeur-couleur.component';
import { FenetreNouveauDessinComponent } from './components/fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';
import { GridOptionsComponent } from './components/grid-options/grid-options.component';
import { GuideSujetComponent } from './components/guide-sujet/guide-sujet.component';
import { OutilDessinComponent } from './components/outil-dessin/outil-dessin.component';
import { PageDessinComponent } from './components/page-dessin/page-dessin.component';
import { PageGuideComponent } from './components/page-guide/page-guide.component';
import { SurfaceDessinComponent } from './components/surface-dessin/surface-dessin.component';

// Service
import { CommandManagerService } from './services/command/command-manager.service';
import { ParametresCouleurService } from './services/couleur/parametres-couleur.service';
import { GestionnaireDessinService } from './services/gestionnaire-dessin/gestionnaire-dessin.service';
import { GestionnaireRaccourcisService } from './services/gestionnaire-raccourcis.service';
import { GestionnaireRoutingService } from './services/gestionnaire-routing.service';
import { GridService } from './services/grid/grid.service';
import { NavigationGuideService } from './services/navigation-guide.service';
import { DessinCrayonService } from './services/outils/dessin-crayon.service';
import { DessinLigneService } from './services/outils/dessin-ligne.service';
import { DessinRectangleService } from './services/outils/dessin-rectangle.service';
import { SelectionService } from './services/outils/selection/selection.service';
import { SVGStockageService } from './services/stockage-svg/svg-stockage.service';

@NgModule({
    declarations: [AppComponent, AccueilComponent, AvertissementNouveauDessinComponent, PageDessinComponent, PageGuideComponent,
        FenetreNouveauDessinComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent, SurfaceDessinComponent,
            ChoixCouleurComponent, GlissiereCouleurComponent, CouleurPaletteComponent, ValeurCouleurComponent, GridOptionsComponent],
    imports: [BrowserModule, HttpClientModule, MatButtonModule, FormsModule, ReactiveFormsModule,
        MatButtonModule, MatDialogModule, BrowserAnimationsModule, RouterModule.forRoot([
        {path: '', component: AccueilComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
    ])],
    providers: [NavigationGuideService, SVGStockageService, DessinCrayonService, GestionnaireDessinService,
                GestionnaireRaccourcisService, DessinRectangleService, DessinLigneService,
                GestionnaireRoutingService, ParametresCouleurService, MatDialogConfig, SelectionService,
                CommandManagerService, GridService],
    entryComponents: [FenetreNouveauDessinComponent, AvertissementNouveauDessinComponent,
                      ChoixCouleurComponent, GridOptionsComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
