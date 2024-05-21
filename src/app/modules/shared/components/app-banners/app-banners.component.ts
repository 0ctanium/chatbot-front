import { Component, OnInit } from "@angular/core";
import { ConfigService } from "@core/services/config.service";

type Banners = Array<{ tone: 'info' | 'warning' | 'error' |'success' ; message: string }>

@Component({
	selector: "app-banners",
	templateUrl: "./app-banners.component.html",
	styleUrls: ["./app-banners.component.scss"],
})
export class AppBannersComponent implements OnInit {
  banners: Banners = []

  constructor(private configService: ConfigService) {}

	ngOnInit(): void {
    this.configService.config$.subscribe(config => {
      const newBanners: Banners = []

      if(config) {
        if(config.trainingRasa) {
          newBanners.push({
            tone: 'info',
            message: "Le chatbot est en cours d'entraînement..."
          })
        }
      }

      this.banners = newBanners
    })
  }
}
