import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parse';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

interface Request {
  docFilename: string;
}

interface TransactionCSV {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ docFilename }: Request): Promise<void> {
    // const transactionRepository = getRepository(Transaction);
    const filePath = path.join(uploadConfig.directory, docFilename);

    const arr: TransactionCSV[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ from_line: 2 }))
      .on('data', line => {
        const [title, value, type, category] = line;

        arr.push({ title, value, type, category });
      })
      .on('end', () => {
        console.log(arr);
      });
  }
}

export default ImportTransactionsService;
