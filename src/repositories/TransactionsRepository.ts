import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balances = await this.find();

    const balance = balances.reduce(
      (accumulator, { type, value }) => {
        return {
          ...accumulator,
          [type]: accumulator[type] + value,
        };
      },
      { income: 0, outcome: 0 },
    );

    return {
      ...balance,
      total: balance.income - balance.outcome,
    };
  }
}

export default TransactionsRepository;
