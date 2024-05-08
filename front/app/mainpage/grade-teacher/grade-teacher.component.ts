import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../header/header.component";
import { Header } from "../header/header";
import { SessionCardComponent } from "../session-card/session-card.component";

@Component({
    selector: "app-grade-teacher",
    standalone: true,
    imports: [CommonModule, HeaderComponent, SessionCardComponent],
    templateUrl: "./grade-teacher.component.html",
    styleUrl: "./grade-teacher.component.css",
})
export class GradeTeacherComponent {
    section: Header = {
        name: "Notes",
    };
}
