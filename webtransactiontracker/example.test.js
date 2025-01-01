import { render, screen, fireEvent } from "@testing-library/react";
import NewTransaction from "./src/app/components/transactions/newTransaction";
import TransactionDetails from "./src/app/components/transactions/transactionDetails";
import TransactionList from "./src/app/components/transactions/transactionList";

const mockTransaction = {
    _id: "1",
    name: "Test Transaction",
    amount: 100,
    expense: true,
    date: new Date().toISOString(),
};

const mockTransactions = [
    { _id: "1", name: "Transaction 1", amount: 100, expense: true, date: new Date().toISOString() },
    { _id: "2", name: "Transaction 2", amount: 200, expense: false, date: new Date().toISOString() },
];

describe("NewTransaction Component", () => {
    test("preklopi na tip 'Expense'", () => {
        render(<NewTransaction />);
        fireEvent.click(screen.getByText("Expense"));
        expect(screen.getByText("Expense").classList).toContain("btn-primary");
    });

    test("prikazuje naslov 'New Transaction'", () => {
        render(<NewTransaction />);
        expect(screen.getByText("New Transaction")).toBeInTheDocument();
    });

    test("vnosno polje za ime transakcije je prisotno", () => {
        render(<NewTransaction />);
        expect(screen.getByPlaceholderText("Enter the name of transaction")).toBeInTheDocument();
    });

    test("vnosno polje za znesek je prisotno", () => {
        render(<NewTransaction />);
        expect(screen.getByPlaceholderText("Enter the amount")).toBeInTheDocument();
    });

    test("gumb za shranjevanje transakcije je prisoten", () => {
        render(<NewTransaction />);
        expect(screen.getByText("Save Transaction")).toBeInTheDocument();
    });
});

describe("TransactionDetails Component", () => {
    test("prikazuje podrobnosti transakcije", () => {
        render(<TransactionDetails transaction={mockTransaction} />);
        expect(screen.getByText("Test Transaction")).toBeInTheDocument();
        expect(screen.getByText("€100.00")).toBeInTheDocument();
        expect(screen.getByText("Expense")).toBeInTheDocument();
    });

    test("preklopi v način urejanja", () => {
        render(<TransactionDetails transaction={mockTransaction} />);
        fireEvent.click(screen.getByLabelText("Edit Transaction"));
        expect(screen.getByDisplayValue("Test Transaction")).toBeInTheDocument();
    });

    test("ima gumb za brisanje", () => {
        render(<TransactionDetails transaction={mockTransaction} />);
        expect(screen.getByLabelText("Delete Transaction")).toBeInTheDocument();
    });

    test("spremeni znesek v načinu urejanja", () => {
        render(<TransactionDetails transaction={mockTransaction} />);
        fireEvent.click(screen.getByLabelText("Edit Transaction"));
        const input = screen.getByDisplayValue("100");
        fireEvent.change(input, { target: { value: "150" } });
        expect(input.value).toBe("150");
    });

    test("prikazuje tip transakcije v načinu urejanja", () => {
        render(<TransactionDetails transaction={mockTransaction} />);
        fireEvent.click(screen.getByLabelText("Edit Transaction"));
        expect(screen.getByDisplayValue("Test Transaction")).toBeInTheDocument();
        expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });
});

describe("TransactionList Component", () => {
    test("prikazuje paginacijo", () => {
        render(<TransactionList />);
        expect(screen.getByLabelText("Next")).toBeInTheDocument();
    });



});
