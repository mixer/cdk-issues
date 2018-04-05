import * as  crypto from "crypto";
import * as  zlib from "zlib";

module.exports = (context: any) => {
  if (!context.req.body || typeof context.req.body.data !== "string") {
    return context.done(null, {
      res: {
        status: 400,
        body: "Missing data in request"
      }
    });
  }

  const id = crypto.randomBytes(8).toString("hex");
  const password = crypto.randomBytes(32);
  const originalData = Buffer.from(context.req.body.data);

  const cipher = crypto.createCipher("aes-256-ctr", password);
  const zippedData = zlib.gzipSync(originalData, { level: 9 });
  const encryptedData = Buffer.concat([
    cipher.update(zippedData),
    cipher.final()
  ]).toString("base64");

  context.done(null, {
    res: {
      status: 200,
      body: { id, password }
    },
    document: {
      id,
      data: encryptedData
    }
  });
};
