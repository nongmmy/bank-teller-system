import { Account } from "../../../domain/models/account";
import { AccountRepositoryInterface } from "../../../domain/repositories/accountRepository.interface";
import { TransferUsecase } from "../transfer.usecase";

describe('TransferUseCase', () => {
  let transferUsecase: TransferUsecase;
  let mockAccountRepository: jest.Mocked<AccountRepositoryInterface>;

  beforeEach(() => {
    // Create a mock of the AccountRepository interface
    mockAccountRepository = {
      findOne: jest.fn(),
      updateAccount: jest.fn(),
    };

    transferUsecase = new TransferUsecase(mockAccountRepository);
  });

  it('should transfer successfully', async () => {
    const fromAccountId = 'acc-123';
    const toAccountId = 'acc-567';
    const amount = 100;

    const mockFromAccount = {
      accountId: fromAccountId,
      balance: 200
    } as Account;
    mockAccountRepository.findOne.mockResolvedValueOnce(mockFromAccount);

    const mockToAccount = {
      accountId: toAccountId,
      balance: 0
    } as Account;
    mockAccountRepository.findOne.mockResolvedValueOnce(mockToAccount);

    const mockUpdatedFromAccount = {
      ...mockFromAccount,
      balance: 100,
    };
    mockAccountRepository.updateAccount.mockResolvedValueOnce(mockUpdatedFromAccount);

    const mockUpdatedToAccount = {
      ...mockToAccount,
      balance: 100,
    };
    mockAccountRepository.updateAccount.mockResolvedValueOnce(mockUpdatedToAccount);

    const { fromAccount, toAccount } = await transferUsecase.execute(fromAccountId, toAccountId, amount);

    expect(fromAccount.balance).toBe(100);
    expect(toAccount.balance).toBe(100);
  });

  it('should throw an error if the account does not exist', async () => {
    const fromAccountId = 'no-acc-1';
    const toAccountId = 'no-acc-2';
    const amount = 100;

    mockAccountRepository.findOne.mockResolvedValue(null);

    await expect(transferUsecase.execute(fromAccountId, toAccountId, amount)).rejects.toThrow(
      `From account with ID ${fromAccountId} does not exist.`
    );
  });

  it('should throw an error if the balance is insufficient', async () => {
    const fromAccountId = 'acc-123';
    const toAccountId = 'acc-567';
    const amount = 300;

    const mockFromAccount = {
      accountId: fromAccountId,
      balance: 200
    } as Account;
    mockAccountRepository.findOne.mockResolvedValueOnce(mockFromAccount);

    const mockToAccount = {
      accountId: toAccountId,
      balance: 0
    } as Account;
    mockAccountRepository.findOne.mockResolvedValueOnce(mockToAccount);

    await expect(transferUsecase.execute(fromAccountId, toAccountId, amount)).rejects.toThrow(
      `Cannot transfer ${amount}, Balance is ${mockFromAccount.balance}.`
    );
  });
});