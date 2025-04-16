export interface Formation {
    id: number;  // Assure-toi qu'il n'est pas private
    image: string;
    title: string;
    description: string;
    duration: number;
    price: number;
    is_public: boolean;
  }