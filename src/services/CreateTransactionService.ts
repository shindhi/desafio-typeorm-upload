import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const createCategory = new CreateCategoryService();
    const referringCategory = await createCategory.execute({ title: category });

    const balance = await transactionRepository.getBalance();
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Value goes beyond cash.');
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: referringCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
