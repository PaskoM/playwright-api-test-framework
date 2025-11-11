import { test as base } from "@playwright/test";
import { RequestHandler } from "./request-handler";
import { APILogger } from "./logger";

type Fixtures = {
  api: RequestHandler;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    const baseURL = "https://conduit-api.bondaracademy.com/api";
    const logger = new APILogger();
    const requestHandler = new RequestHandler(request, baseURL, logger);
    await use(requestHandler);
  },
});

export const expect = test.expect;
