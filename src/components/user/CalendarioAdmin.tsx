"use client";

import { ptBR } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { format } from "date-fns";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogClose,
} from "../ui/dialog";
import { useState } from "react";
import { FaUber, FaWhatsapp } from "react-icons/fa6";
import { cancelBooking } from "../booking/actions/cancel-booking";
import { toast } from "sonner";
import { PhoneIcon } from "lucide-react";

interface CalendarioProps {
  bookings: any[];
}

const CalendarioADM = ({ bookings }: CalendarioProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleDayClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCancelClick = async (id: string) => {
    try {
      await cancelBooking(id);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error(error);
    } 
  };

  const renderDay = ({ date }: { date: Date }) => {
    const dayBookings = bookings.filter(
      (booking) => new Date(booking.date).toDateString() === date.toDateString()
    );
    return (
      <>
        <div className="flex mt-2 text-xl font-bold bg-red">
          {date.getDate()}
        </div>
        {dayBookings.length > 0 && (
          <div className="absolute top-10 left-0 flex flex-col  max-h-[8rem] overflow-y-auto">
            {dayBookings.map((booking, index) => (
              <Button
                variant={"outline"}
                key={index}
                className="my-0 mx-2 p-0 text-black bg-transparent justify-start hover:none border-none font-semibold text-[12px]"
                onClick={() => handleDayClick(booking)}
              >
                <p className="">
                  {format(new Date(booking.date), "HH:mm")} -{" "}
                  {booking.service.name} {booking.user.name.split(" ")[0]}
                </p>
              </Button>
            ))}
          </div>
        )}
      </>
    );
  };

  const extract = (address: string) => {
    const latMatch = address.match(/lat=(-?\d+(\.\d+)?)/);
    const lonMatch = address.match(/lon=(-?\d+(\.\d+)?)/);
    const lat = latMatch ? parseFloat(latMatch[1]) : undefined;
    const lon = lonMatch ? parseFloat(lonMatch[1]) : undefined;
    const cleanAddress = address.replace(/,?\s*lat=-?\d+(\.\d+)?/, '').replace(/,?\s*lon=-?\d+(\.\d+)?/, '').trim();

    return {cleanAddress, lat, lon };
  };

  const getUberUrl = (booking: any) => {
    if (booking && booking.user && booking.user.address) {
      const { cleanAddress, lat, lon } = extract(booking.user.address);

      if (lat !== undefined && lon !== undefined) {
        return `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}&dropoff[nickname]=${cleanAddress}`;
      }
    }
    return '';
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
  
    return age;
  };

  const uberUrl = selectedBooking ? getUberUrl(selectedBooking) : '';

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações do Usuário</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogDescription className="text-center my-4 text-black">
            {selectedBooking && selectedBooking.user && (
              <>
                <div className="flex flex-col text-left gap-6">
                  <h1>Nome: {selectedBooking.user.name}</h1>
                  <h1>Data de Nascimento:{" "}{format(new Date(selectedBooking.user.date_brith),"dd/MM/yyyy")} Idade: {calculateAge(new Date(selectedBooking.user.date_brith))}</h1>
                  <h1>CPF: {selectedBooking.user.cpf}</h1>
                  <h1>E-mail: {selectedBooking.user.email}</h1>
                  <h1>Profissão: {selectedBooking.user.work}</h1>
                  <div className="flex items-center">
                    <h1>Whatsapp: {selectedBooking.user.telephone}</h1>
                    <Button
                      className="p-0 m-0"
                      variant={"link"}
                      size={"icon"}
                      onClick={() =>
                        window.open(
                          `whatsapp://send?phone=55${selectedBooking.user.telephone}`,
                          "_blank"
                        )
                      }
                    >
                      <FaWhatsapp size={"20"} />
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <h1>Ligação: {selectedBooking.user.telephone}</h1>
                    <Button
                      className="p-0 m-0"
                      variant={"link"}
                      size={"icon"}
                      onClick={() =>
                        window.open(
                          `tel://${selectedBooking.user.telephone}`,
                          "_blank"
                        )
                      }
                    >
                      <PhoneIcon size={"20"} />
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <h1>Endereço: {extract(selectedBooking.user.address).cleanAddress}</h1>
                    <Button
                      className="p-0 m-0"
                      variant={"link"}
                      size={"icon"}
                      onClick={() =>
                        window.open(
                          uberUrl,
                          "_blank"
                        )
                      }
                    >
                      <FaUber size={"20"} />
                    </Button>
                  </div>
                  <h1>Contato de Emergência ou Descrições: {selectedBooking.user.work}</h1>
                </div>
              </>
            )}

            <Button className="fex justify-center mt-4" onClick={() => handleCancelClick(selectedBooking.id)}> Cancelar </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Calendar
        mode="single"
        locale={ptBR}
        fromDate={new Date()}
        //disabled={{ dayOfWeek: [0, 6] }}
        components={{ DayContent: renderDay }}
        styles={{
          months: { display: "flex", flexDirection: "column", gap: "4rem" },
          month: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            fontSize: "1.25rem",
            fontWeight: "bold",
          },
          caption: {
            display: "flex",
            justifyContent: "center",
            paddingTop: "0.25rem",
            position: "relative",
            alignItems: "center",
            textTransform: "capitalize",
          },
          caption_label: { fontSize: "1.25rem", fontWeight: "800" },
          head_row: { display: "flex", width: "100%", marginTop: "0.5rem" },
          head_cell: {
            width: "100%",
            textTransform: "capitalize",
            fontSize: "1.25rem",
            marginBottom: "1rem",
          },
          cell: {
            position: "relative",
            height: "12rem",
            width: "16rem",
            margin: "3.50px",
          },
          button: { width: "100%" },
          nav_button_previous: { width: "32px", height: "32px" },
          nav_button_next: { width: "32px", height: "32px" },
          table: { width: "100%", borderCollapse: "collapse", gap: "0.25rem" },
          row: { display: "flex" },
          day: {
            padding: "1rem 13.5rem 10.5rem 0",
          },
        }}
      />
    </>
  );
};

export default CalendarioADM;
