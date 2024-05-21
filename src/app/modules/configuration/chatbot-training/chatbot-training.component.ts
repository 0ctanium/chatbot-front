import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RasaService } from '../../../core/services/rasa.service';

@Component({
  selector: 'app-chatbot-training',
  templateUrl: './chatbot-training.component.html',
  styleUrls: [
    './chatbot-training.component.scss',
    '../configuration-expansion-panel.scss',
  ],
})
export class ChatbotTrainingComponent implements OnInit {
  constructor(
    private rasa: RasaService,
    private toastr: ToastrService,
  ) {}

  loading = false;

  ngOnInit(): void {
    this.rasa.loading$.subscribe(loading => {
      this.loading = loading;
    })
  }

  train(): void {
    this.rasa.train().toPromise();
    this.toastr.info("Lancement de l'entraînement du chatbot.")
  }
}
