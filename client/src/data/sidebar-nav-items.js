export default function (role) {
  if (role === "User") {
    return [
      {
        title: "Dashboard",
        id: "dashboard",
        htmlBefore: '<i class="material-icons">home</i>',
        to: "/user/dashboard",
      },
      {
        title: "Place Order",
        id: "place_order",
        htmlBefore: '<i class="material-icons">note_add</i>',
        to: "/user/place-order",
      },
      {
        title: "Orders",
        id: "orders",
        htmlBefore: '<i class="material-icons">assignment</i>',
        to: "/user/order-status",
      }
    ];
  } else {
    return [
      {
        title: "Dashboard",
        id: "dashboard",
        htmlBefore: '<i class="material-icons">home</i>',
        to: "/admin/dashboard",
      },
      {
        title: "Orders",
        id: "orders",
        htmlBefore: '<i class="material-icons">assignment</i>',
        to: "/admin/orders",
      },
      {
        title: "Assets",
        id: "assets",
        htmlBefore: '<i class="material-icons">settings</i>',
        to: "/admin/assets",
      }
    ]
  }

}
