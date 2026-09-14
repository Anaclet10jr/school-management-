import React, { useState } from 'react';
import {
  Coins,
  Receipt,
  Plus,
  Search,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Building,
  CreditCard,
  DollarSign,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Payment, Student, FeeStructure, PaymentMethod } from '../../types';
import { Language, translations } from '../../locales/translations';

interface FeesManagementProps {
  payments: Payment[];
  students: Student[];
  feeStructures: FeeStructure[];
  onAddPayment: (payment: Payment) => void;
  language: Language;
  initialTab?: 'payments' | 'structures' | 'reports';
}

export const FeesManagement: React.FC<FeesManagementProps> = ({
  payments,
  students,
  feeStructures,
  onAddPayment,
  language,
  initialTab,
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'payments' | 'structures' | 'reports'>(initialTab || 'payments');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [search, setSearch] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // New Payment Form
  const [newPayStudentId, setNewPayStudentId] = useState(students[0]?.id || '');
  const [newPayAmount, setNewPayAmount] = useState<number>(150000);
  const [newPayMethod, setNewPayMethod] = useState<PaymentMethod>('MTN Mobile Money');
  const [newPayRef, setNewPayRef] = useState(`MTN-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [newPayNote, setNewPayNote] = useState('Term 2 Tuition fees installment');

  // Calculations
  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalOutstanding = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);
  const fullyPaidCount = students.filter((s) => s.feeBalance === 0).length;
  const partialPaidCount = students.filter((s) => s.feeBalance > 0).length;

  const filteredPayments = payments.filter(
    (p) =>
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === newPayStudentId);
    if (!st) return;

    const receiptNumber = `RCT-2026-${String(payments.length + 85).padStart(5, '0')}`;
    const paymentRecord: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      className: st.className,
      amount: Number(newPayAmount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: newPayMethod,
      referenceNumber: newPayRef,
      receivedBy: 'Diane Mukamana (Bursar)',
      academicYear: '2025-2026',
      term: 'Term 2',
      feeType: 'Tuition & Academic Fees',
      note: newPayNote,
    };

    onAddPayment(paymentRecord);
    setIsPaymentModalOpen(false);
    setSelectedReceipt(paymentRecord); // auto show receipt
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Financial Summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600" />
            <span>Fees & Finance Management (RWF)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rwandan Francs tuition tracking, MTN Mobile Money & Airtel integrations, and official vouchers.
          </p>
        </div>

        <button
          onClick={() => {
            setNewPayRef(`MTN-${Math.floor(10000000 + Math.random() * 90000000)}`);
            setIsPaymentModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Fee Payment</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Total Collected (Term 2)
          </span>
          <p className="text-xl font-black text-emerald-700 mt-2">
            RWF {totalCollected.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Processed via Bank & Mobile Money</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Outstanding Arrears
          </span>
          <p className="text-xl font-black text-rose-600 mt-2">
            RWF {totalOutstanding.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Expected recovery before exams</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Paid in Full
          </span>
          <p className="text-xl font-black text-slate-900 mt-2">{fullyPaidCount} Students</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Zero balance status</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Partial Balances
          </span>
          <p className="text-xl font-black text-amber-600 mt-2">{partialPaidCount} Students</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Active payment plans</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'payments'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Payment Transactions & Receipts
        </button>
        <button
          onClick={() => setActiveTab('structures')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'structures'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Configured Fee Structures
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'reports'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Outstanding Balances by Student
        </button>
      </div>

      {/* TAB 1: PAYMENTS LIST */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search payments by student, receipt, or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Student & Class</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Reference No</th>
                  <th className="py-3 px-4 text-right">Amount (RWF)</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Receipt Voucher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{p.studentName}</span>
                      <span className="text-[11px] text-slate-400 block">{p.className}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.paymentMethod.includes('MTN')
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : p.paymentMethod.includes('Airtel')
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>{p.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{p.referenceNumber}</td>
                    <td className="py-3 px-4 text-right font-black text-emerald-800 text-sm">
                      RWF {p.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{p.paymentDate}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-xs font-bold text-slate-700 transition-colors flex items-center gap-1 mx-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FEE STRUCTURES */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feeStructures.map((fee) => (
            <div key={fee.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {fee.educationLevel}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{fee.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total per Term</span>
                  <span className="text-base font-black text-slate-900">
                    RWF {fee.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span>Tuition & Instructional Material:</span>
                  <strong className="text-slate-800">RWF {fee.tuitionFee.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span>Meals & Catering:</span>
                  <strong className="text-slate-800">RWF {fee.mealsFee.toLocaleString()}</strong>
                </div>
                {fee.boardingFee && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span>Boarding & Accommodation:</span>
                    <strong className="text-slate-800">RWF {fee.boardingFee.toLocaleString()}</strong>
                  </div>
                )}
                {fee.registrationFee && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span>Registration / Administrative Levy:</span>
                    <strong className="text-slate-800">RWF {fee.registrationFee.toLocaleString()}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: OUTSTANDING BALANCES REPORT */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Student Fee Ledgers & Arrears
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Guardian Phone</th>
                  <th className="py-3 px-4 text-right">Fee Balance (RWF)</th>
                  <th className="py-3 px-4 text-center">Settlement Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {st.firstName} {st.lastName}
                    </td>
                    <td className="py-3 px-4">{st.className}</td>
                    <td className="py-3 px-4 text-slate-600">{st.guardians[0]?.phone || '—'}</td>
                    <td className="py-3 px-4 text-right font-black">
                      {st.feeBalance > 0 ? (
                        <span className="text-rose-600">RWF {st.feeBalance.toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-700">RWF 0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.feeBalance === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.feeBalance === 0 ? 'Fully Paid' : 'Outstanding Arrears'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {st.feeBalance > 0 && (
                        <button
                          onClick={() => {
                            setNewPayStudentId(st.id);
                            setNewPayAmount(st.feeBalance);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-bold text-[11px]"
                        >
                          Collect Fee
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Fee Payment (RWF)</h3>
              <button onClick={() => setIsPaymentModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  value={newPayStudentId}
                  onChange={(e) => setNewPayStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600 bg-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.className}) - Balance: RWF {st.feeBalance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount in RWF *</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={newPayAmount}
                  onChange={(e) => setNewPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-emerald-800 text-sm outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={newPayMethod}
                  onChange={(e) => setNewPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600 bg-white font-medium"
                >
                  <option value="MTN Mobile Money">MTN Mobile Money (MoMo)</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Bank">Bank Transfer (Bank of Kigali / Equity)</option>
                  <option value="Cash">Cash at Bursary Counter</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Reference Number</label>
                <input
                  type="text"
                  required
                  value={newPayRef}
                  onChange={(e) => setNewPayRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={newPayNote}
                  onChange={(e) => setNewPayNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Issue Receipt & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL PRINTABLE RECEIPT VOUCHER MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 print:m-0 print:p-4">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Official Payment Receipt
                </h3>
                <p className="text-xs text-slate-500">Kigali Academic Academy • Gasabo, Kigali</p>
                <span className="font-mono text-xs font-bold text-emerald-800 block mt-1">
                  Receipt No: {selectedReceipt.receiptNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="print:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Received From (Student):</span>
                <strong className="text-slate-900">{selectedReceipt.studentName} ({selectedReceipt.className})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Date of Payment:</span>
                <strong className="text-slate-800">{selectedReceipt.paymentDate}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Channel:</span>
                <strong className="text-slate-800">{selectedReceipt.paymentMethod}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Reference / TxID:</span>
                <strong className="text-slate-800 font-mono">{selectedReceipt.referenceNumber}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Fee Purpose:</span>
                <strong className="text-slate-800">{selectedReceipt.feeType}</strong>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between border border-emerald-200 mt-3">
                <span className="font-bold text-emerald-900 text-xs">AMOUNT PAID:</span>
                <span className="text-lg font-black text-emerald-800">
                  RWF {selectedReceipt.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Bursary Authorized: {selectedReceipt.receivedBy}</span>
              <span className="font-mono">Official Seal: [VALIDATED]</span>
            </div>

            <div className="print:hidden flex justify-end gap-2 mt-5">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
