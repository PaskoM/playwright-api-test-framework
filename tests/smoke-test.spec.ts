import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import articleRequestPayload from "../request-objects/POST-article.json";

test("Get articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  await expect(response).shouldMatchSchema("articles", "GET_articles", true);
  expect(response.articlesCount).shouldEqual(10);
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
});

test("Get tags", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);
  await expect(response).shouldMatchSchema("tags", "GET_tags", true);
  expect(response.tags[0]).shouldEqual("Test");
  expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test("Create and delete article", async ({ api }) => {
  const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload)); //parallel execution
  articleRequestPayload.article.title = "Object title";
  const newArticleResponse = await api
    .path("/articles/")
    .body(articleRequest)
    .postRequest(201);
  await expect(newArticleResponse).shouldMatchSchema(
    "articles",
    "POST_articles",
    true
  );
  expect(newArticleResponse.article.title).shouldEqual("Object title");
  const slugId = newArticleResponse.article.slug;

  const articlesListResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesListResponse.articles[0].title).shouldEqual("Object title");

  await api.path(`/articles/${slugId}`).deleteRequest(204);

  const articlesResponseRow = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseRow.articles[0].title).not.shouldEqual("Object title");
});

test("Create, Update and Delete article", async ({ api }) => {
  // Create article
  const newArticleResponse = await api
    .path("/articles/")
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
  await api.path(`/articles/${newSlugId}`).deleteRequest(204);

  const articlesResponseRow = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseRow.articles[0].title).not.shouldEqual(
    "Updated Test Article"
  );
});
