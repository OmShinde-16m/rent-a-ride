import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FiShoppingBag } from 'react-icons/fi';
import { IoHomeOutline } from "react-icons/io5";

export const links = [
    {
      title: 'Dashboard',
      links: [
        {
          name:'adminHome',
          icon:<IoHomeOutline />,
        },
        {
          name: 'allProduct',
          icon: <FiShoppingBag />,
        },
        {
          name: 'vendorVehicleRequests',
          icon: <FiShoppingBag />,
        },
        {
          name: 'orders',
          icon: <AiOutlineShoppingCart />,
        },
      ],
    },
];