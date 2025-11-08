import { test, expect } from "@playwright/test";

test("Get Test Tags", async ({ request }) => {
  const tagsResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags"
  );
  const tagsDataJSON = await tagsResponse.json();
  expect(tagsResponse.status()).toBe(200);
  expect(tagsDataJSON.tags[0]).toEqual("Test");
  expect(tagsDataJSON.tags.length).toBeLessThanOrEqual(10);
});

test("Get All Articles", async ({ request }) => {
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0"
  );
  const articlesDataJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toBe(200);
  expect(articlesDataJSON.articlesCount).toEqual(10);
});

test("Create and Delete Article", async ({ request }) => {
  //auth
  const tokenResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: { email: "paskomariola@gmail.com", password: "Mariola1!" },
      },
    }
  );
  const tokenResponseJson = await tokenResponse.json();
  const authToken = "Token " + tokenResponseJson.user.token;

  //create article
  const newArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "Test Article ",
          description: "Test Article Subject",
          body: "Test Article Description",
          tagList: [],
        },
      },
      headers: {
        Authorization: authToken,
      },
    }
  );
  const newArticleResponseJSON = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual("Test Article ");
  const slugId = newArticleResponseJSON.article.slug;

  //check the list of articles
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
    {
      headers: {
        Authorization: authToken,
      },
    }
  );
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles[0].title).toEqual("Test Article ");

  //delete article
  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      headers: {
        Authorization: authToken,
      },
    }
  );
  expect(deleteArticleResponse.status()).toEqual(204);
});
