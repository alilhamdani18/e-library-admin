import {
  BookOpenIcon ,
  ClockIcon ,
  UsersIcon,
  DocumentCheckIcon ,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "green",
    icon: BookOpenIcon ,
    title: "Jumlah Buku",
    value: "$53k",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "blue",
    icon: BookOpenIcon ,
    title: "Buku Tersedia",
    value: "$53k",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "red",
    icon: UsersIcon,
    title: "Jumlah Pengguna",
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "orange",
    icon: DocumentCheckIcon ,
    title: "Sedang Dipinjam",
    value: "3,462",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
  {
    color: "teal",
    icon: ClockIcon ,
    title: "Status Pending",
    value: "$103,430",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than yesterday",
    },
  },
  
];


export default statisticsCardsData;
