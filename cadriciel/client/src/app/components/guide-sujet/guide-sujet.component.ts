import { Component, EventEmitter, Input, Output} from '@angular/core';
import { EMPTY_SUBJECT} from '../../services/navigation-guide.service';
import { SubjectGuide } from './subject-guide';

@Component({
  selector: 'app-guide-sujet',
  templateUrl: './guide-sujet.component.html',
  styleUrls: ['./guide-sujet.component.scss']
})

export class GuideSujetComponent {

  @Input() node: SubjectGuide = EMPTY_SUBJECT;
  @Input() depth = 0;

  @Output() notification = new EventEmitter<SubjectGuide>();

  getRange = (size: number) => Array(size);

  onClick() {
    if (this.node.subSubjects) {
      // c'est une catégorie: un click n'affiche pas la description, mais ouvre ou ferme la catégorie
      this.node.openCategory = !this.node.openCategory;
    } else {
      // c'est un sujet, on ouvre son contenu
      this.notification.emit(this.node);
    }
  }

  notificationReceived(subject: SubjectGuide) {
    this.notification.emit(subject);
  }

}
