import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const [balance, setBalance] = useState(0);

  // Fetch Expenses
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Income
  const fetchIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Error fetching income:", error);
    }
  };

  // Calculate balance from income and expenses
  const calculateBalance = () => {
    const totalIncome = incomeData.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const totalExpense = expenseData.reduce((acc, cur) => acc + Number(cur.amount), 0);
    setBalance(totalIncome - totalExpense);
  };

  // Add Expense
 const handleAddExpense = async (expense) => {
  const { category, amount, date, icon } = expense;

  if (!category.trim()) {
    toast.error("Category is required.");
    return;
  }

  const expenseAmount = Number(amount);
  if (!expenseAmount || isNaN(expenseAmount) || expenseAmount <= 0) {
    toast.error("Amount should be a valid number greater than 0.");
    return;
  }

  if (!date) {
    toast.error("Date is required.");
    return;
  }

  // Check for future date
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(24, 24, 0, 0); // Strip time for comparison

  if (selectedDate > today) {
    toast.error("You cannot add expenses for future dates.");
    return;
  }

  if (expenseAmount > balance) {
    toast.error("Insufficient balance. Cannot add this expense.");
    return;
  }

  try {
    await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
      category,
      amount: expenseAmount,
      date,
      icon,
    });

    setOpenAddExpenseModal(false);
    toast.success("Expense added successfully");
    await fetchExpenseDetails();
    calculateBalance();
  } catch (error) {
    console.error("Error adding expense:", error.response?.data?.message || error.message);
  }
};

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      await fetchExpenseDetails();
      calculateBalance();
    } catch (error) {
      console.error("Error deleting expense:", error.response?.data?.message || error.message);
    }
  };

  // Download
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchIncomeDetails(), fetchExpenseDetails()]);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    calculateBalance();
  }, [incomeData, expenseData]);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ExpenseOverview
              transactions={expenseData}
              balance={balance}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
