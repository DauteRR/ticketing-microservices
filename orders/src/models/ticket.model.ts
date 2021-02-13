import { Document, Model, model, Schema } from 'mongoose';
import { Order, OrderStatus } from './order.model';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDocument extends Document, TicketAttrs {
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDocument> {
  build(id: string, attrs: TicketAttrs): TicketDocument;
}

const ticketSchema = new Schema<TicketDocument, TicketModel>(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

ticketSchema.statics.build = (id: string, { title, price }: TicketAttrs) => {
  return new Ticket({
    _id: id,
    title,
    price
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
};

const Ticket = model<TicketDocument, TicketModel>('Ticket', ticketSchema);

export { Ticket };
