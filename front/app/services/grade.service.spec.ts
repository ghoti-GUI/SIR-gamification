import { TestBed } from "@angular/core/testing";

import { GradeService } from "./grade.service";
import { HttpClientModule } from "@angular/common/http";

describe("GradeService", () => {
    let service: GradeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [GradeService],
        });
        service = TestBed.inject(GradeService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
