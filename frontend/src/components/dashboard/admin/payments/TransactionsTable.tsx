"use client";
import useGetAllPaymentTransactions from "@/hooks/useGetAllPaymentTransactions";
import React from "react";
import { Table } from "antd";

const TransactionsTable = () => {
   const { data: transactions } = useGetAllPaymentTransactions();

   const dataSource = transactions.map((payment) => ({
      key: payment._id,
      name: `${payment.studentId.firstName} ${payment.studentId.lastName}`,
      matricNo: payment.studentId.admissionNumber,
      paymentRefID: payment.reference,
      date: new Date(payment.transactionDate).toLocaleDateString(),
      amount: `₦${payment.amount.toLocaleString()}`,
      type: payment.paymentType,
      status: payment.status,
   }));
   return (
      <div>
         <Table
            dataSource={dataSource}
            columns={columns}
         />
         ;
      </div>
   );
};

export default TransactionsTable;