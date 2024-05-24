import { db } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import Header from "@/src/components/nav/header";
import ServiceItem from "@/src/components/booking/service-item";
import BookingItem from "@/src/components/booking/booking-item";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [service, confirmedBookings] = await Promise.all([
   db.service.findMany({
      orderBy: {
        id: "asc",
      },
    }),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            user: true,
          },
          orderBy: {
            date: 'asc',
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="h-full">
      <Header/>
      <div className="px-5 py-5">
      <h2 className="text-xl font-bold">
          {session?.user ? `Olá, ${session.user.name?.split(" ")[0]}!` : "Olá! Vamos agendar uma massagem hoje ?"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="pl-5 text-sm mb-3 uppercase text-gray-500 font-bold">Agendamentos</h2>
            <div className="mx-2 flex gap-3 overflow-x-auto">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5">
        <h2 className="m-2 text-sm uppercase text-gray-500 font-bold">
          Recomendados
        </h2>
        <div className="flex gap-2 overflow-x-auto ">
          {service.map((service) => 
            <ServiceItem key={service.id} service={service}/>
          )}
        </div>
      </div>
    </div>
    
  );
}
