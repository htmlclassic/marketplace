import type { Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import { FormSchema, FormState } from "../types";
import {  SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/src/components/ui/form";
import ProductCharacteristics from "./ProductCharacteristics";
import { removeEmptyCustomCharacteristics } from "../utils";
import FieldError from "./FieldError";

interface Props {
  setForm: Dispatch<SetStateAction<FormState | null>>;
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
  const form = useForm<FormState>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit: SubmitHandler<FormState> = async (data) => {
    const newData: FormState = {
      ...data,
      custom_characterstics: removeEmptyCustomCharacteristics(data.custom_characterstics)
    };

    setForm({ ...newData });
    goToNextStep();
  };

  const type = form.watch('type') ?? '';
  const title = form.watch('title') ?? '';

  return (
    <Form {...form}>
      <form
        className={clsx({
          "flex-col gap-5 w-full": true,
          "flex": show,
          "hidden": !show
        })}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <div className="flex flex-col mb-3">
            <Label htmlFor="product_type" className="flex items-center gap-1">
              Тип товара
              <Badge
                className="rounded-full w-4 h-4 text-xs p-0 flex items-center justify-center -translate-y-[5px]"
                title="Ваш товар - это конкретно что? Примеры: видеокарта, моющее средство, щётка для чистки обуви"
              >?</Badge>
            </Label>
            <Input
              {...form.register('type')}
              id="product_type"
              className="py-5"
            />
            <FieldError error={form.formState.errors.type} />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="product_name" className="flex items-center gap-1">
              Дополнительная информация
              <Badge
                className="rounded-full w-4 h-4 text-xs p-0 flex items-center justify-center -translate-y-[5px]"
                title="Дополнительная информация о товаре, которая также, как и тип товара, будет отражена в заголовке товара"
              >?</Badge>
            </Label>
            <Input
              {...form.register('title')}
              id="product_name"
              className="py-5"
            />
            <FieldError error={form.formState.errors.title} />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Итоговый заголовок товара: {`${type} ${title}`}
          </div>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="product_description">Подробное описание</Label>
          <Textarea
            {...form.register('description')}
            rows={10}
            id="product_description"
          />
          <FieldError error={form.formState.errors.description} />
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
                  <FieldError error={form.formState.errors.category} />
                </FormItem>
              )}
            />    
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product_price">Цена</Label>
          <Input
            {...form.register('price', { valueAsNumber: true })}
            id="product_price"
            className="py-5"
            type="number"
          />
          <FieldError error={form.formState.errors.price} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product_quantity">Количество</Label>
          <Input
            {...form.register('quantity', { valueAsNumber: true })}
            id="product_quantity"
            className="py-5"
            type="number"
          />
          <FieldError error={form.formState.errors.quantity} />
        </div>
        <ProductCharacteristics
          register={form.register}
          errors={form.formState.errors}
        />
        <Button className="p-7">Далее</Button>
      </form>
    </Form>
  );
}