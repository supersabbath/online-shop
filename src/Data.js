const sampleProducts = [
  {
    id: 1,
    name: "Nike Air Presto",
    category: "Clothing and Shoes",
    price: 55,
    description: "The Nike Air Presto Women's Shoe delivers the same unrivaled fit and comfort that marked the 2000 debut of the original.",
    popular: true,
    imageURL: "https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/wokkcny4zbhvzobfwc7i/air-presto-womens-shoe-89Tqz1nG.jpg"
  },
  {
    id: 2,
    name: "Casio F-91W-1XY",
    category: "Jewelry and Watches",
    price: 101,
    description: "Shaped in an iconic casio design, this watch features a digital display, stopwatch and an LED backlight. The watch is housed in a durable resin case. Suitable for everyday styling.",

    popular: false,
    imageURL: "https://cdn3.volusion.com/htlyr.vuqkj/v/vspfiles/photos/F-91W-1-2.jpg?1408684729"
  },
  {
    id: 3,
    name: "Seiko Silvertone Black Dial Solar Calendar Watch",
    category: "Jewelry and Watches",
    price: 200,
    description:
      '* 36 mm stainless steel case with mineral dial window\n' +
      '* Automatic self-wind movement with analog display\n' +
      '* Stainless steel bracelet with fold-over clasp',
    popular: false,
    imageURL: "https://images-na.ssl-images-amazon.com/images/I/81XUKQex4nL._UY445_.jpg"
  },
  {
    id: 4,
    name: "Harry Potter",
    category: "Books",
    price: 102,
    description: "Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia" +
      "and Uncle Vernon's house, which he thinks is normal for someone like him who's parents have been killed in" +
      "a 'car crash'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life" +
      "with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is" +
      "until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher's Stone! All this and muggles too. Now, what are they?",

    popular: true,
    imageURL: "https://hpmedia.bloomsbury.com/rep/s/9781408855898_309038.jpeg"
  },
  {
    id: 5,
    name: "DELL SE2717HR",
    category: "Computers",
    price: 102,
    description:
      '* Amazing angles: Share consistent high-color fidelity with In-Plane Switching (IPS) technology across a 27-inch diagonal screen. A stunning vantage point for everyone, from almost anywhere\n' +
      '* Distinctively modern and accessible: The contemporary thin profile is enhanced by the modern white and silver colors.The open wedge stand design provides convenient access to VGA and dual HDMI ports',

    popular: true,
    imageURL: "https://images-na.ssl-images-amazon.com/images/I/71kgK6fAvtL._SL1500_.jpg"
  },
 
  {
    id: 7,
    name: "Swatch Skin",
    category: "Jewelry and Watches",
    price: 200,
    description: "",
    popular: false,
    imageURL: "https://static.swatch.com/images/product/SVUN105/sa000/SVUN105_sa000_sr8.jpg"
  },
  {
    id: 8,
    name: "Adidas Gazelle",
    category: "Clothing and Shoes",
    price: 55,
    description: "",
    popular: false,
    imageURL: "https://www.adidas.co.uk/dis/dw/image/v2/aagl_prd/on/demandware.static/-/Sites-adidas-products/default/zoom/BB5480_00_plp_standard.jpg?sw=276&sh=276&sm=fit&hei=276&wid=276&strip=false"
  },
  {
    id: 9,
    name: "Bluetooth Keyboard, Vive Comb Rechargeable",
    category: "Computers",
    price: 55,
    description: "",
    popular: false,
    imageURL: "https://images-na.ssl-images-amazon.com/images/I/71qNNgYCHYL._SL1500_.jpg"
  },
  {
    id: 10,
    name: "Swatch Blue Suit Mens Watch YGS747 Wrist Watch",
    category: "Jewelry and Watches",
    price: 120,
    description: "",

    popular: false,
    imageURL: "https://images-na.ssl-images-amazon.com/images/I/418I4xAlUHL.jpg"
  },
  {
    id: 11,
    name: "DELL 23 S2340L 1920X1080 FULL HD",
    category: "Computers",
    price: 220,
    description: "This Certified Refurbished product is tested and certified to look and work like new. The refurbishing process includes functionality testing, basic cleaning, inspection, and repackaging. The product ships with all relevant accessories, a minimum 90-day warranty, and may arrive in a generic box. Only select sellers who maintain a high performance bar may offer Certified Refurbished products on Amazon.com",
    popular: false,
    imageURL: "https://images-na.ssl-images-amazon.com/images/I/61NAgk5KMHL._SL1500_.jpg"
  },
];


const categories = [
  {
    name: "All categories",
    icon: "fas fa-list"
  },
  {
    name: "Clothing and Shoes",
    icon: "fas fa-tshirt"
  },
  {
    name: "Jewelry and Watches",
    icon: "far fa-gem"
  },
  {
    name: "Books",
    icon:"fas fa-book"
  },
  {
    name: "Computers",
    icon: "fas fa-desktop"
  },
]



export { sampleProducts, categories }