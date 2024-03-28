import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormStatus } from "react-dom";

interface Props {
  setProfileData: Dispatch<SetStateAction<Profile>>;
}

export default function SubmitButton({ setProfileData }: Props) {
  const { pending, data: formData } = useFormStatus();

  useEffect(() => {
    if (formData) {
      const email = String(formData.get('email'));
      const name = String(formData.get('name'));
      const birthdate = String(formData.get('birthdate'));
      const birthdateFormatted = birthdate !== ''
        ? dayjs(birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

      setProfileData(data => ({
        ...data,
        email,
        name,
        birthdate: birthdateFormatted
      }));
    }
  }, [formData])

  return (
    <button 
      disabled={pending}
      className="border disabled:border-red-400 py-2 px-3 rounded-md"
    >
      {
        pending ? 'Сохраняем...' : 'Сохранить'
      }
    </button>
  );
}