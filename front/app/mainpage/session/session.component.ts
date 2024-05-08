import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../header/header.component";
import { Header } from "../header/header";
import { SessionCardComponent } from "../session-card/session-card.component";

@Component({
    selector: "app-session",
    standalone: true,
    imports: [CommonModule, HeaderComponent, SessionCardComponent],
    templateUrl: "./session.component.html",
    styleUrl: "./session.component.css",
})
export class SessionComponent {
    section: Header = {
        name: "Sessions",
    };
}
