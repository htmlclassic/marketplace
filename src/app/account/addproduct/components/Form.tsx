'use client';

import { useEffect, useState } from "react";

import type { Form } from "../types";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  categories: string[];
}

const formInitial: Form = {
  title: '',
  description: '',
  category: '',
  price: '',
  quantity: ''
};

export default function Form({ categories }: Props) {
  const [show, setShow] = useState(false);

  const [form, setForm] = useState(formInitial);
  const [step, setStep] = useState<0 | 1>(0);

  const params = useSearchParams();
  const router = useRouter();

  // mui components jump in height when this route hydrates
  // i had to show this route only when mui's js has done its job
  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return;

  return (
    <div className="grow">
      <h2 className="self-center text-lg font-semibold mb-10 text-center">Карточка товара</h2>
      <div className="w-[90%] max-w-[600px] mx-auto">
      <Step1
        form={form}
        setForm={setForm}
        goToNextStep={() => {
          setStep(1);
          router.push('/account/addproduct/?step=1');
        }}
        categories={categories}
        show={step === 0}
      />
      <Step2
        form={form}
        goToPrevStep={() => {
          setStep(0);
          router.back();
        }}
        show={step === 1}
      />
      </div>
    </div>
  );
}

// export default function Form({ categories }: Props) {
//   const supabase = createClientSupabaseClient();
//   const api = getAPI(supabase);

//   const router = useRouter();
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSubmitting(true);

//     const formData = new FormData(e.target as HTMLFormElement);
//     const images = formData.getAll('images');
//     formData.delete('images');
    
//     try {
//       const productId = await uploadProductAction(formData);

//       // upload images
//       for (const image of images) {
//         if (typeof image !== 'string') {
//           // supabase doesn't like russian letters in img name, only english. throws an error. any way to solve it?
//           const randomFileName = 
//             Math.random().toString().split('.')[1]
//             + '.'
//             + image.name.split('.')[1];

//           const { error } = await supabase
//             .storage
//             .from('images')
//             .upload(`${productId}/${randomFileName}`, image);
          
//           if (error) console.warn('Couldnt add one of your images: ' + error.message);
//         }
//       }

//       const imgUrls = await api.getImageUrlsByProductId(productId);

//       if (imgUrls) {
//         const { error } = await supabase
//           .from('product')
//           .update({ img_urls: imgUrls })
//           .eq('id', productId);
//       }

//       router.refresh();
//       router.push('/');
//     } catch(error) {
//       console.log(error);
//     }
//   };

//   return (
//     <form
//       className="flex flex-col w-[95%] sm:w-[500px] m-auto gap-4 rounded-lg"
//       onSubmit={handleSubmit}
//     >
//       <h2 className="self-center text-lg font-semibold mb-10">Карточка товара</h2>
//       <label className="flex flex-col gap-2">
//         Название:
//         <textarea required rows={2} name="title" className="border p-1 rounded bg-gray-50 focus:outline-none focus:bg-white" ></textarea>
//       </label>
//       <label className="flex flex-col gap-2">
//         Описание:
//         <textarea required rows={10} name="description" className="border p-1 rounded bg-gray-50 focus:outline-none focus:bg-white" ></textarea>
//       </label>
//       <label className="flex flex-col gap-2">
//         Категория:
//         <select name="category" className="py-2 px-3 rounded border">
//         <option value="">Выбрать категорию</option>
//         {
//           categories.map(name =>
//             <option key={name} value={name}>{name}</option>
//           )
//         }
//       </select>
//       </label>
//       <label className="flex flex-col gap-2">
//         Цена:
//         <input min="1" max="2147483647" required type="number" name="price" className="border p-1 rounded bg-gray-50 focus:outline-none focus:bg-white" />
//       </label>
//       <label className="flex flex-col gap-2">
//         Количество:
//         <input min="1" max="32767" required type="number" name="quantity" className="border p-1 rounded bg-gray-50 focus:outline-none focus:bg-white" />
//       </label>
//       <div className="flex flex-col">
//         <input required type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/svg+xml,image/webp" multiple name="images" />
//       </div>
//       <button type="submit" className="border rounded-md p-2 transition-all hover:border-black">Выставить на продажу</button>

//       <div className={`${submitting ? 'flex ' : 'hidden '} rounded-lg bg-white opacity-90 fixed top-0 left-0 w-full h-full justify-center items-center flex-col gap-2`}>
//         <LoadingSpinner />
//         <div>Добавляем ваш товар</div>
//       </div>
//     </form>
//   );
// }