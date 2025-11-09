import { test as base } from "@playwright/test";
import { RequestHandler } from "./request-handler";

type Fixtures = {
  api: RequestHandler;
};

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const requestHandler = new RequestHandler();
    await use(requestHandler);
  },
});

export const expect = test.expect;
