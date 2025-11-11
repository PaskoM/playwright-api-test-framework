import { APIRequestContext, expect } from "@playwright/test";

export class RequestHandler {
  private request: APIRequestContext;
  private baseURL: string = "";
  private apiPath: string = "";
  private defaultBaseURL: string = "";
  private queryParams: object = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: object = {};

  constructor(request: APIRequestContext, apiBaseURL: string) {
    this.request = request;
    this.defaultBaseURL = apiBaseURL;
    console.log("defaultBaseURL in RequestHandler:", this.defaultBaseURL); // Debugging log
  }

  url(url: string) {
    this.baseURL = url;
    return this;
  }

  path(path: string) {
    this.apiPath = path;
    return this;
  }

  params(params: object) {
    this.queryParams = params;
    return this;
  }

  headers(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }

  body(body: object) {
    this.apiBody = body;
    return this;
  }

  async getRequest(statusCode: number) {
    const url = this.getUrl();
    const response = await this.request.get(url, { headers: this.apiHeaders });
    expect(response.status()).toEqual(statusCode);
    const responseJSON = await response.json();
    return responseJSON;
  }

  async postRequest(statusCode: number) {
    const url = this.getUrl();
    const response = await this.request.post(url, {
      headers: this.apiHeaders,
      data: this.apiBody,
    });
    expect(response.status()).toEqual(statusCode);
    const responseJSON = await response.json();
    return responseJSON;
  }

  async putRequest(statusCode: number) {
    const url = this.getUrl();
    const response = await this.request.put(url, {
      headers: this.apiHeaders,
      data: this.apiBody,
    });
    expect(response.status()).toEqual(statusCode);
    const responseJSON = await response.json();
    return responseJSON;
  }

  async deleteRequest(statusCode: number) {
    const url = this.getUrl();
    const response = await this.request.delete(url, {
      headers: this.apiHeaders,
    });
    expect(response.status()).toEqual(statusCode);
  }

  private getUrl() {
    const url = new URL(
      `${this.baseURL || this.defaultBaseURL}${this.apiPath}`
    );
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }
    return url.toString();
  }
}
