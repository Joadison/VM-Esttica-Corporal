"use client";

import * as yup from "yup";
import { useSession } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { useState } from "react";

import { updateUser } from "./actions/update-user";
import { isValidCPF } from "@/src/utils/cpf";
import { format } from "date-fns";
import Map from "@/src/utils/maps/Map";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  user: User;
}

const FormSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().required().email("E-mail inválido"),
  telephone: yup.string().required("Telefone é obrigatório"),
  date_brith: yup.date().required("Data de Nascimento é obrigatório"),
  marital_status: yup.string().required("Estado civil é obrigatório"),
  cpf: yup.string().test("isValidCPF", "CPF inválido", function (value) {
    return isValidCPF(value);
  }),
  address: yup
    .string()
    .required(
      "Endereço é obrigatório - Preencha assim: Rua 000, casa 00 - Bairro - Cidade - Estado - CEP"
    ),
  emergency_contact: yup.string().required(),
  work: yup.string().required(),
});

interface FormValues {
  name: string;
  email: string;
  telephone: string;
  date_brith: Date;
  marital_status: string;
  cpf: string;
  address: string;
  emergency_contact: string;
  work: string;
}

const Users = ({ user }: Props) => {
  const { data } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver<any>(FormSchema),
    defaultValues: {
      name: user.name || "",
      telephone: user.telephone || "",
      email: user.email || "",
      address: user.address ? user.address.split(", lat=")[0] : "",
      date_brith: user.date_brith ? new Date(user.date_brith) : undefined,
      marital_status: user.marital_status || "",
      work: user.work || "",
      cpf: user.cpf || "",
      emergency_contact: user.emergency_contact || "",
    },
  });

  const address = watch("address");
  const [selectedPosition, setSelectedPosition] = useState<number[] | null>(null);
  const allowedEmails = [
    'joadison2219@gmail.com',
    'anavitoriaesteticista@gmail.com',
    'victoriamariald@gmail.com',
    'anavitoria2005gj@gmail.com'
  ];
  const userEmail = data?.user?.email;
  const isAdmin = userEmail && allowedEmails.includes(userEmail);
  if (user.email !== userEmail && isAdmin === false) {
    console.log("Não é o usuário ou administrador correto.")
    return redirect("/");
  }
  
  const onSubmit = async (data: FormValues) => {
    await updateUser(user.id, data);
  };

  return (
    <>
      <form
        autoComplete="on"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mx-4 py-4"
      >
        <div>
          <h1>Nome</h1>
          <Input
            id="name"
            placeholder=""
            {...register("name", { required: true })}
          />
          {errors.name && <span>Este campo é obrigatório.</span>}
        </div>

        <div>
          <h1>Whatsapp</h1>
          <Input
            id="telefone"
            placeholder="(85) 9 9999 - 9999"
            {...register("telephone", { required: true })}
          />
          {errors.telephone && <span>Este campo é obrigatório.</span>}
        </div>

        <div>
          <h1>Email</h1>
          <Input
            id="email"
            placeholder=""
            {...register("email", { required: true })}
          />
          {errors.email && <span>Este campo é obrigatório.</span>}
        </div>

        <div>
          <h1>Endereço</h1>
          <Map address={address} onSelectPosition={setSelectedPosition} setAddress={(addr: string) => setValue("address", addr)}/>
          <Input
            id="address"
            placeholder="Rua 000, casa 00 - Bairro - Cidade - Estado - CEP"
            {...register("address")}
            //autoComplete="address-line3"
          />
          {errors.address && <span>{errors.address.message}</span>}
          <p className="text-gray-500">
            Preencha assim: Rua 000, casa 00 - Bairro - Cidade - Estado - CEP
          </p>
        </div>

        <div>
          <h1>Data de Nascimento</h1>
          <Input
            id="date_brith"
            type="date"
            placeholder=""
            {...register("date_brith")}
            value={watch("date_brith") ? format(new Date(watch("date_brith")), 'yyyy-MM-dd') : ""}
          />
          {errors.date_brith && <span>Este campo é obrigatório.</span>}
        </div>

        <div>
          <h1>Estado Civil</h1>
          <Select onValueChange={(value) => setValue("marital_status", value)} defaultValue={user.marital_status || ""}>
            <SelectTrigger className="w-[full]">
              <SelectValue placeholder="Escolha o seu estado civil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solteira">Solteira</SelectItem>
              <SelectItem value="Casada">Casada</SelectItem>
              <SelectItem value="Separada Judicialmente">Separada Judicialmente</SelectItem>
              <SelectItem value="Divorciada">Divorciada</SelectItem>
              <SelectItem value="Viúva">Viúva</SelectItem>
              <SelectItem value="União Estável">União Estável</SelectItem>
            </SelectContent>
          </Select>
            {errors.marital_status && <span>Este campo é obrigatório.</span>}
        </div>

        <div>
          <h1>Profissão</h1>
          <Input
            id="work"
            placeholder=""
            {...register("work", { required: true })}
          />
          {errors.work && <span>Este campo é obrigatório.</span>}
        </div>

        <div>
          <h1>CPF</h1>
          <Input
            id="cpf"
            placeholder="999.9999.999-99"
            {...register("cpf", { required: true })}
          />
          {errors.cpf && <span>Este campo é obrigatório.</span>}
        </div>

        <div>
          <h1>Telefone de Emergência entrar em contato com:</h1>
          <Input
            id="emergency_contact"
            {...register("emergency_contact", { required: true })}
          />
          {errors.emergency_contact && <span>Este campo é obrigatório.</span>}
        </div>

        <Button type="submit">Enviar</Button>
      </form>
    </>
  );
};

export default Users;
