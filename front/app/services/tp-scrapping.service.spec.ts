import { TestBed } from "@angular/core/testing";

import { TpScrappingService } from "./tp-scrapping.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe("TpScrappingService", () => {
    let service: TpScrappingService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TpScrappingService],
        });
        service = TestBed.inject(TpScrappingService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
