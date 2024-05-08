import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { sidebars_admin, sidebars_prof, sidebars_stu } from "./side-bar";
import { SidebarButtonComponent } from "./sidebar-button/sidebar-button.component";
import { UserService } from "../services/user.service";
import { PrivateUser, UserType } from "../models/user.model";

@Component({
    selector: "app-side-bar",
    standalone: true,
    templateUrl: "./side-bar.component.html",
    imports: [SidebarButtonComponent, CommonModule, RouterLink, RouterLinkActive],
})
export class SideBarComponent implements OnInit {
    sidebarButtons_stu = sidebars_stu;
    sidebarButtons_teacher = sidebars_prof;
    sidebarButtons_admin = sidebars_admin;

    constructor(
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.userService.getCurrentUser().subscribe((user: PrivateUser) => {
            this.user = user;
        });
    }

    logout() {
        this.userService.logout().subscribe({
            next: () => {
                this.router.navigate(["/login"]);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    user: PrivateUser = new PrivateUser("", "", "", "", "", "");
    protected readonly UserType = UserType;
}
