# cdk-issues

Azure function scripts that store reports of issues with the control development kit.

### Why?

 - We want to track issues via Github and get as much information as possible, including editor state.
 - Editor state may contain private or confidental data which the user doesn't want to share.
 - Github limits the amount of data we can pre-seed into an issue.

### Solution

We create a pair of Azure functions to store and retrieve issue data. When we store data, we AES encrypt the data and give the user a reference and password they can include in the issue. If they don't want to include their editor dump, they can simply discard the password, and no one (including us) will be able to see their editor state.

### API

**`POST /api/issues`** with a body containing `{"data":"some-string"}`. The issue ID and password is returned.

```http
PUT /api/issues HTTP/1.1

{
    "data": "foo"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "id": "d3a1a8815b058d2e",
    "password": "sVTv74o4OLhyddB4QwoH6KKsj1mPcbbvHAUp0Ut0sCk="
}
```

**`POST /api/issues/{issueId}decrypt`** with a body containing `{"password":"base64-password"}`. The issue data is returned. Requires auth.

```http
POST /api/issues/d3a1a8815b058d2e/decrypt HTTP/1.1

{
    "password": "sVTv74o4OLhyddB4QwoH6KKsj1mPcbbvHAUp0Ut0sCk="
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

"foo"
```

### Internal Notes

To retrieve info about an issue, set the `CDK_ISSUE_KEY` to the auth key for the Azure function. Run `node unlock` and follow the prompts to retrieve data associated with an issue. [`direnv`](https://direnv.net/) is great.

Deployment is copy-pasting built code into the UI for now. We'll automate it when this repo goes public.
