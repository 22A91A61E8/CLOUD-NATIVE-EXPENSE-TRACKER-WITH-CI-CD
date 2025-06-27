const xlsx = require("xlsx");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const User = require("../models/User");

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date)
    });

    await newIncome.save();

    // 👇 Recalculate balance and reset lowBalanceNotified if needed
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    let balancePercentage = 100;
    if (totalIncome > 0) {
      balancePercentage = (balance / totalIncome) * 100;
    }

    const user = await User.findById(userId);

    // 👇 Reset the flag so user can receive low-balance email again later
    if (balancePercentage > 10 && user.lowBalanceNotified) {
      user.lowBalanceNotified = false;
      await user.save();
      console.log("Balance above 10%, resetting lowBalanceNotified");
    }

    res.status(200).json(newIncome);
  } catch (error) {
    console.error("Add Income Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Income Sources
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(), // Optional: format date
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const filePath = `income_${userId}.xlsx`;
    xlsx.writeFile(wb, filePath);
    res.download(filePath);
  } catch (error) {
    console.error("Download Income Excel Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
