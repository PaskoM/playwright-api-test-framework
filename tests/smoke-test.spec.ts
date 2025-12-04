import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import articleRequestPayload from "../request-objects/POST-article.json";
import { faker } from "@faker-js/faker";
import { getNewRandomArticle } from "../utils/data-generator";

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
  const articleRequest = getNewRandomArticle();
  const newArticleResponse = await api
    .path("/articles/")
    .body(articleRequest)
    .postRequest(201);
  await expect(newArticleResponse).shouldMatchSchema(
    "articles",
    "POST_articles",
    true
  );
  expect(newArticleResponse.article.title).shouldEqual(
    articleRequest.article.title
  );
  const slugId = newArticleResponse.article.slug;

  const articlesListResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesListResponse.articles[0].title).shouldEqual(
    articleRequest.article.title
  );

  await api.path(`/articles/${slugId}`).deleteRequest(204);

  const articlesResponseRow = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseRow.articles[0].title).not.shouldEqual(
    articleRequest.article.title
  );
});

test("Create, Update and Delete article", async ({ api }) => {
  const articleTitle = faker.lorem.sentence(5);
  const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload)); //parallel execution
  articleRequest.article.title = articleTitle;
  const newArticleResponse = await api
    .path("/articles/")
    .body(articleRequest)
    .postRequest(201);
  expect(newArticleResponse.article.title).shouldEqual(articleTitle);
  const slugId = newArticleResponse.article.slug;

  const updatedArticleTitle = faker.lorem.sentence(5);
  articleRequest.article.title = updatedArticleTitle;
  const updatedArticleResponse = await api
    .path(`/articles/${slugId}`)
    .body(articleRequest)
    .putRequest(200);
  expect(updatedArticleResponse.article.title).shouldEqual(updatedArticleTitle);
  const newSlugId = updatedArticleResponse.article.slug;

  await api.path(`/articles/${newSlugId}`).deleteRequest(204);

  const articlesResponseRow = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseRow.articles[0].title).not.shouldEqual(
    updatedArticleTitle
  );
});
