import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";

let authToken: string;

test.beforeAll("Get auth token", async ({ api }) => {
  const tokenResponse = await api
    .path("/users/login")
    .body({
      user: { email: "paskomariola@gmail.com", password: "Mariola1!" },
    })
    .postRequest(200);
  authToken = "Token " + tokenResponse.user.token;
});

test("Get articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(response.articlesCount).shouldEqual(10);
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
});

test("Get tags", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);
  expect(response.tags[0]).shouldEqual("Test");
  expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test("Create and delete article", async ({ api }) => {
  // Create article
  const newArticleResponse = await api
    .path("/articles/")
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Test Article ",
        description: "Test Article Subject",
        body: "Test Article Description",
        tagList: [],
      },
    })
    .postRequest(201);
  expect(newArticleResponse.article.title).shouldEqual("Test Article ");
  const slugId = newArticleResponse.article.slug;

  // Verify article creation
  const articlesListResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesListResponse.articles[0].title).shouldEqual("Test Article ");

  // Delete article
  await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);

  const articlesResponseRow = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseRow.articles[0].title).not.shouldEqual(
    "Test Article "
  );
});

test("Create, Update and Delete article", async ({ api }) => {
  // Create article
  const newArticleResponse = await api
    .path("/articles/")
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Test Article to Update",
        description: "Test Article Subject",
        body: "Test Article Description",
        tagList: [],
      },
    })
    .postRequest(201);
  expect(newArticleResponse.article.title).shouldEqual(
    "Test Article to Update"
  );
  const slugId = newArticleResponse.article.slug;

  // Update article
  const updatedArticleResponse = await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Updated Test Article",
        description: "Updated Subject",
        body: "Updated Description",
        tagList: ["updated"],
      },
    })
    .putRequest(200);
  expect(updatedArticleResponse.article.title).shouldEqual(
    "Updated Test Article"
  );
  const newSlugId = updatedArticleResponse.article.slug;

  // Delete article
  await api
    .path(`/articles/${newSlugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);

  const articlesResponseRow = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseRow.articles[0].title).not.shouldEqual(
    "Updated Test Article"
  );
});
