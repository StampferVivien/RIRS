test('preprosti test', () => {
    expect(2 + 2).toBe(4);
  });
  import request from 'supertest';
  import express from 'express';
  import transactionsRouter from './src/transactions.js'; 
  import Transaction from './src/models/transaction.js'; 
  
  const app = express();
  app.use(express.json());
  app.use(transactionsRouter);
  
  // Mock for Transaction model
  jest.mock('./src/models/transaction.js', () => ({
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  }));
  
  describe('Transactions Router', () => {
    test('preprosti test', () => {
      expect(2 + 2).toBe(4);
    });
  
    test('GET /getTransactions should return all transactions', async () => {
      const mockTransactions = [
        { _id: '1', name: 'Transaction 1', amount: 100 },
        { _id: '2', name: 'Transaction 2', amount: 200 },
      ];
      Transaction.find.mockResolvedValue(mockTransactions);
  
      const res = await request(app).get('/getTransactions');
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockTransactions);
      expect(Transaction.find).toHaveBeenCalledTimes(1);
    });
  
    test('POST /newTransaction should handle validation errors', async () => {
      const invalidTransaction = { amount: 150, expense: true, date: '2025-01-01T00:00:00Z' };
      const res = await request(app).post('/newTransaction').send(invalidTransaction);
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  
    test('DELETE /deleteTransaction/:id should delete a transaction', async () => {
      const transactionId = '1';
      Transaction.findByIdAndDelete.mockResolvedValue({ _id: transactionId });
  
      const res = await request(app).delete(`/deleteTransaction/${transactionId}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('transaction deleted');
      expect(Transaction.findByIdAndDelete).toHaveBeenCalledWith(transactionId);
    });
  
    test('PUT /editTransaction/:id should update a transaction', async () => {
      const transactionId = '1';
      const updatedTransaction = { name: 'Updated Transaction', amount: 250 };
      Transaction.findByIdAndUpdate.mockResolvedValue({ ...updatedTransaction, _id: transactionId });
  
      const res = await request(app).put(`/editTransaction/${transactionId}`).send(updatedTransaction);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', transactionId);
      expect(res.body).toHaveProperty('name', 'Updated Transaction');
      expect(Transaction.findByIdAndUpdate).toHaveBeenCalledWith(
        transactionId,
        updatedTransaction,
        { new: true }
      );
    });
  
    test('PUT /editTransaction/:id should handle non-existing transaction during update', async () => {
      const transactionId = 'nonexistent';
      const updatedTransaction = { name: 'Updated Transaction', amount: 250 };
      Transaction.findByIdAndUpdate.mockResolvedValue(null);
  
      const res = await request(app).put(`/editTransaction/${transactionId}`).send(updatedTransaction);
  
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Transaction not found');
    });
  
    test('GET /getTransactions should handle error during fetching transactions', async () => {
      Transaction.find.mockRejectedValue(new Error('Database error'));
  
      const res = await request(app).get('/getTransactions');
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  
    test('POST /newTransaction should handle server errors', async () => {
      const newTransaction = { name: 'New Transaction', amount: 150, expense: true, date: '2025-01-01T00:00:00Z' };
      Transaction.prototype.save.mockRejectedValue(new Error('Database error'));
  
      const res = await request(app).post('/newTransaction').send(newTransaction);
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('POST /newTransaction should return error if required fields are missing', async () => {
      const invalidTransaction = { amount: 150, expense: true, date: '2025-01-01T00:00:00Z' }; 
      const res = await request(app).post('/newTransaction').send(invalidTransaction);
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBeDefined();
    });
  });
  