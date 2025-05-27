import {
  BookOpenIcon ,
  DocumentTextIcon ,
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
    icon: DocumentTextIcon ,
    title: "Buku Dipinjam",
    value: "3,462",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
  {
    color: "teal",
    icon: DocumentCheckIcon ,
    title: "Buku Dikembalikan",
    value: "$103,430",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
