import { UserService } from "../services/user.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingService } from "../services/loading.service";

export const AuthGuard = () => {
    const auth = inject(UserService);
    const router = inject(Router);
    // Hacky way to prevent the navbar from showing for a split second when loading a page that doesn't require authentication
    const loading = inject(LoadingService);

    return auth.isAuthenticated().subscribe({
        next: (res) => {
            if (res) {
                loading.setLoading(false);
                return true;
            } else {
                router.navigateByUrl("/login");
                loading.setLoading(false);
                return false;
            }
        },
        error: () => {
            router.navigateByUrl("/login");
            loading.setLoading(false);
            return false;
        },
        complete: () => {},
    });
};

export const NoAuthGuard = () => {
    const auth = inject(UserService);
    const router = inject(Router);
    // Hacky way to prevent the navbar from showing for a split second when loading a page that doesn't require authentication
    const loading = inject(LoadingService);

    return auth.isAuthenticated().subscribe({
        next: (res) => {
            if (res) {
                router.navigateByUrl("/home");
                loading.setLoading(false);
                return false;
            } else {
                loading.setLoading(false);
                return true;
            }
        },
        error: () => {
            loading.setLoading(false);
            return true;
        },
    });
};

export const AdminGuard = () => {
    const auth = inject(UserService);
    const router = inject(Router);
    // Hacky way to prevent the navbar from showing for a split second when loading a page that doesn't require authentication
    const loading = inject(LoadingService);

    return auth.isAuthenticated().subscribe({
        next: (res) => {
            if (res) {
                return auth.getCurrentUser().subscribe({
                    next: (user) => {
                        if (user.type === "admin") {
                            loading.setLoading(false);
                            return true;
                        } else {
                            router.navigateByUrl("/home");
                            loading.setLoading(false);
                            return false;
                        }
                    },
                    error: () => {
                        router.navigateByUrl("/login");
                        loading.setLoading(false);
                        return false;
                    },
                });
            } else {
                router.navigateByUrl("/login");
                loading.setLoading(false);
                return false;
            }
        },
        error: () => {
            router.navigateByUrl("/login");
            loading.setLoading(false);
            return false;
        },
        complete: () => {},
    });
};

export const TeacherGuard = () => {
    const auth = inject(UserService);
    const router = inject(Router);
    // Hacky way to prevent the navbar from showing for a split second when loading a page that doesn't require authentication
    const loading = inject(LoadingService);

    return auth.isAuthenticated().subscribe({
        next: (res) => {
            if (res) {
                return auth.getCurrentUser().subscribe({
                    next: (user) => {
                        if (user.type === "teacher" || user.type === "admin") {
                            loading.setLoading(false);
                            return true;
                        } else {
                            router.navigateByUrl("/home");
                            loading.setLoading(false);
                            return false;
                        }
                    },
                    error: () => {
                        router.navigateByUrl("/login");
                        loading.setLoading(false);
                        return false;
                    },
                });
            } else {
                router.navigateByUrl("/login");
                loading.setLoading(false);
                return false;
            }
        },
        error: () => {
            router.navigateByUrl("/login");
            loading.setLoading(false);
            return false;
        },
        complete: () => {},
    });
};
