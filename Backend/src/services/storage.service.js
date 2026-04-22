import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.MULTER_PUBLIC_KEY,
  privateKey: config.MULTER_PRIVATE_KEY,
  urlEndpoint: config.MULTER_URL_ENDPOINT,
});

export async function uploadImage({ buffer, fileName, folder = "snitch" }) {
  const result = await client.files.upload({
    file: await ImageKit.toFile(buffer),
    fileName,
    folder,
  });

  return result;
}
