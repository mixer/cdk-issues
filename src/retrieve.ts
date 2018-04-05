import * as crypto from 'crypto';
import * as zlib from 'zlib';

module.exports = (context: any, input: any) => {
  if (!context.bindings.document) {
    return context.done(null, {
      res: {
        status: 404,
        body: 'Document not found',
      },
    });
  }

  const password = Buffer.from(context.req.body.password, 'base64');
  const cipher = crypto.createDecipher('aes-256-ctr', password);
  const encryptedData = Buffer.from(context.bindings.document.data, 'base64');
  const zippedData = Buffer.concat([cipher.update(encryptedData), cipher.final()]);

  context.done(null, {
    res: {
      status: 200,
      body: JSON.parse(zlib.gunzipSync(zippedData).toString('utf8')),
    },
  });
};
