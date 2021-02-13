import { Model, Document, Schema, model } from 'mongoose';
import { CreateTicketDto } from '../dtos/tickets.dto';

interface TicketAttrs extends CreateTicketDto {
  userId: string;
}

export interface TicketDocument extends Document, TicketAttrs {
  version: number;
}

interface TicketModel extends Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
}

const ticketSchema = new Schema<TicketDocument, TicketModel>(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    optimisticConcurrency: true,
    versionKey: 'version',
    toJSON: {
      transform: (document: TicketDocument, ret: Partial<TicketDocument>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

export const Ticket = model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema
);
