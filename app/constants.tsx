import image1 from "@/public/images/PHOTO-2024-11-29-09-37-40.jpg";
import image2 from "@/public/images/PHOTO-2024-11-29-09-37-40 3.jpg";
import { StaticImageData } from "next/image";

export interface BaseProfile {
  id: string;
  handle: string;
}

export type Seller = BaseProfile;

export type Buyer = BaseProfile;

export interface Product {
  id: string;
  sellerId: string;
  condition: "good" | "very good";
  name: string;
  image?: StaticImageData;
  price: string;
}

export interface Offering {
  id: string;
  productId: string;
  buyerId: string;
}

export interface questionnaire {
  category: string;
  questions: {
    question: string;
    answers: string[];
  }[];
}

export const sellers: Seller[] = [
  {
    id: "seller1",
    handle: "JLO",
  },
  {
    id: "seller2",
    handle: "Pinkkk3",
  },
  {
    id: "seller3",
    handle: "MarioD",
  },
];

export const buyers: Buyer[] = [
  {
    id: "buyer1",
    handle: "EKO",
  },
  {
    id: "buyer2",
    handle: "Day23",
  },
  {
    id: "buyer3",
    handle: "Maria45",
  },
];

export const products: Product[] = [
  {
    id: "product1",
    sellerId: "seller1",
    condition: "good",
    name: "Bvlgari,red",
    image: image2,
    price: "1200",
  },

  {
    id: "product4",
    sellerId: "seller2",
    condition: "very good",
    name: "Cartier watch",
    image: image1,
    price: "5000",
  },
];

export const offerings: Offering[] = [
  {
    id: "offering1",
    productId: "product1",
    buyerId: "buyer1",
  },
  {
    id: "offering2",
    productId: "product2",
    buyerId: "buyer2",
  },
  {
    id: "offering3",
    productId: "product3",
    buyerId: "buyer3",
  },
  {
    id: "offering4",
    productId: "product4",
    buyerId: "buyer1",
  },
  {
    id: "offering5",
    productId: "product5",
    buyerId: "buyer2",
  },
  {
    id: "offering6",
    productId: "product6",
    buyerId: "buyer3",
  },
  {
    id: "offering7",
    productId: "product7",
    buyerId: "buyer1",
  },
  {
    id: "offering8",
    productId: "product8",
    buyerId: "buyer2",
  },
  {
    id: "offering9",
    productId: "product9",
    buyerId: "buyer3",
  },
];

export const questionnaire: questionnaire[] = [
  {
    category: "Delivery",
    questions: [
      {
        question: "When did you buy this item?",
        answers: [
          "2024.",
          "2023.",
          "2022.",
          "2021.",
          "Avant ou pendant l’année 2020.",
        ],
      },
      {
        question: "Have you used this item frequently?",
        answers: [
          "Very little, used only 2 or 3 times.",
          "Occasionally, for special occasions.",
          "Yes, but it has been well-maintained.",
        ],
      },
      {
        question: "How long have you used this item?",
        answers: [
          "Only a few months.",
          "About a year.",
          "Several years but lightly used.",
        ],
      },
      {
        question: "Was this item purchased from an official retailer?",
        answers: [
          "Yes, bought from an official store.",
          "Yes, purchased from an authorized dealer.",
          "No, bought from a private seller.",
        ],
      },
    ],
  },
  {
    category: "Product",
    questions: [
      {
        question: "Is the item in good condition?",
        answers: [
          "Yes, it’s like new.",
          "Yes, in very good condition with minor signs of wear.",
          "It’s in good condition but has some visible signs of wear.",
          "The condition is well described in the listing.",
        ],
      },
      {
        question: "Are there any defects or damages to disclose?",
        answers: [
          "No, no defects.",
          "Yes, a slight scratch on the side.",
          "Yes, minor wear visible on the closure.",
          "Details of the defects are in the listing.",
        ],
      },
      {
        question: "Has the item been maintained?",
        answers: [
          "Yes, cleaned regularly.",
          "Yes, recently serviced by a professional.",
          "No, but it is in good natural condition.",
        ],
      },
      {
        question: "Does this item have a warranty?",
        answers: [
          "Yes, the warranty is still valid.",
          "No, the warranty has expired.",
          "No, this item never had a warranty.",
        ],
      },
    ],
  },
  {
    category: "Payment",
    questions: [
      {
        question: "Is the item authenticated?",
        answers: [
          "Yes, with a certificate included.",
          "Yes, authenticated by an expert.",
          "No, but it can be authenticated upon request.",
        ],
      },
      {
        question: "Do you have the original receipt?",
        answers: [
          "Yes, I kept it.",
          "Yes, a copy is available.",
          "No, I no longer have it.",
        ],
      },
      {
        question: "Is there a certificate of authenticity?",
        answers: [
          "Yes, provided with the item.",
          "No, but I can request one if necessary.",
        ],
      },
    ],
  },
  {
    category: "Other",
    questions: [
      {
        question: "Did you buy this item new?",
        answers: [
          "Yes, purchased new in-store.",
          "No, I bought it second-hand.",
          "Yes, it was new at the time of purchase.",
        ],
      },
      {
        question: "Why are you selling this item?",
        answers: [
          "I’m making room in my wardrobe.",
          "I no longer use it.",
          "I received a similar item as a gift.",
          "To fund a new purchase.",
        ],
      },
      {
        question: "Does the item come with accessories or original packaging?",
        answers: [
          "Yes, everything is included.",
          "Yes, but a few items are missing.",
          "No, just the main item.",
        ],
      },
    ],
  },
];
