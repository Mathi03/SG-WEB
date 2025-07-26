import { Button } from "@components/ui/button";
import PregnanciesController from "@infrastructure/controllers/PregnanciesController";
import { useRequest } from "ahooks";
import { useEffect, useRef, useState } from "react";
import RCalendar from "tui-calendar";
import "tui-calendar/dist/tui-calendar.css"; // Importar los estilos

const Calendar = () => {
  const calendarRef = useRef<RCalendar | null>(null);
  const [label, setLabel] = useState<string>("");

  useRequest(() => PregnanciesController.expectedDate(), {
    onSuccess: (data) => {
      // if (calendarRef.current) {
      //   const schedules = data.map((item) => ({
      //     id: item.id,
      //     calendarId: "1",
      //     title: `Parto Esperado: ${item.animal.tagNumber}`,
      //     category: "time",
      //     dueDateClass: "",
      //     start: item.expectedDate,
      //     end: item.expectedDate,
      //   }));
      //   calendarRef.current.createSchedules(schedules);
      // }
    },
  });

  const updateMonthLabel = () => {
    const current = calendarRef.current?.getDate();
    const date = current?.toDate(); // Convierte a objeto Date estándar
    const monthName = date?.toLocaleString("es-ES", { month: "long" }); // "julio"
    const year = date?.getFullYear();
    setLabel(`${monthName} ${year}`);
  };

  useEffect(() => {
    const calendar = new RCalendar("#calendar", {
      defaultView: "month",
      taskView: true,
      scheduleView: true,
      useDetailPopup: true,
      useCreationPopup: true,
    });

    calendarRef.current = calendar;
    return () => {
      calendar.destroy();
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full items-end">
      <div className="flex gap-4">
        <div className="item-center justify-center">{label}</div>
        <Button
          onClick={() => {
            updateMonthLabel();
            calendarRef.current?.prev();
          }}
        >
          Anterior Mes
        </Button>
        <Button
          onClick={() => {
            updateMonthLabel();
            calendarRef.current?.next();
          }}
        >
          Siguiente Mes
        </Button>
      </div>
      <div id="calendar" className="flex flex-col w-full h-full" />
    </div>
  );
};

export default Calendar;
