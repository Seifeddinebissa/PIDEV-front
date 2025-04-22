import { PaymentMethodEnum } from "./PaymentMethodEnum";

export class Paiement{
     id!:number;
     amount!:number;
     currency!:string;
     paymentMethod!:PaymentMethodEnum;
     date!:Date;
}