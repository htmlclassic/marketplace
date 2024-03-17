import type { Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import { z } from "zod";
import { FormSchema } from "../types";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/src/components/ui/form";

interface Props {
  setForm: Dispatch<SetStateAction<z.infer<typeof FormSchema> | null>>;
  goToNextStep: () => void;
  categories: string[];
  show: boolean;
}

export default function Step1({
  setForm,
  categories,
  goToNextStep,
  show
}: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setForm({ ...data });
    goToNextStep();
  };

  return (
    <Form {...form}>
    <form
      className={clsx({
        "flex-col gap-3 w-full": true,
        "flex": show,
        "hidden": !show
      })}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor="product_name">Наименование</Label>
        <Input
          {...form.register('title')}
          id="product_name"
          className="py-5"
        />
        <Error error={form.formState.errors.title} />
      </div>
      <div>
        <Label htmlFor="product_description">Описание</Label>
        <Textarea
          {...form.register('description')}
          rows={10}
          id="product_description"
        />
        <Error error={form.formState.errors.description} />
      </div>
      <div>
        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <Label>Категория
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="font-normal py-5">
                      <SelectValue placeholder="Выбрать категорию" />
                    </SelectTrigger>
                    <SelectContent {...form.register('category')}>
                      {
                        categories.map(name =>
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        )
                      }
                    </SelectContent>
                  </Select>
                </Label>
                <Error error={form.formState.errors.category} />
              </FormItem>
            )}
          />    
      </div>
      <div>
        <Label htmlFor="product_price">Цена</Label>
        <Input
          {...form.register('price', { valueAsNumber: true })}
          id="product_price"
          className="py-5"
        />
        <Error error={form.formState.errors.price} />
      </div>
      <div>
        <Label htmlFor="product_quantity">Количество</Label>
        <Input
          {...form.register('quantity', { valueAsNumber: true })}
          id="product_quantity"
          className="py-5"
        />
        <Error error={form.formState.errors.quantity} />
      </div>
      <Button className="p-7">Далее</Button>
    </form>
    </Form>
  );
}

function Error({ error }: { error: FieldError | undefined }) {
  return (
    error &&
      <div className="text-sm text-red-400 mt-2">{error.message}</div>
  );
}