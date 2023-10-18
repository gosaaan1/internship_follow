import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

// NOTE busboy を使ってみた
// https://www.npmjs.com/package/busboy
const busboy = require('busboy');

// https://stackoverflow.com/questions/72544409/unexpected-end-of-form-error-when-using-multer
// https://nextjs.org/docs/pages/building-your-application/routing/api-routes#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
}

const API_URL: string = 'http://compreface/api/v1/detection/detect';
const API_KEY: string = '7700b4a7-bd1f-4063-9115-7f125371cf80';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const formData = new FormData();
    const customHeaders = {
      'x-api-key': API_KEY
    };

    new Promise((resolve, reject) => {
      // フォームデータの解析
      // https://qiita.com/takamura_s/items/b7cbfbb5ba2879b81f5c
      const bb = busboy({ headers: req.headers });
      bb.on('file', (name: string, file: Readable, info: any) => {
        const { mimeType } = info;
        const chunks: Array<Uint8Array> = [];
        file.on('data', (chunk: any) => {
          console.log(`File [${name}] got ${chunk.length} bytes`);
          chunks.push(chunk);
        }).on('close', () => {
          console.log(`File [${name}] done`);
          // https://developer.mozilla.org/ja/docs/Web/API/File/File
          resolve(new File(chunks, name, {type: mimeType}));
        });
      });
      bb.on('close', () => {
        console.log('Done parsing form!');
      });
      req.pipe(bb);
    }).then((file: any) => {
      const formData = new FormData();
      formData.append('file', file);

      const customHeaders = {
        'content-Type': 'multipart/form-data',
        'x-api-key': API_KEY
      };

      console.log(`POST to ${API_URL}`);
      // fetch(API_URL, {
      //   method: 'POST',
      //   headers: customHeaders,
      //   body: formData
      fetch('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'GET',
      }).then((response) => {
        return response.json();
      }).then((jsonData) => {
        console.log(jsonData);
        res.status(200).json(jsonData);
      }).catch((error) => {
        console.log(error);
        res.status(200).json({'message': 'post failed'});
      });
    });

    // fetch('https://jsonplaceholder.typicode.com/todos/1', {
    //   method: 'GET',
    // }).then((response) => {
    //   return response.json();
    // }).then((jsonData) => {
    //   console.log(jsonData);
    //   res.status(200).json(jsonData);
    // }).catch((error) => {
    //   console.log(error);
    //   res.status(200).json({'message': 'post failed'});
    // });
  } else {
    return res.status(405).end();
  }
}
