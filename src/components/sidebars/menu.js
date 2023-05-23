const menu = [
  {
    name: "Vendors",
    icon: "fa-tachometer-alt",
    roles: [1],
    children: [
      {
        name: "Add Vendor",
        icon: "fa-tachometer-alt",
        path: "/vendors/add",
      },
      {
        name: "Vendors List",
        icon: "fa-tachometer-alt",
        path: "/vendors/list",
      },
    ],
  },
  {
    name: "Products",
    icon: "fa-tachometer-alt",
    roles: [1, 2],
    children: [
      {
        name: "Add Product",
        icon: "fa-tachometer-alt",
        path: "/products/add",
        roles: [1],
      },
      {
        name: "Products List",
        icon: "fa-tachometer-alt",
        path: "/products/list",
        roles: [1, 2],
      },
    ],
  },
  {
    name: "Categories",
    icon: "fa-tachometer-alt",
    roles: [1],
    children: [
      {
        name: "Add Category",
        icon: "fa-tachometer-alt",
        path: "/categories/add",
      },
      {
        name: "Categories List",
        icon: "fa-tachometer-alt",
        path: "/categories/list",
      },
    ],
  },
  {
    name: "Brands",
    icon: "fa-tachometer-alt",
    roles: [1],
    children: [
      {
        name: "Add Brand",
        icon: "fa-tachometer-alt",
        path: "/brands/add",
        roles: [1],
      },
      {
        name: "brands List",
        icon: "fa-tachometer-alt",
        path: "/brands/list",
        roles: [1],
      },
    ],
  },
  // {
  //   name: "Tags",
  //   icon: "fa-tachometer-alt",
  //   roles: [1],
  //   children: [
  //     {
  //       name: "Add Tag",
  //       icon: "fa-tachometer-alt",
  //       path: "/tags/add",
  //     },
  //     {
  //       name: "Tags List",
  //       icon: "fa-tachometer-alt",
  //       path: "/tags/list",
  //     },
  //   ],
  // },
  {
    name: "Orders",
    icon: "fa-tachometer-alt",
    roles: [1, 2, 3],
    children: [
      {
        name: "Assign Order",
        icon: "fa-tachometer-alt",
        path: "/orders/assign",
        roles: [1],
      },
      {
        name: "Orders List",
        icon: "fa-tachometer-alt",
        path: "/orders/list",
        roles: [1, 2, 3],
      },
      {
        name: "Vendor Order List",
        icon: "fa-tachometer-alt",
        path: "/orders/vendor-orders",
        roles: [1],
      },
      {
        name: "Delivery Order List",
        icon: "fa-tachometer-alt",
        path: "/orders/delivery-orders",
        roles: [1],
      },
    ],
  },
  {
    name: "Stocks",
    icon: "fa-tachometer-alt",
    roles: [2],
    children: [
      {
        name: "Add Stock",
        icon: "fa-tachometer-alt",
        path: "/stocks/add",
      },
      {
        name: "Stock List",
        icon: "fa-tachometer-alt",
        path: "/stocks/list",
      },
    ],
  },
];
export default menu;
