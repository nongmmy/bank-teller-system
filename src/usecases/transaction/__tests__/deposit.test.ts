import { Account } from "../../../domain/models/account";
import { AccountRepositoryInterface } from "../../../domain/repositories/accountRepository.interface";
import { DepositUsecase } from "../deposit.usecase";

describe('DepositUseCase', () => {
  let depositUsecase: DepositUsecase;
  let mockAccountRepository: jest.Mocked<AccountRepositoryInterface>;

  beforeEach(() => {
    // Create a mock of the AccountRepository interface
    mockAccountRepository = {
      findOne: jest.fn(),
      updateAccount: jest.fn(),
    };

    depositUsecase = new DepositUsecase(mockAccountRepository);
  });

  it('should deposit successfully', async () => {
    const accountId = 'acc-123';
    const amount = 100;

    const mockAccount = {
      accountId,
      balance: 0
    } as Account;
    mockAccountRepository.findOne.mockResolvedValue(mockAccount);

    const mockUpdatedAccount = {
      ...mockAccount,
      balance: 100,
    };
    mockAccountRepository.updateAccount.mockResolvedValue(mockUpdatedAccount);

    const result = await depositUsecase.execute(accountId, amount);

    expect(result.balance).toBe(100);
  });

  it('should throw an error if the account does not exist', async () => {
    const accountId = 'no-acc';

    mockAccountRepository.findOne.mockResolvedValue(null);

    await expect(depositUsecase.execute(accountId, 100)).rejects.toThrow(
      `Account with ID ${accountId} does not exist.`
    );
  });
});