import { Component, Input } from "@angular/core";
import { Header } from "./header";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.css",
})
export class HeaderComponent {
    @Input() section!: Header;
}
