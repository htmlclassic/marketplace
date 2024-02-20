import type { Dispatch, SetStateAction } from "react";
import type { Form } from "../types";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import clsx from "clsx";

interface Props {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
  goToNextStep: () => void;
  categories: string[];
  show: boolean;
}

export default function Step1({
  form,
  setForm,
  categories,
  goToNextStep,
  show
}: Props) {
  return (
    <form
      className={clsx({
        "flex-col gap-3 w-full": true,
        "flex": show,
        "hidden": !show
      })}
      onSubmit={e => {
        e.preventDefault();
        goToNextStep();
      }}
    >
      <TextField
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        label="Название"
        variant="outlined"
        multiline
        name="title"
        required
      />
      <TextField
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        label="Описание"
        rows={10}
        variant="outlined"
        multiline
        name="description"
        required
      />
      <TextField
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
        label="Категория"
        select
        name="category"
        required
      >
        {
          categories.map(name =>
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          )
        }
      </TextField>
      <TextField
        value={form.price}
        onChange={e => {
          let value = e.target.value;
          const MIN = 1;
          const MAX = 2147483647;

          if (Number(value) < MIN) {
            value = String(MIN);
          }

          if (Number(value) > MAX) {
            value = String(MAX)
          }

          setForm({ ...form, price: value });
        }}
        label="Цена"
        variant="outlined"
        type="number"
        name="price"
        required
      />
      <TextField
        value={form.quantity}
        onChange={e => {
          let value = e.target.value;
          const MIN = 1;
          const MAX = 32767;

          if (Number(value) < MIN) {
            value = String(MIN);
          }

          if (Number(value) > MAX) {
            value = String(MAX);
          }

          setForm({ ...form, quantity: value });
        }}
        label="Количество"
        variant="outlined"
        type="number"
        name="quantity"
        required
      />
      <button className="border w-full px-3 py-3 mt-3 self-center hover:border-sky-400 transition-all duration-300">Далее</button>
    </form>
  );
}