import { Component, Input } from "@angular/core";

@Component({
	selector: "banner",
	templateUrl: "./banner.component.html",
	styleUrls: ["./banner.component.scss"],
})
export class BannerComponent {
  @Input() tone: 'info' | 'success' | 'warning' | 'error';

  get icon(): string {
    switch (this.tone) {
      case "info":
        return 'info';
      case "warning":
        return "warning";
      case "error":
        // return "report"
        return "error"
      case "success":
        return 'check_circle'
      default:
        return 'info'
    }
  }
}
