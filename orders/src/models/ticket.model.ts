import { Document, Model, model, Schema } from 'mongoose';
import { Order, OrderStatus } from './order.model';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDocument extends Document, TicketAttrs {
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDocument> {
  build(id: string, attrs: TicketAttrs): TicketDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null>;
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
    versionKey: 'version',
    optimisticConcurrency: true,
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

ticketSchema.statics.findByEvent = ({
  id,
  version
}: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: id,
    version: version - 1
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
