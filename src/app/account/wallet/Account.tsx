'use client';

import BankCard from "@/src/components/BankCard";
import Button from "@/src/components/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { walletDeposit } from "./actions";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { numberWithSpaces } from "@/src/utils";

interface Props {
  balance: number;
  walletId: number;
}

export default function Account({ balance: initialBalance, walletId }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [sum, setSum] = useState(0);
  const [step, setStep] = useState<0 | 1>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  let dialogContent: React.ReactNode =
    <div className="py-3 flex flex-col gap-3">
      <TextField
        onChange={e => setSum(+e.target.value)}
        label="Сумма"
        className="w-full"
        type="number"
        required
      />
      <Button
        disabled={!sum}
        onClick={() => {
          if (sum) setStep(1);
        }}
      >К оплате</Button>
    </div>;

  if (step === 1) {
    dialogContent =
      <BankCard
        onSubmit={async () => {
          await walletDeposit(walletId, sum);

          router.refresh();
          handleDialogClose();
          setBalance(balance + sum);
        }}
        sumToPay={sum}
      />;
  }

  return (
    <div className="rounded-3xl border p-5 h-max sm:w-max">
      <h2 className="font-medium text-xl mb-5">Счёт</h2>
      <div className="mb-3 w-max">Текущий баланс: {numberWithSpaces(balance)} ₽</div>
      <Button
        onClick={() => setOpenDialog(true)}
        className="min-w-60 py-3"
      >Пополнить</Button>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        TransitionProps={{
          onExited() {
            setStep(0);
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"   
        PaperProps={{
          className: 'w-full sm:max-w-[500px] flex items-center'
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Пополнение баланса
        </DialogTitle>
        <DialogContent
        >
          { dialogContent }
        </DialogContent>
      </Dialog>
    </div>
  );
}