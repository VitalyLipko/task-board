import { createWriteStream, mkdir } from 'fs';
import { access, unlink } from 'fs/promises';
import { FileUpload } from 'graphql-upload/Upload';
import { GraphQLError } from 'graphql/error';
import { finished } from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import { File } from '../models/interfaces/file.interface';

class FileStorageService {
  async save(file: FileUpload): Promise<File> {
    const { createReadStream, filename: name, mimetype: mimeType } = await file;
    const stream = createReadStream();
    const fileId = `${uuidv4()}_${name}`;
    const errorMessage = `Cannot save ${name}`;

    await access(config.fileStoragePath).catch(() =>
      mkdir(config.fileStoragePath, (err) => {
        if (err) {
          console.log(err.message);
          throw new GraphQLError(errorMessage);
        }
      }),
    );

    const out = createWriteStream(`${config.fileStoragePath}/${fileId}`);
    stream.pipe(out);

    const finishedPromise = promisify(finished);
    await finishedPromise(out).catch((err) => {
      console.log(err);
      throw new GraphQLError(errorMessage);
    });

    return {
      name,
      mimeType,
      url: `${config.host}:${config.port}/api/v1/file-storage/${fileId}`,
    };
  }

  async delete(url: string): Promise<void> {
    const fileId = url.split(
      `${config.host}:${config.port}/api/v1/file-storage/`,
    )[1];
    await unlink(`${config.fileStoragePath}/${fileId}`).catch((err) =>
      console.log(err),
    );
  }
}

export default new FileStorageService();
