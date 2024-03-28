import { ChangeEvent, FormEvent, useState } from "react";
import uploadProductAction from "../actions";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { getAPI } from "@/supabase/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import MuiButton from "@mui/material/Button";
import { FormState } from "../types";
import { Button } from "@/src/components/ui/button";
import { UploadIcon, ReloadIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { toast } from 'sonner';

export interface Props {
  form: FormState | null;
  goToPrevStep: () => void;
  show: boolean;
}

// browser opens explorer to choose imgs to download
// user clicks 'cancel', and all of the previos uploaded images are lost.
// to fix this issue, you, probably, should make some checks in handleChange()
// and in handleSubmit() don't use formData, use the state
export default function Step2({ form, goToPrevStep, show }: Props) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const api = getAPI(supabase);

  const [imgs, setImgs] = useState<({ name: string; src: string; })[] | null>(null);
  const [primaryImgName, setPrimaryImgName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const images = formData.getAll('images');
    formData.delete('images');

    try {
      const productId = await uploadProductAction(form);

      // upload images
      for (const image of images) {
        if (typeof image !== 'string') {
          // api method retrieves these images later in ascending order by name column
          // i'm just adding a prefix to an img's name to show primary image of a product first
          const prefix = image.name === primaryImgName ? 'a' : 'b';

          const randomFileName = prefix
            + Math.random().toString().split('.')[1]
            + '.'
            + image.name.split('.')[1];

          const { error } = await supabase
            .storage
            .from('images')
            .upload(`${productId}/${randomFileName}`, image);

          if (error) console.warn('Couldnt add one of your images: ' + error.message);
        }
      }

      const imgUrls = await api.getImageUrlsByProductId(productId);

      if (imgUrls) {
        const { error } = await supabase
          .from('product')
          .update({ img_urls: imgUrls })
          .eq('id', productId);
      }

      router.refresh();
      router.push('/');
    } catch (error: any) {
      setSubmitting(false);
      toast.error(error.message);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImgs: ({ name: string; src: string; })[] = [];

      for (const file of Array.from(e.target.files)) {
        newImgs.push({
          name: file.name,
          src: URL.createObjectURL(file)
        });
      }

      setImgs(newImgs);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx({
        "flex-col gap-3 w-full": true,
        "flex": show,
        "hidden": !show
      })}
    >
      <MuiButton
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        className="w-max flex gap-3 self-center"
      >
        <Icon /> Загрузить изображения
        <input
          onChange={handleChange}
          required
          type="file"
          accept="image/avif,image/gif,image/jpeg,image/png,image/svg+xml,image/webp"
          multiple
          name="images"
          className="[clip:rect(0_0_0_0)] [clipPath:inset(50%)] h-[1] w-[1] overflow-hidden absolute bottom-0 left-0 whitespace-nowrap"
          disabled={submitting}
        />
      </MuiButton>
      {
        imgs && imgs.length !== 0 &&
          <p className="text-sm text-center mt-5">Нажмите на изображение, чтобы сделать его основным для вашего товара.</p>
      }
      <div className="flex flex-wrap justify-center gap-3">
        {
          Array.from(imgs ?? []).map(img =>
            <div
              onClick={() => setPrimaryImgName(img.name)}
              className={clsx({
                "relative aspect-square w-[40%] outline outline-3 outline-offset-4 rounded-lg overflow-hidden cursor-pointer transition-all duration-300": true,
                "outline-slate-600": primaryImgName === img.name,
                "outline-transparent": primaryImgName !== img.name
              })}
              title="Нажмите на изображение, чтобы сделать его основным."
              key={img.name}
            >
              <Image
                src={img.src}
                alt="alt"
                fill
                className="object-cover" />
            </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <Button
          variant="outline"
          type="button"
          onClick={goToPrevStep}
          disabled={submitting}
          className="py-7 w-full relative"
        >
          <ArrowLeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px]" />
          Назад
        </Button>
        <Button
          disabled={submitting}
          className="relative py-7 w-full"
        >
          <div>
            {
              submitting
                ? <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <ReloadIcon className="animate-spin-fast w-[15px] h-[15px]" />
                  </div>
                : <UploadIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px]" />
            }
            {
              submitting ? 'Загружаем ваш товар' : 'Загрузить товар'
            }
          </div>
        </Button>
      </div>
    </form>
  );
}

function Icon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={25}
      height={25}
    >
      <path fill="#FFFFFF" d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M14 13v4h-4v-4H7l5-5 5 5z"></path>
    </svg>
  );
}
