const xlsx = require('xlsx');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const User = require('../models/User');
const { sendLowBalanceEmail } = require('../utils/sendLowBalanceEmail');

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validation Check for missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if date is in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const enteredDate = new Date(date);
    if (enteredDate > today) {
      return res.status(400).json({ message: "Cannot add expense for future date" });
    }

    // Calculate Balance Before Adding
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const remainingBalance = totalIncome - totalExpense;

    if (Number(amount) > remainingBalance) {
      return res.status(400).json({ message: "Insufficient balance. Cannot add this expense." });
    }

    // Create New Expense
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();

    // Recalculate balance after adding this expense
    const newRemainingBalance = remainingBalance - amount;
    let balancePercentage = 100;
if (totalIncome > 0) {
  balancePercentage = (newRemainingBalance / totalIncome) * 100;
}
    // Notify if balance <= 10%
    const user = await User.findById(userId);

    if (balancePercentage <= 10 && !user.lowBalanceNotified) {
    await sendLowBalanceEmail(user, newRemainingBalance);
      user.lowBalanceNotified = true;
      console.log("balance low");
      console.log(user.lowBalanceNotified)
      await user.save();
    } else if (balancePercentage > 10 && user.lowBalanceNotified) {
      user.lowBalanceNotified = false;
      await user.save();
    }
console.log(user.lowBalanceNotified)
    res.status(200).json(newExpense);
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expense Source
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = `expense_${userId}.xlsx`;
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    console.error("Download Excel Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
